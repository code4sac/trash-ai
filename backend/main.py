#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Main Lambda Entrypoint."""
import hashlib
import json
import logging
import os
from pathlib import Path
from typing import Dict, Union

from aws_lambda_powertools.logging import Logger
import boto3
from fastapi import FastAPI, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Form
from mangum import Mangum

logging.basicConfig()

CPATH = Path(__file__).parent.absolute()
MAIN_BUCKET = os.environ["MAIN_BUCKET"]
STAGE = os.environ["STAGE"]
REGION = os.environ["REGION"]
IS_ROOT_DOMAIN = True if os.environ["IS_ROOT_DOMAIN"] == "true" else False
IS_LOCAL = True if STAGE == "local" else False
DOMAIN = os.environ["DOMAIN"]

LOG = Logger(service="mangum")
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
LOG.setLevel(LOG_LEVEL)
LOG.info("Logging level set to %s", LOG_LEVEL)
app = FastAPI(title="Trash AI Backend", logger=LOG)
handler = Mangum(app)


if IS_LOCAL:
    regex = r"^(http|https)://(localhost|127\.0\.0\.1)(:[0-9]+)?(/.*)?$"
else:
    # root domain, and subdomains
    regex = r"^https://(.*\.)?{}(/.*)?$".format(DOMAIN)

LOG.info("Starting up, Cors origins: %s", regex)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origin_regex=regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def main():
    return {"message": "Hello World"}


def s3_client():
    if IS_LOCAL:
        LOG.info("Using localstack S3")
        return boto3.client(
            "s3", endpoint_url="http://localstack:4566", region_name=REGION
        )
    else:
        return boto3.client("s3", region_name=REGION)


async def get_barr(
    upload: UploadFile,
    key: str,
) -> Dict[str, Union[str, bytes, bool]]:
    if not upload.content_type.startswith("image/"):
        raise RequestValidationError(
            errors="Only JPEG images are supported",
            body={"message": "Only image files supported"},
        )
    barr = bytes()
    hash_utf = hashlib.sha256()
    hash_bin = hashlib.sha256()
    while True:
        chunk = upload.file.read(1024)
        if not chunk:
            break
        barr += chunk
        if len(barr) > 1024 * 1024 * 10:  # 10MB
            raise RequestValidationError(
                errors="Image too large",
                body={"message": "Image too large"},
            )
    # raw hash
    # When running in lambda, this is called
    hash_bin.update(barr)

    LOG.info("Raw Image hash: %s, size: %s", hash_bin.hexdigest(), len(barr))
    if key == hash_bin.hexdigest():
        return {
            "sha256": hash_bin.hexdigest(),
            "data": barr,
        }
    # decode to utf-8 hash
    # when working with the local dev docker environment, this is called, and I'm not sure why
    LOG.info("Attempting to decode output utf-8")
    barr = bytearray([ord(i) for i in barr.decode("utf-8")])
    hash_utf.update(barr)
    if key == hash_utf.hexdigest():
        return {
            "sha256": hash_utf.hexdigest(),
            "data": barr,
        }
    else:
        raise RequestValidationError(
            errors="Image hash mismatch submitted: %s != acutal:%s".format(
                key, hash_bin.hexdigest()
            ),
            body={"message": "Image hash mismatch"},
        )


@app.post("/upload")
async def upload(
    upload: UploadFile,
    key=Form(...),
    metadata=Form(...),
    filename=Form(...),
) -> Dict[str, Union[str, bytes, bool]]:
    """Upload a file to S3."""
    LOG.info("Processing: %s", filename)
    dct = await get_barr(upload, str(key))
    fileext = Path(filename).suffix
    data = dct.pop("data")
    dig = dct.pop("sha256")
    if dig != key:
        raise RequestValidationError(
            errors=f"Invalid hash {dig} != {key}",
            body={"message": "Invalid key"},
        )
    exists = False
    uploaded = False
    base = "uploads"
    metakey = f"{base}/{dig}.json"
    imgkey = f"{base}/{dig}.{fileext}"
    s3 = s3_client()
    try:
        s3.head_object(Bucket=MAIN_BUCKET, Key=metakey)
        exists = True
        uploaded = True
    except s3.exceptions.ClientError as e:
        if e.response["Error"]["Code"] != "404":
            raise e
        save_data = {
            "original_filename": filename,
            "type": upload.content_type,
            "metadata": metadata,
        }
        s3.put_object(
            Bucket=MAIN_BUCKET, Key=metakey, Body=json.dumps(save_data).encode()
        )
        LOG.info("Uploaded metadata for %s", dig)
        s3.put_object(Bucket=MAIN_BUCKET, Key=imgkey, Body=data)  # type: ignore
        LOG.info("Uploaded image for %s", dig)
        uploaded = True

    return {
        "sha256": dig,
        "exists": exists,
        "uploaded": uploaded,
    }


#  def rate(event, context):
#      current_time = datetime.datetime.now().time()
#      name = context.function_name
#      LOG.debug("Event: %s", event)
#      LOG.info(f"RATE function {name} ran at {current_time}")
#
#
#  def cron(event, context):
#      current_time = datetime.datetime.now().time()
#      name = context.function_name
#      LOG.debug("Event: %s", event)
#      LOG.info(f"CRON function {name} ran at {current_time}")

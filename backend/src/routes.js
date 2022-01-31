const serverless = require("serverless-http");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const multer_s3 = require("multer-s3");
require("dotenv").config();
const AWS = require("aws-sdk");
const bucket = process.env.main_bucket;

app.use(cors());

const s3 = new AWS.S3();

const upload = multer({
    storage: multer_s3({
        s3: s3,
        bucket: bucket,
        metadata: function(_req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(_req, _file, cb) {
            cb(null, Date.now().toString());
        },
    }),
});

app.post("/upload", upload.single("file"), function(req, res, _next) {
    console.log("Uploaded file: ", req.file);
    let send = {
        success: true,
        file: req.file,
    }
    res.json(send);
});

app.get("/list_files", function(_req, res) {
    console.log("Listing files!!!");
    s3.listObjectsV2({ Bucket: bucket }, function(
        err,
        data
    ) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Could not list files" });
        } else {
            res.status(200).json({
                message: "Files listed successfully",
                files: data.Contents,
            });
        }
    });
});

app.use((_req, res, _next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

exports.handler = serverless(app);

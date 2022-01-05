//todo(donny): clear out upload folder after the s3 bucket is done with it.
require("dotenv").config();
const fs = require("fs").promises;

const express = require("express");
const multer = require("multer");

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

let upload = multer({ storage: storage });

const UploadRouter = express.Router();
UploadRouter.post("/", upload.single("file"), 
  async (req, res) => {
  try {
    console.log("in post request")
    if (req.file) {
      const content = await fs.readFile(req.file.path); 
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${req.file.originalname}`,
        Body: content
      }

      s3.upload(params, (err, data) => {
        if (err) {
          console.error("s3 upload error", err)
          res.status(500).send(err);
        }
      }); 

      res.send({
        status: true,
        message: "File Uploaded to server 5001.",
      });
    } else {
      res.status(400).send({
        status: false,
        data: "File Not Found",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = UploadRouter;

//todo(donny): clear out upload folder after the s3 bucket is done with it.
require("dotenv").config();
const fs = require("fs").promises;

const express = require("express");
const multer = require("multer");
const multerS3 = require('multer-s3')

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

var upload = multer({
  limits: {
    fileSize: process.env.MAX_UPLOAD_FILE_SIZE_BYTES
  },
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

const UploadRouter = express.Router();
UploadRouter.post("/", upload.single("file"), 
  async (req, res) => {
    res.send({
      status: true,
      message: 'Successfully uploaded ' + req.file.originalname,
    })
});

module.exports = UploadRouter;

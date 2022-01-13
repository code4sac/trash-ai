require("dotenv").config();
const express = require("express");
const cors = require("cors");

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const app = express();

//enable cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.options("*", cors());

require("./routes/middleware/Auth");

const AuthRouter = require("./routes/AuthRouter");
const MessageRouter = require("./routes/MessageRouter");
const UploadRouter = require("./routes/UploadRouter");

const Config = require("../_config");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/upload", UploadRouter);
app.use("/auth", AuthRouter);
app.use("/", MessageRouter);

app.listen(Config.LISTENING_PORT, () => {
  console.log(`listening: ${Config.LISTENING_PORT}`);
});

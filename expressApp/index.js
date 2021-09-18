const express = require('express');

const MessageRouter = require('./routes/MessageRouter');

const Config = require('../_config');

const app = express();
app.use('/', MessageRouter);

app.listen(Config.LISTENING_PORT, () => {
  console.log(`listening: ${Config.LISTENING_PORT}`)
})
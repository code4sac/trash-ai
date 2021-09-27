const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');


require('./routes/middleware/Auth');


const AuthRouter = require('./routes/AuthRouter');
const MessageRouter = require('./routes/MessageRouter');

const Config = require('../_config');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/auth', AuthRouter);
app.use('/', MessageRouter);

app.listen(Config.LISTENING_PORT, () => {
  console.log(`listening: ${Config.LISTENING_PORT}`)
})
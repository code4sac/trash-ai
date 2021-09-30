const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();

//enable cors
app.use(cors({
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
app.options('*', cors())



require('./routes/middleware/Auth');


const AuthRouter = require('./routes/AuthRouter');
const MessageRouter = require('./routes/MessageRouter');

const Config = require('../_config');


app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/auth', AuthRouter);
app.use('/', MessageRouter);


app.listen(Config.LISTENING_PORT, () => {
  console.log(`listening: ${Config.LISTENING_PORT}`)
})
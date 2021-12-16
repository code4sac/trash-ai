var express = require('express');
const passport = require('passport');

const authMiddleWare = require('./middleware/Auth').authMiddleWare;
console.log(authMiddleWare);

const MessageRouter = express.Router();

const Config = require('../../_config');
const MessageService = Config.getMessageService();

MessageRouter.get('/', async (req, res) => {
    const messages = await MessageService.getMessages(); 
    res.send(messages);
});

MessageRouter.get('/secret', authMiddleWare,
    function(req, res) {
        const secretMessage = "This is a secret message";
        res.json(secretMessage);
    }
);
  
module.exports = MessageRouter;
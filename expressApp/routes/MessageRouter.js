var express = require('express');
var MessageRouter = express.Router();

const Config = require('../../_config');
const MessageService = Config.getMessageService();

MessageRouter.get('/', async (req, res) => {
    const message = await MessageService.getMessage(); 
    res.send(message);
});
  
module.exports = MessageRouter;
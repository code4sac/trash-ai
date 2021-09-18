//const MessageService = new require('./services/message/MockMessageService');
const MessageService = new require('./services/message/SequelizeMessageService');


const Config = {
    LISTENING_PORT : process.env.PORT || 3080,
    getMessageService : () => { return MessageService; }
};

module.exports = Config;
//const MessageService = new require('./services/message/MockMessageService');
const MessageService = new require('./services/message/SequelizeMessageService');
const AuthDao = new require('./services/userauth/data/SequelizeUserDao');

const Config = {
    LISTENING_PORT : process.env.PORT || 3080,
    getMessageService : () => { return MessageService; },
    getAuthDao : () => { return AuthDao; },
    JWTSecretKey : process.env.JWT_SECRET_KEY || 'DUMB_JWT_SECRET_KEY',
};

module.exports = Config;
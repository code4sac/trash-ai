const Message = require('../../sequelize/db/models').Message;

module.exports = class MessageService {
    static async getMessage() {
        return await Message.findOne();
    }
}
;

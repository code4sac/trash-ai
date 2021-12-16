module.exports = class MessageService {
    static async getMessage() {
        const dummyMessage = { message : "Hello from Express.js" };
        return new Promise((resolve, reject) => {          
            setTimeout(() => {
              resolve(dummyMessage);
            }, 300);
          });
    }
}
;

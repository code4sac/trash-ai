
let mockMessages = [
    { id: 1, message : "Mock Message 1" } ,
    { id: 2, message : "Mock Message 2" } ,
    { id: 3, message : "Mock Message 3" } ,
    { id: 4, message : "Mock Message 4" } ,
    { id: 5, message : "Mock Message 5" }
];

class MessageService {
    
    static async getMessages() {
        return mockMessages; 
    }

    static async addMessage(newMessage) {
        mockMessages.push(newMessage);
    }

    static async updateMessage(updateMessage) {
        // updateMessage
    }

    static async deleteMessage(messageId) {
        // deleteMesage
    }

}

export default MessageService; 
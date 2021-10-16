class MessageService {
    
    static mockMessages = [
        { id: 1, message : "Mock Message 1" } ,
        { id: 2, message : "Mock Message 2" } ,
        { id: 3, message : "Mock Message 3" }
    ];

    static async getMessages() {
        return this.mockMessages; 
    }
}

export default MessageService; 
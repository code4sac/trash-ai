class MessageService {
    
    static mockMessages = [
        "Mock Message 1",
        "Mock Message 2",
        "Mock Message 3"
    ];

    static getMessages() {
        return this.mockMessages; 
    }
}

export default MessageService; 
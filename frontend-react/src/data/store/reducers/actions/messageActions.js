const SET_MESSAGES = "SET_MESSAGES";
const ADD_MESSAGE = "ADD_MESSAGE";
const UPDATE_MESSAGE = "UPDATE_MESSAGE";
const DELETE_MESSAGE = "DELETE_MESSAGE";


const setMessages = function(newMessages) {
    return {
        type : SET_MESSAGES,
        payload : newMessages
    }
}

const addMessage = function(newMessageContent) {
    return {
        type : ADD_MESSAGE,
        payload : newMessageContent
    }
}

const updateMessage = function(messageId, newMessageContent) {
    return {
        type : UPDATE_MESSAGE,
        payload : {
            id : messageId, 
            content : newMessageContent
        }
    }
}

const deleteMessage = function(messageId) {
    return {
        type : DELETE_MESSAGE,
        payload : messageId
    }
}


export {
    setMessages,
    addMessage,
    updateMessage,
    deleteMessage,
    SET_MESSAGES,
    ADD_MESSAGE,
    UPDATE_MESSAGE,
    DELETE_MESSAGE
}
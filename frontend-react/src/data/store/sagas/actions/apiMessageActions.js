const API_GET_MESSAGES = "API_GET_MESSAGES ";
const API_POST_MESSAGE = "API_POST_MESSAGE";
const API_PUT_MESSAGE = "API_PUT_MESSAGE";
const API_DELETE_MESSAGE = "API_DELETE_MESSAGE";


const apiGetMessages = function(newMessages) {
    return {
        type : API_GET_MESSAGES,
        payload : newMessages
    }
}

const apiPostMessage = function(newMessageContent) {
    return {
        type : API_POST_MESSAGE,
        payload : newMessageContent
    }
}

const apiPutMessage = function(messageId, newMessageContent) {
    return {
        type : API_PUT_MESSAGE,
        payload : {
            id : messageId, 
            content : newMessageContent
        }
    }
}

const apiDeleteMessage = function(messageId) {
    return {
        type : API_DELETE_MESSAGE,
        payload : messageId
    }
}


export {
    apiGetMessages,
    apiPostMessage,
    apiPutMessage,
    apiDeleteMessage, 
    API_GET_MESSAGES,
    API_POST_MESSAGE,
    API_PUT_MESSAGE,
    API_DELETE_MESSAGE,
}
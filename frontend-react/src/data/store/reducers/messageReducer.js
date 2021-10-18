import {
    SET_MESSAGES
} from './actions/messageActions';

const messageReducer = function(messagesState = [], action) {
    const actionType = action.type;
    const actionData = action.payload;
    switch (actionType) {
        case SET_MESSAGES :
            return [ ...actionData ];
        default: 
            return messagesState;
    }
}

export default messageReducer;
import { put, takeLatest, call } from 'redux-saga/effects'


import MessageService from "../../services/MessageService"; // "../../services/MessageService";



import {
    API_GET_MESSAGES,
    API_POST_MESSAGE,
    API_PUT_MESSAGE,
    API_DELETE_MESSAGE,
} from "./actions/apiMessageActions";

import {
    setMessages
} from "../reducers/actions/messageActions";


function* apiGetMessages(action) {
    let messages = yield call(MessageService.getMessages);
    yield put(setMessages(messages));
}

function* apiPostMessage(action) {
    //
}

function* apiPutMessage(action) {
    //
}

function* apiDeleteMessage(action) {
    //
}

export function* messagesSaga() {
    yield takeLatest(API_GET_MESSAGES, apiGetMessages);
    yield takeLatest(API_POST_MESSAGE, apiPostMessage);
    yield takeLatest(API_PUT_MESSAGE, apiPutMessage);
    yield takeLatest(API_DELETE_MESSAGE, apiDeleteMessage);
}

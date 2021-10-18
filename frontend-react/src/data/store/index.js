import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import messages from "./reducers/messageReducer";

import { composeWithDevTools } from 'redux-devtools-extension';

import { messagesSaga } from './sagas/messageSaga';

function* rootSaga() {
    yield all([
        messagesSaga()
    ])
}

const sagaMiddleware = createSagaMiddleware();


const mainStore = createStore(
    combineReducers({
        messages
    })
    ,
    composeWithDevTools(
        applyMiddleware(
            sagaMiddleware
        )
    )
);

sagaMiddleware.run(rootSaga);

export default mainStore;
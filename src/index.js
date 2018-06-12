import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk'
import {app, board} from './reducers';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(combineReducers({
    app
}), composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();

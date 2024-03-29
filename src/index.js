import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
// import store from './store';
import Chat from './chat'
import * as serviceWorker from './serviceWorker';
import { PersistGate } from 'redux-persist/integration/react'
import {store,persistor} from './store/index'

const App = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Chat />
        </PersistGate>
    </Provider>
)
ReactDOM.render(
    <App />,
    document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
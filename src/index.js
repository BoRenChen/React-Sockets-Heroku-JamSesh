import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import io from 'socket.io-client';

const socket = io();

//sockets test
socket.on('hello', ({ message }) =>
  alert(message)
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../../build')));

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + './index.html')
});

// sockets test
io.on('connection', client => {
  client.emit('hello', { message: 'hello!!! from server!' })


	client.on('join', function(data) {
	     	console.log('joined the server from App.js - from server');

	        client.emit('welcomeMsg', 'Connected to socket')
	    });
	    client.on('messages', function(data) {
	           client.emit('broad', data);
	           client.broadcast.emit('broad',data);
	    });
	    client.on('buttonPressed', function(data) {
	        console.log("server pressed" + data);
	        client.broadcast.emit('press', data);
	    });
	    client.on('buttonReleased', function(data){
	        console.log("server released" + data);
	      	client.broadcast.emit('release', data);
	    });
	    client.on('PianoKeyPressed', function(data){
	        console.log("Paino Key Press " + data);
	      	client.broadcast.emit('PianoKeyPress', data);
	    });
	    client.on('PianoKeyReleased', function(data){
	        console.log("Piano Key Release " + data);
	      	client.broadcast.emit('PianoKeyRelease', data);
	    });
	    client.on('disconnect', function () {
	    console.log('Client disconnected...');
	      client.emit('disconnected');
	    });

});

server.listen(port);
console.log('server listening on port ' + port);

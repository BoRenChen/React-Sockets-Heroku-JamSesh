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


//Global Function
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


// Drum Server
var drumSequencer = [];
var bpm = 150;
function addDrum(item) {
	if (!drumSequencer.includes(item)){

		drumSequencer.push(item);
	console.log("adding item to Drum Sequencer: " + item);
	}
	console.log(drumSequencer);
}
function removeDrum(item) {
	drumSequencer.remove(item);
	console.log("Removing item to Drum Sequencer: " + item);
}

// Sockets Connection
io.on('connection', client => {
  	client.emit('hello', { message: 'hello!!! from server!' })


	client.on('join', function(data) {
	     	console.log('joined the server from App.js - from server');

	//sending drum data to user (array)
	client.emit('drumData', drumSequencer);
	        client.emit('welcomeMsg', 'Connected to socket')
	    });
	    client.on('messages', function(data) {
	           client.emit('broad', data);
	           client.broadcast.emit('broad',data);
	    });
	    client.on('buttonPressed', function(data) {
	        console.log("server pressed" + data);
	        client.broadcast.emit('press', data);
	        client.emit('press', data);
	    });
	    client.on('buttonReleased', function(data){
	        console.log("server released" + data);
	      	client.broadcast.emit('release', data);
	      	client.emit('release', data);
	    });
	    client.on('PianoKeyPressed', function(data){
	        console.log("Paino Key Press " + data);
	      	client.broadcast.emit('PianoKeyPress', data);
	      	client.emit('PianoKeyPress', data);
	    });
	    client.on('PianoKeyReleased', function(data){
	        console.log("Piano Key Release " + data);
	      	client.broadcast.emit('PianoKeyRelease', data);
	      	client.emit('PianoKeyRelease', data);
	    });
	    client.on('synthStatusChanged', function(data){
	    	console.log("New Synth Status = " + data);
	    	client.broadcast.emit('changeSynthStatus', data);
	    });
	    client.on('drumPressed', function(data){
	    	console.log("Drum Pressed " + data);
	    	client.broadcast.emit('drumPress', data);
	    	client.emit("drumPress", data);
	    });
	    client.on('VibeKeyPressed', function(data){
	    	console.log('VibeKeyPressed', data);
	    	client.broadcast.emit('VibeKeyPress', data);
	    	client.emit('VibeKeyPress', data);
	    })
	    client.on('setKeyboardInstrument', function(data){
	    	console.log('changing instrument', data);
	    	client.broadcast.emit('setKeyboardInstrument', data);
	    	client.emit('setKeyboardInstrument', data);
	    })
	    //Drum Sequencer
	    client.on('addDrumSequencerItem', function(data){
	    	addDrum(data);
	    	client.broadcast.emit('addDrumSequencerItem', data);
	    });
	    client.on('removeDrumSequencerItem', function(data){
	    	removeDrum(data);
	    	client.broadcast.emit('removeDrumSequencerItem', data);
	    });
	    client.on('drumSequencerActive', function(data){
	    	console.log('drumSequencerActive', data);
	    	client.emit('setDrumSequencer', data);
	    	client.broadcast.emit('setDrumSequencer', data);
	    });
	    client.on('updateBpmToServer', function(data){
	    	bpm = data;
	    	console.log('update bpm to : '+ data);

	    	client.broadcast.emit('updateBpm', data);
	    });
	    client.on('requestBpm', function(){
	    	console.log('request from client to update bpm');
	    	client.emit('updateBpm', bpm);
	    });
	    client.on('requestUpdateSequencer', function(){
	    	console.log('reqeust from client to update sequencer');
			client.emit('drumData', drumSequencer);
	    });
	    client.on('disconnect', function () {
	    console.log('Client disconnected...');
	      client.emit('disconnected');
	    });

});

server.listen(port);
console.log('server listening on port ' + port);

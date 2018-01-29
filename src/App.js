import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import io from 'socket.io-client';
import Tone from "tone";

const socket = io();

// sockets test
socket.on('hello!!', ({ message }) =>
  alert(message + 'app.js')
);

class App extends Component {

  componentDidMount() {
 


  socket.on('connect', function(data) {
      console.log('joining the server - from client');
      socket.emit('join', 'Sending from App.js to Socket server.');
   });

  socket.on("press", function(data){
    console.log(data);
    synth.triggerAttack(data);
  });

  socket.on('release', function(data){
    console.log("release" + data)
      synth.triggerRelease();
   })


  //TONE STUFF
  var synth2 = new Tone.PolySynth(6, Tone.Synth, {
        "oscillator" : {
          "partials" : [0, 2, 3, 4],
        }
      }).toMaster();
      var synth3 = new Tone.Synth().toMaster();
      var synth = new Tone.Synth({
        "oscillator" : {
          "type" : "pwm",
          "modulationFrequency" : 0.2
        },
        "envelope" : {
          "attack" : 0.02,
          "decay" : 0.1,
          "sustain" : 0.2,
          "release" : 0.9,
        }
      }).toMaster();
  //var code = $.ui.keyCode;

  document.addEventListener('keypress', (event) => {
    const keyName = event.key;

    console.log("hey! ", keyName);
  });

//var keyboard = Interface.Keyboard();

document.addEventListener('keydown', (event) => {
const keyName = event.key;
 //synth2.triggerAttack("B4");

 synth2.triggerAttack(keyName+4)
  //synth2.triggerAttack(keyName.concat(4))
  console.log(keyName.concat(4));
  console.log(keyName+4);
 // if (keyName == 'f') {
 //   synth2.triggerAttack("C4");
 // }
 // if (keyName == 'd') {
 //   synth2.triggerAttack("D");
 // }



//socket.emit('buttonPressed', "B4");

});

document.addEventListener('keyup', (event) => {
  synth2.triggerRelease(event.key+4)
  //Release sound base on content of the li.
  //socket.emit('buttonReleased', "B4");

console.log("up! ");
});


    //attach a listener to all of the buttons
    document.querySelectorAll('li').forEach(function(button){
      button.addEventListener('mousedown', function(e){
        //play the note on mouse down
        synth.triggerAttack(e.target.textContent)
        //Play sound base on content of the li
        socket.emit('buttonPressed', e.target.textContent);

        console.log("from local" + e.target.textContent)

      })
      button.addEventListener('mouseup', function(e){
        //release on mouseup
        synth.triggerRelease()
        //Release sound base on content of the li.
        socket.emit('buttonReleased', e.target.textContent);
      })
    })

  } d

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to JamSesh Powered By React</h1>
        </header>

      <div className="component-app">

        <ul className="set">
          <li className="white b" id="B4">B4</li>
          <li className="black as"></li>
          <li className="white a" id="A4">A4</li>
          <li className="black gs"></li>
          <li className="white g" id="G4">G4</li>
          <li className="black fs"></li>
          <li className="white f" id="F4">F4</li>
          <li className="white e" id="E4">E4</li>
          <li className="black ds"></li>
          <li className="white d" id="D4">D4</li>
          <li className="black cs"></li>
          <li className="white c" id="C4">C4</li>
        </ul>
        <input type="range" min="-10" max="10"/>


        <h1>Socket Test</h1>
        <div id="content">
          <button >C4</button>
          <button >E4</button>
          <button >G4</button>
          <button >B4</button>
        </div>

    
        </div>
      </div>
    );
  }
}

export default App;

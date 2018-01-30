import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import anime from 'animejs'

import io from 'socket.io-client';
import Tone from "tone";

const socket = io();

// sockets test
socket.on('hello!!', ({ message }) =>
  alert(message + 'app.js....')
);

class App extends Component {
  constructor(){
    super();
    this.state={first: true};
  }

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


//anime.js
anime({
  targets: 'path',
  strokeDashoffset: function(el) {
    var pathLength = el.getTotalLength();
    el.setAttribute('stroke-dasharray', pathLength);
    return [-pathLength, 0];
  },
  stroke: {
    value: function(el, i) {
      return 'rgb(200,'+ i * 8 +',150)'; 
    },
    easing: 'linear',
    duration: 2000,
  },
  strokeWidth: {
    value: 6,
    easing: 'linear',
    delay: function(el, i) { 
      return 1200 + (i * 40); 
    },
    duration: 800,
  },
  delay: function(el, i) { 
    return i * 60; 
  },
  duration: 1200,
  easing: 'easeOutExpo',
  loop: true,
  direction: 'alternate'
});


  } 

  componentDidUpdate(){

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

  }


  handle(){
    alert('move to second component')
    this.setState({first: false})
  }

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


        </div>

        <button onClick={this.handle.bind(this)}>move to second page</button>
        {this.state.first == true && <Pqr/>}
        {this.state.first == false && <Sqr/>}

      </div>
    );
  }
}
//uses template from codepen: Sellfy.com/orange83/checkout/?visitor_id=d8d1c378-4af5-483c-a6da-1a630daf0dca
class Pqr extends React.Component {
  render (){
    return (<div><h1>First</h1>
    <section>
  <article>
<svg width="252px" height="94px" viewBox="3 11 252 94" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsxlink="http://www.w3.org/1999/xlink">
    
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <path d="M4,80.3307481 L4,103.14209" id="Stroke-3-Copy-2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M12,80.3307481 L12,103.14209" id="Stroke-3-Copy" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M20,80.3307481 L20,103.14209" id="Stroke-3" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M28,79.2468955 L28,103.14209" id="Stroke-4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M36,78.1629412 L36,103.14209" id="Stroke-5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M44,75.4792747 L44,103.14209" id="Stroke-6" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M52,72.7420239 L52,103.14209" id="Stroke-7" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M60,69.5063186 L60,103.14209" id="Stroke-8" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M68,66.251244 L68,103.14209" id="Stroke-9" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M76,61.8968703 L76,103.14209" id="Stroke-10" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M84,58.6428398 L84,103.14209" id="Stroke-11" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M92,55.3517013 L92,103.14209" id="Stroke-12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M100,52.1459205 L100,103.14209" id="Stroke-13" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M108,49.9758708 L108,103.14209" id="Stroke-14" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M116,49.9648003 L116,103.14209" id="Stroke-15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M124,52.0421408 L124,103.14209" id="Stroke-16" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M132,54.207588 L132,103.14209" id="Stroke-17" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M140,57.4549402 L140,103.14209" id="Stroke-18" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M148,59.7410947 L148,103.14209" id="Stroke-19" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M156,60.7705138 L156,103.14209" id="Stroke-20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M164,59.6868773 L164,103.14209" id="Stroke-21" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M172,56.4734051 L172,103.14209" id="Stroke-22" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M180,49.799018 L180,103.14209" id="Stroke-23" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M188,42.3419581 L188,103.14209" id="Stroke-24" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M196,35.8617977 L196,103.14209" id="Stroke-25" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M204,29.3524204 L204,103.14209" id="Stroke-26" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M212,23.9352737 L212,103.14209" id="Stroke-27" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M220,19.5951742 L220,103.14209" id="Stroke-28" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M228,18.5101493 L228,103.14209" id="Stroke-29" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M236,16.3400995 L236,103.14209" id="Stroke-30" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M244,14.1700498 L244,103.14209" id="Stroke-31" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
    <path d="M252,12 L252,103.14209" id="Stroke-32" stroke="#FFFFFF" stroke-width="2" stroke-linecap="square" fill="none"></path>
</svg>
  </article>
  <footer>
    <span>Made with</span> <a href="http://anime-js.com">anime.js</a>
  </footer>
  <a class="logo" href="http://anime-js.com"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1137/anime-logo.png"></img></a>
</section>

    </div>)
  }
}
class Sqr extends React.Component {
  render (){
    return (
    <div>
      <h1>Second</h1>


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

        </div>
        )
  }
}
export default App;

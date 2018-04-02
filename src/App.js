import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import anime from 'animejs';
import io from 'socket.io-client';
import Tone from "tone";
import {TimelineMax, Ease, Expo, Elastic} from "gsap";
import { Howl, Howler } from 'howler';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketches/sketch';
import sketch2 from './sketches/sketch2';

import crash from "./img/crash.png";
import floor from "./img/floor-tom.png";
import hi  from "./img/hi-hat.png";
import kick from "./img/kick.png";
import left  from "./img/left-tom.png";
import right from "./img/right-tom.png";
import snare from "./img/snare.png";
import sound from "./img/orangeVolume.png";
import message from "./img/message.png";



//GLOBAL
const socket = io();
var seqOpen = false; 
var eqOpen = false;
var chatOpen = false;
var synthStatus = false;
var keyboardState = "instrument";
var circles =[];
var synthVol = 1.0;
var keyVol = 1.0;
var drumVol = 1.0;
var synth2 = new Tone.PolySynth({
  "portamento" : 0.01,
  "oscillator" : {
    "type" : "square"
  },
  "envelope" : {
    "attack" : 0.005,
    "decay" : 0.2,
    "sustain" : 0.4,
    "release" : 1.4,
  },
  "filterEnvelope" : {
    "attack" : 0.005,
    "decay" : 0.1,
    "sustain" : 0.05,
    "release" : 0.8,
    "baseFrequency" : 300,
    "octaves" : 4
  }
}).toMaster();
  var synth3 = new Tone.Synth().toMaster();
  var synth = new Tone.FMSynth({
    "modulationIndex" : 12.22,
    "envelope" : {
      "attack" : 0.01,
      "decay" : 0.2
    },
    "modulation" : {
      "type" : "square"
    },
    "modulationEnvelope" : {
      "attack" : 0.2,
      "decay" : 0.01
    }
  }).toMaster();



function eqPop() {
    
  if (eqOpen == false) {

    document.getElementById("eq").style.left = "0px"; 
    document.getElementById("eq").style.transition = ".5s"; 
    
    eqOpen = true;
  } 
  else if (eqOpen == true) {
    document.getElementById("eq").style.left = "-200px"; 
    document.getElementById("eq").style.transition = ".5s"; 
    eqOpen = false;

  }
} 

function chatPop() {
    
  if (chatOpen == false) {

    document.getElementById("messages").style.left = "0px"; 
    document.getElementById("messages").style.transition = ".5s"; 
    
    chatOpen = true;
  } 
  else if (chatOpen == true) {
    document.getElementById("messages").style.left = "-200px"; 
    document.getElementById("messages").style.transition = ".5s"; 
    chatOpen = false;

  }
} 

function yo() {
  alert("yo!");
}

function seqPop() {
    
    if (seqOpen == false) {
      document.getElementById("sequencer").style.bottom = "0px"; 
      document.getElementById("sequencer").style.transition = ".5s"; 
      document.getElementById("openPanel").innerHTML = "Hide Drum Sequencer"; 
      seqOpen = true;
    } 
    else if (seqOpen == true) {
      document.getElementById("sequencer").style.bottom = "-360px"; 
      document.getElementById("sequencer").style.transition = ".5s"; 
      document.getElementById("openPanel").innerHTML = "View Drum Sequencer"; 
      console.log("closing");
      seqOpen = false;
    }
}




      
// sockets test
socket.on('hello!!', ({ message }) =>
  alert(message + 'app.js....')
);





  //--------------------------------------App Class Start-------------------------------------------//
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      first: "Keyboard1",
      rotation: 150,
      circles: circles,
      stateSketch: sketch,
    };
    console.log("here...........", circles, 'and', this.state.circles);
  }

  rotationChange(e){
    this.setState({rotation:e.target.value});
    console.log(this.state.rotation);

    this.setState({circles:circles});
    console.log(this.state.circles);
  }

  pressEvent(){
    this.state.stateSketch === sketch ? this.setState({stateSketch:sketch2}) : this.setState({stateSketch:sketch});
  }


  componentDidMount() {
   console.log("STARTING");

  //--------------------------------------SOCKET-------------------------------------------//

  socket.on('connect', function(data) {
     // console.log('joining the server - from client');
      socket.emit('join', 'Sending from App.js to Socket server.');
   });

  socket.on("press", function(data){
   // console.log('press' + data);
   //Methods which accept time, no argument (undefined) will be interpreted as "now" (i.e. the audioContext.currentTime).
    synth.triggerAttack(data, undefined, synthVol);
  });

  socket.on('release', function(data){
   // console.log("release" + data)
      synth.triggerRelease();
   });
  socket.on('PianoKeyPress', function(data){
  //  console.log("PianoPressFromServer" + data)
      synth2.triggerAttack(data, undefined, keyVol);
      addNewCircle(100);
   }.bind(this));
  socket.on('PianoKeyRelease', function(data){
   // console.log("PianoReleaseFromServer" + data)
      synth2.triggerRelease(data);
   });
  socket.on('changeSynthStatus', function(data){
    console.log('change synth status to ' + data)
    synthStatus = data;

      if (synthStatus == false) {
      synth2 = new Tone.PolySynth(3, Tone.DuoSynth, {
      "oscillator": {
        "type": "sine"
      },
      "envelope": {
        "attack": 0.01,
        "decay": 0.1,
        "sustain": 0.2,
        "release": 4,
      }
    }).toMaster();
      synthStatus = true;
    } else {
      synth2 = new Tone.PolySynth({
        "portamento" : 0.01,
        "oscillator" : {
          "type" : "square"
        },
        "envelope" : {
          "attack" : 0.005,
          "decay" : 0.2,
          "sustain" : 0.4,
          "release" : 1.4,
        },
        "filterEnvelope" : {
          "attack" : 0.005,
          "decay" : 0.1,
          "sustain" : 0.05,
          "release" : 0.8,
          "baseFrequency" : 300,
          "octaves" : 4
        }
      }).toMaster();
      synthStatus = false;
    }
  });
  socket.on('drumPress', function(data){
    console.log('drumPress ' + data)
    switch(data){
      case 'snare':
        snare(true);
        break;
      case 'hiHat':
        hiHat(true);
        break; 
      case 'kick':
        kick(true);
        break; 
      case 'leftTom':
        leftTom(true);
        break; 
      case 'rightTom':
        rightTom(true);
        break; 
      case 'floorTom':
        floorTom(true);
        break; 
      case 'crashdrum':
        crashdrum(true);
        break;     
      default:
        break;
    }
    addNewCircle(600);

  });
    socket.on('broad', function(data) {
   $('#future').append(data+ "<br/>");
     });




  //Message
   $('form').submit(function(e){
       e.preventDefault();
       var message = $('#chat_input').val();
       socket.emit('messages', message);
   });

  
  //Drum Sequencer

  socket.on('drumData', function(data){

    $('input').each(function() {
      this.checked = false;
    });
 
    data.forEach(function(entry) {
    entry = '#' + entry;
    $(entry.toString()).prop('checked', true);
    });
    socket.emit('requestBpm');

    console.log('finish updating drum sequencer');

  });

  socket.on('addDrumSequencerItem', function(data) {
    var id = '#' + data;
    $(id.toString()).prop('checked', true);
  });

  socket.on('removeDrumSequencerItem', function(data){
    var id = '#' + data;
    $(id.toString()).prop('checked', false);
  });

  socket.on('setDrumSequencer', function(data){
    $(this).find('i').toggleClass('fa-pause');
    console.log("Setting Sequencer from Server", data)
    if (data) {
      console.log('wasfalse')
      beat = 1;
      intervalId = window.setInterval(sequencer, interval);
      sequencerOn = true;
    } else {
      console.log('was true')
      window.clearInterval(intervalId);
      sequencerOn = false;
    }
  });


  socket.on('updateBpm', function(data){
    bpm = data;
    interval = parseInt(60000 / bpm);
    $('#bpm-indicator').val(bpm);
  });

  socket.on('VibeKeyPress', function(data){
          var sound = new Howl({
            src: [data],
          })
          sound.play();

      addNewCircle(400);
  });



//--------------------------------------Recording-------------------------------------------//
  //enabled chrome://flags/ -- Experimental Web Platform Features
  
var recordButton, stopButton, recorder;

window.onload = function () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');

  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    recorder = new MediaRecorder(stream);

    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};

function startRecording() {
  recordButton.disabled = true;
  stopButton.disabled = false;

  recorder.start();
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;

  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
}

function onRecordingReady(e) {
  var audio = document.getElementById('audio');
  // e.data contains a blob representing the recording
  audio.src = URL.createObjectURL(e.data);
  audio.play();
}


  //--------------------------------------TONE-------------------------------------------//

  
  //var code = $.ui.keyCode;

  //KEYBOARD


  var octave = 4;

  var Instruments = {
  // https://github.com/stuartmemo/qwerty-hancock
  keyboard: {
    // Lower octave.
    a: 'Cl',
    w: 'C#l',
    s: 'Dl',
    e: 'D#l',
    d: 'El',
    f: 'Fl',
    t: 'F#l',
    g: 'Gl',
    y: 'G#l',
    h: 'Al',
    u: 'A#l',
    j: 'Bl',
    // Upper octave.
    k: 'Cu',
    o: 'C#u',
    l: 'Du',
    p: 'D#u',
    ';': 'Eu',
    "'": 'Fu',
    ']': 'F#u',
    '\\': 'Gu'
      }
    };

    var Drums = {
      keyboard: {
        t: 'leftTom',
        y: 'rightTom', 
        f: 'crash',
        g: 'floorTom', 
        b: 'kick',
        h: 'snare',
        j: 'hiHat'
      }
    };
    var Vibes = {
  // https://github.com/stuartmemo/qwerty-hancock
  keyboard: {
    // Lower octave.
    a: "https://crossorigin.me/https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Snare.mp3",
    w: "https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/percs2.wav",
    s: "https://s3.amazonaws.com/keydown-pro/percs3.mp3",
    e: "https://s3.amazonaws.com/keydown-pro/percs4.mp3",
    d: "https://s3.amazonaws.com/keydown-pro/percs5.wav",
    f: "https://s3.amazonaws.com/keydown-pro/percs6.wav",
    t: "https://s3.amazonaws.com/keydown-pro/percs7.wav",
    g: "https://s3.amazonaws.com/keydown-pro/percs8.wav",
    y: "https://s3.amazonaws.com/keydown-pro/percs9.wav",
    h: "https://s3.amazonaws.com/keydown-pro/percs10.wav",
    u: "https://s3.amazonaws.com/keydown-pro/tones1.wav",
    j: "https://s3.amazonaws.com/keydown-pro/tones2.wav",
    i: "https://s3.amazonaws.com/keydown-pro/kick7.wav",
   
    k: "https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/tones3.wav",
    o: "https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/tones4.wav",
    l: "https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/tones5.wav",
    p: "https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/tones6.wav",
    ';': "https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/tones7.wav",
    "'": "https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/tones8.wav",
    ']': "https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/tones9.wav",
    '\\': "https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/tones10.wav", 
    z:"https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/kicks6.WAV", 
    x:"https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/snares2.mp3", 
    c:"https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/snares3.mp3", 
    v:"https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/snares4.mp3", 
    b:"https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/snares5.wav", 
    n:"https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/snares6.wav", 
    m:"https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/snares7.wav", 
   
    q:"https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/kicks2.mp3", 
    z:"https://crossorigin.me/https://s3.amazonaws.com/keydown-pro/kicks1.mp3"

      }
    
    };

   
    var vibe= Vibes.keyboard;

    var instrument = Instruments.keyboard;

    var drum = Drums.keyboard;


    //--------------INTERACTION---------------//


  //rendering 
  function addNewCircle(d){
    let graphic = {
      x: Math.floor(Math.random() * (window.innerWidth - 80) + 60),
      y: Math.floor(Math.random() * (window.innerHeight - 80) + 60),
      r:Math.floor(Math.random() * Math.floor(255)),
      g:Math.floor(Math.random() * Math.floor(255)),
      b:Math.floor(Math.random() * Math.floor(255)),
      a:Math.floor(255), 
      diameter: Math.floor(Math.random() * d),
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4
    };

    if(circles.length >=10 ){
      circles.splice(-1,1);
      circles.splice(0,0, graphic);

    } else {
    circles.push(graphic);
    }
    var i = 1;
    for(var i = circles.length - 1; i > -1; i--){
      circles[i].a = 255 - Math.round(25*i);
    }
    // this.setState({
    //         circles:circles
    //       });
  };



  //handler

  var insKeyDown = function(event){
        switch(keyboardState) {
    

          case "instrument":

            var key = event.key;
            
      if(instrument[key]){
          var note = instrument[key].replace('l', octave).replace('u', octave + 1);
      }
      
             if (typeof(note) != 'undefined') {
                socket.emit('PianoKeyPressed', note);
                //synth2.triggerAttack(note);

              } else {
              }
          break;


          //Vibe(mp3 keyboard) State
          case "vibe":
            var keyName = event.key;
            console.log(vibe[keyName])
            var note = vibe[keyName];
        

             if (typeof(note) != 'undefined') {
                socket.emit('VibeKeyPressed', note);

              } else {
              }


          break;
          case "drum":
            var keyName = event.key;
            var note = drum[keyName];
            
            switch(note){
              case 'snare':
                snare(false);
                break;
              case 'hiHat':
                hiHat(false);
                break; 
              case 'kick':
                kick(false);
                break; 
              case 'leftTom':
                leftTom(false);
                break; 
              case 'rightTom':
                rightTom(false);
                break; 
              case 'floorTom':
                floorTom(false);
                break; 
              case 'crash':
                crashdrum(false);
                break;     
              default:
                break;
            }
          break;
          default:
          break;      

    }
    }
    var insKeyUp = function(event){

      var key = event.key;
      
      if(instrument[key]){
          var note = instrument[key].replace('l', octave).replace('u', octave + 1);
      }
      
      socket.emit('PianoKeyReleased', note);
      synth2.triggerRelease(note);

    }

      document.addEventListener('keydown', insKeyDown );
      document.addEventListener('keyup', insKeyUp);

  

    //MOUSE INTERACTION OF 
    //attach a listener to all of the buttons
    document.querySelectorAll('li').forEach(function(button){
      button.addEventListener('mousedown', function(e){
        //play the note on mouse down
        //synth.triggerAttack(e.target.textContent)
        //Play sound base on content of the li
        socket.emit('buttonPressed', e.target.textContent);
      })
      button.addEventListener('mouseup', function(e){
        //release on mouseup
        //synth.triggerRelease()
        //Release sound base on content of the li.
        socket.emit('buttonReleased', e.target.textContent);
      })
    })





    //--------------------------------------DRUM-------------------------------------------//
    //drum

    //Snare
    //audio
    var snareAudio = $('#Snare-Audio');
    var snareAudioEl = snareAudio.get(0);
    snareAudioEl.currentTime = 0;

    var snareDrum = $('#Snare-Drum');

    // Create a new timeline, that's paused by default
    var snaretl = new TimelineMax({
      paused: true
    });

    // The animation tweens
    snaretl.to(snareDrum, 0.1, {scaleX: 1.04, transformOrigin: "50% 50%", ease: Expo.easeOut})
           .to(snareDrum, 0.1, {scaleY: 0.9, transformOrigin: "50% 100%", ease: Expo.easeOut}, '0')
           // The last tween, returns the element to it's original properties
           .to(snareDrum, 0.4, {scale: 1, transformOrigin: "50% 100%", ease: Elastic.easeOut});

    var snareDrum = $('#Snare-Drum');

    // Create a new timeline, that's paused by default
    var snaretl = new TimelineMax({
      paused: true
    });

    // The animation tweens
    snaretl.to(snareDrum, 0.1, {scaleX: 1.04, transformOrigin: "50% 50%", ease: Expo.easeOut})
           .to(snareDrum, 0.1, {scaleY: 0.9, transformOrigin: "50% 100%", ease: Expo.easeOut}, '0')
           // The last tween, returns the element to it's original properties
           .to(snareDrum, 0.4, {scale: 1, transformOrigin: "50% 100%", ease: Elastic.easeOut});

      function snare(fromServer){
        //snare audio & animatin
        snaretl.restart();
        snaretl.play();
        var snareAudioEl = snareAudio.get(0);
        if(!fromServer) {
          socket.emit('drumPressed', "snare");

        } else {
          snareAudioEl.volume = drumVol;
          snareAudioEl.currentTime = 0;
          snareAudioEl.play();
        }



      }

      function crashdrum(fromServer){
        //crash
        crashtl.restart();
        crashtl.play();
        var crashAudioEl = crashAudio.get(0);
        if(!fromServer){
          socket.emit('drumPressed', "crashdrum");
        } else {
        crashAudioEl.volume = drumVol;
        crashAudioEl.currentTime = 0;
        crashAudioEl.play();
       
        }
      }

      function rightTom(fromServer){
        //right tom
        rightTomtl.restart();
        rightTomtl.play();
        var smallTomAudioEl = smallTomAudio.get(0);
        if(!fromServer) {
          socket.emit('drumPressed', "rightTom");
        } else {
          smallTomAudioEl.volume = drumVol;
          smallTomAudioEl.currentTime = 0;
          smallTomAudioEl.play();
        }
      }

      function leftTom(fromServer){
        //lift tom
        leftTomtl.restart();
        leftTomtl.play();
        var bigTomAudioEl = bigTomAudio.get(0);
        if(!fromServer) {
          socket.emit('drumPressed', "leftTom");
        } else {
          bigTomAudioEl.volume = drumVol;
          bigTomAudioEl.currentTime = 0;
          bigTomAudioEl.play();
        }      
      }

      function floorTom(fromServer){
        //Floor Tom
        floorTomtl.restart();
        floorTomtl.play();
        var floorTomAudioEl = floorTomAudio.get(0);
        if(!fromServer) {
          socket.emit('drumPressed', "floorTom");
        } else {
          floorTomAudioEl.volume = drumVol;
          floorTomAudioEl.currentTime = 0;
          floorTomAudioEl.play();
        }
      }

      function kick(fromServer){
        //Kick Drum
        kicktl.restart();
        kicktl.play();
        var kickAudioEl = kickAudio.get(0);
        if(!fromServer) { 
          socket.emit('drumPressed', "kick");
        } else {
          kickAudioEl.volume = drumVol;
          kickAudioEl.currentTime = 0;
          kickAudioEl.play();
        }
      }

      function hiHat(fromServer){
        //Hi-Hat
        hiHattl.restart();
        hiHattl.play();
        var hiHatClosedAudioEl = hiHatClosedAudio.get(0);
        if(!fromServer) { 
          socket.emit('drumPressed', "hiHat");
        } else {
          hiHatClosedAudioEl.volume = drumVol;
          hiHatClosedAudioEl.currentTime = 0;
          hiHatClosedAudioEl.play();
        }
      }


    //crash
    var crash = $('#Crash');
    var crashCymbol = $('#Crash-Cymbol');
    var crashAudio = $('#Crash-Audio');
    var crashAudioEl = crashAudio.get(0);
    crashAudioEl.currentTime = 0;

    // Crash timeline
    var crashtl = new TimelineMax({
      paused: true
    });
    crashtl.to(crashCymbol, 0.1, {rotation: 8, transformOrigin: "50% 50%"})
           .to(crashCymbol,1.5, {rotation: 0, transformOrigin: "50% 50%", ease: Elastic.easeOut.config(2.5, 0.3)});
   
    //Right tom 
    // Right tom drum varibles
    var rightTomDrumAll = $('#Tom-Right-All');
    var rightTomDrum = $('#Tom-Right-Drum');
    var smallTomAudio = $('#Small-Rack-Tom-Audio');

    // Right tom drum timeline
    var rightTomtl = new TimelineMax({
      paused: true
    });
    rightTomtl.to(rightTomDrum, 0.1, {scaleX: 1.04, transformOrigin: "50% 50%", ease: Expo.easeOut})
              .to(rightTomDrum, 0.1, {scaleY: 0.95, transformOrigin: "50% 50%", ease: Expo.easeOut}, '0')
              .to(rightTomDrumAll, 0.1, {rotation: 2.5, transformOrigin: "0 50%", ease: Elastic.easeOut}, '0')
              .to(rightTomDrum, 0.4, {scale: 1, transformOrigin: "50% 50%", ease: Elastic.easeOut})
              .to(rightTomDrumAll, 0.6, {rotation: 0, transformOrigin: "0 50%", ease: Elastic.easeOut}, '-=0.4');



    // Left Tom
    // Left tom drum varibles
    var leftTomDrumAll = $('#Tom-Left-All');
    var leftTomDrum = $('#Tom-Left-Drum');
    var bigTomAudio = $('#Big-Rack-Tom-Audio');

    // Left tom drum timeline
    var leftTomtl = new TimelineMax({
      paused: true
    });
    leftTomtl.to(leftTomDrum, 0.1, {scaleX: 1.04, transformOrigin: "50% 50%", ease: Expo.easeOut})
            .to(leftTomDrum, 0.1, {scaleY: 0.95, transformOrigin: "50% 50%", ease: Expo.easeOut}, '0')
            .to(leftTomDrumAll, 0.1, {rotation: -2.5, transformOrigin: "100% 50%", ease: Elastic.easeOut}, '0')
            .to(leftTomDrum, 0.4, {scale: 1, transformOrigin: "50% 50%", ease: Elastic.easeOut})
            .to(leftTomDrumAll, 0.6, {rotation: 0, transformOrigin: "100% 50%", ease: Elastic.easeOut}, '-=0.4');


    //Floor Tom
    // Floor tom drum varibles
    var floorTomDrumAll = $('#Floor-Tom');
    var floorTomAudio = $('#Floor-Tom-Audio');

    // Floor tom drum timeline
    var floorTomtl = new TimelineMax({
      paused: true
    });
    floorTomtl.to(floorTomDrumAll, 0.1, {scaleX: 1.02, transformOrigin: "50% 50%", ease: Expo.easeOut})
              .to(floorTomDrumAll, 0.1, {scaleY: 0.95, transformOrigin: "50% 100%", ease: Expo.easeOut}, '0')
              .to(floorTomDrumAll, 0.4, {scale: 1, transformOrigin: "50% 100%", ease: Elastic.easeOut});

    //Kick Drum
    // Kick drum varibles
    var kickDrumAll = $('#Kick');
    var kickAudio = $('#Kick-Audio');

    // Kick drum timeline
    var kicktl = new TimelineMax({
      paused: true
    });
    kicktl.to(kickDrumAll, 0.1, {scale: 1.02, transformOrigin: "50% 100%", ease: Expo.easeOut})
          .to(kickDrumAll, 0.4, {scale: 1, transformOrigin: "50% 100%", ease: Elastic.easeOut});


    //Hi-Hat

    // Hi-hat varibles
    var hiHatAll = $('#Hi-Hat');
    var hiHatTop = $('#Hi-Hat-Top');
    var hiHatBottom = $('#Hi-Hat-Bottom');
    var hiHatClosedAudio = $('#Hi-Hat-Closed-Audio');

    // Hi-hat timeline
    var hiHattl = new TimelineMax({
      paused: true
    }); 
    hiHattl.to([hiHatTop, hiHatBottom], 0.1, {rotation: -4, transformOrigin: "50% 50%"})
           .to([hiHatTop, hiHatBottom], 0.6, {rotation: 0, transformOrigin: "50% 50%", ease: Elastic.easeOut.config(1.5, 0.2)});


    //All mouse interaction for drum
    //DOM Button
    $('#snaredr').click(function(){
            snare(false);
    }); 
    $('#crashdr').click(function(){
      crashdrum(false);
    });
    $('#right-tomdr').click(function(){
      rightTom(false);

    });
    $('#left-tomdr').click(function(){
      leftTom(false);
    });
    $('#floortomdr').click(function(){
      floorTom(false);
    });
    $('#kickdr').click(function(){
      kick(false);
    });
    $('#hiHatdr').click(function(){
      hiHat(false);
    });
    //Graphic Key 
    $('#Key-72').click(function(){
      snare(false);
    });
    $('#Key-71').click(function(){
      floorTom(false);
    });
    $('#Key-70').click(function(){
      crashdrum(false);
    });
    $('#Key-89').click(function(){
      rightTom(false);
    });
    $('#Key-84').click(function(){
      leftTom(false);
    });
    $('#Key-66').click(function(){
      kick(false);
    });
    $('#Key-74').click(function(){
      hiHat(false);
    });
    //Graphical Interface
    $('#Snare').click(function(){
      snare(false);
    });
    $('#Floor-Tom').click(function(){
      floorTom(false);
    });
    $('#Crash').click(function(){
      crashdrum(false);
    });
    $('#Tom-Right-All').click(function(){
      rightTom(false);
    });
    $('#Tom-Left-All').click(function(){
      leftTom(false);
    });
    $('#Kick').click(function(){
      kick(false);
    });
    $('#Hi-Hat').click(function(){
      hiHat(false);
    });


    //--------------------------------------Sequencer-------------------------------------------//


    // Sequencer varibles
  var rows = $('.row');
  var rowLength = rows.first().children().length;
  var labels = $('label');
  // Beat starts at 1 because 0 is the img for each row
  var beat = 1;

  // Sequencer
  function sequencer () {
    labels.removeClass('active');
    // Do this function for each .row
    $(rows).each(function() {
    // Select the child element at the "beat" index
     var current = $(this).children().eq(beat);
      current.addClass('active');
    // If the current input is checked do some stuff!
      if (current.find('input').is(":checked")) {
        console.log(current.parent().attr('data-target-drum'))
        switch(current.parent().attr('data-target-drum')){
          case 'snare':
            snare(false);
            break;
          case 'hiHat':
            hiHat(false);
            break; 
          case 'kick':
            kick(false);
            break; 
          case 'leftTom':
            leftTom(false);
            break; 
          case 'rightTom':
            rightTom(false);
            break; 
          case 'floorTom':
            floorTom(false);
            break; 
          case 'crash':
            crashdrum(false);
            break;     
          default:
            break;
        }
        // kicktl.restart();
        // kicktl.play();
        // var kickAudioEl = kickAudio.get(0);
        // kickAudioEl.currentTime = 0;
        // kickAudioEl.play();

        var targetDrum = (current.parent().attr('data-target-drum'));
        // If there a function that shares the same name as the data attribue, do it!
        var fn = window[targetDrum];
        if (typeof fn === "function") {
          fn();
        }
      }
    });
    // If we get to the last child, start over
    if ( beat < (rowLength - 1) ) {
      ++beat;
    } else {
      beat = 1;
    }
  }

  // Start/Stop Sequencer varibles
  var sequencerOn = false;
  var intervalId;
  ///
  // Start/Stop Sequencer
  $('#sequencer-active-btn').click(function () {
    $(this).find('i').toggleClass('fa-pause');
    console.log("HIT")
    if (sequencerOn === false) {
      socket.emit('updateBpmToServer', bpm);
      socket.emit('drumSequencerActive', true);
    } else {
      
      socket.emit('drumSequencerActive', false);
    }

  });

  // Tempo varibles
  var bpm = 300;
  var interval = 60000 / bpm;
  var targetDrum;
  var fn;
// Increase tempo
  $('#bpm-increase-btn').click(function() {
    console.log("bpm",bpm);
    console.log("interval", interval);
    console.log('increase bpm');
    if ( bpm < 300 ) {
      bpm = parseInt($('#bpm-indicator').val());
      bpm += 10;

      interval = parseInt(60000 / bpm);
      $('#bpm-indicator').val(bpm);
    }
  });

  //Decrease tempo
  $('#bpm-decrease-btn').click(function() {

    console.log('decrease bpm');
    if ( bpm > 100 ) {
      bpm = parseInt($('#bpm-indicator').val());
      bpm -= 10;
      console.log("bpm",bpm);
      interval = parseInt(60000 / bpm);
      $('#bpm-indicator').val(bpm);
    }
  });


  // Trigger drum on input check
  $('input').click(function() {
    console.log('im clicked', this)
    if (sequencerOn === false) {

        var id = this.id
      if ($(this).is(":checked")) {
        targetDrum = $(this).parents(".row").attr('data-target-drum');
        console.log(id);
        socket.emit('addDrumSequencerItem', id);

        //For instant feedback
        //fn = window[targetDrum];
        if (typeof fn === "function") {
          fn();
        }
      } else {
        socket.emit('removeDrumSequencerItem', id);
      }
    }
  });

  // Load audio on iOS devices on the first user interaction, because...
  $('#sequencer-visible-btn').one('click', function() {
    $("audio").each(function(i) {
      this.play();
      this.pause();
    });
  });


  //Refresh Btn
  $('#sequencer-reset-btn').click(function(){
    socket.emit('requestUpdateSequencer');
  });


  }//End Of componentWillUpdate 

  componentDidUpdate(){
    // DRUM


    var snareAudio = $('#Snare-Audio');
    var snareAudioEl = snareAudio.get(0);
    snareAudioEl.currentTime = 0;

    var snareDrum = $('#Snare-Drum');

    // Create a new timeline, that's paused by default
    var snaretl = new TimelineMax({
      paused: true
    });

    // The animation tweens
    snaretl.to(snareDrum, 0.1, {scaleX: 1.04, transformOrigin: "50% 50%", ease: Expo.easeOut})
           .to(snareDrum, 0.1, {scaleY: 0.9, transformOrigin: "50% 100%", ease: Expo.easeOut}, '0')
           // The last tween, returns the element to it's original properties
           .to(snareDrum, 0.4, {scale: 1, transformOrigin: "50% 100%", ease: Elastic.easeOut});

    var snareDrum = $('#Snare-Drum');

    // Create a new timeline, that's paused by default
    var snaretl = new TimelineMax({
      paused: true
    });

    // The animation tweens
    snaretl.to(snareDrum, 0.1, {scaleX: 1.04, transformOrigin: "50% 50%", ease: Expo.easeOut})
           .to(snareDrum, 0.1, {scaleY: 0.9, transformOrigin: "50% 100%", ease: Expo.easeOut}, '0')
           // The last tween, returns the element to it's original properties
           .to(snareDrum, 0.4, {scale: 1, transformOrigin: "50% 100%", ease: Elastic.easeOut});

      function snare(fromServer){
        //snare audio & animatin
        snaretl.restart();
        snaretl.play();
        var snareAudioEl = snareAudio.get(0);
        if(!fromServer) {
          socket.emit('drumPressed', "snare");

        } else {
        
          snareAudioEl.currentTime = 0;
          snareAudioEl.play();
        }



      }

      function crashdrum(fromServer){
        //crash
        crashtl.restart();
        crashtl.play();
        var crashAudioEl = crashAudio.get(0);
        if(!fromServer){
          socket.emit('drumPressed', "crashdrum");
        } else {

        crashAudioEl.currentTime = 0;
        crashAudioEl.play();
       
        }
      }

      function rightTom(fromServer){
        //right tom
        rightTomtl.restart();
        rightTomtl.play();
        var smallTomAudioEl = smallTomAudio.get(0);
        if(!fromServer) {
          socket.emit('drumPressed', "rightTom");
        } else {
          smallTomAudioEl.currentTime = 0;
          smallTomAudioEl.play();
        }
      }

      function leftTom(fromServer){
        //lift tom
        leftTomtl.restart();
        leftTomtl.play();
        var bigTomAudioEl = bigTomAudio.get(0);
        if(!fromServer) {
          socket.emit('drumPressed', "leftTom");
        } else {
          bigTomAudioEl.currentTime = 0;
          bigTomAudioEl.play();
        }      
      }

      function floorTom(fromServer){
        //Floor Tom
        floorTomtl.restart();
        floorTomtl.play();
        var floorTomAudioEl = floorTomAudio.get(0);
        if(!fromServer) {
          socket.emit('drumPressed', "floorTom");
        } else {
          floorTomAudioEl.currentTime = 0;
          floorTomAudioEl.play();
        }
      }

      function kick(fromServer){
        //Kick Drum
        kicktl.restart();
        kicktl.play();
        var kickAudioEl = kickAudio.get(0);
        if(!fromServer) { 
          socket.emit('drumPressed', "kick");
        } else {
          kickAudioEl.currentTime = 0;
          kickAudioEl.play();
        }
      }

      function hiHat(fromServer){
        //Hi-Hat
        hiHattl.restart();
        hiHattl.play();
        var hiHatClosedAudioEl = hiHatClosedAudio.get(0);
        if(!fromServer) { 
          socket.emit('drumPressed', "hiHat");
        } else {
          hiHatClosedAudioEl.currentTime = 0;
          hiHatClosedAudioEl.play();
        }
      }


    //crash
    var crash = $('#Crash');
    var crashCymbol = $('#Crash-Cymbol');
    var crashAudio = $('#Crash-Audio');
    var crashAudioEl = crashAudio.get(0);
    crashAudioEl.currentTime = 0;

    // Crash timeline
    var crashtl = new TimelineMax({
      paused: true
    });
    crashtl.to(crashCymbol, 0.1, {rotation: 8, transformOrigin: "50% 50%"})
           .to(crashCymbol,1.5, {rotation: 0, transformOrigin: "50% 50%", ease: Elastic.easeOut.config(2.5, 0.3)});
   
    //Right tom 
    // Right tom drum varibles
    var rightTomDrumAll = $('#Tom-Right-All');
    var rightTomDrum = $('#Tom-Right-Drum');
    var smallTomAudio = $('#Small-Rack-Tom-Audio');

    // Right tom drum timeline
    var rightTomtl = new TimelineMax({
      paused: true
    });
    rightTomtl.to(rightTomDrum, 0.1, {scaleX: 1.04, transformOrigin: "50% 50%", ease: Expo.easeOut})
              .to(rightTomDrum, 0.1, {scaleY: 0.95, transformOrigin: "50% 50%", ease: Expo.easeOut}, '0')
              .to(rightTomDrumAll, 0.1, {rotation: 2.5, transformOrigin: "0 50%", ease: Elastic.easeOut}, '0')
              .to(rightTomDrum, 0.4, {scale: 1, transformOrigin: "50% 50%", ease: Elastic.easeOut})
              .to(rightTomDrumAll, 0.6, {rotation: 0, transformOrigin: "0 50%", ease: Elastic.easeOut}, '-=0.4');



    // Left Tom
    // Left tom drum varibles
    var leftTomDrumAll = $('#Tom-Left-All');
    var leftTomDrum = $('#Tom-Left-Drum');
    var bigTomAudio = $('#Big-Rack-Tom-Audio');

    // Left tom drum timeline
    var leftTomtl = new TimelineMax({
      paused: true
    });
    leftTomtl.to(leftTomDrum, 0.1, {scaleX: 1.04, transformOrigin: "50% 50%", ease: Expo.easeOut})
            .to(leftTomDrum, 0.1, {scaleY: 0.95, transformOrigin: "50% 50%", ease: Expo.easeOut}, '0')
            .to(leftTomDrumAll, 0.1, {rotation: -2.5, transformOrigin: "100% 50%", ease: Elastic.easeOut}, '0')
            .to(leftTomDrum, 0.4, {scale: 1, transformOrigin: "50% 50%", ease: Elastic.easeOut})
            .to(leftTomDrumAll, 0.6, {rotation: 0, transformOrigin: "100% 50%", ease: Elastic.easeOut}, '-=0.4');


    //Floor Tom
    // Floor tom drum varibles
    var floorTomDrumAll = $('#Floor-Tom');
    var floorTomAudio = $('#Floor-Tom-Audio');

    // Floor tom drum timeline
    var floorTomtl = new TimelineMax({
      paused: true
    });
    floorTomtl.to(floorTomDrumAll, 0.1, {scaleX: 1.02, transformOrigin: "50% 50%", ease: Expo.easeOut})
              .to(floorTomDrumAll, 0.1, {scaleY: 0.95, transformOrigin: "50% 100%", ease: Expo.easeOut}, '0')
              .to(floorTomDrumAll, 0.4, {scale: 1, transformOrigin: "50% 100%", ease: Elastic.easeOut});

    //Kick Drum
    // Kick drum varibles
    var kickDrumAll = $('#Kick');
    var kickAudio = $('#Kick-Audio');

    // Kick drum timeline
    var kicktl = new TimelineMax({
      paused: true
    });
    kicktl.to(kickDrumAll, 0.1, {scale: 1.02, transformOrigin: "50% 100%", ease: Expo.easeOut})
          .to(kickDrumAll, 0.4, {scale: 1, transformOrigin: "50% 100%", ease: Elastic.easeOut});


    //Hi-Hat

    // Hi-hat varibles
    var hiHatAll = $('#Hi-Hat');
    var hiHatTop = $('#Hi-Hat-Top');
    var hiHatBottom = $('#Hi-Hat-Bottom');
    var hiHatClosedAudio = $('#Hi-Hat-Closed-Audio');

    // Hi-hat timeline
    var hiHattl = new TimelineMax({
      paused: true
    }); 
    hiHattl.to([hiHatTop, hiHatBottom], 0.1, {rotation: -4, transformOrigin: "50% 50%"})
           .to([hiHatTop, hiHatBottom], 0.6, {rotation: 0, transformOrigin: "50% 50%", ease: Elastic.easeOut.config(1.5, 0.2)});


    //All mouse interaction for drum
    //DOM Button
    $('#snaredr').click(function(){
            snare(false);
    }); 
    $('#crashdr').click(function(){
      crashdrum(false);
    });
    $('#right-tomdr').click(function(){
      rightTom(false);

    });
    $('#left-tomdr').click(function(){
      leftTom(false);
    });
    $('#floortomdr').click(function(){
      floorTom(false);
    });
    $('#kickdr').click(function(){
      kick(false);
    });
    $('#hiHatdr').click(function(){
      hiHat(false);
    });
    //Graphic Key 
    $('#Key-72').click(function(){
      snare(false);
    });
    $('#Key-71').click(function(){
      floorTom(false);
    });
    $('#Key-70').click(function(){
      crashdrum(false);
    });
    $('#Key-89').click(function(){
      rightTom(false);
    });
    $('#Key-84').click(function(){
      leftTom(false);
    });
    $('#Key-66').click(function(){
      kick(false);
    });
    $('#Key-74').click(function(){
      hiHat(false);
    });
    //Graphical Interface
    $('#Snare').click(function(){
      snare(false);
    });
    $('#Floor-Tom').click(function(){
      floorTom(false);
    });
    $('#Crash').click(function(){
      crashdrum(false);
    });
    $('#Tom-Right-All').click(function(){
      rightTom(false);
    });
    $('#Tom-Left-All').click(function(){
      leftTom(false);
    });
    $('#Kick').click(function(){
      kick(false);
    });
    $('#Hi-Hat').click(function(){
      hiHat(false);
    });

  //TONE STUFF
  var synth2 = new Tone.PolySynth(6, Tone.Synth, {
        "oscillator" : {
          "partials" : [0, 2, 3, 4],
        }
      }).toMaster();
      var synth3 = new Tone.Synth().toMaster();
  var synth = new Tone.FMSynth({
      "modulationIndex" : 12.22,
      "envelope" : {
        "attack" : 0.01,
        "decay" : 0.2
      },
      "modulation" : {
        "type" : "square"
      },
      "modulationEnvelope" : {
        "attack" : 0.2,
        "decay" : 0.01
      }
    }).toMaster();
  //var code = $.ui.keyCode;


    //attach a listener to all of the buttons
    document.querySelectorAll('li').forEach(function(button){
      button.addEventListener('mousedown', function(e){
        //play the note on mouse down
        //

        //synth.triggerAttack(e.target.textContent)
        //Play sound base on content of the li
        socket.emit('buttonPressed', e.target.textContent);

        console.log("from local" + e.target.textContent)

      })
      button.addEventListener('mouseup', function(e){
        //release on mouseup
        //synth.triggerRelease()
        //Release sound base on content of the li.
        socket.emit('buttonReleased', e.target.textContent);
      })
    })

    $('#synthSlider').click(function() {
      alert( "Handler for .change() called." );
    });

  }

  
  handle(){
      this.setState({first: "Keyboard2"})
      keyboardState = 'instrument';
      //$('ul li.white').style.background = "-webkit-linear-gradient(top, orange 0%,#fff 100%)";
    }

  handleDrum(){
    this.setState({first: "Drum"})
    keyboardState ='drum'
  }

  handleInstrument() { 
    var data = '';

    console.log("it was 1");
    switch (keyboardState) {
      case "vibe":
        data = 'instrument';
        break;

      case "instrument":
        data = 'vibe';
        break;  

      default:
        data = 'instrument';
        break;

    }
    keyboardState = data;
  }

  handleSynth() {
      console.log("pressed", synth2);
      socket.emit('synthStatusChanged', synthStatus);
      if (synthStatus == false) {
      synth2 = new Tone.PolySynth(3, Tone.DuoSynth, {
      "oscillator": {
        "type": "sine"
      },
      "envelope": {
        "attack": 0.01,
        "decay": 0.1,
        "sustain": 0.2,
        "release": 4,
      }
    }).toMaster();
      synthStatus = true;
    } else {
      synth2 = new Tone.PolySynth({
        "portamento" : 0.01,
        "oscillator" : {
          "type" : "square"
        },
        "envelope" : {
          "attack" : 0.005,
          "decay" : 0.2,
          "sustain" : 0.4,
          "release" : 1.4,
        },
        "filterEnvelope" : {
          "attack" : 0.005,
          "decay" : 0.1,
          "sustain" : 0.05,
          "release" : 0.8,
          "baseFrequency" : 300,
          "octaves" : 4
        }
      }).toMaster();
      synthStatus = false;
    }

    }

    handleSynthVolume(){
      var input = document.getElementById("synthSlider");
      var currentVal = input.value;
      synthVol = currentVal;
    }
    handleKeyVolume(){
      var input = document.getElementById("keySlider");
      var currentVal = input.value;
      keyVol = currentVal;
      Howler.volume(keyVol);
    }
    handleDrumVolume(){
      var input = document.getElementById("drumSlider");
      var currentVal = input.value;
      drumVol = currentVal;
    }



//main render
//app render
  render() {
    let yo = (this.state.clicked % 2) === 0;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">JamSesh</h1>
        </header>
        
        <div>
        <P5Wrapper sketch={this.state.stateSketch} rotation={this.state.rotation} circles={this.state.circles}/>
        
        </div>

        <div id = "messages">
        <div id="messageTab">
        <img src={message} id="messageIcon"></img>
        </div>
        <div id="future">
        <p>Hi!</p>
        <p>Hi!</p>
        </div>
          <form id="form" id="chat_form">
              <input id="chat_input" type="text"/>
              <button  id="submit" type="submit" value="Send">Send</button>
        </form>
        </div>
        




        <div id="eq">
        <div id = "eqTab" onClick={eqPop}>
        <img src={sound} id="eqSoundIcon"></img>
        </div>
        <h3>Volume Control</h3>
        
        <div class='eqSliders'>
        <h4>Drums</h4>
        <input id="drumSlider" onChange={this.handleDrumVolume.bind(this)} type="range" min="0.0" max="1.0" step=".01"/>
        </div>

        <div class='eqSliders'>
        <h4>Synth</h4>
        <input id="synthSlider" onChange={this.handleSynthVolume.bind(this)} type="range" min="0.0" max="1.0" step=".01"/>
        </div>

        <div class='eqSliders'>
        <h4>Keys</h4>
        <input id="keySlider" onChange={this.handleKeyVolume.bind(this)} type="range" min="0.0" max="1.0" step=".01"/>
        </div>

        </div>

        
      
        
        {this.state.first == "Keyboard1" && <Keyboard1/>}
        {this.state.first == "Keyboard2" && <Keyboard2/>}
        {this.state.first == "Drum" && <Drum/>}
        {this.state.first == "DrumSequencer" && <DrumSequencer/>}
        
        <button class="button" onClick={this.handleSynth.bind(this)}>CHANGE SYNTH</button>
        <button class="button"  onClick={this.handleInstrument.bind(this)}>CHANGE KEYBOARD/VIBE</button>
        <button class="button"  onClick={this.handleDrum.bind(this)}>DRUM</button>
        <button class="button"  onClick={this.handle.bind(this)}>KEYBOARD2</button>
        <p><button class="button" id="record">Record audio</button> <button class="button" id="stop">Stop</button></p>
        <p><audio id="audio" controls></audio></p>

        <DrumSequencer/>



        <audio id="Big-Rack-Tom-Audio">
  <source src="https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Big-Rack-Tom.mp3" preload="auto" type="audio/mp3" />
</audio>
<audio id="Crash-Audio">
  <source src="https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Crash.mp3" preload="auto" type="audio/mp3" />
</audio>
<audio id="Floor-Tom-Audio">
  <source src="https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Floor-Tom.mp3" preload="auto" type="audio/mp3" />
</audio>
<audio id="Hi-Hat-Closed-Audio">
  <source src="https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Hi-Hat-Closed.mp3" preload="auto" type="audio/mp3" />
</audio>
<audio id="Hi-Hat-Open-Audio">
  <source src="https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/High-Hat-Open.mp3" preload="auto" type="audio/mp3" />
</audio>
<audio id="Kick-Audio">
  <source src="https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Kick.mp3" preload="auto" type="audio/mp3" />
</audio>
<audio id="Small-Rack-Tom-Audio">
  <source src="https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Small-Rack-Tom.mp3" preload="auto" type="audio/mp3" />
</audio>
<audio id="Snare-Audio">
  <source src="https://s3.amazonaws.com/iamjoshellis-codepen/pens-of-rock/drums/Snare.mp3" preload="auto" type="audio/mp3" />
</audio>

      </div>
    );
  }
}
//uses template from codepen: Sellfy.com/orange83/checkout/?visitor_id=d8d1c378-4af5-483c-a6da-1a630daf0dca
class Anime extends React.Component {

  constructor(props) {
    super(props);
    this.targets = [];
  }

  componentDidMount() {

    let animeProps = Object.assign({}, this.props, {
      targets: this.targets
  });

    delete animeProps.children;

this.anime = anime(animeProps);
  }
  
  shouldComponentUpdate(nextProps) {
    this.anime = anime(Object.assign({}, {targets: this.targets}, nextProps));
    
    return true;
  }

addTarget = (newTarget) => {
  this.targets = [...this.targets, newTarget];
}

render() {
  let children = [];
  if (this.props.children) {
    if (Array.isArray(this.props.children))
      children = this.props.children;
    else
      children = [this.props.children];
  }

  return (
    <g>
      {children.map((child, i) => (React.cloneElement(child, { key: i, ref: this.addTarget })))}
    </g>
  );
  }
}

class Keyboard1 extends React.Component {

  
  render (){

    return (
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

        </div>
        )
  }
}

class Keyboard2 extends React.Component {
  render (){
    return (
    <div>
      <h1>Keyboard2</h1>

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





class Drum extends React.Component {
  render (){
    return (
    <div>
      <h1>Drum</h1>
<svg class="drumsvg" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="300 300 1400 1400">
<g id="Drums">
  <g>
    <path id="Drum-Shadow" opacity="0.1" fill="#333333" d="M1626.6,1282.8c0,45.4-280.5,82.1-626.6,82.1re
      c-346,0-626.6-36.8-626.6-82.1c0-45.4,280.5-82.1,626.6-82.1C1346,1200.6,1626.6,1237.4,1626.6,1282.8z"/>
    <g id="Snare">
      <g id="Snare-Drum">
        
          <rect x="1219" y="885" fill="#0BC1F8" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="223" height="110"/>
        <line fill="none" stroke="#0891BA" stroke-width="8" stroke-miterlimit="10" x1="1438" y1="914" x2="1223" y2="914"/>
        <g>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M1227,950c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V950z"/>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M1450,950c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V950z"/>
          <g>
            
              <line fill="none" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1293" y1="971" x2="1293" y2="958"/>
            
              <line fill="none" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1293" y1="922" x2="1293" y2="909"/>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1301,950c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V950z"/>
          </g>
          <g>
            
              <line fill="none" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1368" y1="971" x2="1368" y2="958"/>
            
              <line fill="none" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1368" y1="922" x2="1368" y2="909"/>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1376,950c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V950z"/>
          </g>
        </g>
        
          <rect x="1209" y="885" fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="241" height="21"/>
        
          <rect x="1209" y="974" fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="241" height="21"/>
        <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="1213" y1="900" x2="1446" y2="900"/>
        <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="1213" y1="989" x2="1446" y2="989"/>
      </g>
      <g id="Snare-Stand">
        
          <rect x="1321" y="1087" fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="17" height="95"/>
        <g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1403.4,1256c-3.4,3.4-8.8,3.3-12.1-0.1l-66.7-66.7c-3.4-3.4-3.5-8.7-0.1-12.1l0,0c3.4-3.4,8.8-3.3,12.1,0.1l66.7,66.7
              C1406.6,1247.2,1406.7,1252.6,1403.4,1256L1403.4,1256z"/>
            
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="1395.4" y1="1252.8" x2="1328.2" y2="1185.6"/>
            
              <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1403.8,1244.4l-12,12c0,0,6.4,10.8,8,12.4c4.7,4.7,11.9,4.3,16.6-0.4c4.7-4.7,5.1-11.9,0.5-16.6
              C1415.3,1250.4,1403.8,1244.4,1403.8,1244.4z"/>
          </g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1257.5,1255.7c-3.4-3.4-3.3-8.8,0.1-12.1l66.7-66.7c3.4-3.4,8.7-3.5,12.1-0.1l0,0c3.4,3.4,3.3,8.8-0.1,12.1l-66.7,66.7
              C1266.2,1259,1260.8,1259.1,1257.5,1255.7L1257.5,1255.7z"/>
            
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="1265.7" y1="1252.8" x2="1330.5" y2="1187.9"/>
            
              <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1269,1256.1l-12-12c0,0-10.8,6.4-12.4,8c-4.7,4.7-4.3,11.9,0.4,16.6c4.7,4.7,11.9,5.1,16.6,0.5
              C1263,1267.7,1269,1256.1,1269,1256.1z"/>
          </g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1317.1,1182.8c0-7.5,6-13.5,13.5-13.5s13.5,6,13.5,13.5c0,7.5-6,13.5-13.5,13.5S1317.1,1190.2,1317.1,1182.8z"/>
            <path fill="#333333" d="M1333,1179.5c-1.8-1.3-4.3-0.9-5.6,0.9c-1.3,1.8-0.9,4.3,0.9,5.6c1.8,1.3,4.3,0.9,5.6-0.9
              C1335.2,1183.3,1334.8,1180.8,1333,1179.5z"/>
          </g>
        </g>
        <g>
          <g>
            <g>
              
                <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                M1210,979.6c0-3.7-2.8-6.6-6.5-6.6c-3.7,0-6.5,3-6.5,6.6V992h13V979.6z"/>
              
                <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                M1210,997.3V992h-13v10c0,3.6,2.5,7.1,6.1,7.5l122.3,13.6l1.2-12.9L1210,997.3z"/>
              <path fill="#BCECE8" d="M1203.8,1006.6l118.8,13.3l0.2-2l-121.6-13.6C1201.6,1005.5,1202.6,1006.4,1203.8,1006.6z"/>
            </g>
            <g>
              
                <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                M1462,992h-13v5.3l-114.7,12.8l1.6,12.9l120.5-13.5c3.6-0.4,5.5-4,5.5-7.5l0,0V992z"/>
              <path fill="#BCECE8" d="M1338.5,1017.7l0.2,2l117.8-13.1c1.1-0.1,1.9-0.9,2.5-1.9L1338.5,1017.7z"/>
              
                <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                M1462,979.6c0-3.7-2.8-6.6-6.5-6.6c-3.7,0-6.5,3-6.5,6.6V992h13V979.6z"/>
            </g>
          </g>
          <g>
            <g>
              
                <rect x="1323.6" y="1017" transform="matrix(1 5.709041e-03 -5.709041e-03 1 6.0417 -7.5767)" fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="13" height="75"/>
              
                <circle fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="1330.6" cy="1016.8" r="8.5"/>
              <circle fill="#333333" cx="1330.6" cy="1016.8" r="2"/>
            </g>
            <g>
              
                <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                M1418.4,1004.6c-2.5-2.6-6.6-2.6-9.2-0.1l-83.8,82.9l9.1,9.2l83.8-82.9C1420.9,1011.2,1420.9,1007.1,1418.4,1004.6z"/>
              <line fill="none" stroke="#BCECE8" stroke-width="2" stroke-miterlimit="10" x1="1408.9" y1="1017" x2="1344.2" y2="1081"/>
              
                <circle fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="1414.6" cy="1007.8" r="8.5"/>
              <circle fill="#333333" cx="1414.6" cy="1007.8" r="2"/>
            </g>
            <g>
              
                <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                M1243.7,1003.6c-2.6,2.5-2.6,6.6-0.1,9.2l82.9,83.8l9.2-9.1l-82.9-83.8C1250.4,1001.1,1246.3,1001.1,1243.7,1003.6z"/>
              <line fill="none" stroke="#BCECE8" stroke-width="2" stroke-miterlimit="10" x1="1247.8" y1="1011" x2="1317.1" y2="1081"/>
              
                <circle fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="1248.6" cy="1007.8" r="8.5"/>
              <circle fill="#333333" cx="1248.6" cy="1007.8" r="2"/>
            </g>
          </g>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M1348,1089.1c0,4.9-4,8.9-8.9,8.9h-18.2c-4.9,0-8.9-4-8.9-8.9v-4.2c0-4.9,4-8.9,8.9-8.9h18.2c4.9,0,8.9,4,8.9,8.9V1089.1z"/>
        </g>
      </g>
    </g>
    <g id="Floor-Tom">
      <g id="Floor-Tom-Drum">
        
          <rect x="541" y="878" fill="#0BC1F8" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="287" height="320"/>
        <line fill="none" stroke="#0891BA" stroke-width="8" stroke-miterlimit="10" x1="824" y1="907" x2="545" y2="907"/>
        <g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M549,940c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V940z"/>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M836,940c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V940z"/>
            <g>
              
                <line fill="none" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="637" y1="912" x2="637" y2="899"/>
              
                <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                M645,940c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V940z"/>
            </g>
            <g>
              
                <line fill="none" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="732" y1="912" x2="732" y2="899"/>
              
                <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                M740,940c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V940z"/>
            </g>
          </g>
          
            <rect x="532" y="878" fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="304" height="21"/>
          <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="536" y1="893" x2="832" y2="893"/>
        </g>
        <g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M836,1156c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V1156z"/>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M549,1156c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V1156z"/>
            <g>
              
                <line fill="none" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="732" y1="1164" x2="732" y2="1177"/>
              
                <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                M740,1156c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V1156z"/>
            </g>
            <g>
              
                <line fill="none" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="637" y1="1164" x2="637" y2="1177"/>
              
                <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                M645,1156c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V1156z"/>
            </g>
          </g>
          
            <rect x="533" y="1177" fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="304" height="21"/>
          <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="537" y1="1192" x2="833" y2="1192"/>
        </g>
      </g>
      <g id="Floor-Tom-Legs">
        <g>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M526.3,1122.8l-11.3,52.7v76.2c0,3.1,2.4,5.7,5.5,5.7s5.5-2.5,5.5-5.7v-75l11.3-52.7l11.2-52.7l3.6-16.6l-10.9-2.2
            L526.3,1122.8z"/>
          
            <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M533.5,1245L533.5,1245l-6.8-11h-11l-6.6,11h0c-1.3,2-2,4.6-2,7.3c0,7.8,6.3,14.2,14.2,14.2s14.2-6.6,14.2-14.4
            C535.3,1249.6,534.7,1247,533.5,1245z"/>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M553,1014c0-5.6-4.9-10.2-10.5-10.2s-10.5,4.6-10.5,10.2v58h21V1014z"/>
        </g>
        <g>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M681,1251.7c0,3.1,2.4,5.7,5.5,5.7s5.5-2.5,5.5-5.7V1070h-11V1251.7z"/>
          
            <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M699.5,1245L699.5,1245l-6.8-11h-11l-6.6,11h0c-1.3,2-2,4.6-2,7.3c0,7.8,6.3,14.2,14.2,14.2s14.2-6.6,14.2-14.4
            C701.3,1249.6,700.7,1247,699.5,1245z"/>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M697,1014c0-5.6-4.9-10.2-10.5-10.2s-10.5,4.6-10.5,10.2v58h21V1014z"/>
        </g>
        <g>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M843.6,1122.8l-14.2-70.5l-10.7,2.2l3.4,16.6l10.5,52.7l10.4,52.7v75c0,3.1,2.4,5.7,5.5,5.7s5.5-2.5,5.5-5.7v-76.2
            L843.6,1122.8z"/>
          
            <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M861.5,1245L861.5,1245l-6.8-11h-11l-6.6,11h0c-1.3,2-2,4.6-2,7.3c0,7.8,6.3,14.2,14.2,14.2s14.2-6.6,14.2-14.4
            C863.3,1249.6,862.7,1247,861.5,1245z"/>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M816,1014c0-5.6,4.9-10.2,10.5-10.2s10.5,4.6,10.5,10.2v58h-21V1014z"/>
        </g>
      </g>
    </g>
    <g id="Hi-Hat">
      <g id="Hi-Hat-Stand-Top">
        
          <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
          M1494,849V731.2c0-3.1-2.4-5.7-5.5-5.7c-3.1,0-5.5,2.5-5.5,5.7V849H1494z"/>
        
          <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
          M1497,998.8c0,4.6-3.7,8.2-8.2,8.2h-0.5c-4.6,0-8.2-3.7-8.2-8.2V761.2c0-4.6,3.7-8.2,8.2-8.2h0.5c4.6,0,8.2,3.7,8.2,8.2V998.8z"
          />
        <rect x="1483" y="800" fill="#BCECE8" width="11" height="78"/>
        
          <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
          M1502.7,775c0-1-0.7-0.6-0.7-0.7v-0.5c0-4.6-3-7.8-7.6-7.8h-10.5c-4.6,0-8.9,3.2-8.9,7.8v0.5c0,0.1,0.7-0.3,0.7,0.7H1502.7z"/>
        <g id="Hi-Hat-Top">
          
            <path fill="#FDE74C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M1579.8,789.7l-33-0.8c-23-0.5-32.8-4.5-39.5-9c0,0,0.1,0.2,0.1,0.2c-3.5-2.8-7.9-4.2-12.7-4.2c-1.5,0-5.9,0-5.9,0
            s-4.4,0-5.9,0c-4.8,0-9.3,1.4-12.8,4.2c0,0,0-0.1,0-0.1c-6.6,4.5-16.6,8.4-39.6,8.9l-33.5,0.7c-3.7,0-7,2.7-7,6.4v0.1
            c0,3.7,3.6,6.7,7.3,6.7h91.4h91.4c3.7,0,5.8-3,5.8-6.7v-0.1C1586,792.5,1583.5,789.7,1579.8,789.7z"/>
          
            <line fill="none" stroke="#FEF5B7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1479" y1="783" x2="1497" y2="783"/>
        </g>
      </g>
      <g id="Hi-Hat-Bottom">
        
          <path fill="#FDE74C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
          M1397,818.3l32.8,0.8c23,0.5,33.2,4.5,39.2,9v0c4,2.8,9,4.9,13.8,4.9c1.5,0,5.9,0,5.9,0s4.4,0,5.9,0c4.8,0,9.3-1.9,12.8-4.7
          l0-0.1c6.6-4.5,16.6-8.5,39.6-9.1l32.8-0.8c3.7,0,6.2-2.8,6.2-6.5v-0.1c0-3.7-2.2-5.8-5.8-5.8h-91.4h-91.4
          c-3.7,0-7.3,2.1-7.3,5.8v0.1C1390,815.6,1393.3,818.3,1397,818.3z"/>
        
          <line opacity="0.3" fill="none" stroke="#BEAD39" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1479" y1="826" x2="1497" y2="826"/>
      </g>
      <g id="Hi-Hat-Stand">
        
          <rect x="1480" y="833" fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="17" height="367"/>
        <g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1561.8,1272c-3.4,3.4-8.8,3.3-12.1-0.1l-66.7-66.7c-3.4-3.4-3.5-8.7-0.1-12.1l0,0c3.4-3.4,8.8-3.3,12.1,0.1l66.7,66.7
              C1565.1,1263.2,1565.2,1268.6,1561.8,1272L1561.8,1272z"/>
            
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="1553.9" y1="1268.8" x2="1486.7" y2="1201.6"/>
            
              <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1562.2,1260.4l-12,12c0,0,6.4,10.8,8,12.4c4.7,4.7,11.9,4.3,16.6-0.4c4.7-4.7,5.1-11.9,0.5-16.6
              C1573.8,1266.4,1562.2,1260.4,1562.2,1260.4z"/>
          </g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1416,1271.7c-3.4-3.4-3.3-8.8,0.1-12.1l66.7-66.7c3.4-3.4,8.7-3.5,12.1-0.1l0,0c3.4,3.4,3.3,8.8-0.1,12.1l-66.7,66.7
              C1424.7,1275,1419.3,1275.1,1416,1271.7L1416,1271.7z"/>
            <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="1424.2" y1="1268.8" x2="1489" y2="1203.9"/>
            
              <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1427.5,1272.1l-12-12c0,0-10.8,6.4-12.4,8c-4.7,4.7-4.3,11.9,0.4,16.6c4.7,4.7,11.9,5.1,16.6,0.5
              C1421.5,1283.7,1427.5,1272.1,1427.5,1272.1z"/>
          </g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1475.6,1198.8c0-7.5,6-13.5,13.5-13.5s13.5,6,13.5,13.5c0,7.5-6,13.5-13.5,13.5S1475.6,1206.2,1475.6,1198.8z"/>
            <path fill="#333333" d="M1491.5,1195.5c-1.8-1.3-4.3-0.9-5.6,0.9c-1.3,1.8-0.9,4.3,0.9,5.6c1.8,1.3,4.3,0.9,5.6-0.9
              C1493.7,1199.3,1493.3,1196.8,1491.5,1195.5z"/>
          </g>
        </g>
        <g>
          
            <circle fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="1504.7" cy="998.5" r="10"/>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M1502,1010.1c0,6-4.9,10.9-10.9,10.9h-5.1c-6,0-10.9-4.9-10.9-10.9v-22.1c0-6,4.9-10.9,10.9-10.9h5.1c6,0,10.9,4.9,10.9,10.9
            V1010.1z"/>
        </g>
        
          <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
          M1475.7,833c0,0-0.7-0.3-0.7-0.2v0.5c0,4.6,4.4,8.7,8.9,8.7h10.5c4.6,0,7.6-4.2,7.6-8.7v-0.5c0-0.1,0.7,0.2,0.7,0.2H1475.7z"/>
      </g>
    </g>
    <g id="Main-Kit">
      <g id="Toms">
        <g id="Tom-Rack">
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M1009,760.8c5.6,0,10,4.6,10,10.2v101c0,6-20,6-20,0V771C999,765.4,1003.4,760.8,1009,760.8L1009,760.8z"/>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M1052,872V771c0-5.6,4.4-10.2,10-10.2l0,0c5.6,0,10,4.6,10,10.2v101C1072,877.6,1052,877.6,1052,872z"/>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M1082.7,872c0,6.1-4.9,11-11,11h-72c-6.1,0-11-4.9-11-11l0,0c0-6.1,4.9-11,11-11h72C1077.8,861,1082.7,865.9,1082.7,872
            L1082.7,872z"/>
        </g>
        <g id="Tom-Left-All">
          <g id="Tom-Left-Drum">
            
              <rect x="750" y="679" fill="#0BC1F8" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="221" height="184"/>
            <line fill="none" stroke="#0891BA" stroke-width="8" stroke-miterlimit="10" x1="754" y1="708" x2="967" y2="708"/>
            <g>
              <g>
                
                  <path fill="#F8FDFD" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M757,739c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V739z"/>
                
                  <path fill="#F8FDFD" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M979,739c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V739z"/>
                <g>
                  
                    <line fill="#F8FDFD" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="823" y1="711" x2="823" y2="698"/>
                  
                    <path fill="#F8FDFD" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                    M831,739c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V739z"/>
                </g>
                <g>
                  
                    <line fill="#F8FDFD" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="897" y1="711" x2="897" y2="698"/>
                  
                    <path fill="#F8FDFD" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                    M905,739c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V739z"/>
                </g>
              </g>
              
                <rect x="741" y="679" fill="#F8FDFD" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="238" height="21"/>
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="975" y1="694" x2="745" y2="694"/>
            </g>
            <g>
              <g>
                
                  <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M979,823c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V823z"/>
                
                  <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M757,823c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V823z"/>
                <g>
                  
                    <line fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="897" y1="831" x2="897" y2="844"/>
                  
                    <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                    M905,823c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V823z"/>
                </g>
                <g>
                  
                    <line fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="823" y1="831" x2="823" y2="844"/>
                  
                    <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                    M831,823c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V823z"/>
                </g>
              </g>
              
                <rect x="741" y="842" fill="#F8FDFD" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="238" height="21"/>
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="975" y1="858" x2="745" y2="858"/>
            </g>
          </g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M959,782.1c0,6-4.9,10.9-10.9,10.9h-5.1c-6,0-10.9-4.9-10.9-10.9v-22.1c0-6,4.9-10.9,10.9-10.9h5.1c6,0,10.9,4.9,10.9,10.9
              V782.1z"/>
            <path fill="#BCECE8" d="M955.6,786h-18.9c1.4,2.4,3.9,4,6.9,4h5.1C951.7,790,954.3,788.4,955.6,786z"/>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M954.2,781h53.8v0c6,0,10.7-4.4,10.7-10c0-5.6-4.1-10-9.7-10h0.1h-55c-5.6,0-10.2,4.4-10.2,10C944,776.6,948.5,781,954.2,781z
              "/>
            <path fill="#BCECE8" d="M1015.4,774h-67.8c1.1,2.4,3.6,4,6.5,4h54.4c0,0,0.1,0,0.1,0C1011.8,778,1014.3,776.4,1015.4,774z"/>
            
              <circle fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="1009.1" cy="770.8" r="13.3"/>
            <path fill="#333333" d="M1011.5,767.6c-1.8-1.3-4.3-0.9-5.6,0.9c-1.3,1.8-0.9,4.3,0.9,5.6c1.8,1.3,4.3,0.9,5.6-0.9
              C1013.7,771.4,1013.3,768.9,1011.5,767.6z"/>
          </g>
        </g>
        <g id="Tom-Right-All">
          <g id="Tom-Right-Drum">
            
              <rect x="1101" y="679" fill="#0BC1F8" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="221" height="184"/>
            <line fill="none" stroke="#0891BA" stroke-width="8" stroke-miterlimit="10" x1="1105" y1="708" x2="1318" y2="708"/>
            <g>
              <g>
                
                  <path fill="#F8FDFD" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M1108,739c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V739z"/>
                
                  <path fill="#F8FDFD" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M1330,739c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V739z"/>
                <g>
                  
                    <line fill="#F8FDFD" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1174" y1="711" x2="1174" y2="698"/>
                  
                    <path fill="#F8FDFD" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                    M1182,739c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V739z"/>
                </g>
                <g>
                  
                    <line fill="#F8FDFD" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1248" y1="711" x2="1248" y2="698"/>
                  
                    <path fill="#F8FDFD" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                    M1256,739c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V739z"/>
                </g>
              </g>
              
                <rect x="1092" y="679" fill="#F8FDFD" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="238" height="21"/>
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="1326" y1="694" x2="1096" y2="694"/>
            </g>
            <g>
              <g>
                
                  <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M1330,823c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V823z"/>
                
                  <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M1108,823c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V823z"/>
                <g>
                  
                    <line fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1248" y1="831" x2="1248" y2="844"/>
                  
                    <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                    M1256,823c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V823z"/>
                </g>
                <g>
                  
                    <line fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1174" y1="831" x2="1174" y2="844"/>
                  
                    <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                    M1182,823c0,4.4-3.6,8-8,8l0,0c-4.4,0-8-3.6-8-8v-20c0-4.4,3.6-8,8-8l0,0c4.4,0,8,3.6,8,8V823z"/>
                </g>
              </g>
              
                <rect x="1092" y="842" fill="#F8FDFD" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="238" height="21"/>
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="1326" y1="858" x2="1096" y2="858"/>
            </g>
          </g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1139,759.9c0-6-4.9-10.9-10.9-10.9h-5.1c-6,0-10.9,4.9-10.9,10.9v22.1c0,6,4.9,10.9,10.9,10.9h5.1c6,0,10.9-4.9,10.9-10.9
              V759.9z"/>
            <path fill="#BCECE8" d="M1116.5,786h18.9c-1.4,2.4-3.9,4-6.9,4h-5.1C1120.5,790,1117.9,788.4,1116.5,786z"/>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1118,781h-55v0c-6,0-10.2-4.4-10.2-10c0-5.6,4.6-10,10.3-10h-0.1h55c5.6,0,10.2,4.4,10.2,10
              C1128.2,776.6,1123.6,781,1118,781z"/>
            <path fill="#BCECE8" d="M1056.7,774h67.8c-1.1,2.4-3.6,4-6.5,4h-54.4c0,0-0.1,0-0.1,0C1060.3,778,1057.9,776.4,1056.7,774z"/>
            
              <circle fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="1063" cy="770.8" r="13.3"/>
            <path fill="#333333" d="M1060.7,767.6c1.8-1.3,4.3-0.9,5.6,0.9c1.3,1.8,0.9,4.3-0.9,5.6c-1.8,1.3-4.3,0.9-5.6-0.9
              C1058.5,771.4,1058.9,768.9,1060.7,767.6z"/>
          </g>
        </g>
      </g>
      <g id="Kick">
        <g id="Kick-Stand">
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M815.3,1050.3c0.3-5.6,5.3-10,11-9.7c5.6,0.3,10.3,5,10,10.7l-2.7,58l-21-1L815.3,1050.3z"/>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M828.6,1109.1l-7.7,167.4c-0.1,3.1-2.6,5.5-5.8,5.4c-3.1-0.1-5.4-2.8-5.2-5.9l7.7-167.4L828.6,1109.1z"/>
            
              <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M803.4,1269L803.4,1269l7.3-10.6l11,0.4l6.1,11.2h0c1.2,3,1.8,4.8,1.7,7.5c-0.4,7.8-7,13.9-14.8,13.5
              c-7.8-0.4-13.8-7.2-13.5-15C801.4,1273.5,802.1,1271,803.4,1269z"/>
          </g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1256.2,1050.3c-0.3-5.6-5.3-10-11-9.7c-5.6,0.3-10.3,5-10,10.7l2.7,58l21-1L1256.2,1050.3z"/>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1242.9,1109.1l7.7,167.4c0.1,3.1,2.6,5.5,5.8,5.4c3.1-0.1,5.4-2.8,5.2-5.9l-7.7-167.4L1242.9,1109.1z"/>
            
              <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M1268.1,1269L1268.1,1269l-7.3-10.6l-11,0.4l-6.1,11.2h0c-1.2,3-1.8,4.8-1.7,7.5c0.4,7.8,7,13.9,14.8,13.5
              c7.8-0.4,13.8-7.2,13.5-15C1270.1,1273.5,1269.3,1271,1268.1,1269z"/>
          </g>
        </g>
        <g id="Kick-Drum">
          
            <circle fill="#0BC1F8" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="1035.7" cy="1085" r="210"/>
          <circle id="Inner-Drum-Wobble" fill="none" cx="1035.7" cy="1085" r="201.2"/>
          
            <circle id="Inner-Drum" fill="#FDFFFC" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="1035.7" cy="1085" r="192.6"/>
          <g id="Drum-Logo-Wobble">
            <g>
              <path fill="none" d="M980.6,942.2l-4.3,19.9h0.8c7.1,0,12.2-8.3,12.2-15c0-4.8-2.7-9-9.4-9c-13.9,0-23.1,7.8-23.1,20.8
                c0,4.4,1.1,5.1,1.2,5.8c-5.9,0-9.2-2.1-9.2-8.3c0-11.4,15.8-22.3,30.1-22.3c13.5,0,19.4,6.7,19.4,13.7
                c0,5.2-3.3,11.2-9.2,14.6c4.5,1.3,5.9,4.5,5.9,8.6c0,7-4.2,16.4-4.2,21.7c0,2.6,1.3,4.9,3.3,5.7c-3.6,1-6.4,1.5-8.5,1.5
                c-5.6,0-6.7-2.9-6.7-5.7c0-5.7,4.5-16,4.5-22.5c0-3.4-1.3-5.8-5.1-5.8c-0.8,0-1.7,0.1-2.7,0.3l-6.9,32.3h-12.3l11.7-54.5
                L980.6,942.2z"/>
              <path fill="none" d="M1068.7,955.4c-2.8,0-5.4,1-7.4,2.5l4.1-19.4l-12.7,1.7l-9.5,44.5c-0.3,1.5-0.5,2.8-0.5,4
                c-1.6,1.1-3.2,1.9-4.5,1.9c-3.4,0-4.3-1.4-4.3-3.3c0-0.8,0.2-2,0.3-2.9l6.2-29.4h-12.3l-6.2,29.4c-0.3,1-0.4,2.1-0.5,3
                c-2.1,1.7-4.3,3.2-6.1,3.2c-3.4,0-4.3-1.3-4.3-3.2c0-0.8,0.2-2,0.3-2.9l6.2-29.4h-12.3l-6.2,29.4c-0.3,1.6-0.5,3.2-0.5,4.5
                c0,6.4,4.1,9.4,10.7,9.4c3.7,0,8.3-3.4,12.3-7.2c0.8,5,4.7,7.2,10.5,7.2c3.3,0,7.4-2.8,11.1-6.1c1.5,4.7,6.6,6.4,13.6,6.4
                c15.3,0,22.7-18.9,22.7-32.4C1079.5,961.2,1076.9,955.4,1068.7,955.4z M1058.6,992.5c-2.6,0-3.8-0.6-3.8-3.2
                c0-1.1,0.3-2.7,0.7-4.7l4.9-23c0.8-0.6,3.8-1.2,4.6-1.2c2.1,0,4.9,1.2,4.9,6.3C1069.9,973,1065.7,992.5,1058.6,992.5z"/>
              <path fill="none" d="M1099.1,955.5l-6.3,29.1c-0.3,0.9-0.4,1.9-0.4,2.7c0,1.9,0.9,3.2,4.3,3.2c2,0,4.3-1.5,6.5-3.4l6.7-31.6
                h12.4l-10.5,49.7c-2.6,12.2-9.9,14.6-15.6,14.6c-5.2,0-10.1-3.7-10.1-9.3c0-8,6.7-10.5,14.8-12.8l1.3-5.9
                c-3.9,3.5-8.2,6.6-11.6,6.6c-6.7,0-10.6-2.9-10.6-9.3c0-1.4,0.2-2.7,0.5-4.4l6-29.1H1099.1z M1094.3,1012.2
                c1.7,0,4-1.6,5.1-6.7l1-5.1c-5.4,1.8-9.5,4.3-9.5,8.9C1090.8,1010.5,1092.4,1012.2,1094.3,1012.2z"/>
            </g>
            <line fill="none" x1="955" y1="1009" x2="1078" y2="1009"/>
          </g>
          <g id="Drum-Logo">
            <g>
              <path fill="#333333" d="M982.8,943.6l-4.1,19.1h0.7c6.8,0,11.7-8,11.7-14.4c0-4.6-2.6-8.6-9-8.6c-13.3,0-22.2,7.5-22.2,20
                c0,4.2,1.1,4.8,1.2,5.6c-5.7,0-8.8-2.1-8.8-8c0-10.9,15.1-21.4,28.9-21.4c13,0,18.7,6.4,18.7,13.2c0,5-3.2,10.8-8.9,14.1
                c4.3,1.2,5.7,4.4,5.7,8.2c0,6.7-4,15.7-4,20.8c0,2.5,1.2,4.7,3.2,5.4c-3.5,1-6.2,1.4-8.1,1.4c-5.3,0-6.4-2.8-6.4-5.5
                c0-5.4,4.3-15.4,4.3-21.6c0-3.3-1.2-5.6-4.9-5.6c-0.7,0-1.6,0.1-2.6,0.3l-6.6,31h-11.8l11.2-52.3L982.8,943.6z"/>
              <path fill="#333333" d="M1067.3,956.2c-2.7,0-5.2,1-7.1,2.4l3.9-18.7l-12.2,1.6l-9.1,42.7c-0.3,1.4-0.5,2.7-0.5,3.8
                c-1.5,1.1-3,1.8-4.4,1.8c-3.3,0-4.1-1.3-4.1-3.1c0-0.7,0.2-1.8,0.3-2.7l5.9-28.1h-11.8l-5.9,28.1c-0.2,1-0.4,2-0.5,2.8
                c-2.1,1.6-4.1,3-5.8,3c-3.3,0-4.1-1.3-4.1-3.1c0-0.7,0.2-1.8,0.3-2.7l5.9-28.1h-11.8l-5.9,28.1c-0.3,1.6-0.5,3.1-0.5,4.3
                c0,6.2,3.9,9,10.3,9c3.5,0,8-3.3,11.8-6.9c0.7,4.8,4.5,6.9,10.1,6.9c3.2,0,7.1-2.7,10.7-5.9c1.5,4.6,6.3,6.1,13.1,6.1
                c14.7,0,21.8-18.2,21.8-31.1C1077.8,961.8,1075.2,956.2,1067.3,956.2z M1057.7,991.9c-2.5,0-3.6-0.6-3.6-3
                c0-1.1,0.2-2.5,0.7-4.5l4.7-22c0.7-0.6,3.6-1.2,4.4-1.2c2.1,0,4.7,1.2,4.7,6.1C1068.6,973.2,1064.4,991.9,1057.7,991.9z"/>
              <path fill="#333333" d="M1096.5,956.4l-6,27.9c-0.2,0.9-0.4,1.8-0.4,2.6c0,1.8,0.9,3,4.1,3c1.9,0,4.1-1.5,6.2-3.3l6.4-30.3
                h11.9l-10,47.7c-2.5,11.8-9.5,14-15,14c-5,0-9.7-3.5-9.7-8.9c0-7.6,6.4-10,14.2-12.3l1.2-5.7c-3.7,3.4-7.9,6.3-11.2,6.3
                c-6.4,0-10.2-2.8-10.2-9c0-1.3,0.2-2.6,0.5-4.2l5.8-27.9H1096.5z M1091.9,1010.7c1.6,0,3.9-1.6,4.9-6.4l1-4.8
                c-5.2,1.7-9.1,4.1-9.1,8.5C1088.6,1009.2,1090.1,1010.7,1091.9,1010.7z"/>
            </g>
            
              <line fill="none" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="959" y1="1008" x2="1076" y2="1008"/>
          </g>
          <g>
            <g>
              <g>
                
                  <path fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M821,1074.7c-6,0-10.5,4.7-10.5,10.5c0,5.8,4.5,10.5,10.5,10.5v9.3h20v-40h-20V1074.7z"/>
                <path fill="#333333" d="M819.9,1085.3c0,1.1,0.9,2,2,2c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2
                  C820.8,1083.3,819.9,1084.2,819.9,1085.3z"/>
              </g>
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="835" y1="1101" x2="835" y2="1069"/>
            </g>
            <g>
              <g>
                
                  <path fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M919.8,1265.1c-3,5.2-1.2,11.4,3.8,14.3s11.3,1.4,14.3-3.8l8.1,4.7l10-17.3l-34.6-20l-10,17.3L919.8,1265.1z"/>
                <path fill="#333333" d="M928.1,1272c1,0.5,2.2,0.2,2.7-0.7c0.6-1,0.2-2.2-0.7-2.7c-1-0.6-2.2-0.2-2.7,0.7
                  C926.8,1270.3,927.1,1271.5,928.1,1272z"/>
              </g>
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="949.7" y1="1266.2" x2="922" y2="1250.2"/>
            </g>
            <g>
              <g>
                
                  <path fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M1133.8,1275.5c3,5.2,9.3,6.7,14.3,3.8c5-2.9,6.8-9.1,3.8-14.3l8-4.6l-10-17.3l-34.6,20l10,17.3L1133.8,1275.5z"/>
                <path fill="#333333" d="M1143.9,1271.7c1-0.6,1.3-1.8,0.7-2.7c-0.6-1-1.8-1.3-2.7-0.7c-1,0.6-1.3,1.8-0.7,2.7
                  C1141.8,1271.9,1143,1272.3,1143.9,1271.7z"/>
              </g>
              
                <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="1149.6" y1="1250.2" x2="1121.8" y2="1266.2"/>
            </g>
            <g>
              <g>
                
                  <path fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M1249,1095.3c6,0,10.5-4.7,10.5-10.5c0-5.8-4.5-10.5-10.5-10.5v-9.3h-20v40h20V1095.3z"/>
                <path fill="#333333" d="M1251.6,1084.6c0-1.1-0.9-2-2-2c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2
                  C1250.7,1086.6,1251.6,1085.7,1251.6,1084.6z"/>
              </g>
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="1235" y1="1069" x2="1235" y2="1101"/>
            </g>
            <g>
              <g>
                
                  <path fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M1151.7,904.7c3-5.2,1.2-11.4-3.8-14.3c-5-2.9-11.3-1.4-14.3,3.8l-8-4.6l-10,17.3l34.6,20l10-17.3L1151.7,904.7z"/>
                <path fill="#333333" d="M1143.4,897.9c-1-0.5-2.2-0.2-2.7,0.7c-0.6,1-0.2,2.2,0.7,2.7c1,0.6,2.2,0.2,2.7-0.7
                  C1144.7,899.7,1144.3,898.4,1143.4,897.9z"/>
              </g>
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="1122" y1="903.8" x2="1149.7" y2="919.8"/>
            </g>
            <g>
              <g>
                
                  <path fill="#EEFAF9" stroke="#333333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
                  M937.7,894.5c-3-5.2-9.3-6.7-14.3-3.8s-6.8,9.1-3.8,14.3l-8.1,4.7l10,17.3l34.6-20l-10-17.3L937.7,894.5z"/>
                <path fill="#333333" d="M927.5,898.2c-0.9,0.6-1.3,1.8-0.7,2.7c0.6,1,1.8,1.3,2.7,0.7c1-0.6,1.3-1.8,0.7-2.7
                  C929.7,898,928.5,897.6,927.5,898.2z"/>
              </g>
              <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="921.8" y1="919.8" x2="949.6" y2="903.8"/>
            </g>
          </g>
        </g>
      </g>
    </g>
    <g id="Crash">
      <g id="Crash-Stand-Top">
        
          <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
          M558,649.3l20.3-55.8c1.1-2.9-0.3-6.1-3.2-7.2c-2.9-1.1-6,0.5-7.1,3.4l-20.3,55.8L558,649.3z"/>
        
          <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
          M575.4,610.2c1.6-4.3-0.6-9-4.9-10.6l-0.5-0.2c-4.3-1.6-9,0.6-10.6,4.9l-65.2,179.3l16,5.8L575.4,610.2z"/>
        
          <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
          M539.1,645.7c0,0.1-0.1,0.2-0.1,0.2l-0.2,0.5c-1.6,4.3,0.7,9,4.9,10.6l9.9,3.6c4.3,1.6,9-0.7,10.6-4.9l0.2-0.5
          c0-0.1,0-0.2,0.1-0.2L539.1,645.7z"/>
        
          <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
          M575.7,623.9c0-0.1,0.1-0.2,0.1-0.2l0.2-0.5c1.6-4.3-0.6-9-4.9-10.6l-9.9-3.6c-4.3-1.6-9,0.6-10.6,4.9l-0.2,0.5
          c0,0.1,0,0.2-0.1,0.2L575.7,623.9z"/>
        <g id="Crash-Cymbol">
          
            <path fill="#FDE74C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M691.9,684.6l-48.7-18.7c-33.9-13-46.9-22.8-54.8-31.5c-3.3-3.4-9.8-9.5-16.9-12.1c-2.2-0.8-8.7-3.2-8.7-3.2s0,0-0.1,0
            c-0.1,0-0.1,0-0.1,0s-6.6-2.4-8.7-3.2c-7.1-2.6-16.1-2.1-20.7-1.6c-11.7,1.5-28,0.7-62.3-11.1l-49.3-17
            c-5.4-2-10.6-0.3-12.1,3.9l-0.1,0.1c-1.5,4.2,1.1,8.6,6.6,10.6l135.4,49.3l0.1,0l0.1,0l135.4,49.3c5.4,2,10.3,0.3,11.9-3.9
            l0.1-0.1C700.2,691.2,697.3,686.6,691.9,684.6z"/>
          
            <line fill="none" stroke="#FEF5B7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="572.3" y1="630.1" x2="546.6" y2="620.8"/>
        </g>
      </g>
      <g id="Crash-Stand">
        
          <rect x="493" y="787" fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="17" height="409"/>
        <g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M574.8,1269c-3.4,3.4-8.8,3.3-12.1-0.1l-66.7-66.7c-3.4-3.4-3.5-8.7-0.1-12.1l0,0c3.4-3.4,8.8-3.3,12.1,0.1l66.7,66.7
              C578.1,1260.2,578.2,1265.6,574.8,1269L574.8,1269z"/>
            <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="566.9" y1="1265.8" x2="499.7" y2="1198.6"/>
            
              <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M575.2,1257.4l-12,12c0,0,6.4,10.8,8,12.4c4.7,4.7,11.9,4.3,16.6-0.4c4.7-4.7,5.1-11.9,0.5-16.6
              C586.8,1263.4,575.2,1257.4,575.2,1257.4z"/>
          </g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M429,1268.7c-3.4-3.4-3.3-8.8,0.1-12.1l66.7-66.7c3.4-3.4,8.7-3.5,12.1-0.1l0,0c3.4,3.4,3.3,8.8-0.1,12.1l-66.7,66.7
              C437.7,1272,432.3,1272.1,429,1268.7L429,1268.7z"/>
            <line fill="none" stroke="#BCECE8" stroke-width="4" stroke-miterlimit="10" x1="437.2" y1="1265.8" x2="502" y2="1200.9"/>
            
              <path fill="#5C5C5C" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M440.5,1269.1l-12-12c0,0-10.8,6.4-12.4,8c-4.7,4.7-4.3,11.9,0.4,16.6c4.7,4.7,11.9,5.1,16.6,0.5
              C434.5,1280.7,440.5,1269.1,440.5,1269.1z"/>
          </g>
          <g>
            
              <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
              M488.6,1195.8c0-7.5,6-13.5,13.5-13.5s13.5,6,13.5,13.5c0,7.5-6,13.5-13.5,13.5S488.6,1203.2,488.6,1195.8z"/>
            <path fill="#333333" d="M504.5,1192.5c-1.8-1.3-4.3-0.9-5.6,0.9c-1.3,1.8-0.9,4.3,0.9,5.6c1.8,1.3,4.3,0.9,5.6-0.9
              C506.7,1196.3,506.3,1193.8,504.5,1192.5z"/>
          </g>
        </g>
        <g>
          
            <circle fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="517.7" cy="994.5" r="10"/>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M515,1006.1c0,6-4.9,10.9-10.9,10.9h-5.1c-6,0-10.9-4.9-10.9-10.9v-22.1c0-6,4.9-10.9,10.9-10.9h5.1c6,0,10.9,4.9,10.9,10.9
            V1006.1z"/>
        </g>
        <g>
          
            <path fill="#EEFAF9" stroke="#333333" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
            M488.4,786.8c0-7.5,6-13.5,13.5-13.5s13.5,6,13.5,13.5c0,7.5-6,13.5-13.5,13.5S488.4,794.2,488.4,786.8z"/>
          <path fill="#333333" d="M504.3,783.5c-1.8-1.3-4.3-0.9-5.6,0.9c-1.3,1.8-0.9,4.3,0.9,5.6c1.8,1.3,4.3,0.9,5.6-0.9
            C506.5,787.3,506.1,784.8,504.3,783.5z"/>
        </g>
      </g>
    </g>
  </g>
  <g id="All-Keys" class="hidden" opacity="0.9">
    <g id="Key-66">
      <path fill="none" stroke="#FDFFFC" stroke-width="9" stroke-miterlimit="10" d="M1103.5,1442.5c0,6.6-5.4,12-12,12h-107
        c-6.6,0-12-5.4-12-12v-107c0-6.6,5.4-12,12-12h107c6.6,0,12,5.4,12,12V1442.5z"/>
      <text transform="matrix(1 0 0 1 1011.9473 1411.7119)" fill="#FDFFFC" font-family="'Montserrat'" font-size="76.2579">B</text>
    </g>
    <g id="Key-74">
      <path fill="none" stroke="#FDFFFC" stroke-width="9" stroke-miterlimit="10" d="M1551.5,1442.5c0,6.6-5.4,12-12,12h-107
        c-6.6,0-12-5.4-12-12v-107c0-6.6,5.4-12,12-12h107c6.6,0,12,5.4,12,12V1442.5z"/>
      <text transform="matrix(1 0 0 1 1466.3574 1411.7119)" fill="#FDFFFC" font-family="'Montserrat'" font-size="76.2579">J</text>
    </g>
    <g id="Key-72">
      <path fill="none" stroke="#FDFFFC" stroke-width="9" stroke-miterlimit="10" d="M1393.5,1442.5c0,6.6-5.4,12-12,12h-107
        c-6.6,0-12-5.4-12-12v-107c0-6.6,5.4-12,12-12h107c6.6,0,12,5.4,12,12V1442.5z"/>
      <text transform="matrix(1 0 0 1 1300.0742 1411.7119)" fill="#FDFFFC" font-family="'Montserrat'" font-size="76.2579">H</text>
    </g>
    <g id="Key-71">
      <path fill="none" stroke="#FDFFFC" stroke-width="9" stroke-miterlimit="10" d="M751.5,1442.5c0,6.6-5.4,12-12,12h-107
        c-6.6,0-12-5.4-12-12v-107c0-6.6,5.4-12,12-12h107c6.6,0,12,5.4,12,12V1442.5z"/>
      <text transform="matrix(1 0 0 1 658.1689 1411.5645)" fill="#FDFFFC" font-family="'Montserrat'" font-size="76.2579">G</text>
    </g>
    <g id="Key-70">
      <path fill="none" stroke="#FDFFFC" stroke-width="9" stroke-miterlimit="10" d="M564.5,1442.5c0,6.6-5.4,12-12,12h-107
        c-6.6,0-12-5.4-12-12v-107c0-6.6,5.4-12,12-12h107c6.6,0,12,5.4,12,12V1442.5z"/>
      <text transform="matrix(1 0 0 1 477.3369 1411.7119)" fill="#FDFFFC" font-family="'Montserrat'" font-size="76.2579">F</text>
    </g>
    <g id="Key-89">
      <path fill="none" stroke="#FDFFFC" stroke-width="9" stroke-miterlimit="10" d="M1278.5,638.5c0,6.6-5.4,12-12,12h-107
        c-6.6,0-12-5.4-12-12v-107c0-6.6,5.4-12,12-12h107c6.6,0,12,5.4,12,12V638.5z"/>
      <text transform="matrix(1 0 0 1 1190.5742 607.7119)" fill="#FDFFFC" font-family="'Montserrat'" font-size="76.2579">Y</text>
    </g>
    <g id="Key-84">
      <path fill="none" stroke="#FDFFFC" stroke-width="9" stroke-miterlimit="10" d="M928.5,638.5c0,6.6-5.4,12-12,12h-107
        c-6.6,0-12-5.4-12-12v-107c0-6.6,5.4-12,12-12h107c6.6,0,12,5.4,12,12V638.5z"/>
      <text transform="matrix(1 0 0 1 841.3369 607.7119)" fill="#FDFFFC" font-family="'Montserrat'" font-size="76.2579">T</text>
    </g>
  </g>
</g>
</svg>




<div id="footer" class="footer hidden">

        <button id='crashdr'>Crash</button>
        <button id='floortomdr'>FTom</button>
        <button id='left-tomdr'>LTom</button>
        <button id='kickdr'>Kick</button>
        <button id='right-tomdr'>RTom</button>
        <button id='snaredr'>Snare</button>
        <button id='hiHatdr'>HiHat</button>
</div>

        </div>
        )
  }
}


class DrumSequencer extends React.Component {
  render (){
    return (
    <div>

      <div id="container-sequencer" class="container-sequencer collapse">
          <div id="sequencer" class="sequencer">
          <div id="openPanel" onClick={seqPop}>View Drum Sequencer</div>
            <div class="row" data-target-drum="crash">
              <img src={crash} alt="Crash"/>
              <label><input id='crash-01' type="checkbox"/><span></span></label>
              <label><input id='crash-02' type="checkbox"/><span></span></label>
              <label><input id='crash-03' type="checkbox"/><span></span></label>
              <label><input id='crash-04' type="checkbox"/><span></span></label>
              <label><input id='crash-05' type="checkbox"/><span></span></label>
              <label><input id='crash-06' type="checkbox"/><span></span></label>
              <label><input id='crash-07' type="checkbox"/><span></span></label>
              <label><input id='crash-08' type="checkbox"/><span></span></label>
            </div>
            <div class="row" data-target-drum="hiHat">
              <img src={hi} alt="Hi hat"/>
              <label><input id='hiHat-01' type="checkbox"/><span></span></label>
              <label><input id='hiHat-02' type="checkbox"/><span></span></label>
              <label><input id='hiHat-03' type="checkbox"/><span></span></label>
              <label><input id='hiHat-04' type="checkbox"/><span></span></label>
              <label><input id='hiHat-05' type="checkbox"/><span></span></label>
              <label><input id='hiHat-06' type="checkbox"/><span></span></label>
              <label><input id='hiHat-07' type="checkbox"/><span></span></label>
              <label><input id='hiHat-08' type="checkbox"/><span></span></label>
            </div>
            <div class="row" data-target-drum="snare">
              <img src={snare} alt="Snare"/>
              <label><input id='snare-01' type="checkbox"/><span></span></label>
              <label><input id='snare-02' type="checkbox"/><span></span></label>
              <label><input id='snare-03' type="checkbox"/><span></span></label>
              <label><input id='snare-04' type="checkbox"/><span></span></label>
              <label><input id='snare-05' type="checkbox"/><span></span></label>
              <label><input id='snare-06' type="checkbox"/><span></span></label>
              <label><input id='snare-07' type="checkbox"/><span></span></label>
              <label><input id='snare-08' type="checkbox"/><span></span></label>
            </div>
            <div class="row" data-target-drum="rightTom">
              <img src={right} alt="Right tom"/><label><input class='rightTom-01' type="checkbox"/><span></span></label>
              <label><input id='rightTom-02' type="checkbox"/><span></span></label>
              <label><input id='rightTom-03' type="checkbox"/><span></span></label>
              <label><input id='rightTom-04' type="checkbox"/><span></span></label>
              <label><input id='rightTom-05' type="checkbox"/><span></span></label>
              <label><input id='rightTom-06' type="checkbox"/><span></span></label>
              <label><input id='rightTom-07' type="checkbox"/><span></span></label>
              <label><input id='rightTom-08' type="checkbox"/><span></span></label>
            </div>
            <div class="row" data-target-drum="leftTom">
              <img src={left} alt="Left tom"/>
              <label><input id='leftTom-01' type="checkbox"/><span></span></label>
              <label><input id='leftTom-02' type="checkbox"/><span></span></label>
              <label><input id='leftTom-03' type="checkbox"/><span></span></label>
              <label><input id='leftTom-04' type="checkbox"/><span></span></label>
              <label><input id='leftTom-05' type="checkbox"/><span></span></label>
              <label><input id='leftTom-06' type="checkbox"/><span></span></label>
              <label><input id='leftTom-07' type="checkbox"/><span></span></label>
              <label><input id='leftTom-08' type="checkbox"/><span></span></label>
            </div>
            <div class="row" data-target-drum="floorTom">
              <img src={floor} alt="Floor tom"/>
              <label><input id='floorTom-01' type="checkbox"/><span></span></label>
              <label><input id='floorTom-02' type="checkbox"/><span></span></label>
              <label><input id='floorTom-03' type="checkbox"/><span></span></label>
              <label><input id='floorTom-04' type="checkbox"/><span></span></label>
              <label><input id='floorTom-05' type="checkbox"/><span></span></label>
              <label><input id='floorTom-06' type="checkbox"/><span></span></label>
              <label><input id='floorTom-07' type="checkbox"/><span></span></label>
              <label><input id='floorTom-08' type="checkbox"/><span></span></label>
            </div>
            <div class="row" data-target-drum="kick">
              <img src={kick} alt="Kick"/>
              <label><input id='kick-01' type="checkbox"/><span></span></label>
              <label><input id='kick-02' type="checkbox"/><span></span></label>
              <label><input id='kick-03' type="checkbox"/><span></span></label>
              <label><input id='kick-04' type="checkbox"/><span></span></label>
              <label><input id='kick-05' type="checkbox"/><span></span></label>
              <label><input id='kick-06' type="checkbox"/><span></span></label>
              <label><input id='kick-07' type="checkbox"/><span></span></label>
              <label><input id='kick-08' type="checkbox"/><span></span></label>
            </div>
            <div class="sequencer-controls">
              <button id="sequencer-active-btn" class="btn" aria-label="Play"><i class="fa fa-play"></i></button>
              <button id="sequencer-reset-btn" class="btn">Refresh Sequencer</button>
              <div class="sequencer-controls-tempo">
                <button id="bpm-decrease-btn" class="btn" aria-label="Decrease bpm">-</button>
                <input id="bpm-indicator" type="number" min="100" max="300" size="3" value="150" readonly/>
                <button id="bpm-increase-btn" class="btn" aria-label="Iecrease bpm">+</button>
              </div>
            </div>
          </div>

          </div>
        </div>
      )
  }
}
export default App;

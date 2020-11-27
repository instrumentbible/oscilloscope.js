// oscilloscope options
var options = {
	at: "container",
	type: "oscilloscope",
	thickness: 5,
	id: "theOsc",
	color: "#39FF14",
	background: "#303030",
	fade: 1,
	fftSize: 2048,
}

var newSource;

// create oscilloscope
var myOscilloscope = new Oscilloscope(options)

   // set the frame rate
   // myOscilloscope.setFrameRate(40);
   function audioSetup(){ audioContext = new AudioContext();
	//audioplyr.currentTime = 0
	// analyser (for audio visualization)
	   analyser = audioContext.createAnalyser();
	   analyser.fftSize = 2048;
	   analyser.smoothingTimeConstant = 0.5;
	   analyser.maxDecibels = -30;
	   analyser.minDecibels = -100;
	   analyser.smoothingTimeConstant = 0.1;

	   frequencyData = new Float32Array(analyser.frequencyBinCount);
	   // audioplyr.setAttribute('src', "audio/mahsiv.mp3");
	   // create an oscillator
	   var oscillator = audioContext.createOscillator();
	   oscillator.type = "sine";
	   oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
	   oscillator.start();
	   // oscillator.connect(analyser);
	   // oscillator.connect(audioContext.destination);
	 
	   // audio player gain
	   audioGain = audioContext.createGain();
	   audioGain.gain.setValueAtTime(1, audioContext.currentTime);
	   audioGain.connect(analyser);
	   audioGain.connect(audioContext.destination);
	  
	   //drawURL("https://upload.wikimedia.org/wikipedia/commons/9/9b/Bruckner_Symphony_No._5%2C_opening.wav");
	   //drawURL("https://upload.wikimedia.org/wikipedia/commons/3/32/Danse_Macabre_-_Busy_Strings_%28ISRC_USUAN1100556%29.mp3");
	   //drawURL("https://upload.wikimedia.org/wikipedia/commons/d/d6/Danse_Macabre_-_Light_Dance_%28ISRC_USUAN1100553%29.mp3");
	   //drawURL("https://upload.wikimedia.org/wikipedia/commons/c/c6/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3");

	   myOscilloscope.resume();
	radioSrc = audioContext.createMediaElementSource(audioplyr);
	  radioSrc.connect(audioGain);
	   
	   splitter = audioContext.createChannelSplitter();

	   analyserL = audioContext.createAnalyser();
	   analyserL.smoothingTimeConstant = 0.7;

	   analyserR = audioContext.createAnalyser();
	   analyserR.smoothingTimeConstant = 0.7;

	   //sourceNode = audioContext.createMediaElementSource(audio);
	   radioSrc.connect(splitter);
	   //sourceNode.connect(audioContext.destination);

	   splitter.connect(analyserL,0,0);
	   splitter.connect(analyserR,1,0);

	   //audio.play();
	   analyserL.fftSize = 4096;
	   analyserR.fftSize = 4096;
	   bufferLength = analyserL.fftSize;
	   dataArrayL = new Float32Array(bufferLength);
	   dataArrayR = new Float32Array(bufferLength);
	}

   // update framereate
   document.getElementById('framerate').addEventListener('input',	function (e) {
	   myOscilloscope.setFramerate(this.value);
   });
   
   
   // update thickness
   document.getElementById('thickness').addEventListener('input', function (e) {
	   myOscilloscope.setThickness(this.value);
   });

	// update window
	document.getElementById('window').addEventListener('input', function (e) {
		myOscilloscope.setWindow(this.value);
	});

	// update minDecibels
	document.getElementById('minDecibels').addEventListener('input', function (e) {
		var aw = parseFloat(this.value)
		myOscilloscope.setMinDecibels(aw);
	});

	// update maxDecibels
	document.getElementById('maxDecibels').addEventListener('input', function (e) {
		var aw = parseFloat(this.value)

		myOscilloscope.setMaxDecibels( aw);
	});

	// update smoothing
	document.getElementById('smoothing').addEventListener('input', function (e) {
		myOscilloscope.setSmoothing(this.value);
	});


	// update fade
	document.getElementById('fade').addEventListener('input', function (e) {
	myOscilloscope.setFade(this.value);
	});
		  
   // update color
   document.getElementById('color').addEventListener('input', function (e) {
	   myOscilloscope.setColor(this.value);
   });
   
   // update background color
   document.getElementById('background').addEventListener('input', function (e) {
	   myOscilloscope.setBackground(this.value);
   });

	// update border color
	document.getElementById('border').addEventListener('input', function (e) {
		myOscilloscope.setBorder(this.value);
	});
	// set number of bars
	document.getElementById('bars').addEventListener('input', function (e) {
		myOscilloscope.setBars(this.value);
	});

// initalize
document.getElementById('initalize').addEventListener('click', function (e) {
	audioSetup();
	this.style.display = 'none';
	document.getElementById('controls').style.opacity = 1
});

// start
document.getElementById('resume').addEventListener('click', function (e) {
	myOscilloscope.resume();
});

// freeze
document.getElementById('freeze').addEventListener('click', function (e) {
	myOscilloscope.freeze();
});
   
// to start
document.getElementById('back').addEventListener('click', function (e) {
	audioplyr.currentTime = 0
});

// loop button
document.getElementById('loop').addEventListener('click', function (e) {
	var clickEvent = new MouseEvent("click", {
		"view": window,
		"bubbles": true,
		"cancelable": false
	});
	document.getElementById('loopToggle').dispatchEvent(clickEvent);
});

// type
document.getElementById('loopToggle').addEventListener('change', function (e) {
	if (this.checked){
		audioplyr.loop = true;
		document.getElementById('loop').innerHTML = "loop on";
	}
	else {
		audioplyr.loop = false;
		document.getElementById('loop').innerHTML = "loop off";
	}
});

// fullscreen
document.getElementById('fullscreen').addEventListener('click', function (e) {
	myOscilloscope.fullscreen();
});

// windowed
document.getElementById('windowed').addEventListener('click', function (e) {
	myOscilloscope.windowed();
});
 
// fftSize
document.getElementById('fftSize').addEventListener('change', function (e) {
	var newFFT = parseInt(this.value);
	myOscilloscope.setFFTSize(newFFT);
});

// type
document.getElementById('type').addEventListener('change', function (e) {
   myOscilloscope.setType(this.value);
});

// start
document.getElementById('play').addEventListener('click', function (e) {
	if(audioplyr.paused){
		audioplyr.play();
		this.innerHTML = "pause";
	}
	else {
		audioplyr.pause();
		this.innerHTML = "play";
	}
});

// update audio playback rate
	document.getElementById('rate').addEventListener('input', function (e) {
		audioplyr.playbackRate = this.value;
	});

function drawURL(url) {
	audioIsDrawn = true;
	var audioRequest = new XMLHttpRequest();
	audioRequest.open("GET", url, true);
	audioRequest.responseType = "arraybuffer";
	audioRequest.onload = function() {
		audioContext.decodeAudioData( audioRequest.response, function(buffer) {
			newSource = audioContext.createBufferSource();
			newSource.buffer = buffer;
			newSource.connect(audioGain);
			newSource.start();
		});
	}
	audioRequest.send();
}


// allow scroll input on numbers
document.addEventListener("wheel",function(e){
  focusedEl = document.activeElement;
  if (focusedEl.nodeName='input' && focusedEl.type && focusedEl.type.match(/number/i)){
	var max = null, min = null;
	if(focusedEl.hasAttribute('max')){ max = focusedEl.getAttribute('max'); }
	if(focusedEl.hasAttribute('min')){ min = focusedEl.getAttribute('min'); }
	var value = parseFloat(focusedEl.value);
	if (e.deltaY < 0) { value += 0.01; if (max !== null && value > max) { value = parseFloat(max); } }
	else 		      { value -= 0.01; if (min !== null && value < min) { value = parseFloat(min); } }
	focusedEl.value = parseFloat(value);
  }
}, {passive: false});

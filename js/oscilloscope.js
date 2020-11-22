// cross browser AudioContext setup
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
var audioGain;
var analyser;
var analyserL, analyserR, dataArrayL, dataArrayR, splitter,size;
var frequencyData;
var clock;
var cvs;
var ctx;
var theWindow;
var viewMode;
var thisOsc;
var bufferLength;var radioSrc
// oscilloscope.js
class Oscilloscope {
	
	constructor(options) {
		thisOsc = this;
		// options
		this.at 			= options.at			|| "container";
		this.background 	= options.background	|| "black";
		this.color 			= options.color			|| "green";
		this.framerate 		= options.framerate		|| 24;
		this.id 			= options.id			|| "theOsc";
		this.thickness 		= options.thickness		|| 5;
		this.window 		= options.window		|| 2.0;
		this.fade 			= options.fade			|| 1;
		this.smoothing 		= options.smoothing		|| 0.8;
		this.type 			= options.type	 		||"bars";
		this.playing 		= options.playing	 	||false;
		this.fftSize 		= options.fftSize	 	||2048;
		this.direction 		= options.direction	 	||"forward";
		//this.maxDecibels 		= options.maxDecibels	 	||0;
		//this.minDecibels 		= options.minDecibels	 	||-100;
		
		//TO DO
		// if this.at is null, create container div and append to body
		
		var canvas = document.createElement('canvas')
		canvas.id = this.id;
		canvas.style.backgroundColor = this.background;
		var container = document.querySelector('#'+this.at)
		container.appendChild(canvas);
		cvs = canvas;
		cvs.width = 1000;
		cvs.height = 1000;
		ctx = cvs.getContext('2d');
		ctx.strokeStyle = this.color;
		ctx.fillStyle = hexToRGB(this.background, this.fade);//"rgba(50,50,50,0.1)"
		theWindow = this.window;
		this.setThickness(this.thickness);
		viewMode = this.type;
		this.setType(this.type);
	}
	
	
	
	
	// draw canvas
	draw(e){
		if (viewMode == "oscilloscope"){
			bufferLength = analyser.fftSize;
			var dataArray = new Float32Array(bufferLength);

			// only get new frequencyData if playing
			// this allows us to change the color while paused
			if(thisOsc.playing){
				analyser.getFloatTimeDomainData(dataArray);
			}
				
			//ctx.fillStyle = hexToRGB(thisOsc.background, thisOsc.fade);
			ctx.fillRect(0,0, cvs.width, cvs.height);
			ctx.beginPath();
			
			var sliceWidth = cvs.width * theWindow / bufferLength;
			var x = 0;

			for (let i = 0; i < bufferLength; i++) {
				var v = dataArray[i] * 200;
				var y =  cvs.height/2 + v;
				if(i === 0) { ctx.moveTo(x, y); }
				else		{ ctx.lineTo(x, y); }
				x += sliceWidth;
			}
				
			ctx.stroke();
				
		}
		
		// bars
		if (viewMode == "bars"){
			// frequencyBinCount is half of FFT size
			bufferLength = analyser.frequencyBinCount;
			var dataArray = new Float32Array(bufferLength);
			analyser.getFloatFrequencyData(dataArray);
			ctx.fillStyle = hexToRGB(thisOsc.background, thisOsc.fade);
			ctx.fillRect(0,0, cvs.width, cvs.height);
			var barWidth = (cvs.width / bufferLength) * (Math.max(thisOsc.thickness, 1));
			var barHeight;
			let posX = 0;
			for (let i = 0; i < bufferLength; i++) {
				barHeight = (dataArray[i] + 140)* 7;
				//ctx.fillStyle = 'rgb(' + 57 + ','+ (barHeight+100) +',20)';
				ctx.fillStyle = thisOsc.color;

				ctx.fillRect(posX, cvs.height -  barHeight/2, barWidth, barHeight/2);
				posX += barWidth + 1;
			}
	   }
							
			
			
			// spectrogram
			var speed = 3;
			if (viewMode == "spectrogram"){
				var dataArray = new Uint8Array(analyser.frequencyBinCount);
				if(thisOsc.direction == "forward"){
					let imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
					ctx.putImageData(imgData,speed, 0);
				} else {
					let imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
					ctx.putImageData(imgData, (-1 * speed), 0);
					
				}
				analyser.getByteFrequencyData(dataArray);

			   for (let i = 0; i < dataArray.length; i++) {
				   let rat = dataArray[i] / 255;
				   let hue = Math.round((rat * 120) + 280 % 360);
				   let sat = '100%';
				   let lit =  10 + (70 * rat) + '%';
				   ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit})`;
				   ctx.beginPath();
				   if(thisOsc.direction == "forward"){
					   ctx.moveTo(speed, cvs.height - (i * (cvs.height / dataArray.length) + (cvs.height / dataArray.length)));
					   ctx.lineTo(speed, cvs.height - (i * (cvs.height / dataArray.length)));
				   } else {
					   ctx.moveTo(cvs.width - speed, cvs.height - (i * (cvs.height / dataArray.length)));
					   ctx.lineTo(cvs.width - speed, cvs.height - (i * (cvs.height / dataArray.length) + (cvs.height / dataArray.length)));
				   }
				   ctx.stroke();
			   }
		
		   }
																		
																		
			
			// XY
			if (viewMode == "XY"){
				 size = Math.min(cvs.width, cvs.height)
				analyserL.getFloatTimeDomainData(dataArrayL);
				analyserR.getFloatTimeDomainData(dataArrayR);
				ctx.fillRect(0, 0, cvs.width, cvs.height);
				ctx.beginPath();
				ctx.moveTo(-(dataArrayL[0]+1)*size/2+size/2+cvs.width/2, -(dataArrayR[0]+1)*size/2+size);
				for (var i = 0; i < dataArrayL.length; i++) {
					ctx.lineTo(-(dataArrayL[i]+1)*size/2+size/2+cvs.width/2, -(dataArrayR[i]+1)*size/2+size);
				}
				ctx.stroke();
		   }
	}
	
	
	// set input
	// setInput(e) {
	//	this.input = e;
	//	this.input.connect(audioContext.destination)
	// }
	
	// set framerate
	setFramerate(e){
		this.framerate = e;
		var milliseconds = 1000 / this.framerate;
		clearInterval(clock);
		clock = setInterval(this.draw, milliseconds);
	}
	
	// get framerate
	getFramerate(){ return this.framerate; }
	
	// set color
	setColor(e) {
		this.color = e;
		ctx.strokeStyle = this.color;
		//ctx.fillStyle = this.color;
		this.draw()
	}
	
	// get color
	getColor() { return this.color;	}
	
	// set background color
	setBackground(e) {
		this.background = e;
		cvs.style.backgroundColor = this.background;
		ctx.fillStyle = hexToRGB(this.background, 0.5);
	}
	
	// get background color
	getBackground() { return this.background; }
	// set type
	setType(e) {
		this.type = e;
		viewMode = e;
		if (e == 'oscilloscope'){
			ctx.strokeStyle = this.color;
			ctx.fillStyle = hexToRGB(thisOsc.background, thisOsc.fade);
		}
	   else if (e == 'bars'){
		   ctx.fillStyle = hexToRGB(thisOsc.background, thisOsc.fade);
	   }
	   else if (e == 'spectrogram'){
			ctx.fillStyle = 'hsl(280, 100%, 10%)';
			ctx.fillRect(0, 0, cvs.width, cvs.height);
		}
	   else  if (e == 'XY'){
			ctx.strokeStyle = this.color;
			 ctx.fillStyle = hexToRGB(thisOsc.background, thisOsc.fade);
	   }
	}
	
	// get type
	getType() { return this.type; }
	
	// set thickness
	setThickness(e) {
		this.thickness = e;
		ctx.lineWidth = this.thickness;
	}
	
	// get thickness
	getThickness(e) { return this.thickness;	}
	
	// set fftSize
	setFFTSize(e) {
		this.fftSize = e;
		analyser.fftSize = e;
	}
	
	// get fftSize
	getFFTSize(e) { return this.fftSize; }
	
	
	// set border color
	setBorder(e) {
		document.querySelector('#'+this.id).style.borderColor = e;
	}
	
	// set fade
	setFade(e) {
		this.fade = e;
	   ctx.fillStyle = hexToRGB(thisOsc.background, thisOsc.fade);

	}
	
	// set direction
	setDirection(e) {
		this.direction = e;
	}
	// set window
	setWindow(e) {
		this.window = e;
		theWindow = this.window
	}
	
	// set smoothing
	setSmoothing(e) {
		this.smoothing = parseFloat(e);
		analyser.smoothingTimeConstant = this.smoothing;
	}
	
	// set minDecibels
	setMinDecibels(e) {
		//this.minDecibels = e;
		analyser.minDecibels = e;
	}
	
	// set maxDecibels
	setMaxDecibels(e) {console.log(e)
		//this.maxDecibels = e;
		analyser.maxDecibels = e;
	}
	
	// start
	start() {
		this.setFramerate(this.framerate);
		this.playing = true;
	}
	
	stop() {
		clearInterval(clock);
		this.playing = false;
	}
	
	fullscreen(){
		
		cvs.style.height = "100vh";
		cvs.style.width = "100vw";
		cvs.style.position = "fixed";
		cvs.style.top = "0";
		cvs.style.left = "0";
		cvs.style.zIndex = "100";
		cvs.style.border = "0";
		cvs.style.borderRadius = "0";
		
		document.getElementById('fullscreen').style.display = 'none';
		document.getElementById('windowed').style.display = 'inline-block';
	}
	
	windowed(){
		cvs.style.height = "100%";
		cvs.style.width = "100%";
		cvs.style.position = "relative";
		cvs.style.top = "auto";
		cvs.style.left = "auto";
		cvs.style.zIndex = "1";
		cvs.style.border = "4px solid black";
		cvs.style.borderRadius = "1em";
		document.getElementById('fullscreen').style.display = 'inline-block';
		document.getElementById('windowed').style.display = 'none';
	}
	
}

// convert hex to RGBA
function hexToRGB(hex, alpha) {
   var r = parseInt(hex.slice(1, 3), 16),
	   g = parseInt(hex.slice(3, 5), 16),
	   b = parseInt(hex.slice(5, 7), 16);
   if (alpha) {
	   return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
   } else {
	   return "rgb(" + r + ", " + g + ", " + b + ")";
   }
}


// uplaod audio file

   var audioplyr = document.getElementById('playerAudio');
    audioplyr.loop = true;
	// fftSize
	document.getElementById('audiofile').addEventListener('change', function (e) {
		document.getElementById('audiofile').title = 'loading ⌛️';
		var sdfg = this;
		var target = e.currentTarget;
		var file = target.files[0];
		var reader = new FileReader();
		console.log(audioplyr[0]);
		if (target.files && file) {
		var reader = new FileReader();
		reader.onload = function (e) { audioplyr.setAttribute('src', e.target.result);  /*audioplyr.play(); */}
		reader.readAsDataURL(file);
		var filename = sdfg.value;
		var file = document.getElementById('audiofile').files[0];
		var filename = document.getElementById('audiofile').files[0].name;
		var blob = new Blob([file]);
	   
	   myurl  = URL.createObjectURL(blob);
	
	   document.getElementById('linkToDownld').download = filename;
	   document.getElementById('linkToDownld').href = myurl;

   }
});
			


// var audioElement = new Audio('car_horn.wav');
 audioplyr.addEventListener('loadeddata', (e) => {document.getElementById('audiofile').title = 'file loaded'});
						   /* audioplyr.addEventListener('playing', (e) => {console.log(e)})
 audioplyr.addEventListener('emptied', (e) => { console.log(e); });
 audioplyr.addEventListener('ended', (e) => { console.log(e); });
 audioplyr.addEventListener('loadeddata', (e) => { console.log(e) });
 audioplyr.addEventListener('loadedmetadata', (e) => { console.log(e) });
 audioplyr.addEventListener('timeupdate', (e) => { console.log(e) })
*/ audioplyr.addEventListener('play', (e) => {document.getElementById('play').innerHTML ="⏸";});
 audioplyr.addEventListener('pause', (e) => {document.getElementById('play').innerHTML ="▶️";})
/* audioplyr.addEventListener('volumechange', (e) => {console.log(audioplyr.volume);})
 audioplyr.addEventListener('seeking', (e) => {console.log(audioplyr.currentTime);})
 audioplyr.addEventListener('seeked', (e) => {console.log(e);})

	*/

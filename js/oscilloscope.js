// cross browser AudioContext setup
var AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

var analyser;
var frequencyData;
var clock;
var cvs;
var ctx;

// oscilloscope.js
class Oscilloscope {
	constructor(options) {
		
		// options
		this.at 			= options.at			|| "container";
		this.background 	= options.background	|| "black";
		this.color 			= options.color			|| "green";
		this.framerate 		= options.framerate		|| 24;
		this.id 			= options.id			|| "theOsc";
		this.thickness 		= options.thickness		|| 10;

		//TO DO
		// if this.at is null, create container div and append to body
		
		var canvas = document.createElement('canvas')
		canvas.id = this.id;
		canvas.style.backgroundColor = this.background;

		var container = document.querySelector('#'+this.at)
		container.appendChild(canvas);

		cvs = canvas;
		ctx = cvs.getContext('2d');
		ctx.strokeStyle = this.color;

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
	getFramerate(){
		return this.framerate;
	}
	
	// set color
	setColor(e) {
		this.color = e;
		ctx.strokeStyle = this.color;
	}
	
	// get color
	getColor() {
		return this.color;
	}
	
	// set background color
	setBackground(e) {
		this.background = e;
		cvs.style.backgroundColor = this.background;
	}
	
	// get background color
	getBackground() {
		return this.background;
	}
	
	// set thickness
	setThickness(e) {
		this.thickness = e;
		ctx.lineWidth = this.thickness;
	}
	
	// draw canvas
	draw(e){

		analyser.getByteTimeDomainData(frequencyData);

		ctx.clearRect(0,0, cvs.width, cvs.height);
		ctx.beginPath();
		
		var sliceWidth = cvs.width * 2.0 / analyser.frequencyBinCount;
		var x = 0;

		for (let i = 0; i < analyser.frequencyBinCount; i++) {
			var v = frequencyData[i] / 128.0;
			var y = v * cvs.height/2;
			if(i === 0) { ctx.moveTo(x, y); }
			else		{ ctx.lineTo(x, y); }
			x += sliceWidth;
		}
		ctx.stroke();
		
	}
	
	// ===== static functions ===== //
	//static myFunction(e) {
	//	return e;
	///}
	
}



# oscilloscope.js

### What is it?
Audio visualization for JavaScript.
Renders audio/visual data to a HTML `<canvas>`


### Features
- Oscilloscope
- Fourier  (Bars)
- VU meter
- Sonogram
- 3D sonogram
-  level meter


## Use

```javascript
var myOscilloscope = new Oscilloscope {}
```

Parameters
```javascript
var options = {
	color: "green",
	thickness: 5,
	input: oscillator,
	framerate: 24,
	fftSize: 1024,
	maxDecibels: 100,
	minDecibels: 2,
	shadowColor: "black",
	shadowOffsetX: 2,
	shadowOffsetY: 2,
	shadowBlur: 2,
	fillStyle: "pink"
}
```


update [fftSize](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize)
```javascript
oscilloscope("fftSize", 2048);

oscilloscope.color("#000000");
oscilloscope.frameRate(60);
```



Connect via WebAudio
```javascript
// cross browser AudioContext setup
var AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// create an oscillator
var oscillator = audioContext.createOscillator();
oscillator.type = "sine";
oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
oscillator.start();

// plug it in
// oscillator --> oscilloscope
oscillator.connect(myOscilloscope);
```


```javascript
// analyser (for audio visualization)
var analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0.5;
analyser.maxDecibels = 0;
analyser.minDecibels = -100;

// frequency data (this is where the audio is analyzed)
frequencyData = new Uint8Array(analyser.frequencyBinCount);
```


## Visualization Examples
Oscilloscope
```javascript
// Oscilloscope
function drawOsc() {

	analyser.getByteTimeDomainData(frequencyData);

	ctx.clearRect(0,0, cvs.width, cvs.height);
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.lineWidth = 10;
	
	for (let i = 0; i < analyser.fftSize; i++) {
		const x = i;
		const y = frequencyData[i];
		if (i === 0){ ctx.moveTo(x, y); } 
		else  		{ ctx.lineTo(x, y); }
	}
	ctx.stroke();
}
```


Bars

```javascript
// FFT Bars
function drawBars() {
	var bufferLength = analyser.frequencyBinCount;
	
	analyser.getByteFrequencyData(frequencyData);
	
	ctx.clearRect(0,0, cvs.width, cvs.height);
	const barWidth = (cvs.width / bufferLength) *  						15;
	const barLowHz1 = (cvs.width / 300);
	let posX = 0;
	for (let i = 0; i < analyser1.fftSize; i++) {
	var hue = i/bufferLength * 360;
	ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
	ctx.fillRect(posX, cvs.height - frequencyData[i] , barWidth, frequencyData[i]);
	posX += barWidth - barLowHz1;
	}
}
```

VU Meter
```javascript
// VU Meter

function drawVU() {
	analyser.getByteFrequencyData(frequencyData);
	var values = 0;
	var length = frequencyData.length;
	for (var i = 0; i < (length/4); i++) { values += (frequencyData[i]); }
	var average = values / length;
	// var dfsg = Math.round((average + Number.EPSILON) * 100) / 100;
	// $( "#vu " ).html( dfsg  )

$('#lineVU').css('transform','rotate('+ (((inverseRmsLogScale(rmsLogScale(0.80, 1500), values) * 90) * -1) + 90) +'deg)');

}

const rmsLogScale = (v, m) => {return (100 - ((Math.log((1 - v) * 100) / 4.605170185988092) * 100)) / 100 * m;};

const inverseRmsLogScale = (lg, m) => {const x5 = (lg * 100) / m;const x4 = (100 - x5);const x3 = x4 / 100;const x2 = x3 * 4.605170185988092;const x1 = Math.exp(x2);return 1 - ((x1) / 100);};
```

Audio Level Meter
> I would call it a "decibel" meter, but I am not certain it is accurately analyzing decibels.
```javascript
// Audio Input Meter
function drawInput() {
	analyser.getByteFrequencyData(frequencyData);
	var values = 0;
	var length = frequencyData.length;
	for (var i = 0; i < (length/4); i++) { values += (frequencyData[i]); }
	var average = (values / length) / 2;
	$("#audioInMeter").val(average);
}
```


Spectrogram

```javascript
// Spectrogram 2D
const W = cvs.width;// = window.innerWidth;
const H = cvs.height;// = window.innerHeight;

function loop() {

	// height window
	// higher number = smaller window of frequencies
	var spectroHeight = 8; 
	const LEN = frequencyData.length / spectroHeight;

	// console.log(LEN)
	const h = H / LEN;
	const x = W - 1;
	let imgData = ctx.getImageData(1, 0, x, H);
	ctx.fillRect(0, 0, x, H);
	ctx.putImageData(imgData, 0, 0);
	analyser1.getByteFrequencyData(frequencyData);

	for (let i = 0; i < LEN; i++) {
		let rat = frequencyData[i] / 255;
		let hue = Math.round(rat * 120 + 280 % 360);
		let sat = '100%';
		let lit = 10 + 70 * rat + '%';

		ctx.beginPath();
		ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit})`;
		ctx.moveTo(x, H - i * h);
		ctx.lineTo(x, H - (i * h + h));
		ctx.stroke();
	}
}
```

# oscilloscope.js

Audio visualization for JavaScript. Render audio/visual data to a HTML `<canvas>`

> DISCLAIMER: this library is a work in progress

Try the [live demo](https://instrumentbible.github.io/oscilloscope.js/).

# Features
- various audio/visual modes (oscilloscope, frequency bars, spectrogram, XY)
- change colors
- change thickness
- change framerate

## Use

```javascript
var options = {
	at: "container",
	type: "oscilloscope",
	thickness: 5,
	id: "theOsc",
	color: "#39FF14",
	background: "#303030",
	fade: 1,
	fftSize: 2048,
};

var myOscilloscope = new Oscilloscope(options);

```


VU Meter
```javascript
// VU Meter
function draw() {
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
function draw() {
	analyser.getByteFrequencyData(frequencyData);
	var values = 0;
	var length = frequencyData.length;
	for (var i = 0; i < (length/4); i++) { values += (frequencyData[i]); }
	var average = (values / length) / 2;
	$("#audioInMeter").val(average);
}
```

# oscilloscope.js

Audio visualization for JavaScript. Render audio/visual data to a HTML `<canvas>`

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
	fftSize: 2048
};

var myOscilloscope = new Oscilloscope(options);

```

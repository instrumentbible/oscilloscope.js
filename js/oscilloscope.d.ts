declare module 'oscilloscope.js' {
  export default class Oscilloscope {
    constructor(options?: Partial<{
      /**
       * Visual type
       * @default "oscilloscope"
       */
      type: "oscilloscope" | "bars" | "spectrogram" | "XY";

      /**
       * Foreground color
       * @default "green"
       */
      color: string;

      /**
       * Background color
       * @default "black"
       */
      background: string;

      /**
       * How often to draw to the canvas (frames per second)
       * @default 24
       */
      framerate: number;

      /**
       * Thickness of `oscilloscope` line or `bar` width
       * @default 10
       */
      thickness: number;

      /**
       * Adds a 'delay' to the animation
       * @default 1
       */
      fade: number;

      /**
       * Allows you to zoom in on an `oscilloscope`
       * @default 2
       */
      window: number;

      /**
       * Changes the direction for `spectrogram`
       * @default "forward"
       */
      direction: "forward" | "backward";

      /**
       * Changes the [smoothingTimeConstant](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/smoothingTimeConstant)
       * @default 0.8
       */
      smoothing: number;

      /**
       * Changes the [fftSize](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize)
       * @default 2048
       */
      fftSize: 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768;
    }>);
  }
}

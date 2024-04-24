import { makeScene2D, Img, Circle, Txt } from "@motion-canvas/2d";
import { Color, createSignal } from "@motion-canvas/core";

import { audiowaveformAmplitudes } from "../";

import thumb from "../data/test.webp";
import audioJSON from "../data/test.mp3.json";

const amplitudes = audiowaveformAmplitudes(audioJSON);

const opacity = createSignal(amplitudes[0]);

export default makeScene2D(function* (view) {
  view.fill(0x202228);

  view.add(
    <Circle
      width={256}
      height={256}
      stroke={createSignal(() => new Color(0x23a559).alpha(opacity()))}
      lineWidth={32}
    >
      <Img src={thumb} width={256} radius={128} />
    </Circle>
  );

  view.add(
    <Txt
      y={200}
      fontFamily="mono"
      fill="white"
      text={createSignal(() => "Opacity: " + opacity().toFixed(3))}
    />
  );

  for (let i = 0; i < amplitudes.length; ++i) {
    yield* opacity(
      amplitudes[i] * 3, // it only needs to get 1/3 of the maximum amplitude to fully light up the ring in this configuration
      1 / 5 // the timestep in audiowaveform was set at 1/5 seconds, adjust accordingly.
    );
  }
});

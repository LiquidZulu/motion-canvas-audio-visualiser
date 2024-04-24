
# Table of Contents

1.  [Guide](#org7be14fb)
    1.  [Get The Sample Rate](#org3219e93)
    2.  [Process the Audio with `audiowaveform`](#org26f6a1b)
    3.  [Import The Processed Audio Into Motion Canvas](#org3950c5a)

Audio visualisation with [Motion Canvas](https://motioncanvas.io) and [audiowaveform](https://github.com/bbc/audiowaveform/).


<a id="org7be14fb"></a>

# Guide

For the purposes of this guide, I will use `src/data/test.mp3`.


<a id="org3219e93"></a>

## Get The Sample Rate

You can acquire the sample rate using `ffprobe`:

    ffprobe src/data/test.mp3

Which should yield something like:

    ffprobe version 5.1.3 Copyright (c) 2007-2022 the FFmpeg developers
      built with gcc 12.2.0 (GCC)
      configuration: ...
    Input #0, mp3, from 'src/data/test.mp3':
      Duration: 00:00:03.79, start: 0.025057, bitrate: 85 kb/s
      Stream #0:0: Audio: mp3, 44100 Hz, mono, fltp, 85 kb/s

Here, we can see that `test.mp3` is at 44100 Hz, but we do not need anywhere close to this resolution. I find that about 5 samples a second works for me, so I would use 44100 / 5 = 8820 for the next step.


<a id="org26f6a1b"></a>

## Process the Audio with `audiowaveform`

    audiowaveform -i src/data/test.mp3 -o src/data/test.mp3.json -z 8820

The `-z 8820` argument refers to the level of &ldquo;zoom,&rdquo; or how many samples should be used for a single entry into the new JSON file. This should be calculated based upon the [sample rate](#org3219e93).


<a id="org3950c5a"></a>

## Import The Processed Audio Into Motion Canvas

See `src/scenes/visualiser.tsx` for example usage. `src/index.ts` provides an `audiowaveformAmplitudes` function to more easily use the data in Motion Canvas; this function takes an audiowaveform JSON and provides an array of amplitudes between 0 and 1, which can then be used to drive whatever animation.

For example, I can create an opacity signal:

    import { audiowaveformAmplitudes } from 'motion-canvas-audio-visualiser';
    import audioJSON from "../data/test.mp3.json";
    const amplitudes = audiowaveformAmplitudes(audioJSON);
    const opacity = createSignal(amplitudes[0]);

And use that opacity for a ring around an image:

    export default makeScene2D(function* (view) {
      ...
    
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
      ...
    };

Which can then be updated according to how long each timestep is based on the [sample rate](#org3219e93):

    for (let i = 0; i < amplitudes.length; ++i) {
        yield* opacity(
          amplitudes[i] * 3,
          1 / 5
        );
      }

In that example, I am using `1 / 5` for the duration, because each timestep takes 1/5 seconds, and I have multiplied the amplitude by 3 such that it will be maximally opaque whilst only achieving a third of the maximum amplitude.



# Table of Contents

1.  [Guide](#org30357f4)
    1.  [Get The Sample Rate](#org984c381)
    2.  [Process the Audio with `audiowaveform`](#orge3adf18)
    3.  [Import The Processed Audio Into Motion Canvas](#org50ce85d)

Audio visualisation with [Motion Canvas](https://motioncanvas.io) and [audiowaveform](https://github.com/bbc/audiowaveform/).


<a id="org30357f4"></a>

# Guide

For the purposes of this guide, I will use `src/data/test.mp3`.


<a id="org984c381"></a>

## Get The Sample Rate

You can acquire the sample rate using `ffprobe`:

    ffprobe src/data/test.mp3

Which should yield something like:

Here, we can see that `test.mp3` is at 44100 Hz, but we do not need anywhere close to this resolution. I find that about 5 samples a second works for me, so I would use 44100 / 5 = 8820 for the next step.


<a id="orge3adf18"></a>

## Process the Audio with `audiowaveform`

    audiowaveform -i src/data/test.mp3 -o src/data/test.mp3.json -z 8820

The `-z 8820` argument refers to the level of &ldquo;zoom,&rdquo; or how many samples should be used for a single entry into the new JSON file. This should be calculated based upon the [sample rate](#org984c381).


<a id="org50ce85d"></a>

## Import The Processed Audio Into Motion Canvas

See `src/scenes/visualiser.tsx` for example usage. `src/index.ts` provides an `audiowaveformAmplitudes` function to more easily use the data in Motion Canvas; this function takes an audiowaveform JSON and provides an array of amplitudes between 0 and 1, which can then be used to drive whatever animation.

For example, I can create an opacity signal:

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

Which can then be updated according to how long each timestep is based on the [sample rate](#org984c381):

    for (let i = 0; i < amplitudes.length; ++i) {
        yield* opacity(
          amplitudes[i] * 3,
          1 / 5
        );
      }

In that example, I am using `1 / 5` for the duration, because each timestep takes 1/5 seconds, and I have multiplied the amplitude by 3 such that it will be maximally opaque whilst only achieving a third of the maximum amplitude.


/*
 * See: https://github.com/bbc/audiowaveform/blob/master/doc/DataFormat.md
 *
 * "Array of minimum and maximum waveform data points, interleaved.
 * The example shows a two channel waveform data file. Depending on
 * bits, each value may be in the range -128 to +127 or -32768 to
 * +32767."
 *
 * You need to normalise based upon the range that you told
 * audiowaveform to use.
 */
export function audiowaveformAmplitudes(
  audiowaveformJSON: { data: number[] } & Record<string, unknown>,
  range = 32767
) {
  let proc: number[] = [];
  for (let i = 0; i < audiowaveformJSON.data.length; i += 2) {
    proc.push(
      normalise(audiowaveformJSON.data[i], audiowaveformJSON.data[i + 1], range)
    );
  }
  return proc;
}

function normalise(hi: number, lo: number, range: number) {
  return Math.max(Math.abs(hi), Math.abs(lo)) / range;
}

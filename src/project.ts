import { makeProject } from "@motion-canvas/core";

import visualiser from "./scenes/visualiser?scene";
import audio from "./data/test.mp3";

export default makeProject({
  audio,
  scenes: [visualiser],
});

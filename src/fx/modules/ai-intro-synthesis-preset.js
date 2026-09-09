/**
 * Synthesis 1 — https://shaders.com/collection/synthesis/c91ae513-d656-4f32-933f-fdcd579495e2
 *
 * Decoded from public `/api/preview/preset/{id}` (XOR `shaders-preview-key`).
 * Preview watermark `ImageTexture` stripped. Filter nodes wrap generators
 * (structureVersion 3 is a flat sibling list on the site; createShader needs children).
 */

export const SYNTHESIS_ID = "c91ae513-d656-4f32-933f-fdcd579495e2";

export const FLOW_BACK_HEX = "#08071a";
export const WAVE_BLUE_HEX = "#0582e8";
export const WAVE_PINK_HEX = "#f00e94";

export const FLOW_BACK = [8 / 255, 7 / 255, 26 / 255];
export const WAVE_BLUE = [5 / 255, 130 / 255, 232 / 255];
export const WAVE_PINK = [240 / 255, 14 / 255, 148 / 255];

export const SOLID = {
  color: FLOW_BACK_HEX,
  opacity: 1,
  blendMode: "normal",
};

export const WAVE_A = {
  angle: 0,
  color: WAVE_BLUE_HEX,
  speed: 0.3,
  opacity: 1,
  position: { x: 0.6541417591801879, y: 0.6730714489040706 },
  softness: 0.55,
  amplitude: 0.36,
  blendMode: "normal-oklch",
  frequency: 0.2,
  thickness: 0.72,
};

export const WAVE_B = {
  angle: 0,
  color: WAVE_PINK_HEX,
  speed: 0.5,
  opacity: 1,
  position: { x: 0.6046114432109309, y: 0.513663535439795 },
  softness: 0.54,
  amplitude: 0.17,
  blendMode: "normal-oklch",
  frequency: 0.2,
  thickness: 0.35,
};

export const DISTORT = {
  angle: 299,
  edges: "stretch",
  speed: 0.2,
  opacity: 1,
  strength: 1,
  waveType: "sine",
  blendMode: "normal",
  frequency: 0.3,
};

export const GRAIN = {
  opacity: 1,
  strength: 0.07,
  blendMode: "normal",
  bias: 2,
};

export const GRAIN_STRENGTH = GRAIN.strength;
export const GRAIN_BIAS = GRAIN.bias;

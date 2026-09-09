import { clamp } from "../utils.js";

/**
 * Synthesis 1 stack (shaders.com collection payload, not Pro GLSL):
 * SolidColor #08071a
 * → WaveDistortion (angle 299°, sine)
 * → two SineWave glows (#0582e8, #f00e94), OKLCH-ish / screen mix
 * → FilmGrain strength 0.07, bias toward dark
 */

export const FLOW_BACK = [0.031, 0.027, 0.102]; // #08071a
export const WAVE_BLUE = [0.02, 0.51, 0.91]; // #0582e8
export const WAVE_PINK = [0.941, 0.055, 0.58]; // #f00e94
export const GRAIN_STRENGTH = 0.07;
export const GRAIN_BIAS = 2;

function clamp01(n) {
  return clamp(n, 0, 1);
}

function smoothstep(a, b, t) {
  const x = clamp01((t - a) / Math.max(b - a, 1e-6));
  return x * x * (3 - 2 * x);
}

function hash21(x, y) {
  let n = Math.imul((x | 0) ^ 0x9e3779b9, 0x85ebca6b);
  n = Math.imul(n ^ ((y | 0) * 0xc2b2ae35), 0x27d4eb2d);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

/** Screen-space grain (FilmGrain: pixel coords, not gradient UV). */
export function grainTerm(gx, gy) {
  return hash21(gx, gy) * 2 - 1;
}

/**
 * WaveDistortion: displace UV along the perpendicular of `angle`.
 * edges: stretch → clamp 0–1.
 */
export function waveDistort(uv, t, d) {
  const rad = (d.angle * Math.PI) / 180;
  const ax = Math.cos(rad);
  const ay = Math.sin(rad);
  const along = uv.x * ax + uv.y * ay;
  const disp =
    d.strength * 0.14 * Math.sin(along * d.frequency * Math.PI * 2 + t * d.speed);
  let x = uv.x + -ay * disp;
  let y = uv.y + ax * disp;
  if (d.edges === "mirror") {
    x = Math.abs(((x % 2) + 2) % 2 - 1);
    y = Math.abs(((y % 2) + 2) % 2 - 1);
  } else {
    x = clamp01(x);
    y = clamp01(y);
  }
  return { x, y };
}

/**
 * SineWave SDF band: rotate into wave space, sine offset, thickness + softness.
 * Returns coverage 0–1.
 */
export function sineWave(uv, t, w) {
  const rad = (w.angle * Math.PI) / 180;
  const ca = Math.cos(rad);
  const sa = Math.sin(rad);
  const dx = uv.x - w.pos.x;
  const dy = uv.y - w.pos.y;
  const x = dx * ca + dy * sa;
  const y = -dx * sa + dy * ca;
  const wave =
    w.amplitude * Math.sin(x * w.frequency * Math.PI * 2 + t * w.speed);
  const dist = Math.abs(y - wave) - w.thickness * 0.5;
  return 1 - smoothstep(0, Math.max(w.softness, 1e-4), dist);
}

function screenMix(base, col, a) {
  const k = clamp01(a);
  return [
    1 - (1 - base[0]) * (1 - col[0] * k),
    1 - (1 - base[1]) * (1 - col[1] * k),
    1 - (1 - base[2]) * (1 - col[2] * k),
  ];
}

const DISTORT = {
  angle: 299,
  frequency: 0.85,
  strength: 0.42,
  speed: 0.55,
  edges: "stretch",
};

const WAVE_A = {
  color: WAVE_BLUE,
  pos: { x: 0.64, y: 0.62 },
  angle: 12,
  amplitude: 0.38,
  frequency: 0.38,
  speed: 0.62,
  thickness: 0.92,
  softness: 0.55,
};

const WAVE_B = {
  color: WAVE_PINK,
  pos: { x: 0.42, y: 0.5 },
  angle: 77,
  amplitude: 0.42,
  frequency: 0.34,
  speed: 0.48,
  thickness: 0.86,
  softness: 0.54,
};

/**
 * Time-shifted Synthesis stack (no grain).
 * @param {{x:number,y:number}} uv
 * @param {number} t seconds
 * @returns {[number,number,number]}
 */
export function flowingGradient(uv, t) {
  const d = waveDistort(uv, t, DISTORT);
  let rgb = FLOW_BACK.slice();
  const a = sineWave(d, t, WAVE_A);
  const b = sineWave(d, t, WAVE_B);
  rgb = screenMix(rgb, WAVE_A.color, a);
  rgb = screenMix(rgb, WAVE_B.color, b);
  return rgb;
}

/**
 * FilmGrain overlay: strength * (1-luma)^bias * signed noise.
 * @param {{x:number,y:number}} uv
 * @param {number} t seconds
 * @param {{x:number,y:number}|null} [grainUv]
 * @returns {[number,number,number]}
 */
export function sampleIntroFlow(uv, t, grainUv = null) {
  const rgb = flowingGradient(uv, t);
  if (!grainUv) return rgb;
  const n = grainTerm(grainUv.x, grainUv.y);
  const lum = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  const w = GRAIN_STRENGTH * Math.pow(1 - lum, GRAIN_BIAS);
  const g = n * w;
  return [clamp01(rgb[0] + g), clamp01(rgb[1] + g), clamp01(rgb[2] + g)];
}

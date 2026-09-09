import { clamp } from "../utils.js";
import {
  DISTORT,
  FLOW_BACK,
  GRAIN_BIAS,
  GRAIN_STRENGTH,
  WAVE_A,
  WAVE_B,
  WAVE_BLUE,
  WAVE_PINK,
} from "./ai-intro-synthesis-preset.js";

/**
 * CPU stand-in of our WebGL Synthesis port (same formulas).
 * Viewport default 16×9 so tests don't need a canvas.
 */

export {
  FLOW_BACK,
  GRAIN_BIAS,
  GRAIN_STRENGTH,
  WAVE_BLUE,
  WAVE_PINK,
};

const TAU = Math.PI * 2;
const DEFAULT_VIEW = { x: 16, y: 9 };

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

export function grainTerm(gx, gy) {
  return hash21(gx, gy) * 2 - 1;
}

/** WaveDistortion: phase along rotated, aspect-corrected Y; displace * 0.5. */
export function waveDistort(uv, t, d, aspect) {
  const rad = (d.angle * Math.PI) / 180;
  const ca = Math.cos(rad);
  const sa = Math.sin(rad);
  const cx = (uv.x - 0.5) * aspect;
  const cy = uv.y - 0.5;
  const rotatedY = cx * sa + cy * ca;
  const phase = (rotatedY + 0.5) * d.frequency * TAU + t * d.speed * 0.5;
  const disp = Math.sin(phase) * d.strength * 0.5;
  return {
    x: clamp01(uv.x + (disp * ca) / Math.max(aspect, 1e-6)),
    y: clamp01(uv.y + disp * sa),
  };
}

/**
 * SineWave coverage. UV is y-up (WebGL); position.y is y-down (editor).
 */
export function sineWave(uv, t, w, viewport = DEFAULT_VIEW) {
  const aspect = viewport.x / Math.max(viewport.y, 1e-6);
  const pos = w.position || w.pos;
  const dx = uv.x * aspect - pos.x * aspect;
  const dy = uv.y - (1 - pos.y);
  const rad = (w.angle * Math.PI) / 180;
  const ca = Math.cos(rad);
  const sa = Math.sin(rad);
  const rx = dx * ca - dy * sa;
  const ry = dx * sa + dy * ca;
  const wave = Math.sin(rx * w.frequency * TAU + t * w.speed) * w.amplitude;
  const dist = Math.abs(ry - wave);
  const halfT = w.thickness * 0.5;
  const halfS = w.softness * 0.5;
  return 1 - smoothstep(halfT - halfS, halfT + halfS, dist);
}

function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

function rgbToOklab(rgb) {
  const r = srgbToLinear(rgb[0]);
  const g = srgbToLinear(rgb[1]);
  const b = srgbToLinear(rgb[2]);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

function oklabToRgb(lab) {
  const l_ = lab[0] + 0.3963377774 * lab[1] + 0.2158037573 * lab[2];
  const m_ = lab[0] - 0.1055613458 * lab[1] - 0.0638541728 * lab[2];
  const s_ = lab[0] - 0.0894841775 * lab[1] - 1.291485548 * lab[2];
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [clamp01(linearToSrgb(r)), clamp01(linearToSrgb(g)), clamp01(linearToSrgb(b))];
}

function mixOklab(base, col, a) {
  const k = clamp01(a);
  const A = rgbToOklab(base);
  const B = rgbToOklab(col);
  return oklabToRgb([
    A[0] + (B[0] - A[0]) * k,
    A[1] + (B[1] - A[1]) * k,
    A[2] + (B[2] - A[2]) * k,
  ]);
}

const WAVE_A_CPU = { ...WAVE_A, color: WAVE_BLUE };
const WAVE_B_CPU = { ...WAVE_B, color: WAVE_PINK };

export function flowingGradient(uv, t, viewport = DEFAULT_VIEW) {
  const aspect = viewport.x / Math.max(viewport.y, 1e-6);
  const d = waveDistort(uv, t, DISTORT, aspect);
  let rgb = FLOW_BACK.slice();
  rgb = mixOklab(rgb, WAVE_A_CPU.color, sineWave(d, t, WAVE_A_CPU, viewport));
  rgb = mixOklab(rgb, WAVE_B_CPU.color, sineWave(d, t, WAVE_B_CPU, viewport));
  return rgb;
}

export function sampleIntroFlow(uv, t, grainUv = null, viewport = DEFAULT_VIEW) {
  const rgb = flowingGradient(uv, t, viewport);
  if (!grainUv) return rgb;
  const n = grainTerm(grainUv.x, grainUv.y);
  const lum = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  const w = GRAIN_STRENGTH * 0.1 * Math.pow(1 - lum + 1e-6, GRAIN_BIAS);
  const g = n * w;
  return [clamp01(rgb[0] + g), clamp01(rgb[1] + g), clamp01(rgb[2] + g)];
}

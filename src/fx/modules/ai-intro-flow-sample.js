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

export function grainTerm(gx, gy) {
  const n = Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
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
    x: uv.x + (disp * ca) / Math.max(aspect, 1e-6),
    y: uv.y + disp * sa,
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

/** Additive glow. Punch chroma (not luma) so washes stay neon without blasting the center. */
function punchLin(lin) {
  const y = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  return lin.map((c) => clamp01(y + (c - y) * 1.85));
}
function addGlow(base, col, a) {
  const k = clamp01(a) ** 1.28;
  const glow = punchLin(col.map(srgbToLinear)).map((c) => c * k * 0.7);
  const out = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    out[i] = clamp01(linearToSrgb(srgbToLinear(base[i]) + glow[i]));
  }
  return out;
}

const WAVE_A_CPU = { ...WAVE_A, color: WAVE_BLUE };
const WAVE_B_CPU = { ...WAVE_B, color: WAVE_PINK };

export function flowingGradient(uv, t, viewport = DEFAULT_VIEW) {
  const aspect = viewport.x / Math.max(viewport.y, 1e-6);
  const d = waveDistort(uv, t, DISTORT, aspect);
  let rgb = FLOW_BACK.slice();
  rgb = addGlow(rgb, WAVE_A_CPU.color, sineWave(d, t, WAVE_A_CPU, viewport));
  rgb = addGlow(rgb, WAVE_B_CPU.color, sineWave(d, t, WAVE_B_CPU, viewport));
  return rgb;
}

export function sampleIntroFlow(uv, t, grainUv = null, viewport = DEFAULT_VIEW) {
  const rgb = flowingGradient(uv, t, viewport);
  if (!grainUv) return rgb;
  const n = grainTerm(grainUv.x, grainUv.y);
  const lum = Math.min(1, Math.max(0, 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]));
  const g = n * Math.pow(1 - lum + 1e-6, GRAIN_BIAS) * GRAIN_STRENGTH * 0.1;
  return [clamp01(rgb[0] + g), clamp01(rgb[1] + g), clamp01(rgb[2] + g)];
}

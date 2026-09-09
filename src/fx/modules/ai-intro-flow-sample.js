import { clamp } from "../utils.js";

/** Brand-family spots (indigo / violet / fuchsia) over intro dark. */
export const FLOW_COLORS = [
  [0.31, 0.275, 0.9],
  [0.655, 0.545, 0.99],
  [0.753, 0.149, 0.827],
  [0.231, 0.51, 0.965],
];

export const FLOW_BACK = [0.039, 0.02, 0.078];
export const GRAIN_STRENGTH = 0.085;

function clamp01(n) {
  return clamp(n, 0, 1);
}

function hash21(x, y) {
  let n = Math.imul((x | 0) ^ 0x9e3779b9, 0x85ebca6b);
  n = Math.imul(n ^ ((y | 0) * 0xc2b2ae35), 0x27d4eb2d);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

/**
 * Screen-space grain — Paper GrainGradient: grains use pixel coords so they
 * do not stretch with the gradient's scale/fit.
 */
export function grainTerm(gx, gy) {
  return hash21(gx, gy) * 2 - 1;
}

function spotPos(i, t) {
  const a = i * 1.73;
  const b = 0.45 + (i % 3) * 0.22;
  const c = 0.55 + ((i + 1) % 4) * 0.18;
  return [
    0.5 + 0.46 * Math.sin(t * b + a),
    0.5 + 0.46 * Math.cos(t * c + a * 1.5),
  ];
}

/**
 * Time-shifted multi-spot mix (Mesh Gradient trajectories) with a light swirl.
 * @param {{x:number,y:number}} uv
 * @param {number} t seconds
 * @returns {[number,number,number]}
 */
export function flowingGradient(uv, t) {
  let u = uv.x;
  let v = uv.y;
  u += 0.1 * Math.sin(v * 5.1 + t * 0.52);
  v += 0.1 * Math.cos(u * 4.4 - t * 0.38);
  const cx = u - 0.5;
  const cy = v - 0.5;
  const ang = 0.28 * Math.sin(t * 0.22);
  const ca = Math.cos(ang);
  const sa = Math.sin(ang);
  u = 0.5 + cx * ca - cy * sa;
  v = 0.5 + cx * sa + cy * ca;

  let cr = 0;
  let cg = 0;
  let cb = 0;
  let wsum = 0;
  const n = FLOW_COLORS.length;
  for (let i = 0; i < n; i++) {
    const p = spotPos(i, t);
    const dx = u - p[0];
    const dy = v - p[1];
    const w = 1 / (dx * dx + dy * dy + 0.045);
    const col = FLOW_COLORS[i];
    cr += col[0] * w;
    cg += col[1] * w;
    cb += col[2] * w;
    wsum += w;
  }
  const inv = 1 / Math.max(wsum, 1e-6);
  const fade =
    0.55 +
    0.45 *
      Math.min(
        1,
        1.15 - 1.1 * ((u - 0.5) * (u - 0.5) + (v - 0.48) * (v - 0.48))
      );
  return [
    FLOW_BACK[0] + (cr * inv - FLOW_BACK[0]) * fade,
    FLOW_BACK[1] + (cg * inv - FLOW_BACK[1]) * fade,
    FLOW_BACK[2] + (cb * inv - FLOW_BACK[2]) * fade,
  ];
}

/**
 * Shipped intro background sample.
 * @param {{x:number,y:number}} uv object UV 0–1
 * @param {number} t seconds
 * @param {{x:number,y:number}|null} [grainUv] pixel-space grain; omit/null = no grain
 * @returns {[number,number,number]} rgb 0–1
 */
export function sampleIntroFlow(uv, t, grainUv = null) {
  const rgb = flowingGradient(uv, t);
  if (!grainUv) return rgb;
  const g = grainTerm(grainUv.x, grainUv.y) * GRAIN_STRENGTH;
  return [clamp01(rgb[0] + g), clamp01(rgb[1] + g), clamp01(rgb[2] + g)];
}

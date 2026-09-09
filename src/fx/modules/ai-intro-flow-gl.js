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

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uFade;

const float TAU = 6.28318530718;
const vec3 BACK = vec3(${FLOW_BACK[0]}, ${FLOW_BACK[1]}, ${FLOW_BACK[2]});
const vec3 BLUE = vec3(${WAVE_BLUE[0]}, ${WAVE_BLUE[1]}, ${WAVE_BLUE[2]});
const vec3 PINK = vec3(${WAVE_PINK[0]}, ${WAVE_PINK[1]}, ${WAVE_PINK[2]});
const float GRAIN_AMT = ${GRAIN_STRENGTH.toFixed(4)};
const float GRAIN_POW = ${GRAIN_BIAS.toFixed(4)};

vec3 srgbToLin(vec3 c){
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
vec3 linToSrgb(vec3 c){
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
/* Additive linear glow. pow() kills the gray-purple fringe of a soft mask. */
vec3 addGlow(vec3 base, vec3 col, float a){
  a = pow(clamp(a, 0.0, 1.0), 1.28);
  return clamp(linToSrgb(srgbToLin(base) + srgbToLin(col) * a * 1.18), 0.0, 1.0);
}

vec2 waveDistort(vec2 uv, float aspect, float t){
  float rad = ${DISTORT.angle.toFixed(4)} * 0.01745329251;
  float ca = cos(rad);
  float sa = sin(rad);
  vec2 c = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  float rotatedY = c.x * sa + c.y * ca;
  float phase = (rotatedY + 0.5) * ${DISTORT.frequency.toFixed(4)} * TAU
    + t * ${DISTORT.speed.toFixed(4)} * 0.5;
  float disp = sin(phase) * ${DISTORT.strength.toFixed(4)} * 0.5;
  return uv + vec2(disp * ca / max(aspect, 1e-6), disp * sa);
}

float sineMask(vec2 uv, vec2 pos, float angle, float freq, float amp, float thick, float soft, float anim, float aspect){
  vec2 d = vec2(uv.x * aspect - pos.x * aspect, uv.y - (1.0 - pos.y));
  float rad = angle * 0.01745329251;
  float ca = cos(rad);
  float sa = sin(rad);
  vec2 r = vec2(d.x * ca - d.y * sa, d.x * sa + d.y * ca);
  float wave = sin(r.x * freq * TAU + anim) * amp;
  float dist = abs(r.y - wave);
  float ht = thick * 0.5;
  float hs = soft * 0.5;
  return 1.0 - smoothstep(ht - hs, ht + hs, dist);
}

float filmGrain(vec2 pixel){
  float n = fract(sin(dot(pixel, vec2(12.9898, 78.233))) * 43758.5453);
  return n * 2.0 - 1.0;
}

void main(){
  vec2 res = max(uRes, vec2(1.0));
  vec2 uv = gl_FragCoord.xy / res;
  float aspect = res.x / res.y;
  vec2 dUv = waveDistort(uv, aspect, uTime);

  vec3 rgb = BACK;
  float a1 = sineMask(
    dUv,
    vec2(${WAVE_A.position.x.toFixed(8)}, ${WAVE_A.position.y.toFixed(8)}),
    ${WAVE_A.angle.toFixed(4)},
    ${WAVE_A.frequency.toFixed(4)},
    ${WAVE_A.amplitude.toFixed(4)},
    ${WAVE_A.thickness.toFixed(4)},
    ${WAVE_A.softness.toFixed(4)},
    uTime * ${WAVE_A.speed.toFixed(4)},
    aspect
  );
  float a2 = sineMask(
    dUv,
    vec2(${WAVE_B.position.x.toFixed(8)}, ${WAVE_B.position.y.toFixed(8)}),
    ${WAVE_B.angle.toFixed(4)},
    ${WAVE_B.frequency.toFixed(4)},
    ${WAVE_B.amplitude.toFixed(4)},
    ${WAVE_B.thickness.toFixed(4)},
    ${WAVE_B.softness.toFixed(4)},
    uTime * ${WAVE_B.speed.toFixed(4)},
    aspect
  );
  rgb = addGlow(rgb, BLUE, a1);
  rgb = addGlow(rgb, PINK, a2);

  /* Official FilmGrain: 1 device px, bias 2, strength*0.1. Don't CSS-cell / 2-octave. */
  float lum = clamp(dot(rgb, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0);
  float grain = filmGrain(gl_FragCoord.xy) * pow(1.0 - lum + 1e-6, GRAIN_POW) * GRAIN_AMT * 0.1;
  rgb = clamp(rgb + grain, 0.0, 1.0);
  gl_FragColor = vec4(rgb * uFade, 1.0);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(log || "shader compile failed");
  }
  return sh;
}

/**
 * Own WebGL port of Synthesis 1 (decoded params, no shaders npm).
 * @returns {{ draw: (now: number, fade: number) => void, resize: () => boolean, dispose: () => void } | null}
 */
export function createIntroFlowGl(canvas, sizeEl) {
  const gl =
    canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    }) ||
    canvas.getContext("experimental-webgl", {
      alpha: false,
      antialias: false,
    });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    return null;
  }

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  const aPos = gl.getAttribLocation(prog, "aPos");
  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");
  const uFade = gl.getUniformLocation(prog, "uFade");

  let cssW = 0;
  let cssH = 0;

  function resize() {
    const rect = (sizeEl || canvas).getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const pw = Math.round(w * dpr);
    const ph = Math.round(h * dpr);
    if (w === cssW && h === cssH && canvas.width === pw) return false;
    cssW = w;
    cssH = h;
    canvas.width = pw;
    canvas.height = ph;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    gl.viewport(0, 0, pw, ph);
    return true;
  }

  function draw(now, fade) {
    if (!cssW) resize();
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now || 0) * 0.001);
    gl.uniform1f(uFade, fade);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function dispose() {
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
  }

  resize();
  return { draw, resize, dispose };
}

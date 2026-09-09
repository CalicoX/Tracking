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

vec3 srgbToLin(vec3 c){
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
vec3 linToSrgb(vec3 c){
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
vec3 rgbToOklab(vec3 rgb){
  vec3 c = srgbToLin(rgb);
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  float l_ = pow(l, 1.0 / 3.0);
  float m_ = pow(m, 1.0 / 3.0);
  float s_ = pow(s, 1.0 / 3.0);
  return vec3(
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  );
}
vec3 oklabToRgb(vec3 lab){
  float l_ = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m_ = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s_ = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  float l = l_ * l_ * l_;
  float m = m_ * m_ * m_;
  float s = s_ * s_ * s_;
  vec3 lin = vec3(
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
  return clamp(linToSrgb(lin), 0.0, 1.0);
}
vec3 mixOklab(vec3 base, vec3 col, float a){
  a = clamp(a, 0.0, 1.0);
  return oklabToRgb(mix(rgbToOklab(base), rgbToOklab(col), a));
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
  return clamp(uv + vec2(disp * ca / max(aspect, 1e-6), disp * sa), 0.0, 1.0);
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

float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
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
  rgb = mixOklab(rgb, BLUE, a1);
  rgb = mixOklab(rgb, PINK, a2);

  float n = hash12(gl_FragCoord.xy) * 2.0 - 1.0;
  float lum = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
  float grain = n * pow(1.0 - lum + 1e-6, ${GRAIN_BIAS.toFixed(4)}) * ${GRAIN_STRENGTH.toFixed(4)} * 0.1;
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
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
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

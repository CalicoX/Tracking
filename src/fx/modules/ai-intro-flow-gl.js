import {
  DISTORT,
  FLOW_BACK,
  GLOW_POW,
  GLOW_SPREAD,
  GRAIN_STRENGTH,
  VIGNETTE_AMT,
  VIGNETTE_INNER,
  VIGNETTE_OUTER,
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
uniform float uDpr;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform float uInk;
uniform vec2 uFlow;
uniform vec2 uTrail[16];

const float TAU = 6.28318530718;
const vec3 BACK = vec3(${FLOW_BACK[0]}, ${FLOW_BACK[1]}, ${FLOW_BACK[2]});
const vec3 BLUE = vec3(${WAVE_BLUE[0]}, ${WAVE_BLUE[1]}, ${WAVE_BLUE[2]});
const vec3 PINK = vec3(${WAVE_PINK[0]}, ${WAVE_PINK[1]}, ${WAVE_PINK[2]});
const float GRAIN_AMT = ${GRAIN_STRENGTH.toFixed(4)};

vec3 srgbToLin(vec3 c){
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
vec3 linToSrgb(vec3 c){
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
/* Additive glow. Punch chroma (not luma) so washes stay neon without blasting the center. */
vec3 punchLin(vec3 lin){
  float y = dot(lin, vec3(0.2126, 0.7152, 0.0722));
  return clamp(y + (lin - vec3(y)) * 1.85, 0.0, 1.0);
}
vec3 addGlow(vec3 base, vec3 col, float a){
  a = pow(clamp(a, 0.0, 1.0), ${GLOW_POW.toFixed(4)});
  vec3 glow = punchLin(srgbToLin(col)) * a * 0.7;
  return clamp(linToSrgb(srgbToLin(base) + glow), 0.0, 1.0);
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
  float ht = thick * 0.5 * ${GLOW_SPREAD.toFixed(4)};
  float hs = soft * 0.5 * ${GLOW_SPREAD.toFixed(4)};
  return 1.0 - smoothstep(ht - hs, ht + hs, dist);
}

float filmGrain(vec2 pixel){
  vec3 p3 = fract(vec3(pixel.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z) * 2.0 - 1.0;
}

float inkField(vec2 uv){
  if (uInk < 0.001) return 0.0;
  float m = 0.0;
  float spd = length(uVel) + length(uFlow);
  for (int i = 0; i < 15; i++){
    vec2 a = uTrail[i];
    vec2 b = uTrail[i + 1];
    vec2 pa = uv - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
    float d = length(pa - ba * h);
    float w = mix(0.34, 0.11, float(i) / 15.0) + spd * 0.55;
    m = max(m, exp(-(d * d) / max(w * w, 1e-6)));
  }
  vec2 hm = uv - uMouse;
  m = max(m, exp(-dot(hm, hm) / 0.05));
  return pow(clamp(m * uInk, 0.0, 1.0), 0.48);
}

vec2 flowDir(vec2 uv, float t){
  vec2 acc = vec2(0.0);
  float wsum = 0.0;
  for (int i = 0; i < 15; i++){
    vec2 a = uTrail[i];
    vec2 b = uTrail[i + 1];
    vec2 pa = uv - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
    float d = length(pa - ba * h);
    float w = mix(0.34, 0.11, float(i) / 15.0);
    float k = exp(-(d * d) / max(w * w, 1e-6));
    vec2 tang = normalize(ba + vec2(1e-5, 0.0));
    vec2 nrm = vec2(tang.y, -tang.x);
    acc += (tang * 0.42 + nrm * 0.95) * k;
    wsum += k;
  }
  vec2 wake = wsum > 0.0 ? acc / wsum : vec2(0.0);
  vec2 c1 = vec2(
    sin(uv.y * 8.5 + t * 1.15 + uv.x * 3.2),
    cos(uv.x * 7.5 - t * 0.95 + uv.y * 4.1)
  );
  vec2 c2 = vec2(
    cos(uv.y * 13.0 - t * 1.55 + uFlow.x * 4.0),
    sin(uv.x * 12.0 + t * 1.35 + uFlow.y * 4.0)
  );
  return wake * 1.55 + uFlow * 1.15 + uVel * 0.65 + c1 * 0.28 + c2 * 0.16;
}

void main(){
  vec2 res = max(uRes, vec2(1.0));
  vec2 uv = gl_FragCoord.xy / res;
  float aspect = res.x / res.y;
  vec2 p = uv;
  if (uInk > 0.001) {
    for (int s = 0; s < 5; s++){
      float k = inkField(p) * (1.0 - float(s) * 0.08);
      p -= flowDir(p, uTime) * k * 0.16;
    }
  }
  vec2 dUv = waveDistort(p, aspect, uTime + inkField(p) * 0.55);

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
  float vig = smoothstep(${VIGNETTE_INNER.toFixed(4)}, ${VIGNETTE_OUTER.toFixed(4)},
    length((uv - vec2(0.5)) * vec2(1.12, 1.0)));
  rgb = mix(rgb, BACK, vig * ${VIGNETTE_AMT.toFixed(4)});

  /* 1 CSS px (official viewport). Authored 0.07 — official also *0.1 is invisible here. */
  float lum = clamp(dot(rgb, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0);
  float dark = pow(1.0 - lum + 1e-6, 0.7);
  float grain = filmGrain(gl_FragCoord.xy / max(uDpr, 1.0)) * mix(0.82, dark, 0.35) * GRAIN_AMT;
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
  const uDpr = gl.getUniformLocation(prog, "uDpr");
  const uMouse = gl.getUniformLocation(prog, "uMouse");
  const uVel = gl.getUniformLocation(prog, "uVel");
  const uInk = gl.getUniformLocation(prog, "uInk");
  const uFlow = gl.getUniformLocation(prog, "uFlow");
  const uTrail0 = gl.getUniformLocation(prog, "uTrail[0]");

  let cssW = 0;
  let cssH = 0;
  let dpr = 1;
  const TRAIL_N = 16;
  const trail = new Float32Array(TRAIL_N * 2);
  for (let i = 0; i < TRAIL_N; i++) {
    trail[i * 2] = 0.5;
    trail[i * 2 + 1] = 0.5;
  }
  let targetX = 0.5;
  let targetY = 0.5;
  let mouseX = 0.5;
  let mouseY = 0.5;
  let prevX = 0.5;
  let prevY = 0.5;
  let velX = 0;
  let velY = 0;
  let flowX = 0;
  let flowY = 0;
  let ink = 0;
  let hovering = false;
  let armed = false;

  function setPointer(nx, ny, inside) {
    if (inside) {
      const x = Math.max(0, Math.min(1, nx));
      const y = Math.max(0, Math.min(1, ny));
      if (!armed) {
        for (let i = 0; i < TRAIL_N; i++) {
          trail[i * 2] = x;
          trail[i * 2 + 1] = y;
        }
        mouseX = prevX = x;
        mouseY = prevY = y;
        armed = true;
      }
      targetX = x;
      targetY = y;
      hovering = true;
    } else {
      hovering = false;
    }
  }

  function stepInk() {
    if (hovering) ink += (1 - ink) * 0.14;
    else ink *= 0.988;
    if (ink < 0.0015) {
      ink = 0;
      armed = hovering ? armed : false;
    }
    prevX = mouseX;
    prevY = mouseY;
    mouseX += (targetX - mouseX) * 0.22;
    mouseY += (targetY - mouseY) * 0.22;
    velX = mouseX - prevX;
    velY = mouseY - prevY;
    flowX += velX * 2.4;
    flowY += velY * 2.4;
    flowX *= 0.968;
    flowY *= 0.968;
    trail[0] += (mouseX - trail[0]) * 0.2;
    trail[1] += (mouseY - trail[1]) * 0.2;
    for (let i = 1; i < TRAIL_N; i++) {
      const ox = (i - 1) * 2;
      const ix = i * 2;
      const follow = 0.09 + (1 - i / TRAIL_N) * 0.05;
      trail[ix] += (trail[ox] - trail[ix]) * follow;
      trail[ix + 1] += (trail[ox + 1] - trail[ix + 1]) * follow;
    }
  }

  function isFlowing() {
    return ink > 0.002 || hovering;
  }

  function resize() {
    const rect = (sizeEl || canvas).getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    dpr = Math.min(2, window.devicePixelRatio || 1);
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
    stepInk();
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now || 0) * 0.001);
    gl.uniform1f(uFade, fade);
    gl.uniform1f(uDpr, dpr);
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.uniform2f(uVel, velX, velY);
    gl.uniform2f(uFlow, flowX, flowY);
    gl.uniform1f(uInk, ink);
    if (uTrail0) gl.uniform2fv(uTrail0, trail);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function dispose() {
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
  }

  resize();
  return { draw, resize, dispose, setPointer, isFlowing };
}

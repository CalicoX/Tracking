/**
 * AI intro → 案例：滚动粒子消散（Park：去掉布料；反向 canvasui particle-scroll）。
 * 案例原版：线下是沙，往下滚再聚回去。这里反过来——intro 先完整，往下滚打成沙粒散开，露出底下案例。
 * html2canvas 抓当前 intro 当粒子贴图；藏真 DOM；sticky 底透明。
 */
import { clamp, prefersReducedMotion } from "../utils.js";

const AI_HOLD_VH = 0.36;

const VS = `
attribute vec2 aUv;
attribute vec4 aCol;
attribute float aH;
uniform float uP;
uniform float uTime;
varying vec4 vCol;
void main(){
  vec2 home = vec2(aUv.x * 2.0 - 1.0, (1.0 - aUv.y) * 2.0 - 1.0);
  float delay = aH * 0.55;
  float local = clamp((uP - delay * 0.4) / 0.72, 0.0, 1.0);
  local = local * local * (3.0 - 2.0 * local);
  // 反向：散开向上飘（案例 gravity 正值是往下沉沙）
  vec2 scatter = vec2((aH * 2.0 - 1.0) * 1.15, 0.35 + aH * 1.55);
  float swirl = sin(uTime * 0.9 + aH * 6.2832) * 0.12 * local;
  float drift = sin(uTime * 1.4 + aH * 12.0) * 0.03 * local;
  vec2 pos = home + scatter * local + vec2(swirl + drift, drift * 0.6);
  float fade = mix(1.0, 0.0, clamp((local - 0.55) / 0.45, 0.0, 1.0));
  vCol = vec4(aCol.rgb, aCol.a * fade);
  gl_PointSize = mix(2.6, 1.05, local);
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

const FS = `
precision mediump float;
varying vec4 vCol;
void main(){
  vec2 p = gl_PointCoord - 0.5;
  float d = dot(p, p);
  if (d > 0.25) discard;
  float a = vCol.a * smoothstep(0.25, 0.04, d);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vCol.rgb, a);
}`;

export function mount() {
  const track =
    document.getElementById("ai-lab-intro-track") ||
    document.getElementById("ai-letter-track");
  const sticky = document.getElementById("ai-letter-sticky");
  const intro = document.getElementById("ai-lab-intro");
  if (!track || !sticky || !intro) return () => {};
  if (sticky.dataset.curtainMounted) return () => {};
  sticky.dataset.curtainMounted = "1";

  if (prefersReducedMotion()) {
    return function dispose() {
      delete sticky.dataset.curtainMounted;
    };
  }

  const view = document.createElement("canvas");
  view.id = "ai-curtain-view";
  view.style.cssText =
    "position:fixed;inset:0;width:100vw;height:100vh;z-index:180;pointer-events:none;display:none;";
  document.body.appendChild(view);
  const vctx = view.getContext("2d", { alpha: true });

  let gl = null;
  const glc = document.createElement("canvas");
  try {
    gl = glc.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) throw new Error("no webgl");
  } catch (err) {
    console.warn("[ai-curtain] webgl unavailable", err);
    view.remove();
    return () => {};
  }

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
    return s;
  }
  let prog;
  const U = {};
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
    gl.useProgram(prog);
  } catch (err) {
    console.warn("[ai-curtain] shader", err);
    view.remove();
    return () => {};
  }
  for (const name of ["uP", "uTime"]) U[name] = gl.getUniformLocation(prog, name);

  const buf = gl.createBuffer();
  let particleCount = 0;
  const STRIDE = 7 * 4;

  function uploadParticles(shot) {
    const sctx = shot.getContext("2d", { willReadFrequently: true });
    const W = shot.width;
    const H = shot.height;
    const img = sctx.getImageData(0, 0, W, H).data;
    const step = Math.max(2, Math.round(Math.min(W, H) / 220));
    const list = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const i = (y * W + x) * 4;
        const a = img[i + 3];
        if (a < 12) continue;
        const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
        list.push(x / W, y / H, img[i] / 255, img[i + 1] / 255, img[i + 2] / 255, a / 255, hash);
      }
    }
    particleCount = list.length / 7;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    const locUv = gl.getAttribLocation(prog, "aUv");
    const locCol = gl.getAttribLocation(prog, "aCol");
    const locH = gl.getAttribLocation(prog, "aH");
    gl.enableVertexAttribArray(locUv);
    gl.vertexAttribPointer(locUv, 2, gl.FLOAT, false, STRIDE, 0);
    gl.enableVertexAttribArray(locCol);
    gl.vertexAttribPointer(locCol, 4, gl.FLOAT, false, STRIDE, 8);
    gl.enableVertexAttribArray(locH);
    gl.vertexAttribPointer(locH, 1, gl.FLOAT, false, STRIDE, 24);
  }

  let captured = false;
  let capturing = false;
  const t0 = performance.now();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const W = Math.round(window.innerWidth * dpr);
    const H = Math.round(window.innerHeight * dpr);
    if (view.width !== W) view.width = W;
    if (view.height !== H) view.height = H;
    glc.width = W;
    glc.height = H;
    gl.viewport(0, 0, W, H);
  }
  resize();
  window.addEventListener("resize", resize);

  function progress() {
    const vh = window.innerHeight;
    const r = track.getBoundingClientRect();
    const travel = Math.max(1, r.height - vh);
    const scrolled = clamp(-r.top, 0, travel);
    const holdPx = Math.min(vh * AI_HOLD_VH, travel * 0.42);
    const zoomPx = Math.min(vh * 0.48, travel * 0.4);
    return clamp((scrolled - holdPx) / Math.max(zoomPx, 1), 0, 1);
  }

  function captureCloth() {
    if (capturing || captured) return;
    capturing = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    import("html2canvas")
      .then((mod) => {
        const html2canvas = mod.default || mod;
        return html2canvas(intro, {
          backgroundColor: "#0a0514",
          scale: dpr,
          useCORS: true,
          logging: false,
          foreignObjectRendering: false,
        });
      })
      .then((shot) => {
        uploadParticles(shot);
        captured = true;
        capturing = false;
        sticky.classList.add("is-curtain-on");
        draw();
      })
      .catch((err) => {
        console.warn("[ai-curtain] html2canvas", err);
        capturing = false;
      });
  }

  function draw() {
    const p = progress();
    const on = p > 0.0001 && p < 0.999;
    if (on && !captured && !capturing) captureCloth();
    if (!on) {
      captured = false;
      capturing = false;
      particleCount = 0;
      sticky.classList.remove("is-curtain-on");
      view.style.display = "none";
      return;
    }
    if (!captured || particleCount < 1) return;

    view.style.display = "block";
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    gl.useProgram(prog);
    gl.uniform1f(U.uP, ease);
    gl.uniform1f(U.uTime, (performance.now() - t0) / 1000);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.drawArrays(gl.POINTS, 0, particleCount);
    vctx.clearRect(0, 0, view.width, view.height);
    vctx.drawImage(glc, 0, 0, view.width, view.height);
  }

  const prev = window.__updateAiScroll;
  function onAiScroll() {
    if (typeof prev === "function") prev();
    draw();
  }
  window.__updateAiScroll = onAiScroll;
  window.addEventListener("scroll", draw, { passive: true });
  window.addEventListener("resize", draw);
  draw();

  return function dispose() {
    window.removeEventListener("scroll", draw);
    window.removeEventListener("resize", draw);
    window.removeEventListener("resize", resize);
    if (window.__updateAiScroll === onAiScroll) {
      window.__updateAiScroll = prev;
    }
    sticky.classList.remove("is-curtain-on");
    view.remove();
    delete sticky.dataset.curtainMounted;
  };
}

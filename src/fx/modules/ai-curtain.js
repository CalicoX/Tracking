/**
 * AI intro → work 区过渡：WebGL 窗帘拉开（Park：AI 字母遮罩退役）。
 * 同一滚动区间（AI_HOLD_VH 之后的 AI_ZOOM_VH）：双幕叶从中心向两侧拉开，
 * 帘面织物褶皱/高光走 fragment shader（无贴图）；拉到底整层淡出，露出 work 区。
 * 可见层是 2D canvas blit（与 coverage-globe 同因：页面合成对 WebGL 层不可靠）。
 */
import { clamp, prefersReducedMotion } from "../utils.js";

const VERT = `
attribute vec2 aP;
varying vec2 vUv;
void main(){ vUv = aP * 0.5 + 0.5; gl_Position = vec4(aP, 0.0, 1.0); }
`;

/** 双幕叶：leafL/leafR 各占半屏向两侧位移；cloth 褶皱 = sin 波 + 倒角高光。
 * p: 0 全闭 → 1 全开；alpha 随 p>0.72 渐隐。 */
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uP;      // open progress 0..1
uniform float uAspect; // width/height
uniform vec3  uBase;   // curtain base color
uniform vec3  uHi;     // fold highlight color

float fold(vec2 uv, float leafShift) {
  // vertical folds compressed as the leaf opens (fabric bunches)
  float scale = mix(9.0, 16.0, uP);
  float x = (uv.x - leafShift) * uAspect * scale;
  float wave = sin(x) * 0.5 + sin(x * 2.17 + 1.3) * 0.22 + sin(x * 4.3 + 0.6) * 0.1;
  // shading: strong on fold slopes
  return wave;
}

void main(){
  float halfW = 0.5;
  float open = uP * halfW; // leaf shift in uv units
  // left leaf: x in [0, .5]; right leaf: [.5, 1]
  float isR = step(0.5, vUv.x);
  // sample coordinate of this leaf in "closed" space
  float u = mix(vUv.x + open, vUv.x - open, isR);
  // off-leaf area (opened gap) → transparent
  float inLeaf = step(0.0, u) * step(u, halfW) * (1.0 - step(halfW, vUv.x))
               + step(halfW, vUv.x) * step(u, 1.0) * step(halfW, u);
  // wait-free approach: compute mask directly
  float leafMask = 0.0;
  if (isR < 0.5) { leafMask = step(0.0, u); }
  else { leafMask = 1.0 - step(1.0, u); }

  vec2 luv = vec2(clamp(u, 0.0, 1.0), vUv.y);
  float w = fold(luv, isR < 0.5 ? 0.0 : 1.0);
  // base shading with folds; vertical light falloff (stage top-light)
  float shade = 0.86 + 0.14 * w;
  vec3 col = uBase * shade;
  // fold highlights
  float hi = smoothstep(0.35, 0.9, w);
  col += uHi * hi * 0.22;
  // subtle sweep toward the gap edge (silk sheen)
  float edge = isR < 0.5 ? smoothstep(0.5, 0.0, luv.x) : smoothstep(0.5, 1.0, luv.x);
  col += uHi * edge * 0.12;
  // top/bottom vignette
  col *= 0.92 + 0.08 * smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);

  // whole-layer dissolve at the tail of the pull
  float alpha = leafMask * (1.0 - smoothstep(0.72, 1.0, uP));
  // leading edge soft 1px
  alpha *= smoothstep(-0.002, 0.002, isR < 0.5 ? (vUv.x - open + 0.001) : (open + 0.5 - vUv.x + 0.001));
  gl_FragColor = vec4(col, alpha);
}
`;

export function mount() {
  const track =
    document.getElementById("ai-lab-intro-track") ||
    document.getElementById("ai-letter-track");
  const sticky = document.getElementById("ai-letter-sticky");
  if (!track || !sticky) return () => {};
  if (sticky.dataset.curtainMounted) return () => {};
  sticky.dataset.curtainMounted = "1";

  if (prefersReducedMotion()) {
    // 直接可读：无窗帘
    return function dispose() {
      delete sticky.dataset.curtainMounted;
    };
  }

  // —— 可见 2D canvas（blit），GL 离屏 ——
  const view = document.createElement("canvas");
  view.id = "ai-curtain-view";
  view.style.cssText =
    "position:fixed;inset:0;width:100vw;height:100vh;z-index:210;pointer-events:none;display:none;";
  document.body.appendChild(view);
  const vctx = view.getContext("2d");

  let gl = null;
  let renderer = null;
  try {
    renderer = document.createElement("canvas");
    const glc = renderer.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!glc) throw new Error("no webgl");
    gl = glc;
    renderer.width = 2;
    renderer.height = 2;
    renderer.style.cssText = "position:absolute;left:-99999px;top:0;";
    document.body.appendChild(renderer);
  } catch (err) {
    console.warn("[ai-curtain] webgl unavailable", err);
    view.remove();
    return () => {};
  }

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s) || "shader");
    }
    return s;
  }
  let prog = null;
  const U = {};
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aP");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const name of ["uP", "uAspect", "uBase", "uHi"]) {
      U[name] = gl.getUniformLocation(prog, name);
    }
  } catch (err) {
    console.warn("[ai-curtain] shader", err);
    view.remove();
    renderer.remove();
    return () => {};
  }

  let W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = Math.round(window.innerWidth * dpr);
    H = Math.round(window.innerHeight * dpr);
    if (view.width !== W || view.height !== H) {
      view.width = W;
      view.height = H;
    }
    gl.canvas.width = W;
    gl.canvas.height = H;
    gl.viewport(0, 0, W, H);
    gl.useProgram(prog);
    gl.uniform1f(U.uAspect, window.innerWidth / Math.max(1, window.innerHeight));
  }
  resize();
  window.addEventListener("resize", resize);

  // —— 进度：与退役的 ai-letter-zoom 完全同一滚动映射 ——
  const AI_HOLD_VH = 0.36;

  function progress() {
    const vh = window.innerHeight;
    const r = track.getBoundingClientRect();
    const travel = Math.max(1, r.height - vh);
    const scrolled = clamp(-r.top, 0, travel);
    const holdPx = Math.min(vh * AI_HOLD_VH, travel * 0.42);
    const zoomPx = Math.min(vh * 0.48, travel * 0.4);
    return clamp((scrolled - holdPx) / Math.max(zoomPx, 1), 0, 1);
  }

  function draw() {
    const p = progress();
    const on = p > 0.001 && p < 0.999;
    view.style.display = on ? "block" : "none";
    if (!on) return;
    gl.useProgram(prog);
    gl.uniform1f(U.uP, p);
    // 深紫帘面（配 AI intro 底色 #0a0514），高光淡紫
    gl.uniform3f(U.uBase, 0.055, 0.035, 0.10);
    gl.uniform3f(U.uHi, 0.62, 0.45, 0.95);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    vctx.clearRect(0, 0, view.width, view.height);
    vctx.drawImage(gl.canvas, 0, 0, view.width, view.height);
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
    view.remove();
    renderer.remove();
    delete sticky.dataset.curtainMounted;
  };
}

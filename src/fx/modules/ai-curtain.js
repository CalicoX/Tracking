/**
 * AI intro → 案例：滚动粒子消散（Park：去掉布料；反向 canvasui particle-scroll）。
 * 案例原版：线下是沙，往下滚再聚回去。这里反过来——intro 先完整，往下滚打成沙粒散开，露出底下案例。
 * html2canvas 抓当前 intro；藏真 DOM；粒子用四边形（不用 gl.POINTS，IAB/合成不可靠）。
 */
import { clamp, prefersReducedMotion } from "../utils.js";

const AI_HOLD_VH = 0.36;

const VS = `
attribute vec2 aUv;
attribute vec4 aCol;
attribute float aH;
attribute vec2 aCorner;
uniform float uP;
uniform float uTime;
uniform vec2 uGrain;
varying vec4 vCol;
void main(){
  vec2 home = vec2(aUv.x * 2.0 - 1.0, (1.0 - aUv.y) * 2.0 - 1.0);
  float delay = aH * 0.45;
  float local = clamp((uP - delay * 0.35) / 0.78, 0.0, 1.0);
  local = local * local * (3.0 - 2.0 * local);
  vec2 scatter = vec2((aH * 2.0 - 1.0) * 1.25, 0.55 + aH * 1.7);
  float swirl = sin(uTime * 1.1 + aH * 6.2832) * 0.16 * local;
  float drift = sin(uTime * 1.6 + aH * 11.0) * 0.05 * local;
  vec2 pos = home + scatter * local + vec2(swirl + drift, drift * 0.7);
  float fade = mix(1.0, 0.0, clamp((local - 0.42) / 0.58, 0.0, 1.0));
  float sz = mix(1.0, 0.55, local);
  pos += aCorner * uGrain * sz;
  vCol = vec4(aCol.rgb, aCol.a * fade);
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

const FS = `
precision mediump float;
varying vec4 vCol;
void main(){
  gl_FragColor = vCol;
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

  function clearMountFlag() {
    delete sticky.dataset.curtainMounted;
  }

  if (prefersReducedMotion()) {
    return function dispose() {
      clearMountFlag();
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
    clearMountFlag();
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
    clearMountFlag();
    return () => {};
  }
  for (const name of ["uP", "uTime", "uGrain"]) U[name] = gl.getUniformLocation(prog, name);

  const buf = gl.createBuffer();
  let vertCount = 0;
  const STRIDE = 9 * 4;

  function bindAttribs() {
    const locUv = gl.getAttribLocation(prog, "aUv");
    const locCol = gl.getAttribLocation(prog, "aCol");
    const locH = gl.getAttribLocation(prog, "aH");
    const locC = gl.getAttribLocation(prog, "aCorner");
    gl.enableVertexAttribArray(locUv);
    gl.vertexAttribPointer(locUv, 2, gl.FLOAT, false, STRIDE, 0);
    gl.enableVertexAttribArray(locCol);
    gl.vertexAttribPointer(locCol, 4, gl.FLOAT, false, STRIDE, 8);
    gl.enableVertexAttribArray(locH);
    gl.vertexAttribPointer(locH, 1, gl.FLOAT, false, STRIDE, 24);
    gl.enableVertexAttribArray(locC);
    gl.vertexAttribPointer(locC, 2, gl.FLOAT, false, STRIDE, 28);
  }

  function uploadParticles(shot) {
    const sctx = shot.getContext("2d", { willReadFrequently: true });
    const W = shot.width;
    const H = shot.height;
    const img = sctx.getImageData(0, 0, W, H).data;
    const step = Math.max(3, Math.round(Math.min(W, H) / 160));
    const list = [];
    const corners = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, -1],
      [1, 1],
      [-1, 1],
    ];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const i = (y * W + x) * 4;
        const a = img[i + 3];
        if (a < 18) continue;
        const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
        const u = x / W;
        const v = y / H;
        const r = img[i] / 255;
        const g = img[i + 1] / 255;
        const b = img[i + 2] / 255;
        const al = a / 255;
        for (const [cx, cy] of corners) {
          list.push(u, v, r, g, b, al, hash, cx, cy);
        }
      }
    }
    vertCount = list.length / 9;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(list), gl.STATIC_DRAW);
    bindAttribs();
  }

  let captured = false;
  let capturing = false;
  let raf = 0;
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
    return {
      p: clamp((scrolled - holdPx) / Math.max(zoomPx, 1), 0, 1),
      pinned: scrolled > 8,
    };
  }

  function captureCloth() {
    if (capturing || captured) return;
    capturing = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    import("html2canvas")
      .then((mod) => {
        const html2canvas = mod.default || mod;
        return html2canvas(intro, {
          backgroundColor: "#0a0514",
          scale: dpr,
          useCORS: true,
          logging: false,
          foreignObjectRendering: false,
          onclone(doc) {
            doc.querySelectorAll("#ai-lab-intro, #ai-lab-intro *").forEach((el) => {
              el.style.filter = "none";
              el.style.backdropFilter = "none";
              el.style.webkitBackdropFilter = "none";
            });
          },
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

  function stopRaf() {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  function draw() {
    const { p, pinned } = progress();
    if (pinned && !captured && !capturing) captureCloth();
    const on = captured && p > 0.0001 && p < 0.999;
    if (!on) {
      if (!pinned) {
        captured = false;
        capturing = false;
        vertCount = 0;
        sticky.classList.remove("is-curtain-on");
      }
      view.style.display = "none";
      if (p >= 0.999) {
        sticky.classList.add("is-curtain-on");
        view.style.display = "none";
      }
      if (p <= 0.0001 || p >= 0.999) stopRaf();
      else if (captured && !raf) raf = requestAnimationFrame(loop);
      return;
    }

    view.style.display = "block";
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    bindAttribs();
    gl.uniform1f(U.uP, ease);
    gl.uniform1f(U.uTime, (performance.now() - t0) / 1000);
    gl.uniform2f(U.uGrain, 0.012, 0.012 * (window.innerWidth / Math.max(1, window.innerHeight)));
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertCount);
    vctx.clearRect(0, 0, view.width, view.height);
    vctx.drawImage(glc, 0, 0, view.width, view.height);
    if (!raf) raf = requestAnimationFrame(loop);
  }

  function loop() {
    raf = 0;
    draw();
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
    stopRaf();
    window.removeEventListener("scroll", draw);
    window.removeEventListener("resize", draw);
    window.removeEventListener("resize", resize);
    if (window.__updateAiScroll === onAiScroll) {
      window.__updateAiScroll = prev;
    }
    sticky.classList.remove("is-curtain-on");
    view.remove();
    clearMountFlag();
  };
}

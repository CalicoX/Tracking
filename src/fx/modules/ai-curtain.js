/**
 * AI intro → 案例：滚动粒子消散（Park：去掉布料；反向 canvasui particle-scroll）。
 * 原版 https://canvasui.dev/docs/components/particle-scroll ：线下是沙，往下滚再聚回去。
 * 这里反过来——intro 先完整，往下滚打成沙粒向上散开，露出底下案例。
 *
 * 算法照原版：HTML 抓成一张纹理；拼好的格子走全屏 textured quad（真字形，不是渐变色块）；
 * 未拼好的格子走实例化四边形沙粒（不用 gl.POINTS，IAB/合成不可靠），片元按 home 采样纹理。
 * 捕获：优先 html-in-canvas drawElementImage；否则 html2canvas，并把 background-clip:text 拍成实色字。
 */
import { clamp, prefersReducedMotion, shouldReduceFx } from "../utils.js";

const AI_HOLD_VH = 0.36;

const CFG = {
  density: 2,
  size: 1.25,
  spread: 220,
  gravity: -0.45,
  drift: 0.7,
  swirl: 60,
  stagger: 0.7,
  fade: 0.85,
  smoothing: 0.6,
};

const HASH = `
float hash (vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}`;

const QUAD_VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main () {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const BASE_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uContent;
uniform vec2 uRes;
uniform float uDensity;
uniform float uStagger;
uniform float uP;
${HASH}
void main () {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;
  vec2 cell = floor(px / max(uDensity, 1.0));
  float d = hash(cell) * uStagger;
  float local = clamp((uP - d) / max(1.0 - d, 1e-3), 0.0, 1.0);
  float t = 1.0 - local;
  float vis = 1.0 - smoothstep(0.0, 0.12, local);
  vec4 tex = textureLod(uContent, vec2(vUv.x, 1.0 - vUv.y), 0.0);
  outColor = vec4(tex.rgb, vis * tex.a);
}`;

const POINT_VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
uniform sampler2D uContent;
uniform vec2 uRes;
uniform vec2 uGrid;
uniform float uDensity;
uniform float uStagger;
uniform float uSpread;
uniform float uGravity;
uniform float uDrift;
uniform float uSwirl;
uniform float uTime;
uniform float uFade;
uniform float uSize;
uniform float uP;
uniform float uLag;
out vec2 vCenter;
out vec2 vCorner;
out float vSize;
out float vAlpha;
out float vLod;
out float vMerge;
${HASH}
void main () {
  float fid = float(gl_InstanceID);
  vec2 cell = vec2(mod(fid, uGrid.x), floor(fid / uGrid.x));
  float h1 = hash(cell);
  float h2 = hash(cell + vec2(1.7, 9.1));
  float h3 = hash(cell + vec2(5.5, 2.9));
  float h4 = hash(cell + vec2(8.4, 4.2));
  float d = h1 * uStagger;
  float local = clamp((uP - d) / max(1.0 - d, 1e-3), 0.0, 1.0);
  float t = 1.0 - local;
  float e = 1.0 - pow(1.0 - t, 3.0);
  vec2 home = vec2(
    (cell.x + 0.5) * uDensity,
    (cell.y + 0.5) * uDensity
  );
  vec2 homeUv = clamp(home / uRes, 0.0, 1.0);
  float srcA = textureLod(uContent, homeUv, 0.0).a;
  float vis = (1.0 - step(0.97, t))
    * step(0.02, srcA)
    * step(home.x, uRes.x)
    * step(home.y, uRes.y)
    * (1.0 - step(0.999, local));
  if (vis < 0.5) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    vCenter = vec2(0.0);
    vCorner = aCorner;
    vSize = 0.0;
    vAlpha = 0.0;
    vLod = 0.0;
    vMerge = 0.0;
    return;
  }
  vec2 dir = normalize(vec2(h2 - 0.5, h3 - 0.5) + vec2(1e-4, 0.0));
  float reach = 0.08 + 0.92 * pow(h4, 2.4);
  vec2 off = dir * uSpread * reach;
  off.y += uGravity * uSpread * (0.25 + 0.75 * h4);
  vec2 scat = home + off;
  vec2 pos = mix(scat, home, e);
  vec2 perp = vec2(-dir.y, dir.x);
  pos += perp * (h2 - 0.5) * 2.0 * uSwirl * sin(e * 3.14159);
  float tt = uTime * uDrift;
  float amp = (1.0 - e) * (uSpread * 0.05 + 2.5);
  pos += vec2(
    sin(tt * (4.0 + 5.0 * h2) + h3 * 40.0),
    cos(tt * (3.5 + 5.5 * h3) + h2 * 40.0)
  ) * amp;
  pos.y += uLag * (1.0 - e) * (0.5 + 0.5 * h4);
  pos += vec2(h4 - 0.5, h1 - 0.5) * uDensity * 3.0
    * (1.0 - smoothstep(0.5, 0.85, t));
  float grow = smoothstep(0.55, 1.0, e);
  float sizeCss = mix(uSize, uDensity * 1.3, grow);
  vCenter = home;
  vCorner = aCorner;
  vSize = sizeCss;
  vAlpha = mix(uFade, 1.0, e) * (1.0 - smoothstep(0.72, 1.0, local));
  vLod = (1.0 - e) * 1.5;
  vMerge = smoothstep(0.75, 0.97, t);
  vec2 p = pos + aCorner * 0.5 * sizeCss;
  gl_Position = vec4(
    p.x / uRes.x * 2.0 - 1.0,
    1.0 - p.y / uRes.y * 2.0,
    0.0,
    1.0
  );
}`;

const POINT_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uContent;
uniform vec2 uRes;
in vec2 vCenter;
in vec2 vCorner;
in float vSize;
in float vAlpha;
in float vLod;
in float vMerge;
out vec4 outColor;
void main () {
  vec2 o = vCorner * 0.5;
  vec2 uv = clamp((vCenter + o * vSize) / uRes, 0.0, 1.0);
  vec4 tex = textureLod(uContent, uv, vLod);
  float circle = 1.0 - smoothstep(0.25, 0.5, length(o));
  float mask = mix(circle, 1.0, vMerge);
  float a = vAlpha * mask * tex.a;
  if (a < 0.01) discard;
  outColor = vec4(tex.rgb, a);
}`;

const TITLE_FILLS = ["#f5f3ff", "#e9d5ff", "#c4b5fd", "#a78bfa", "#c026d3", "#e879f9"];

const HIDE_SEL =
  ".ai-intro-bg, .ai-intro-streams, .ai-intro-dots, .ai-intro-veil, .ai-title-particles, .ai-letter-cut, canvas.ai-title-particles";

function flattenClipText(doc) {
  const set = (el, prop, val) => el.style.setProperty(prop, val, "important");
  doc.querySelectorAll("#ai-intro-title .ai-word").forEach((el, i) => {
    const c = TITLE_FILLS[Math.min(i, TITLE_FILLS.length - 1)];
    set(el, "background-image", "none");
    set(el, "background", "none");
    set(el, "-webkit-background-clip", "border-box");
    set(el, "background-clip", "border-box");
    set(el, "-webkit-text-fill-color", c);
    set(el, "color", c);
    set(el, "filter", "none");
    set(el, "opacity", "1");
  });
  doc.querySelectorAll(".ai-orb-type-text, .ai-intro-eyebrow, .ai-intro-eyebrow *").forEach((el) => {
    set(el, "background-image", "none");
    set(el, "background", "none");
    set(el, "-webkit-background-clip", "border-box");
    set(el, "background-clip", "border-box");
    set(el, "-webkit-text-fill-color", "#ede9fe");
    set(el, "color", "#ede9fe");
  });
  const win = doc.defaultView;
  if (!win) return;
  doc.querySelectorAll("#ai-lab-intro *").forEach((el) => {
    const clip = `${win.getComputedStyle(el).webkitBackgroundClip || ""} ${
      win.getComputedStyle(el).backgroundClip || ""
    }`.toLowerCase();
    if (!clip.includes("text")) return;
    set(el, "background-image", "none");
    set(el, "background", "none");
    set(el, "-webkit-background-clip", "border-box");
    set(el, "background-clip", "border-box");
    set(el, "-webkit-text-fill-color", "#ede9fe");
    set(el, "color", "#ede9fe");
  });
}

function captureWithDrawElement(el) {
  const c = document.createElement("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = Math.max(1, Math.round(el.offsetWidth));
  const h = Math.max(1, Math.round(el.offsetHeight));
  c.width = Math.round(w * dpr);
  c.height = Math.round(h * dpr);
  const ctx = c.getContext("2d");
  if (!ctx || typeof ctx.drawElementImage !== "function") return null;
  try {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawElementImage(el, 0, 0);
    return c;
  } catch {
    return null;
  }
}

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

  if (prefersReducedMotion() || shouldReduceFx()) {
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

  const glc = document.createElement("canvas");
  const gl = glc.getContext("webgl2", {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
  });
  if (!gl || gl.isContextLost()) {
    console.warn("[ai-curtain] webgl2 unavailable");
    view.remove();
    clearMountFlag();
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

  function link(vertText, fragText) {
    const vert = compile(gl.VERTEX_SHADER, vertText);
    const frag = compile(gl.FRAGMENT_SHADER, fragText);
    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "link");
    }
    const uniforms = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }
    return { program, vert, frag, uniforms };
  }

  let base;
  let points;
  try {
    base = link(QUAD_VERT, BASE_FRAG);
    points = link(POINT_VERT, POINT_FRAG);
  } catch (err) {
    console.warn("[ai-curtain] shader", err);
    view.remove();
    clearMountFlag();
    return () => {};
  }

  const quadVao = gl.createVertexArray();
  gl.bindVertexArray(quadVao);
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const contentTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, contentTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0])
  );

  let captured = false;
  let capturing = false;
  let raf = 0;
  let time = 0;
  let lastTime = performance.now();
  let lag = 0;
  let lastScrolled = 0;
  let pSmooth = 0;
  const t0 = performance.now();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const W = Math.round(window.innerWidth * dpr);
    const H = Math.round(window.innerHeight * dpr);
    if (view.width !== W) view.width = W;
    if (view.height !== H) view.height = H;
    if (glc.width !== W) glc.width = W;
    if (glc.height !== H) glc.height = H;
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
      scrolled,
    };
  }

  function punchOpaqueBlack(shot) {
    try {
      const ctx = shot.getContext("2d", { willReadFrequently: true });
      if (!ctx) return shot;
      const img = ctx.getImageData(0, 0, shot.width, shot.height);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 220 && d[i] + d[i + 1] + d[i + 2] < 36) d[i + 3] = 0;
      }
      ctx.putImageData(img, 0, 0);
    } catch {
      /* tainted / no 2d — keep original */
    }
    return shot;
  }

  function uploadContent(shot) {
    punchOpaqueBlack(shot);
    gl.bindTexture(gl.TEXTURE_2D, contentTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, shot);
    gl.generateMipmap(gl.TEXTURE_2D);
    captured = true;
    capturing = false;
  }

  function captureCloth() {
    if (capturing || captured) return;
    const title = intro.querySelector("#ai-intro-title");
    if (title && !title.classList.contains("is-words-in")) return;
    capturing = true;

    const native = captureWithDrawElement(intro);
    if (native) {
      uploadContent(native);
      draw();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    import("html2canvas")
      .then((mod) => {
        const html2canvas = mod.default || mod;
        return html2canvas(intro, {
          backgroundColor: null,
          scale: dpr,
          useCORS: true,
          logging: false,
          foreignObjectRendering: false,
          ignoreElements(el) {
            if (!el || !el.classList) return false;
            return (
              el.classList.contains("ai-intro-bg") ||
              el.classList.contains("ai-intro-streams") ||
              el.classList.contains("ai-intro-dots") ||
              el.classList.contains("ai-intro-veil") ||
              el.classList.contains("ai-title-particles") ||
              el.classList.contains("ai-letter-cut")
            );
          },
          onclone(doc) {
            const root = doc.getElementById("ai-lab-intro");
            if (root) {
              root.style.setProperty("background", "transparent", "important");
              root.style.setProperty("background-image", "none", "important");
            }
            doc.querySelectorAll(HIDE_SEL).forEach((el) => {
              el.style.display = "none";
            });
            /* transform/filter 会让 html2canvas 按 1x 栅格化再放大 → 标题马赛克 */
            doc.querySelectorAll("#ai-lab-intro, #ai-lab-intro *").forEach((el) => {
              el.style.setProperty("filter", "none", "important");
              el.style.setProperty("backdrop-filter", "none", "important");
              el.style.setProperty("-webkit-backdrop-filter", "none", "important");
              el.style.setProperty("transform", "none", "important");
              el.style.setProperty("will-change", "auto", "important");
              el.style.setProperty("opacity", "1", "important");
            });
            const h2 = doc.getElementById("ai-intro-title");
            if (h2) {
              h2.classList.add("is-words-in");
              h2.classList.remove("is-shine");
            }
            doc.querySelectorAll(".ai-reveal").forEach((el) => el.classList.add("is-in"));
            flattenClipText(doc);
          },
        });
      })
      .then((shot) => {
        uploadContent(shot);
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

  function densityFor(w, h) {
    return Math.max(Math.max(CFG.density, 1), Math.sqrt((w * h) / 800000));
  }

  function render(p, dt, scrolled) {
    const w = Math.max(window.innerWidth, 1);
    const h = Math.max(window.innerHeight, 1);
    const density = densityFor(w, h);
    const gridX = Math.ceil(w / density);
    const gridY = Math.ceil(h / density) + 2;
    const stagger = Math.min(Math.max(CFG.stagger, 0), 0.95);

    lag += scrolled - lastScrolled;
    lastScrolled = scrolled;
    lag *= Math.exp(-dt / 0.22);
    lag = Math.min(Math.max(lag, -400), 400);
    if (Math.abs(lag) < 0.1) lag = 0;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, glc.width, glc.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, contentTexture);
    gl.bindVertexArray(quadVao);

    gl.useProgram(base.program);
    gl.uniform1i(base.uniforms.uContent, 0);
    gl.uniform2f(base.uniforms.uRes, w, h);
    gl.uniform1f(base.uniforms.uDensity, density);
    gl.uniform1f(base.uniforms.uStagger, stagger);
    gl.uniform1f(base.uniforms.uP, p);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (p < 0.999) {
      gl.useProgram(points.program);
      gl.uniform1i(points.uniforms.uContent, 0);
      gl.uniform2f(points.uniforms.uRes, w, h);
      gl.uniform2f(points.uniforms.uGrid, gridX, gridY);
      gl.uniform1f(points.uniforms.uDensity, density);
      gl.uniform1f(points.uniforms.uStagger, stagger);
      gl.uniform1f(points.uniforms.uSpread, Math.max(CFG.spread, 0));
      gl.uniform1f(points.uniforms.uGravity, Math.min(Math.max(CFG.gravity, -1), 1));
      gl.uniform1f(points.uniforms.uDrift, Math.max(CFG.drift, 0));
      gl.uniform1f(points.uniforms.uSwirl, Math.max(CFG.swirl, 0));
      gl.uniform1f(points.uniforms.uTime, time);
      gl.uniform1f(points.uniforms.uFade, Math.min(Math.max(CFG.fade, 0), 1));
      gl.uniform1f(points.uniforms.uSize, Math.max(CFG.size, 0.5));
      gl.uniform1f(points.uniforms.uP, p);
      gl.uniform1f(points.uniforms.uLag, lag);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, gridX * gridY);
    }

    vctx.clearRect(0, 0, view.width, view.height);
    vctx.drawImage(glc, 0, 0, view.width, view.height);
  }

  function draw() {
    const { p, pinned, scrolled } = progress();
    if (pinned && !captured && !capturing) captureCloth();

    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 1 / 30);
    lastTime = now;
    time = (now - t0) / 1000;

    const tau = CFG.smoothing;
    const k = tau <= 0 ? 1 : 1 - Math.exp(-dt / Math.max(tau, 1e-4));
    pSmooth += (p - pSmooth) * k;
    if (Math.abs(p - pSmooth) < 0.0005) pSmooth = p;

    const scattering = pSmooth > 0.0001;
    sticky.classList.toggle("is-curtain-on", captured && scattering);
    const on = captured && scattering && pSmooth < 0.999;

    if (!on) {
      view.style.display = "none";
      if (!pinned && !scattering) {
        captured = false;
        capturing = false;
      }
      stopRaf();
      return;
    }

    view.style.display = "block";
    render(pSmooth, dt, scrolled);
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
    gl.deleteTexture(contentTexture);
    gl.deleteProgram(base.program);
    gl.deleteProgram(points.program);
    gl.deleteShader(base.vert);
    gl.deleteShader(base.frag);
    gl.deleteShader(points.vert);
    gl.deleteShader(points.frag);
    gl.deleteBuffer(quad);
    gl.deleteVertexArray(quadVao);
    view.remove();
    clearMountFlag();
  };
}

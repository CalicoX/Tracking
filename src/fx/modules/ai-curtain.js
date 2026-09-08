/**
 * AI intro 整屏一块布（Park：WebGL 布幕，滚动掀开，露出下面 AI 案例）。
 * - 离屏 canvas 把 intro 画面绘制成纹理，整屏一块布（单 quad 网格）；
 * - 滚动 scrub：布整体向上掀走（顶边先行、底边拖尾），带波动扭曲 + 褶皱明暗；
 * - p 0→0.06 布淡入接管（画面与真页一致，无缝交棒，sticky 加 is-curtain-on 藏真文案），
 *   0.85→1 布整体淡出；p=0/1 时层隐藏。倒滚可倒放。
 * - 可见层 2D blit（本站页面合成对 WebGL 层不可靠，同 coverage-globe）。
 * 布只盖 topbar 以下区域。
 */
import { clamp, prefersReducedMotion } from "../utils.js";

const AI_HOLD_VH = 0.36;

/* —— 布面纹理：把 intro 画成一张静态像 —— */
function buildIntroTexture(W, H, titleFs, leadFs) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  const bg = x.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0b0616");
  bg.addColorStop(0.5, "#0e0919");
  bg.addColorStop(1, "#0a0514");
  x.fillStyle = bg;
  x.fillRect(0, 0, W, H);
  x.strokeStyle = "rgba(167,139,250,0.16)";
  x.lineWidth = Math.max(1, H * 0.0016);
  for (let i = 0; i < 4; i++) {
    const y0 = H * (0.12 + i * 0.24);
    x.beginPath();
    x.moveTo(-40, y0);
    x.bezierCurveTo(W * 0.25, y0 - H * 0.05, W * 0.5, y0 + H * 0.05, W * 0.75, y0 - H * 0.02);
    x.bezierCurveTo(W * 0.9, y0 - H * 0.05, W + 40, y0 + H * 0.01, W + 40, y0);
    x.stroke();
  }
  const cx = W / 2;
  const cy = H / 2;
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.font = `700 ${titleFs}px Inter, system-ui, sans-serif`;
  const grad = x.createLinearGradient(cx - W * 0.34, 0, cx + W * 0.34, 0);
  grad.addColorStop(0, "#f8f7ff");
  grad.addColorStop(0.45, "#c9b2ff");
  grad.addColorStop(0.75, "#b76ef2");
  grad.addColorStop(1, "#e879f9");
  x.fillStyle = grad;
  x.fillText("Tracking Is Getting Smarter. So", cx, cy - titleFs * 0.62);
  x.fillText("is the Customer Journey.", cx, cy + titleFs * 0.62);
  x.font = `400 ${leadFs}px Inter, system-ui, sans-serif`;
  x.fillStyle = "rgba(226, 222, 245, 0.86)";
  [
    "AI brings smarter prediction, personalization, and engagement to the post-",
    "purchase journey — from delivery estimates and intelligent tracking",
    "experiences to opportunities that drive repeat purchase.",
  ].forEach((t, i) => x.fillText(t, cx, cy + titleFs * 1.75 + leadFs * 1.6 * i));
  return c;
}

const VS = `
attribute vec2 aP;            // x,y ∈ [0,1] 平面参数（0,0=左下）
uniform float uLift;          // 掀开进度 0..1（NDC 上移量，顶边先行）
uniform float uAspect;
varying vec2 vUv;
varying float vRip;
void main(){
  vUv = aP;
  // 顶边先行：v 越大抬得越快 → 布面倾斜掀走；底边拖尾
  float lead = 0.35 + 1.05 * aP.y;              // 底 0.35 → 顶 1.4
  float y = aP.y * 2.0 - 1.0 + uLift * lead * 2.3;
  // 掀动扭曲：横波（相位随进度推移）+ 微斜
  float rip = sin(aP.y * 9.0 + uLift * 14.0) * cos(aP.x * 5.0 - uLift * 6.0);
  float x = aP.x * 2.0 - 1.0 + rip * 0.045 * uLift + uLift * 0.06;
  vRip = rip;
  gl_Position = vec4(x, y, 0.0, 1.0);
}`;

const FS = `
precision highp float;
varying vec2 vUv;
varying float vRip;
uniform sampler2D uTex;
uniform float uAlpha;
void main(){
  vec3 col = texture2D(uTex, vec2(clamp(vUv.x,0.0,1.0), clamp(vUv.y,0.0,1.0))).rgb;
  // 布褶：波谷压暗、波峰提亮 + 掀开方向（上）渐暗
  float fold = 0.86 + 0.16 * vRip;
  col *= fold;
  col *= 1.0 - vUv.y * 0.22;
  gl_FragColor = vec4(col, uAlpha);
}`;

export function mount() {
  const track =
    document.getElementById("ai-lab-intro-track") ||
    document.getElementById("ai-letter-track");
  const sticky = document.getElementById("ai-letter-sticky");
  if (!track || !sticky) return () => {};
  if (sticky.dataset.curtainMounted) return () => {};
  sticky.dataset.curtainMounted = "1";

  if (prefersReducedMotion()) {
    return function dispose() {
      delete sticky.dataset.curtainMounted;
    };
  }

  const vw0 = window.innerWidth;
  const vh0 = window.innerHeight;

  // —— 可见 2D canvas：topbar 以下全屏 ——
  const view = document.createElement("canvas");
  view.id = "ai-curtain-view";
  view.style.cssText =
    "position:fixed;left:0;right:0;top:var(--topbar-h,64px);bottom:0;width:100vw;height:calc(100vh - var(--topbar-h,64px));z-index:180;pointer-events:none;display:none;";
  document.body.appendChild(view);
  const vctx = view.getContext("2d");

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

  const COLS = 40, ROWS = 30;
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

  // 整屏布网格
  const verts = [];
  const idx = [];
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      verts.push(c / COLS, r / ROWS);
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const a = r * (COLS + 1) + c;
      idx.push(a, a + 1, a + COLS + 1, a + 1, a + COLS + 2, a + COLS + 1);
    }
  }
  const vbuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  const ibuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
  const aP = gl.getAttribLocation(prog, "aP");
  gl.enableVertexAttribArray(aP);
  gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);

  // 纹理
  const dprT = Math.min(window.devicePixelRatio || 1, 2);
  const texCanvas = buildIntroTexture(
    Math.round(vw0 * dprT),
    Math.round(vh0 * dprT),
    56 * dprT,
    18 * dprT,
  );
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  for (const name of ["uLift", "uAspect", "uAlpha", "uTex"]) {
    U[name] = gl.getUniformLocation(prog, name);
  }
  gl.uniform1i(U.uTex, 0);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const W = Math.round(window.innerWidth * dpr);
    const H = Math.round((window.innerHeight - 64) * dpr);
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

  function draw() {
    const p = progress();
    const on = p > 0.0001 && p < 0.999;
    view.style.display = on ? "block" : "none";
    // 交棒：布接管后藏真文案（class 驱动，避免与 ai-lab 的 inline 淡出打架）
    sticky.classList.toggle("is-curtain-on", p > 0.0001);
    if (!on) return;

    // 掀开缓动：前段慢（接管可读），后段加速离场
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const lift = ease * 0.62; // 顶边总上移 ≈0.62*2.3 ≈ 1.43 NDC → 完全离场
    const alpha = clamp(p / 0.06, 0, 1) * (1 - clamp((p - 0.85) / 0.15, 0, 1));

    gl.useProgram(prog);
    gl.uniform1f(U.uLift, lift);
    gl.uniform1f(U.uAlpha, alpha);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
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

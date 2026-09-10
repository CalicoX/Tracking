import {
  hookLenisWhenReady,
  isMobileLayout,
  prefersReducedMotion,
  shouldReduceFx,
  shouldRunContinuousFx,
} from "../utils.js";
import { createIntroFlowGl } from "./ai-intro-flow-gl.js";
import { sampleIntroFlow } from "./ai-intro-flow-sample.js";

export { sampleIntroFlow } from "./ai-intro-flow-sample.js";

/** Same pin-hold as ai-lab / retired curtain — settle, then exit. */
export const AI_HOLD_VH = 0.36;
/** Scroll window that dissolves the intro so `.ai-lab-work` leaks through. */
export const AI_EXIT_VH = 0.48;

const FIELD_W = 256;
const FIELD_H = 144;
const MATRIX_GLYPHS = "+++■□#+█▓▒#";
const MATRIX_ROWS = 42;
const MATRIX_COLS = 88;
const CELL_W = 13;
const CELL_H = 17;
const FONT_PX = 12;
const EMPTY_PCT = 50;
const SLIDE_RADIUS = 260;
const SLIDE_PUSH = 48;
const SLIDE_DRAG = 5.2;

function smoothstep(a, b, t) {
  const x = Math.max(0, Math.min(1, (t - a) / Math.max(b - a, 1e-6)));
  return x * x * (3 - 2 * x);
}

function exitProgress(track) {
  const vh = window.innerHeight || 1;
  const total = Math.max(track.offsetHeight - vh, 1);
  const scrolled = Math.max(
    0,
    Math.min(-track.getBoundingClientRect().top, total)
  );
  const holdPx = Math.min(vh * AI_HOLD_VH, total * 0.42);
  const exitPx = Math.min(vh * AI_EXIT_VH, total * 0.4);
  if (scrolled <= holdPx) return 0;
  return Math.max(0, Math.min((scrolled - holdPx) / Math.max(exitPx, 1), 1));
}

/**
 * Own WebGL Synthesis port on the AI intro. 2D sampleIntroFlow if GL fails.
 * Intro CSS background stays opaque (#08071a).
 */
export function mount() {
  const track =
    document.getElementById("ai-lab-intro-track") ||
    document.getElementById("ai-letter-track");
  const sticky = document.getElementById("ai-letter-sticky");
  const intro = document.getElementById("ai-lab-intro");
  const host = document.getElementById("ai-intro-ascii");
  if (!track || !sticky || !intro || !host) return () => {};
  if (sticky.dataset.fxAscii) return () => {};
  sticky.dataset.fxAscii = "1";

  let raf = 0;
  let running = false;
  let visible = false;
  let p = 0;
  let drawnOut = false;
  let cssW = 0;
  let cssH = 0;
  let ctx = null;
  let canvas = null;
  let glApi = null;
  let lastDraw = 0;
  let reduceCanvas = shouldReduceFx() || prefersReducedMotion();
  const field = document.createElement("canvas");
  field.width = FIELD_W;
  field.height = FIELD_H;
  const fieldCtx = field.getContext("2d", { willReadFrequently: true });
  const fieldImg = fieldCtx ? fieldCtx.createImageData(FIELD_W, FIELD_H) : null;
  const matrix = document.getElementById("ai-intro-matrix");
  const matrixA = matrix && matrix.querySelector(".ai-intro-matrix-a");
  const matrixB = matrix && matrix.querySelector(".ai-intro-matrix-b");
  let matrixFilled = false;
  let matrixKey = "";
  let matrixFx = null;
  let ptrTx = 0;
  let ptrTy = 0;
  let ptrMx = 0;
  let ptrMy = 0;
  let ptrVx = 0;
  let ptrVy = 0;
  let ptrInf = 0;
  let ptrHover = false;

  function makeMatrix(seed, rows, cols) {
    const rr = rows || MATRIX_ROWS;
    const cc = cols || MATRIX_COLS;
    let out = "";
    let s = seed | 0;
    for (let r = 0; r < rr; r++) {
      for (let c = 0; c < cc; c++) {
        s = (Math.imul(s, 1664525) + 1013904223) | 0;
        if ((s >>> 0) % 100 < EMPTY_PCT) out += " ";
        else out += MATRIX_GLYPHS[(Math.abs(s) + r * 17 + c * 31) % MATRIX_GLYPHS.length];
      }
      out += "\n";
    }
    return out;
  }

  function fillMatrix() {
    if (!matrixA || !matrixB || isMobileLayout()) return;
    const rect = sticky.getBoundingClientRect();
    const w = Math.max(1, rect.width || window.innerWidth || 1);
    const h = Math.max(1, rect.height || window.innerHeight || 1);
    const cols = Math.max(MATRIX_COLS, Math.ceil(w / CELL_W) + 8);
    const rows = Math.max(MATRIX_ROWS, Math.ceil((h * 2.15) / CELL_H) + 4);
    const key = cols + "x" + rows;
    if (matrixFilled && matrixKey === key) return;
    const a = makeMatrix(42, rows, cols);
    const b = makeMatrix(917, rows, cols);
    matrixA.textContent = a + a;
    matrixB.textContent = b + b;
    matrixFilled = true;
    matrixKey = key;
  }

  function clearMatrix() {
    if (!matrixFilled) return;
    if (matrixA) matrixA.textContent = "";
    if (matrixB) matrixB.textContent = "";
    matrixFilled = false;
    matrixKey = "";
  }

  function glyphIndex(col, row, seed) {
    let s = Math.imul(col + seed, 1664525) + Math.imul(row + 17, 1013904223);
    s = s | 0;
    if ((s >>> 0) % 100 < EMPTY_PCT) return -1;
    return (Math.abs(s) + row * 17 + col * 31) % MATRIX_GLYPHS.length;
  }

  function makeAtlas(color, dpr) {
    const n = MATRIX_GLYPHS.length;
    const cw = Math.max(1, Math.ceil(CELL_W * dpr));
    const ch = Math.max(1, Math.ceil(CELL_H * dpr));
    const sheet = document.createElement("canvas");
    sheet.width = cw * n;
    sheet.height = ch;
    const g = sheet.getContext("2d");
    if (!g) return null;
    g.font =
      "500 " +
      Math.round(FONT_PX * dpr) +
      'px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = color;
    for (let i = 0; i < n; i++) {
      g.fillText(MATRIX_GLYPHS[i], (i + 0.5) * cw, ch * 0.56);
    }
    return { sheet, cw, ch };
  }

  function destroyMatrixFx() {
    if (!matrixFx) return;
    if (matrixFx.canvas && matrixFx.canvas.parentNode) {
      matrixFx.canvas.parentNode.removeChild(matrixFx.canvas);
    }
    if (matrix) matrix.classList.remove("is-live");
    matrixFx = null;
  }

  function ensureMatrixFx() {
    if (matrixFx) return matrixFx;
    if (!matrix || reduceCanvas) return null;
    const c = document.createElement("canvas");
    c.className = "ai-intro-matrix-fx";
    c.setAttribute("aria-hidden", "true");
    matrix.appendChild(c);
    const c2 = c.getContext("2d", { alpha: true });
    if (!c2) {
      if (c.parentNode) c.parentNode.removeChild(c);
      return null;
    }
    matrixFx = {
      canvas: c,
      ctx: c2,
      atlasA: null,
      atlasB: null,
      cssW: 0,
      cssH: 0,
      dpr: 1,
    };
    matrix.classList.add("is-live");
    return matrixFx;
  }

  function resizeMatrix() {
    const fx = ensureMatrixFx();
    if (!fx) return;
    const rect = sticky.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (w === fx.cssW && h === fx.cssH && fx.dpr === dpr && fx.atlasA) return;
    fx.cssW = w;
    fx.cssH = h;
    fx.dpr = dpr;
    fx.canvas.width = Math.round(w * dpr);
    fx.canvas.height = Math.round(h * dpr);
    fx.canvas.style.width = w + "px";
    fx.canvas.style.height = h + "px";
    fx.atlasA = makeAtlas("rgb(118,112,148)", dpr);
    fx.atlasB = makeAtlas("rgb(78,86,108)", dpr);
    if (!ptrHover && ptrInf < 0.01) {
      ptrTx = w * 0.5;
      ptrTy = h * 0.5;
      ptrMx = ptrTx;
      ptrMy = ptrTy;
    }
  }

  function drawMatrixLayer(fx, atlas, seed, driftPx, alpha) {
    if (!atlas) return;
    const ctx = fx.ctx;
    const w = fx.cssW;
    const h = fx.cssH;
    const cols = Math.ceil(w / CELL_W) + 3;
    const rows = Math.ceil(h / CELL_H) + 3;
    const rowShift = Math.floor(driftPx / CELL_H);
    const yOff = driftPx - rowShift * CELL_H;
    const mx = ptrMx;
    const my = ptrMy;
    const vx = ptrVx;
    const vy = ptrVy;
    const inf = ptrInf;
    const r2 = SLIDE_RADIUS * SLIDE_RADIUS;
    for (let r = -1; r < rows; r++) {
      const y0 = r * CELL_H - yOff;
      const row = r + rowShift;
      for (let c = -1; c < cols; c++) {
        const gi = glyphIndex(c, row, seed);
        if (gi < 0) continue;
        const x0 = c * CELL_W;
        let ox = 0;
        let oy = 0;
        let lit = alpha;
        if (inf > 0.01) {
          const dx = x0 - mx;
          const dy = y0 - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            const d = Math.sqrt(d2) || 1;
            const fall = 1 - d / SLIDE_RADIUS;
            const f = fall * fall * inf;
            ox = (dx / d) * SLIDE_PUSH * f + vx * SLIDE_DRAG * f;
            oy = (dy / d) * SLIDE_PUSH * f + vy * SLIDE_DRAG * f;
            lit = alpha * (1 + 0.35 * f);
          }
        }
        ctx.globalAlpha = lit;
        ctx.drawImage(
          atlas.sheet,
          gi * atlas.cw,
          0,
          atlas.cw,
          atlas.ch,
          (x0 + ox) * fx.dpr,
          (y0 + oy) * fx.dpr,
          atlas.cw,
          atlas.ch
        );
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawMatrix(now) {
    if (reduceCanvas || p >= 0.995) return;
    const fx = matrixFx;
    if (!fx || !fx.ctx || !fx.cssW) return;
    const lerp = ptrHover ? 0.22 : 0.12;
    const pmx = ptrMx;
    const pmy = ptrMy;
    ptrMx += (ptrTx - ptrMx) * lerp;
    ptrMy += (ptrTy - ptrMy) * lerp;
    ptrVx = ptrVx * 0.8 + (ptrMx - pmx);
    ptrVy = ptrVy * 0.8 + (ptrMy - pmy);
    const vlen = Math.hypot(ptrVx, ptrVy);
    if (vlen > 48) {
      ptrVx *= 48 / vlen;
      ptrVy *= 48 / vlen;
    }
    ptrInf += ((ptrHover ? 1 : 0) - ptrInf) * (ptrHover ? 0.2 : 0.08);
    if (ptrInf < 0.002 && !ptrHover) ptrInf = 0;
    fx.ctx.setTransform(1, 0, 0, 1, 0, 0);
    fx.ctx.clearRect(0, 0, fx.canvas.width, fx.canvas.height);
    fx.ctx.imageSmoothingEnabled = false;
    const t = now || 0;
    drawMatrixLayer(fx, fx.atlasA, 42, (t * 0.014) % (CELL_H * 64), 1);
    drawMatrixLayer(fx, fx.atlasB, 917, -((t * 0.009) % (CELL_H * 64)), 0.42);
  }

  function onPointerMove(e) {
    if (reduceCanvas || isMobileLayout()) return;
    const rect = sticky.getBoundingClientRect();
    ptrTx = e.clientX - rect.left;
    ptrTy = e.clientY - rect.top;
    ptrHover = true;
    if (visible && !running) startLoop();
  }

  function onPointerLeave() {
    ptrHover = false;
  }

  function applyExit(progress) {
    const copy = 1 - smoothstep(0.0, 0.36, progress);
    const rest = 1 - smoothstep(0.48, 1, progress);
    intro.style.setProperty("--ascii-copy", copy.toFixed(3));
    intro.style.setProperty("--intro-rest-op", rest.toFixed(3));
    sticky.classList.toggle("is-ascii-on", !reduceCanvas);
    sticky.classList.toggle("is-ascii-out", progress >= 0.98);
  }

  function ensureCanvas() {
    if (canvas) return canvas;
    if (host.tagName === "CANVAS") canvas = host;
    else {
      canvas = host.querySelector("canvas") || document.createElement("canvas");
      canvas.className = "ai-intro-flow";
      canvas.setAttribute("aria-hidden", "true");
      if (!canvas.parentNode) host.appendChild(canvas);
    }
    return canvas;
  }

  function resizeFallback() {
    if (!canvas || !ctx) return;
    const rect = sticky.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    if (w === cssW && h === cssH && canvas.width === Math.round(w * dpr)) return;
    cssW = w;
    cssH = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawnOut = false;
    draw(typeof performance !== "undefined" ? performance.now() : 0);
  }

  function drawFallback(now) {
    if (!ctx || !cssW || !fieldCtx || !fieldImg) return;
    if (p >= 0.995) {
      ctx.clearRect(0, 0, cssW, cssH);
      drawnOut = true;
      return;
    }
    const t = (now || 0) * 0.001;
    const data = fieldImg.data;
    const fade = 1 - p * 0.35;
    const viewport = { x: cssW, y: cssH };
    for (let y = 0; y < FIELD_H; y++) {
      for (let x = 0; x < FIELD_W; x++) {
        const uv = { x: (x + 0.5) / FIELD_W, y: 1 - (y + 0.5) / FIELD_H };
        const grainUv = {
          x: (x * cssW) / FIELD_W,
          y: (y * cssH) / FIELD_H,
        };
        const rgb = sampleIntroFlow(uv, t, grainUv, viewport);
        const i = (y * FIELD_W + x) * 4;
        data[i] = (rgb[0] * 255 * fade) | 0;
        data[i + 1] = (rgb[1] * 255 * fade) | 0;
        data[i + 2] = (rgb[2] * 255 * fade) | 0;
        data[i + 3] = 255;
      }
    }
    fieldCtx.putImageData(fieldImg, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(field, 0, 0, cssW, cssH);
    drawnOut = false;
  }

  function draw(now) {
    const fade = Math.max(0, 1 - p * 0.35);
    if (p >= 0.995) {
      if (ctx && cssW) ctx.clearRect(0, 0, cssW, cssH);
      if (matrixFx && matrixFx.ctx) {
        matrixFx.ctx.clearRect(0, 0, matrixFx.canvas.width, matrixFx.canvas.height);
      }
      drawnOut = true;
      return;
    }
    if (glApi) {
      glApi.resize();
      glApi.draw(now, fade);
      drawnOut = false;
    } else {
      drawFallback(now);
    }
    drawMatrix(now);
  }

  function loop(now) {
    raf = 0;
    if (!running) return;
    const live = shouldRunContinuousFx({
      sectionVisible: visible,
      documentHidden: typeof document !== "undefined" && document.hidden,
    });
    if (!live || reduceCanvas) {
      running = false;
      return;
    }
    if (p >= 0.995 && drawnOut) {
      running = false;
      return;
    }
    var minDt = ptrHover || ptrInf > 0.02 ? 16 : 32;
    if (lastDraw && now - lastDraw < minDt) {
      raf = requestAnimationFrame(loop);
      return;
    }
    lastDraw = now;
    draw(now);
    raf = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (reduceCanvas || !visible) return;
    if (typeof document !== "undefined" && document.hidden) return;
    if (!glApi && !ctx && !matrixFx) return;
    running = true;
    if (!raf) raf = requestAnimationFrame(loop);
  }

  function stopLoop() {
    running = false;
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  function startGl() {
    ensureCanvas();
    try {
      glApi = createIntroFlowGl(canvas, sticky);
    } catch (e) {
      glApi = null;
    }
    if (glApi) {
      sticky.classList.add("is-ascii-on");
      return true;
    }
    return false;
  }

  function startFallback() {
    if (reduceCanvas) return;
    ensureCanvas();
    ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    sticky.classList.add("is-ascii-on");
    resizeFallback();
  }

  function startVisual() {
    if (reduceCanvas) return;
    if (!glApi && !ctx) {
      if (!startGl()) startFallback();
    }
    resizeMatrix();
    startLoop();
  }

  function onScroll() {
    if (isMobileLayout()) {
      p = 0;
      sticky.classList.remove("is-ascii-on", "is-ascii-out");
      intro.style.removeProperty("--ascii-copy");
      intro.style.removeProperty("--intro-rest-op");
      return;
    }
    p = exitProgress(track);
    applyExit(p);
    if (reduceCanvas) return;
    if (p < 0.995) drawnOut = false;
    if (visible && !document.hidden) startLoop();
  }

  function syncCanvasMode() {
    reduceCanvas = shouldReduceFx() || prefersReducedMotion() || isMobileLayout();
    if (reduceCanvas) {
      stopLoop();
      destroyMatrixFx();
      sticky.classList.remove("is-ascii-on");
      host.style.display = "none";
      if (isMobileLayout()) clearMatrix();
      else fillMatrix();
      onScroll();
      return;
    }
    host.style.display = "";
    fillMatrix();
    startVisual();
    onScroll();
  }

  const unLenis = hookLenisWhenReady(onScroll);
  const io =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              visible = e.isIntersecting;
              if (visible) {
                drawnOut = false;
                onScroll();
                startLoop();
              } else {
                stopLoop();
              }
            });
          },
          { threshold: 0.02, rootMargin: "40px" }
        );
  if (io) io.observe(sticky);
  else {
    visible = true;
    startLoop();
  }

  function onVis() {
    if (document.hidden) stopLoop();
    else if (visible) {
      drawnOut = false;
      startLoop();
    }
  }
  document.addEventListener("visibilitychange", onVis);
  intro.addEventListener("pointermove", onPointerMove, { passive: true });
  intro.addEventListener("pointerleave", onPointerLeave, { passive: true });

  const mq640 = window.matchMedia("(max-width: 640px)");
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onBp = () => syncCanvasMode();
  if (mq640.addEventListener) {
    mq640.addEventListener("change", onBp);
    mqReduce.addEventListener("change", onBp);
  } else if (mq640.addListener) {
    mq640.addListener(onBp);
    mqReduce.addListener(onBp);
  }

  let ro = null;
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => {
      if (reduceCanvas) return;
      if (glApi) glApi.resize();
      else resizeFallback();
      resizeMatrix();
      fillMatrix();
      drawnOut = false;
      if (!running) draw(performance.now());
    });
    ro.observe(sticky);
  } else {
    window.addEventListener("resize", onBp);
  }

  syncCanvasMode();
  onScroll();

  return function dispose() {
    stopLoop();
    unLenis();
    if (io) io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    intro.removeEventListener("pointermove", onPointerMove);
    intro.removeEventListener("pointerleave", onPointerLeave);
    destroyMatrixFx();
    if (mq640.removeEventListener) {
      mq640.removeEventListener("change", onBp);
      mqReduce.removeEventListener("change", onBp);
    } else if (mq640.removeListener) {
      mq640.removeListener(onBp);
      mqReduce.removeListener(onBp);
    }
    if (ro) ro.disconnect();
    else window.removeEventListener("resize", onBp);
    if (glApi) glApi.dispose();
    clearMatrix();
    sticky.classList.remove("is-ascii-on", "is-ascii-out");
    intro.style.removeProperty("--ascii-copy");
    intro.style.removeProperty("--intro-rest-op");
    delete sticky.dataset.fxAscii;
  };
}

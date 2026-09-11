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

/* ——— AI 二字粒子水印：滚入汇聚、滚出散开 ———
   离屏画 "AI" 取样落点，2D 圆点粒子。不要再画 ASCII 方块/加号。 */
const GLYPH_CELL_MIN = 1.9;
const GLYPH_CELL_MAX = 2.4;
const GLYPH_PARTICLE_CAP = 16000;
const GLYPH_MORPH_TEXT = "Tracking Page";
const GLYPH_TARGET_VH = 0.8;
const GLYPH_LIGHT_COLORS = ["#4a3d96", "#5b4bb0"];
const GLYPH_MID_COLORS = ["#6d5bd0", "#7c6bd6"];
const GLYPH_HEAVY_COLORS = ["#8b5cf6", "#a78bfa"];
const GLYPH_BAND_W = 0.13;
const GLYPH_BAND_SPEED = 0.16;
/* 不要描边提亮，全身同一档 */
const GLYPH_DOT_ALPHA = 0.2;
const GLYPH_BAND_ALPHA = 0.08;
/* Park：扰动再加大 */
const GLYPH_DRIFT = 5.4;
const GLYPH_FLICKER = 0.28;

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function glyphCellSize(w) {
  return Math.min(GLYPH_CELL_MAX, Math.max(GLYPH_CELL_MIN, w / 720));
}

function sampleInkPoints(pctx, boxW, boxH, cell, viewW, viewH) {
  let img = null;
  try {
    img = pctx.getImageData(0, 0, boxW, boxH);
  } catch (e) {
    return [];
  }
  const mask = img.data;
  let x0 = boxW;
  let y0 = boxH;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < boxH; y++) {
    for (let x = 0; x < boxW; x++) {
      if (mask[(y * boxW + x) * 4 + 3] > 60) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return [];
  const inkW = x1 - x0 + 1;
  const inkH = y1 - y0 + 1;
  const cols = Math.max(1, Math.floor(inkW / cell));
  const rows = Math.max(1, Math.floor(inkH / cell));
  const originX = (viewW - cols * cell) / 2;
  const originY = (viewH - rows * cell) / 2;
  const pts = [];
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const px = x0 + Math.round((cx + 0.5) * cell);
      const py = y0 + Math.round((cy + 0.5) * cell);
      if (px >= boxW || py >= boxH) continue;
      if (mask[(py * boxW + px) * 4 + 3] <= 60) continue;
      pts.push({
        x: originX + (cx + 0.5) * cell,
        y: originY + (cy + 0.5) * cell,
        col: cx,
        ny: rows > 1 ? cy / (rows - 1) : 0.5,
      });
    }
  }
  return pts;
}

function sortPts(pts) {
  return pts.slice().sort((a, b) => a.x - b.x || a.y - b.y);
}

function resamplePts(pts, n) {
  if (!pts.length) {
    const empty = [];
    for (let i = 0; i < n; i++) empty.push({ x: 0, y: 0, col: i, ny: 0.5 });
    return empty;
  }
  const s = sortPts(pts);
  if (s.length === n) return s;
  const out = [];
  const last = s.length - 1;
  for (let i = 0; i < n; i++) {
    const t = ((i + 0.5) / n) * s.length;
    const i0 = Math.min(last, t | 0);
    out.push(s[i0]);
  }
  return out;
}

function drawTrackingPage(ctx, boxW, boxH) {
  const lines = ["Tracking", "Page"];
  let fs = boxH * 0.4;
  const font = (size) =>
    `800 ${size}px Inter, "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 12; i++) {
    ctx.font = font(fs);
    const tw = Math.max(
      ctx.measureText(lines[0]).width,
      ctx.measureText(lines[1]).width
    );
    if (tw <= boxW * 0.94 || fs < 28) break;
    fs *= 0.92;
  }
  const lh = fs * 1.08;
  ctx.fillText(lines[0], boxW / 2, boxH / 2 - lh * 0.5);
  ctx.fillText(lines[1], boxW / 2, boxH / 2 + lh * 0.5);
}

/** 板状衬线 I：上下横板 + 中竖，不靠 Inter 那根细棍。 */
function drawSlabI(ctx, cx, top, bot) {
  const h = Math.max(1, bot - top);
  const stem = h * 0.18;
  const slabW = h * 0.74;
  const slabH = h * 0.155;
  ctx.fillRect(cx - slabW / 2, top, slabW, slabH);
  ctx.fillRect(cx - slabW / 2, bot - slabH, slabW, slabH);
  ctx.fillRect(cx - stem / 2, top, stem, h);
}

/** 和 I 同款板状衬线 A：平顶横板、粗腿、横档、底脚横板。 */
function drawSlabA(ctx, cx, top, bot) {
  const h = Math.max(1, bot - top);
  const w = h * 0.96;
  const t = h * 0.175;
  const slabH = h * 0.155;
  const left = cx - w / 2;
  const right = cx + w / 2;
  const topSlabW = w * 0.4;
  const topL = cx - topSlabW / 2;
  const topR = cx + topSlabW / 2;
  ctx.fillRect(topL, top, topSlabW, slabH);
  ctx.beginPath();
  ctx.moveTo(topL, top);
  ctx.lineTo(topL + t, top);
  ctx.lineTo(left + t * 1.32, bot);
  ctx.lineTo(left, bot);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(topR - t, top);
  ctx.lineTo(topR, top);
  ctx.lineTo(right, bot);
  ctx.lineTo(right - t * 1.32, bot);
  ctx.closePath();
  ctx.fill();
  const u = 0.56;
  const barY = top + h * u;
  const lIn = topL + t + (left + t * 1.32 - (topL + t)) * u;
  const rIn = topR - t + (right - t * 1.32 - (topR - t)) * u;
  ctx.fillRect(lIn, barY, Math.max(t, rIn - lIn), t);
  ctx.fillRect(left - w * 0.04, bot - slabH, w * 0.38, slabH);
  ctx.fillRect(right - w * 0.34, bot - slabH, w * 0.38, slabH);
}

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
  let glyphCanvas = null;
  let glyphCtx = null;
  let glyphCells = null;
  let glyphCell = 11;
  let glyphW = 0;
  let glyphH = 0;
  let glyphSizeKey = "";
  let glyphC = 0;
  let glyphEnter = 0;
  let glyphMorph = 0;

  function applyExit(progress) {
    const copy = 1 - smoothstep(0.68, 1, progress);
    const rest = 1 - smoothstep(0.82, 1, progress);
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

  function ensureGlyphCanvas() {
    if (glyphCanvas) return glyphCanvas;
    const bg = host.parentNode;
    if (!bg) return null;
    glyphCanvas = document.createElement("canvas");
    glyphCanvas.className = "ai-intro-aiglyph";
    glyphCanvas.setAttribute("aria-hidden", "true");
    bg.appendChild(glyphCanvas);
    glyphCtx = glyphCanvas.getContext("2d");
    return glyphCanvas;
  }

  /** AI 与 Tracking Page 两套落点配对，滚动时变形。 */
  function buildGlyphField() {
    if (!sticky) return;
    const rect = sticky.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const cell = glyphCellSize(w);
    const key = w + "x" + h + "x" + cell;
    if (key === glyphSizeKey) return;
    glyphSizeKey = key;
    glyphW = w;
    glyphH = h;
    glyphCell = cell;

    const pairRatio = 0.96 + 0.32 + 0.74;
    const capH = Math.max(
      48,
      Math.min(h * GLYPH_TARGET_VH, (w * 0.98) / pairRatio)
    );
    const aiW = Math.max(8, Math.ceil(capH * pairRatio + cell * 8));
    const aiH = Math.max(8, Math.ceil(capH * 1.12));
    const aiProbe = document.createElement("canvas");
    aiProbe.width = aiW;
    aiProbe.height = aiH;
    const aiCtx = aiProbe.getContext("2d");
    if (!aiCtx) return;
    aiCtx.fillStyle = "#fff";
    const aW = capH * 0.96;
    const slabW = capH * 0.74;
    const gap = capH * 0.32;
    const pairW = aW + gap + slabW;
    const left = (aiW - pairW) / 2;
    const top = (aiH - capH) / 2;
    const bot = top + capH;
    drawSlabA(aiCtx, left + aW / 2, top, bot);
    drawSlabI(aiCtx, left + aW + gap + slabW / 2, top, bot);
    const aiPts = sampleInkPoints(aiCtx, aiW, aiH, cell, w, h);

    const wordW = Math.max(8, w);
    const wordH = Math.max(8, Math.round(h * 0.82));
    const wordProbe = document.createElement("canvas");
    wordProbe.width = wordW;
    wordProbe.height = wordH;
    const wordCtx = wordProbe.getContext("2d");
    if (!wordCtx) return;
    drawTrackingPage(wordCtx, wordW, wordH);
    const wordPts = sampleInkPoints(wordCtx, wordW, wordH, cell, w, h);

    const n = Math.min(
      GLYPH_PARTICLE_CAP,
      Math.max(aiPts.length, wordPts.length, 1)
    );
    const from = resamplePts(aiPts, n);
    const to = resamplePts(wordPts, n);
    const diag = Math.sqrt(w * w + h * h);
    const cells = [];
    for (let i = 0; i < n; i++) {
      const a = from[i];
      const b = to[i];
      const ang = Math.atan2(a.y - h / 2, a.x - w / 2) + (Math.random() - 0.5) * 0.9;
      const dist = (0.22 + Math.random() * 0.8) * diag;
      cells.push({
        x0: a.x,
        y0: a.y,
        x1: b.x,
        y1: b.y,
        ox: Math.cos(ang) * dist,
        oy: Math.sin(ang) * dist,
        col: a.col,
        ny: a.ny,
        r: Math.random(),
        base: 0.22 + Math.random() * 0.06,
        d: Math.random() * 0.38,
      });
    }
    glyphCells = cells;
  }

  function sizeGlyphCanvas() {
    if (!glyphCanvas || !glyphCtx || !glyphW || !glyphH) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const pw = Math.round(glyphW * dpr);
    const ph = Math.round(glyphH * dpr);
    if (glyphCanvas.width === pw && glyphCanvas.height === ph) return;
    glyphCanvas.width = pw;
    glyphCanvas.height = ph;
    glyphCanvas.style.width = glyphW + "px";
    glyphCanvas.style.height = glyphH + "px";
    glyphCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* 粒子：圆点 + 亮带，滚动只管归位/散开。 */
  function drawGlyph(now) {
    if (!glyphCtx || !glyphCells || !glyphCells.length) return;
    const g = glyphCtx;
    const tt = (now || 0) * 0.001;
    g.clearRect(0, 0, glyphW, glyphH);
    if (glyphC <= 0.004) return;
    for (let i = 0; i < glyphCells.length; i++) {
      const c = glyphCells[i];
      const s = smoothstep(c.d, c.d + 0.6, glyphC);
      if (s <= 0.008) continue;
      let d = c.ny - ((tt * GLYPH_BAND_SPEED + c.col * 0.055) % 1);
      d -= Math.round(d);
      const near = 1 - Math.min(1, Math.abs(d) / GLYPH_BAND_W);
      const flow = near * near;
      const lvl = Math.min(1, c.base * 2.4 + flow * 0.9);
      const heavy = lvl > 0.6;
      const mid = !heavy && lvl > 0.32;
      const palette = heavy
        ? GLYPH_HEAVY_COLORS
        : mid
          ? GLYPH_MID_COLORS
          : GLYPH_LIGHT_COLORS;
      const ph = c.r * 6.283;
      const jx =
        (Math.sin(tt * 1.7 + ph) * 1.05 + Math.sin(tt * 0.63 + ph * 2.1) * 0.82) *
        glyphCell *
        GLYPH_DRIFT;
      const jy =
        (Math.cos(tt * 1.33 + ph * 1.7) * 1.0 + Math.sin(tt * 0.91 + ph * 1.2) * 0.72) *
        glyphCell *
        GLYPH_DRIFT;
      const flick = 1 - GLYPH_FLICKER * (0.5 + 0.5 * Math.sin(tt * 2.3 + ph * 3));
      const alpha = GLYPH_DOT_ALPHA + flow * GLYPH_BAND_ALPHA;
      const mx = glyphMorph;
      const gx = c.x0 + (c.x1 - c.x0) * mx;
      const gy = c.y0 + (c.y1 - c.y0) * mx;
      const x = gx + c.ox * (1 - s) + jx * s;
      const y = gy + c.oy * (1 - s) + jy * s;
      const rad = 0.95 + flow * 0.12;
      g.fillStyle = palette[(c.r * palette.length) | 0];
      g.globalAlpha = Math.min(1, alpha * flick * s);
      g.beginPath();
      g.arc(x, y, rad, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
  }

  /** 滚入汇聚（enter 0→1），滚出散开（exit 1→0）。 */
  function glyphProgress() {
    return glyphEnter * (1 - exitProgress(track));
  }

  function startGlyph() {
    if (reduceCanvas) return;
    if (!ensureGlyphCanvas() || !glyphCtx) return;
    buildGlyphField();
    sizeGlyphCanvas();
  }

  function draw(now) {
    drawGlyph(now);
    const fade = Math.max(0, 1 - p * 0.35);
    if (p >= 0.995) {
      if (ctx && cssW) ctx.clearRect(0, 0, cssW, cssH);
      drawnOut = true;
      return;
    }
    if (glApi) {
      glApi.resize();
      glApi.draw(now, fade);
      drawnOut = false;
      return;
    }
    drawFallback(now);
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
    if (p >= 0.995 && drawnOut && glyphC <= 0.004) {
      running = false;
      return;
    }
    var minDt = 32;
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
    if (!glApi && !ctx) return;
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
    startGlyph();
    if (glApi || ctx) {
      startLoop();
      return;
    }
    if (!startGl()) startFallback();
    startLoop();
  }

  function onScroll() {
    if (isMobileLayout()) {
      p = 0;
      sticky.classList.remove("is-ascii-on", "is-ascii-out");
      intro.style.removeProperty("--ascii-copy");
      intro.style.removeProperty("--intro-rest-op");
      intro.style.removeProperty("--intro-tilt");
      intro.style.removeProperty("--pblur");
      intro.style.removeProperty("--ai-blur");
      return;
    }
    p = exitProgress(track);
    applyExit(p);
    const vh = window.innerHeight || 1;
    const top = track.getBoundingClientRect().top;
    glyphEnter = clamp01(1 - top / vh);
    /* 入场清晰度只由「离钉住位多远」决定：hold 段必须停在 1（全清晰），
       退出段（exitProgress）再由 applyExit / 散开逻辑接管（Park 09-11 报过钉住位 pblur=1）。 */
    glyphC = glyphEnter;
    const holdPx = vh * AI_HOLD_VH;
    const holdU = top >= 0 ? 0 : Math.min(1, -top / Math.max(holdPx, 1));
    glyphMorph = smoothstep(0.06, 0.9, holdU);
    if (reduceCanvas) return;
    if (p < 0.995) drawnOut = false;
    if (visible && !document.hidden) startLoop();
  }

  function syncCanvasMode() {
    reduceCanvas = shouldReduceFx() || prefersReducedMotion() || isMobileLayout();
    if (reduceCanvas) {
      stopLoop();
      sticky.classList.remove("is-ascii-on");
      host.style.display = "none";
      if (glyphCanvas) glyphCanvas.style.display = "none";
      onScroll();
      return;
    }
    host.style.display = "";
    if (glyphCanvas) glyphCanvas.style.display = "";
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
      buildGlyphField();
      sizeGlyphCanvas();
      drawnOut = false;
      if (!running) draw(performance.now());
    });
    ro.observe(sticky);
  } else {
    window.addEventListener("resize", onBp);
  }

  syncCanvasMode();
  onScroll();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      glyphSizeKey = "";
      if (!reduceCanvas) {
        buildGlyphField();
        sizeGlyphCanvas();
      }
    });
  }

  return function dispose() {
    stopLoop();
    unLenis();
    if (io) io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
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
    if (glyphCanvas && glyphCanvas.parentNode) {
      glyphCanvas.parentNode.removeChild(glyphCanvas);
    }
    glyphCanvas = null;
    glyphCtx = null;
    glyphCells = null;
    glyphSizeKey = "";
    sticky.classList.remove("is-ascii-on", "is-ascii-out");
    intro.style.removeProperty("--ascii-copy");
    intro.style.removeProperty("--intro-rest-op");
    delete sticky.dataset.fxAscii;
  };
}

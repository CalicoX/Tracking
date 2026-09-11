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

/* ——— AI 二字的 ASCII 轮廓水印：滚入汇聚、滚出散开 ———
   面积收着做（约视宽 40% 上限 520），压在 veil 之上、文案之下。
   纯 2D fillText，格子由离屏 "AI" 字形的像素 alpha 反解，描边格密、内部格稀。 */
const GLYPH_CELL_MIN = 9;
const GLYPH_CELL_MAX = 13;
const GLYPH_TARGET_VW = 0.72;
const GLYPH_TARGET_MAX = 880;
const GLYPH_TARGET_VH = 1;
/* 字符按亮度分三档（Park：ascii 样式要更丰富），档内还随时间换字 */
const GLYPH_LIGHT_CHARS = ["·", ".", ":", ";", "+", "-", "'"];
const GLYPH_MID_CHARS = ["+", "=", "o", "x", "%", "░", "▒", "v", "n"];
const GLYPH_HEAVY_CHARS = ["█", "▓", "▌", "▐", "▀", "▄", "#", "8", "X", "@", "&", "W", "M"];
/* 紫罗兰实体（Park 09-11：不要和背景反差）：底子按字符档位给透明度，亮带扫过提亮 */
const GLYPH_LIGHT_COLORS = ["#5b4bb0", "#6d5bd0"];
const GLYPH_MID_COLORS = ["#7c6bd6", "#8b5cf6"];
const GLYPH_HEAVY_COLORS = ["#a78bfa", "#c4b5fd", "#e9d5ff", "#e879f9"];
const GLYPH_BAND_W = 0.13;
const GLYPH_BAND_SPEED = 0.16;
const GLYPH_CHAR_MORPH = 1.6;
const GLYPH_ALPHA_BASE = 0.05;
const GLYPH_ALPHA_GAIN = 0.2;
/* 字形描边单独一档：描边亮、内部暗，AI 才「明显」（Park 09-11「不够明显」） */
const GLYPH_EDGE_ALPHA_BASE = 0.32;
const GLYPH_EDGE_ALPHA_GAIN = 0.16;
/* 汇聚完成后的残余扰动：每格绕落点小幅摆动 + 亮度微闪（Park：汇聚后还要有扰动感） */
const GLYPH_DRIFT = 0.3;
const GLYPH_FLICKER = 0.14;

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function glyphCellSize(w) {
  return Math.round(Math.min(GLYPH_CELL_MAX, Math.max(GLYPH_CELL_MIN, w / 120)));
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

  /** 把 "AI" 光栅化成格点：描边格用密字符、内部格用稀字符，各带一个向外的散开位移。 */
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

    const targetW = Math.min(w * GLYPH_TARGET_VW, GLYPH_TARGET_MAX, h * GLYPH_TARGET_VH);
    const font = (size) =>
      `700 ${size}px Inter, "Helvetica Neue", Arial, sans-serif`;
    const probe = document.createElement("canvas");
    probe.width = 8;
    probe.height = 8;
    let pctx = probe.getContext("2d");
    if (!pctx) return;
    const baseFs = 100;
    pctx.font = font(baseFs);
    const unit = pctx.measureText("AI").width / baseFs || 1.1;
    const fs = Math.max(20, targetW / unit);
    const boxW = Math.max(8, Math.ceil(targetW) + cell * 3);
    const boxH = Math.max(8, Math.ceil(fs * 1.5));
    probe.width = boxW;
    probe.height = boxH;
    pctx = probe.getContext("2d");
    if (!pctx) return;
    pctx.font = font(fs);
    pctx.fillStyle = "#fff";
    pctx.textAlign = "center";
    pctx.textBaseline = "middle";
    pctx.fillText("AI", boxW / 2, boxH / 2);

    let img = null;
    try {
      img = pctx.getImageData(0, 0, boxW, boxH);
    } catch (e) {
      img = null;
    }
    if (!img) return;
    const mask = img.data;

    /* canvas 的 middle 基线不等于字形视觉中心，必须扫出墨迹包围盒再据此居中 */
    let inkX0 = boxW;
    let inkY0 = boxH;
    let inkX1 = -1;
    let inkY1 = -1;
    for (let y = 0; y < boxH; y++) {
      for (let x = 0; x < boxW; x++) {
        if (mask[(y * boxW + x) * 4 + 3] > 60) {
          if (x < inkX0) inkX0 = x;
          if (x > inkX1) inkX1 = x;
          if (y < inkY0) inkY0 = y;
          if (y > inkY1) inkY1 = y;
        }
      }
    }
    if (inkX1 < 0) return;
    const inkW = inkX1 - inkX0 + 1;
    const inkH = inkY1 - inkY0 + 1;

    const cols = Math.max(1, Math.floor(inkW / cell));
    const rows = Math.max(1, Math.floor(inkH / cell));
    const inked = (cx, cy) => {
      if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return false;
      const px = inkX0 + Math.round((cx + 0.5) * cell);
      const py = inkY0 + Math.round((cy + 0.5) * cell);
      if (px >= boxW || py >= boxH) return false;
      return mask[(py * boxW + px) * 4 + 3] > 60;
    };

    const originX = (w - cols * cell) / 2;
    const originY = (h - rows * cell) / 2;
    const diag = Math.sqrt(w * w + h * h);
    const gridTop = originY;
    const gridH = Math.max(1, rows * cell);
    const cells = [];
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        if (!inked(cx, cy)) continue;
        const edge =
          !inked(cx - 1, cy) ||
          !inked(cx + 1, cy) ||
          !inked(cx, cy - 1) ||
          !inked(cx, cy + 1);
        const x = originX + (cx + 0.5) * cell;
        const y = originY + (cy + 0.5) * cell;
        const ang = Math.atan2(y - h / 2, x - w / 2) + (Math.random() - 0.5) * 0.9;
        const dist = (0.22 + Math.random() * 0.8) * diag;
        const r0 = Math.random();
        cells.push({
          x: x,
          y: y,
          ox: Math.cos(ang) * dist,
          oy: Math.sin(ang) * dist,
          col: cx,
          /* 亮带用的归一化高度（字形框内 0..1） */
          ny: (y - gridTop) / gridH,
          /* 稳定随机相位：决定这一格落到哪个字符/颜色 */
          r: r0,
          /* 是不是字形描边格：描边提亮、内部压暗，字形才「明显」（Park 09-11） */
          edge: edge,
          base: (edge ? 0.3 : 0.08) + Math.random() * 0.05,
          d: Math.random() * 0.38,
        });
      }
    }
    glyphCells = cells;
  }

  function sizeGlyphCanvas() {
    if (!glyphCanvas || !glyphCtx || !glyphW || !glyphH) return;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const pw = Math.round(glyphW * dpr);
    const ph = Math.round(glyphH * dpr);
    if (glyphCanvas.width === pw && glyphCanvas.height === ph) return;
    glyphCanvas.width = pw;
    glyphCanvas.height = ph;
    glyphCanvas.style.width = glyphW + "px";
    glyphCanvas.style.height = glyphH + "px";
    glyphCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* 实体 + 流动：整格都画，亮带自上而下扫（每列错开），滚动进度只管归位/散开。 */
  function drawGlyph(now) {
    if (!glyphCtx || !glyphCells || !glyphCells.length) return;
    const g = glyphCtx;
    const tt = (now || 0) * 0.001;
    g.clearRect(0, 0, glyphW, glyphH);
    if (glyphC <= 0.004) return;
    g.font = `${Math.round(glyphCell * 1.02)}px Menlo, SFMono-Regular, ui-monospace, Consolas, monospace`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    for (let i = 0; i < glyphCells.length; i++) {
      const c = glyphCells[i];
      const s = smoothstep(c.d, c.d + 0.6, glyphC);
      if (s <= 0.008) continue;
      let d = c.ny - ((tt * GLYPH_BAND_SPEED + c.col * 0.055) % 1);
      d -= Math.round(d);
      const near = 1 - Math.min(1, Math.abs(d) / GLYPH_BAND_W);
      const flow = near * near;
      /* 描边格额外抬一档，保证字形轮廓清楚 */
      const lvl = Math.min(1, c.base * 2.4 + flow * 0.9 + (c.edge ? 0.3 : 0));
      const heavy = lvl > 0.6;
      const mid = !heavy && lvl > 0.32;
      const pool = heavy
        ? GLYPH_HEAVY_CHARS
        : mid
          ? GLYPH_MID_CHARS
          : GLYPH_LIGHT_CHARS;
      const palette = heavy
        ? GLYPH_HEAVY_COLORS
        : mid
          ? GLYPH_MID_COLORS
          : GLYPH_LIGHT_COLORS;
      /* 残余扰动：两个不同频率的正弦叠加，每格相位不同，所以是「整片微微扰动」而不是整齐摆动 */
      const ph = c.r * 6.283;
      const jx =
        (Math.sin(tt * 1.7 + ph) * 0.72 + Math.sin(tt * 0.63 + ph * 2.1) * 0.42) *
        glyphCell *
        GLYPH_DRIFT;
      const jy = Math.cos(tt * 1.33 + ph * 1.7) * glyphCell * GLYPH_DRIFT * 0.8;
      const flick = 1 - GLYPH_FLICKER * (0.5 + 0.5 * Math.sin(tt * 2.3 + ph * 3));
      /* 描边用固定高亮（只占很少格，所以整体不会「太亮」），内部继续压暗 */
      const alpha = c.edge
        ? GLYPH_EDGE_ALPHA_BASE + flow * GLYPH_EDGE_ALPHA_GAIN
        : GLYPH_ALPHA_BASE + lvl * GLYPH_ALPHA_GAIN;
      g.globalAlpha = alpha * flick * s;
      g.fillStyle = palette[(c.r * palette.length) | 0];
      g.fillText(
        pool[((tt * GLYPH_CHAR_MORPH + c.r * 9) | 0) % pool.length],
        c.x + c.ox * (1 - s) + jx * s,
        c.y + c.oy * (1 - s) + jy * s
      );
    }
    g.globalAlpha = 1;
  }

  /** 滚入汇聚（enter 0→1），滚出散开（exit 1→0）。 */
  function glyphProgress() {
    const vh = window.innerHeight || 1;
    const enter = clamp01(1 - track.getBoundingClientRect().top / vh);
    return enter * (1 - exitProgress(track));
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
      return;
    }
    p = exitProgress(track);
    applyExit(p);
    glyphC = glyphProgress();
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

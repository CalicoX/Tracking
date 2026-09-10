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
    if (p >= 0.995 && drawnOut) {
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
      onScroll();
      return;
    }
    host.style.display = "";
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
    sticky.classList.remove("is-ascii-on", "is-ascii-out");
    intro.style.removeProperty("--ascii-copy");
    intro.style.removeProperty("--intro-rest-op");
    delete sticky.dataset.fxAscii;
  };
}

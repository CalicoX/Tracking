import {
  clamp,
  hookLenisWhenReady,
  isMobileLayout,
  prefersReducedMotion,
  shouldReduceFx,
  shouldRunContinuousFx,
} from "../utils.js";

/** Same pin-hold as ai-lab / retired curtain — settle, then exit. */
export const AI_HOLD_VH = 0.36;
/** Scroll window that dissolves the intro so `.ai-lab-work` leaks through. */
export const AI_EXIT_VH = 0.48;

/** Uniform cell — Park: 不要有大有小. */
export const CELL = 7;
const BAYER8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23,
  61, 29, 53, 21,
];

function hash(i) {
  let x = Math.imul((i | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

function smoothstep(a, b, t) {
  const x = clamp((t - a) / Math.max(b - a, 1e-6), 0, 1);
  return x * x * (3 - 2 * x);
}

function vnoise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix * 13 + iy * 47);
  const b = hash((ix + 1) * 13 + iy * 47);
  const c = hash(ix * 13 + (iy + 1) * 47);
  const d = hash((ix + 1) * 13 + (iy + 1) * 47);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

const BLOBS = (function () {
  const out = [];
  for (let i = 0; i < 5; i++) {
    const sx = hash(i * 5 + 6) > 0.5 ? 1 : -1;
    const sy = hash(i * 5 + 8) > 0.5 ? 1 : -1;
    out.push({
      x: hash(i * 3 + 1),
      y: hash(i * 3 + 2),
      r: 0.13 + hash(i * 3 + 4) * 0.1,
      vx: sx * (0.09 + hash(i * 7 + 1) * 0.08),
      vy: sy * (0.06 + hash(i * 7 + 3) * 0.07),
      stretch: 0.55 + hash(i * 9 + 2) * 0.9,
      rot: hash(i * 11 + 4) * Math.PI,
      lobes: 2 + ((hash(i * 13 + 5) * 3) | 0),
      phase: hash(i * 15 + 6) * Math.PI * 2,
    });
  }
  return out;
})();

function wrap1(x) {
  return x - Math.floor(x);
}

function wrapSigned(a, b) {
  let d = a - b;
  if (d > 0.5) d -= 1;
  if (d < -0.5) d += 1;
  return d;
}

/** Irregular drifting masses — not round pills. */
function field(cx, cy, t, cols, rows) {
  const nx = cx / Math.max(cols, 1);
  const ny = cy / Math.max(rows, 1);
  const chew = vnoise(nx * 16 + t * 0.14, ny * 16);
  const chew2 = vnoise(nx * 31 - t * 0.09, ny * 31 + 6);
  let m = 0;
  for (let i = 0; i < BLOBS.length; i++) {
    const b = BLOBS[i];
    const bx = wrap1(b.x + t * b.vx);
    const by = wrap1(b.y + t * b.vy);
    let dx = wrapSigned(nx, bx);
    let dy = wrapSigned(ny, by);
    const cs = Math.cos(b.rot);
    const sn = Math.sin(b.rot);
    const rx = (dx * cs + dy * sn) / b.stretch;
    const ry = (-dx * sn + dy * cs) * b.stretch;
    const ang = Math.atan2(ry, rx);
    const dist = Math.sqrt(rx * rx + ry * ry);
    const lobe = 0.62 + 0.48 * Math.sin(ang * b.lobes + b.phase + t * 0.35);
    const r = b.r * lobe * (0.72 + 0.5 * chew);
    const d = dist / Math.max(r, 0.02);
    if (d >= 1.05) continue;
    let v = 1 - Math.min(d, 1);
    v = v * v * (0.4 + 0.85 * chew2);
    m += v;
  }
  return smoothstep(0.1, 0.48, clamp(m, 0, 1.5));
}

function exitProgress(track) {
  const vh = window.innerHeight || 1;
  const total = Math.max(track.offsetHeight - vh, 1);
  const scrolled = clamp(-track.getBoundingClientRect().top, 0, total);
  const holdPx = Math.min(vh * AI_HOLD_VH, total * 0.42);
  const exitPx = Math.min(vh * AI_EXIT_VH, total * 0.4);
  if (scrolled <= holdPx) return 0;
  return clamp((scrolled - holdPx) / Math.max(exitPx, 1), 0, 1);
}

/**
 * Ordered-dither field over the full intro. Masses drift; + / square stay per-cell.
 */
export function mount() {
  const track =
    document.getElementById("ai-lab-intro-track") ||
    document.getElementById("ai-letter-track");
  const sticky = document.getElementById("ai-letter-sticky");
  const intro = document.getElementById("ai-lab-intro");
  const canvas = document.getElementById("ai-intro-ascii");
  if (!track || !sticky || !intro) return () => {};
  if (sticky.dataset.fxAscii) return () => {};
  sticky.dataset.fxAscii = "1";

  let raf = 0;
  let running = false;
  let visible = false;
  let p = 0;
  let drawnOut = false;
  let cssW = 0;
  let cssH = 0;
  let cols = 0;
  let rows = 0;
  let ctx = null;
  let lastDraw = 0;
  let reduceCanvas = shouldReduceFx() || prefersReducedMotion();

  function resize() {
    if (!canvas || !ctx) return;
    const rect = sticky.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const same =
      w === cssW && h === cssH && canvas.width === Math.round(w * dpr);
    cssW = w;
    cssH = h;
    if (!same) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    cols = Math.ceil(w / CELL) + 1;
    rows = Math.ceil(h / CELL) + 1;
    drawnOut = false;
    draw(typeof performance !== "undefined" ? performance.now() : 0);
  }

  function applyExit(progress) {
    const copy = 1 - smoothstep(0.0, 0.36, progress);
    const rest = 1 - smoothstep(0.48, 1, progress);
    intro.style.setProperty("--ascii-copy", copy.toFixed(3));
    intro.style.setProperty("--intro-rest-op", rest.toFixed(3));
    sticky.classList.toggle("is-ascii-on", !reduceCanvas);
    sticky.classList.toggle("is-ascii-out", progress >= 0.98);
  }

  function draw(now) {
    if (!ctx || !cssW || !cols) return;
    ctx.clearRect(0, 0, cssW, cssH);
    if (p >= 0.995) {
      drawnOut = true;
      return;
    }

    const t = (now || 0) * 0.001;
    const bias = p * 0.72;
    const dot = CELL * 0.72;
    const inset = (CELL - dot) * 0.5;
    const arm = CELL * 0.28;
    const thick = Math.max(1, CELL * 0.14);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * CELL + inset;
        const y = r * CELL + inset;
        const n = field(c, r, t, cols, rows);
        if (n < 0.02) continue;
        const b = (BAYER8[(c & 7) + ((r & 7) << 3)] + 0.5) / 64;
        if (n <= b + bias) continue;
        const plus = hash(c * 31 + r * 17) > 0.6;
        const a = 0.07 + n * 0.1;
        ctx.fillStyle = "rgba(118,112,148," + a.toFixed(3) + ")";
        if (plus) {
          const cx = c * CELL + CELL * 0.5;
          const cy = r * CELL + CELL * 0.5;
          ctx.fillRect(cx - arm, cy - thick * 0.5, arm * 2, thick);
          ctx.fillRect(cx - thick * 0.5, cy - arm, thick, arm * 2);
        } else {
          ctx.fillRect(x, y, dot, dot);
        }
      }
    }
    drawnOut = false;
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
    if (lastDraw && now - lastDraw < 20) {
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
      if (canvas) {
        canvas.style.display = "none";
        if (ctx && cssW) ctx.clearRect(0, 0, cssW, cssH);
      }
      onScroll();
      return;
    }
    if (canvas) canvas.style.display = "";
    if (ctx) {
      resize();
      drawnOut = false;
      onScroll();
      startLoop();
    }
  }

  if (canvas) {
    ctx = canvas.getContext("2d", { alpha: true });
    if (ctx) ctx.imageSmoothingEnabled = false;
    else reduceCanvas = true;
  } else {
    reduceCanvas = true;
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
      resize();
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
    sticky.classList.remove("is-ascii-on", "is-ascii-out");
    intro.style.removeProperty("--ascii-copy");
    intro.style.removeProperty("--intro-rest-op");
    if (ctx && cssW) ctx.clearRect(0, 0, cssW, cssH);
    delete sticky.dataset.fxAscii;
  };
}

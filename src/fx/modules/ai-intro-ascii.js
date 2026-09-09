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

/** Cap so it stays a field, not a carpet. Density via count, not glyph scale. */
export const MAX_GLYPHS = 1600;
/** One size for squares and pluses — Park: 不要有大有小. */
export const GLYPH_SIZE = 7;

function hash(i) {
  let x = Math.imul((i | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

function smoothstep(a, b, t) {
  const x = clamp((t - a) / Math.max(b - a, 1e-6), 0, 1);
  return x * x * (3 - 2 * x);
}

function buildGlyphs(w, h) {
  const maxN = clamp(Math.round((w * h) / 820), 980, MAX_GLYPHS);
  const glyphs = [];
  for (let i = 0; i < maxN; i++) {
    const k = hash(i + 9);
    glyphs.push({
      x: hash(i * 2 + 1) * w,
      y: hash(i * 2 + 3) * h,
      plus: k > 0.5,
      vx: (hash(i + 31) - 0.5) * 42,
      vy: (hash(i + 37) - 0.5) * 36,
      phase: hash(i + 8) * 1024,
      blink: 2.2 + hash(i + 4) * 4.4,
      flip: 3.1 + hash(i + 6) * 6.2,
      kick: 0.45 + hash(i + 12) * 0.9,
      drop: 0.06 + hash(i + 15) * 0.78,
      fall: 40 + hash(i + 19) * 260,
      drift: (hash(i + 23) - 0.5) * 48,
      kickId: -1,
    });
  }
  return glyphs;
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
 * Uniform-size square / plus field, randomly placed, randomly wandering.
 * Intro CSS background stays opaque at rest.
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
  let glyphs = [];
  let ctx = null;
  let lastDraw = 0;
  let reduceCanvas = shouldReduceFx() || prefersReducedMotion();

  function resize() {
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
    glyphs = buildGlyphs(w, h);
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
    if (!ctx || !cssW) return;
    ctx.clearRect(0, 0, cssW, cssH);
    if (p >= 0.995) {
      drawnOut = true;
      return;
    }

    const t = (now || 0) * 0.001;
    const dt = lastDraw ? Math.min(0.05, Math.max(0, (now - lastDraw) * 0.001)) : 0.016;
    const size = GLYPH_SIZE;
    const arm = size * 0.5;
    const thick = 1.4;

    for (let i = 0; i < glyphs.length; i++) {
      const g = glyphs[i];
      const kickId = (t * g.kick) | 0;
      if (kickId !== g.kickId) {
        g.kickId = kickId;
        g.vx = (hash(i + kickId * 9 + 31) - 0.5) * 52;
        g.vy = (hash(i + kickId * 11 + 37) - 0.5) * 46;
        if (hash(i + kickId * 3) > 0.74) {
          g.x = hash(i + kickId * 5 + 1) * cssW;
          g.y = hash(i + kickId * 7 + 3) * cssH;
        }
      }
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      if (g.x < -size) g.x += cssW + size * 2;
      else if (g.x > cssW + size) g.x -= cssW + size * 2;
      if (g.y < -size) g.y += cssH + size * 2;
      else if (g.y > cssH + size) g.y -= cssH + size * 2;

      g.plus = hash(i + ((t * g.flip) | 0) * 17) > 0.5;
      if (hash(i + ((t * g.blink) | 0) * 13) < 0.16) continue;

      const local = clamp((p - g.drop) / 0.3, 0, 1);
      let a = 0.42;
      if (local > 0) a *= 1 - local;
      if (a < 0.04) continue;
      let x = g.x;
      let y = g.y;
      if (local > 0) {
        const fall = local * local;
        y += fall * g.fall;
        x += local * g.drift;
      }
      ctx.fillStyle = "rgba(168,160,196," + a.toFixed(3) + ")";
      if (g.plus) {
        ctx.fillRect(x - arm, y - thick * 0.5, arm * 2, thick);
        ctx.fillRect(x - thick * 0.5, y - arm, thick, arm * 2);
      } else {
        ctx.fillRect(x - size * 0.5, y - size * 0.5, size, size);
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
    draw(now);
    lastDraw = now;
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

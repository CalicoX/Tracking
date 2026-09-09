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

/** Hard cap — denser marks, not more of them (Park: 密度加大，控制总数量). */
export const MAX_GLYPHS = 780;

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

function field(nx, ny) {
  return (
    vnoise(nx * 3.2, ny * 3.2) * 0.55 +
    vnoise(nx * 7.1 + 4, ny * 6.4) * 0.45
  );
}

function pushGlyph(glyphs, nx, ny, i, sizeMul) {
  const k = hash(i + 9);
  glyphs.push({
    nx: clamp(nx, 0.012, 0.988),
    ny: clamp(ny, 0.018, 0.982),
    plus: k > 0.5,
    size: (5.5 + hash(i + 21) * 6.5) * sizeMul,
    amp: 0.36 + hash(i + 4) * 0.22,
    phase: hash(i + 8) * Math.PI * 2,
    drop: 0.06 + hash(i + 15) * 0.78,
    fall: 40 + hash(i + 19) * 260,
    drift: (hash(i + 23) - 0.5) * 48,
  });
}

function buildGlyphs(w, h) {
  const area = Math.max(1, w * h);
  const maxN = clamp(Math.round(area / 1750), 480, MAX_GLYPHS);
  const glyphs = [];
  let i = 0;
  const tries = maxN * 6;
  while (glyphs.length < maxN && i < tries) {
    i += 1;
    const u = hash(i * 3 + 1);
    const v = hash(i * 5 + 7);
    const k = hash(i * 11 + 13);
    const n = field(u, v);
    /* Keep random scatter; skip more in the title well. */
    const dx = u - 0.5;
    const dy = v - 0.44;
    const center = dx * dx * 3.4 + dy * dy * 4.6;
    if (center < 0.16 && k > 0.22) continue;
    if (n < 0.28 && k > 0.55) continue;
    const nx = clamp(u + (n - 0.5) * 0.05, 0.012, 0.988);
    const ny = clamp(v + (hash(i + 29) - 0.5) * 0.04, 0.018, 0.982);
    pushGlyph(glyphs, nx, ny, i, 1);
    /* Local clumps — denser pockets, still inside the cap. */
    if (k > 0.7 && glyphs.length + 3 < maxN) {
      const sats = 1 + ((hash(i + 41) * 3) | 0);
      for (let s = 0; s < sats && glyphs.length < maxN; s++) {
        const ang = hash(i * 17 + s + 3) * Math.PI * 2;
        const rad = 0.01 + hash(i * 19 + s) * 0.028;
        pushGlyph(
          glyphs,
          nx + Math.cos(ang) * rad,
          ny + Math.sin(ang) * rad * 0.85,
          i * 31 + s + 90,
          0.72
        );
      }
    }
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
 * Capped, randomly scattered square / plus field. Intro CSS background stays
 * opaque at rest. After hold, copy fades, glyphs drop, then the overlay lifts.
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
    for (let i = 0; i < glyphs.length; i++) {
      const g = glyphs[i];
      const local = clamp((p - g.drop) / 0.3, 0, 1);
      let a = g.amp * (0.7 + 0.3 * Math.sin(t * 0.85 + g.phase));
      if (local > 0) a *= 1 - local;
      if (a < 0.04) continue;
      let x = g.nx * cssW + Math.sin(t * 0.55 + g.phase) * 1.6;
      let y = g.ny * cssH + Math.cos(t * 0.4 + g.phase) * 1.2;
      if (local > 0) {
        const fall = local * local;
        y += fall * g.fall;
        x += local * g.drift;
      }
      ctx.fillStyle = "rgba(168,160,196," + a.toFixed(3) + ")";
      if (g.plus) {
        const arm = g.size * 0.55;
        const thick = Math.max(1.1, g.size * 0.22);
        ctx.fillRect(x - arm, y - thick * 0.5, arm * 2, thick);
        ctx.fillRect(x - thick * 0.5, y - arm, thick, arm * 2);
      } else {
        const d = g.size;
        ctx.fillRect(x - d * 0.5, y - d * 0.5, d, d);
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
    if (p <= 0 && lastDraw && now - lastDraw < 33) {
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

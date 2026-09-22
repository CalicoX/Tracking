import {
  clamp,
  prefersReducedMotion,
  shouldRunContinuousFx,
} from "../utils.js";

/** Higher = slower. Park: 1 too fast, 1.3 a bit slow. */
const PACE = 1.1;
const dur = (ms) => Math.round(ms * PACE);

const STEPS = [
  ".os-hero img",
  ".os-logo",
  ".os-hero-copy",
  ".os-track-card",
  ".os-status",
  ".os-summary",
  ".os-look",
  ".float-card-metric",
];

function ease(t) {
  return 1 - Math.pow(1 - t, 3);
}

function relRect(el, root) {
  const a = el.getBoundingClientRect();
  const b = root.getBoundingClientRect();
  const scale = b.width / Math.max(root.offsetWidth, 1);
  return {
    x: (a.left - b.left) / scale,
    y: (a.top - b.top) / scale,
    w: a.width / scale,
    h: a.height / scale,
  };
}

/**
 * Agent cursor + Illustrator-style marquee/selection while the tracking page is drawn.
 * Plays once while the mock is on screen; pauses/snaps complete if scrolled away.
 * @returns {() => void}
 */
export function mount() {
  const root = document.querySelector(".visual-asm");
  if (!root) return () => {};

  if (prefersReducedMotion()) {
    root.classList.remove("is-drawing");
    root.querySelectorAll("[data-draw]").forEach((n) => n.classList.add("is-placed"));
    return () => {};
  }

  root.querySelectorAll(".draw-overlay").forEach((n) => n.remove());
  root.querySelectorAll("[data-draw]").forEach((n) => n.classList.remove("is-placed"));
  root.classList.remove("is-drawn");
  root.classList.add("is-drawing");

  const overlay = document.createElement("div");
  overlay.className = "draw-overlay";
  overlay.innerHTML =
    '<div class="draw-marquee" hidden></div>' +
    '<div class="draw-box" hidden>' +
    '<i class="draw-h nw"></i><i class="draw-h n"></i><i class="draw-h ne"></i>' +
    '<i class="draw-h w"></i><i class="draw-h e"></i>' +
    '<i class="draw-h sw"></i><i class="draw-h s"></i><i class="draw-h se"></i>' +
    '<span class="draw-size"></span></div>' +
    '<div class="draw-pointer">' +
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
    '<path fill="#111" stroke="#fff" stroke-width="1.2" d="M4.2 3.4l14.2 9.1-6.4 1.5 3.7 7.2-2.6 1.3-3.8-7.3-5.1 4.8z"/>' +
    "</svg>" +
    '<span class="draw-agent">' +
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
    '<path d="M6.7 1.1 7.9 4.6l3.5 1.2-3.5 1.2L6.7 10.4 5.5 7l-3.5-1.2L5.5 4.6 6.7 1.1Z"/>' +
    "</svg>Agent</span></div>";
  root.appendChild(overlay);

  const pointer = overlay.querySelector(".draw-pointer");
  const marquee = overlay.querySelector(".draw-marquee");
  const box = overlay.querySelector(".draw-box");
  const sizeEl = overlay.querySelector(".draw-size");

  let cx = 36;
  let cy = 24;
  let raf = 0;
  let cancelled = false;
  let sectionVisible = false;
  let playing = false;
  let finished = false;
  let started = false;
  let generation = 0;
  const waiters = [];
  let settleAnim = null;

  function isStale(gen) {
    return cancelled || gen !== generation || !playing;
  }

  function setPointer(x, y) {
    cx = x;
    cy = y;
    pointer.style.transform = `translate(${x}px, ${y}px)`;
  }

  function placeBox(el, r) {
    el.style.left = `${r.x}px`;
    el.style.top = `${r.y}px`;
    el.style.width = `${Math.max(r.w, 8)}px`;
    el.style.height = `${Math.max(r.h, 8)}px`;
  }

  function abortTweens() {
    waiters.splice(0).forEach(({ t, resolve }) => {
      clearTimeout(t);
      resolve();
    });
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (settleAnim) {
      const done = settleAnim;
      settleAnim = null;
      done();
    }
  }

  function wait(ms, gen) {
    return new Promise((resolve) => {
      if (isStale(gen)) {
        resolve();
        return;
      }
      const t = setTimeout(() => {
        const i = waiters.findIndex((w) => w.t === t);
        if (i >= 0) waiters.splice(i, 1);
        resolve();
      }, ms);
      waiters.push({ t, resolve });
    });
  }

  function animate(from, to, ms, onTick, gen) {
    return new Promise((resolve) => {
      if (isStale(gen)) {
        resolve();
        return;
      }
      settleAnim = resolve;
      const t0 = performance.now();
      const tick = (now) => {
        if (isStale(gen)) {
          settleAnim = null;
          resolve();
          return;
        }
        const p = clamp((now - t0) / ms, 0, 1);
        const k = ease(p);
        onTick({
          x: from.x + (to.x - from.x) * k,
          y: from.y + (to.y - from.y) * k,
        });
        if (p < 1) raf = requestAnimationFrame(tick);
        else {
          settleAnim = null;
          resolve();
        }
      };
      raf = requestAnimationFrame(tick);
    });
  }

  function resetCycle() {
    overlay.classList.remove("is-done");
    marquee.hidden = true;
    box.hidden = true;
    root.classList.add("is-drawing");
    root.classList.remove("is-drawn");
    root.querySelectorAll("[data-draw]").forEach((n) => {
      n.classList.remove("is-placed", "is-big", "is-dropping", "is-slapping", "is-shine");
    });
    cx = 36;
    cy = 24;
    setPointer(cx, cy);
  }

  function snapComplete() {
    overlay.classList.add("is-done");
    marquee.hidden = true;
    box.hidden = true;
    root.classList.remove("is-drawing");
    root.classList.add("is-drawn");
    root.querySelectorAll("[data-draw]").forEach((n) => {
      n.classList.remove("is-big", "is-dropping", "is-slapping", "is-shine");
      n.classList.add("is-placed");
    });
  }

  async function playOnce(gen) {
    resetCycle();
    await wait(dur(240), gen);
    if (isStale(gen)) return;

    for (const sel of STEPS) {
      if (isStale(gen)) return;
      const el = root.querySelector(sel);
      if (!el) continue;
      if (getComputedStyle(el).display === "none") continue;
      const r = relRect(el, root);
      const start = { x: r.x, y: r.y };
      const end = { x: r.x + r.w, y: r.y + r.h };

      await animate({ x: cx, y: cy }, start, dur(280), (p) => setPointer(p.x, p.y), gen);
      if (isStale(gen)) return;
      await wait(dur(70), gen);
      if (isStale(gen)) return;

      marquee.hidden = false;
      box.hidden = true;
      await animate(
        start,
        end,
        dur(340),
        (p) => {
          setPointer(p.x, p.y);
          placeBox(marquee, {
            x: start.x,
            y: start.y,
            w: Math.max(p.x - start.x, 4),
            h: Math.max(p.y - start.y, 4),
          });
        },
        gen
      );
      if (isStale(gen)) return;

      marquee.hidden = true;
      box.hidden = false;
      placeBox(box, r);
      sizeEl.textContent = `${Math.round(r.w)} × ${Math.round(r.h)}`;
      el.classList.add("is-placed");
      await wait(dur(320), gen);
      box.hidden = true;
    }
  }

  async function runOnce(gen) {
    await playOnce(gen);
    if (isStale(gen)) return;
    overlay.classList.add("is-done");
    root.classList.remove("is-drawing");
    root.classList.add("is-drawn");
    await wait(dur(400), gen);
    if (isStale(gen)) return;
    finished = true;
    playing = false;
    overlay.remove();
  }

  function startPlay() {
    if (playing || cancelled || finished) return;
    started = true;
    playing = true;
    generation += 1;
    const gen = generation;
    abortTweens();
    runOnce(gen).catch(() => {});
  }

  function stopPlay() {
    abortTweens();
    if (finished || !started) return;
    playing = false;
    generation += 1;
    snapComplete();
    finished = true;
    overlay.remove();
  }

  function syncPlay() {
    const on = shouldRunContinuousFx({
      sectionVisible,
      documentHidden: typeof document !== "undefined" && document.hidden,
    });
    if (on) startPlay();
    else stopPlay();
  }

  const io =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              sectionVisible = e.isIntersecting;
              syncPlay();
            });
          },
          { threshold: 0.18 }
        );

  function onVisChange() {
    syncPlay();
  }

  if (io) io.observe(root);
  else {
    sectionVisible = true;
    syncPlay();
  }
  document.addEventListener("visibilitychange", onVisChange);

  return function dispose() {
    cancelled = true;
    playing = false;
    generation += 1;
    abortTweens();
    document.removeEventListener("visibilitychange", onVisChange);
    if (io) io.disconnect();
    overlay.remove();
    root.classList.remove("is-drawing");
    root.querySelectorAll("[data-draw]").forEach((n) => n.classList.add("is-placed"));
  };
}

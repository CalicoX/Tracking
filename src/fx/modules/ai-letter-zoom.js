import { clamp, prefersReducedMotion } from "../utils.js";

/**
 * After the intro screen pins, extra viewports of scroll before zoom starts.
 * ~1 extra screen so it settles first — do not zoom on arrival.
 */
export const AI_HOLD_VH = 0.36;
/** Viewports spent scaling the title "AI". */
export const AI_ZOOM_VH = 0.48;

/** Fraction fallbacks (520vh track ≈ 420vh travel). Stack uses the same end. */
export const AI_HOLD_END = 0.30;
export const AI_ZOOM_END = 0.54;

/**
 * Scale the heading's "AI" as a knockout over the example module.
 * Holds after the screen pins, then zooms — does not start immediately.
 * @returns {() => void}
 */
export function mount() {
  const track =
    document.getElementById("ai-lab-intro-track") ||
    document.getElementById("ai-letter-track");
  const sticky = document.getElementById("ai-letter-sticky");
  const intro = document.getElementById("ai-lab-intro");
  const svg = sticky && sticky.querySelector(".ai-letter-cut");
  const word = document.querySelector(".ai-word-ai");
  if (!track || !sticky) return () => {};

  let origin = null;
  let zooming = false;

  function ensureLayer() {
    let layer = document.getElementById("ai-zoom-layer");
    if (layer) return layer;
    layer = document.createElement("div");
    layer.id = "ai-zoom-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML =
      '<svg class="ai-zoom-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">' +
      "<defs>" +
      '<mask id="ai-zoom-mask" maskUnits="userSpaceOnUse">' +
      '<rect class="ai-zoom-mask-bg" fill="#fff"/>' +
      '<g class="ai-zoom-g">' +
      '<text class="ai-zoom-text" fill="#000" text-anchor="middle" dominant-baseline="central">AI</text>' +
      "</g></mask></defs>" +
      /* Painted twin: the HTML AI is hidden to avoid ghosting, so without this
       * the knockout holes expose an empty slot and the zoom reads as some
       * foreign blob. Same geometry, heading gradient on top of the veil. */
      '<defs><linearGradient id="ai-glyph-grad" x1="0" y1="0" x2="1" y2="0">' +
      '<stop class="ai-glyph-s1" offset="0"/>' +
      '<stop class="ai-glyph-s2" offset="1"/>' +
      "</linearGradient></defs>" +
      '<text class="ai-zoom-glyph" fill="url(#ai-glyph-grad)" text-anchor="middle" dominant-baseline="central">AI</text>' +
      '<rect class="ai-zoom-fill" fill="#0a0514" mask="url(#ai-zoom-mask)"/>' +
      "</svg>";
    document.body.appendChild(layer);
    return layer;
  }

  function captureOrigin() {
    if (!word) return;
    const range = document.createRange();
    range.selectNodeContents(word);
    const tr = range.getBoundingClientRect();
    range.detach();
    if (tr.width < 4 || tr.height < 4) return;
    const cs = window.getComputedStyle(word);
    const fs = parseFloat(cs.fontSize) || tr.height;
    const lsPx = parseFloat(cs.letterSpacing) || 0;
    /* Heading colors come from a clipped background-image on the span; pull
     * its stops so the flying pair matches the title it grew out of. */
    let g1 = null;
    let g2 = null;
    const bg = cs.backgroundImage || "";
    const stops = bg.match(/(#[0-9a-f]{3,8}|rgba?\([^)]*\))/gi);
    if (stops && stops.length >= 2) {
      g1 = stops[0];
      g2 = stops[stops.length - 1];
    } else if (cs.color && cs.color !== "rgba(0, 0, 0, 0)") {
      g1 = g2 = cs.color;
    }
    origin = {
      w: window.innerWidth,
      h: window.innerHeight,
      x: tr.left + tr.width / 2,
      y: tr.top + tr.height / 2,
      fs: fs,
      lsEm: fs ? lsPx / fs : 0,
      fw: cs.fontWeight || "700",
      ff: cs.fontFamily || "Inter, system-ui, sans-serif",
      g1: g1,
      g2: g2,
    };
    snapGlyphToInk();
  }

  function snapGlyphToInk() {
    if (!origin) return;
    applyLetter(1, 1);
    const layer = document.getElementById("ai-zoom-layer");
    const text = layer && layer.querySelector(".ai-zoom-text");
    if (!text) return;
    try {
      const b = text.getBBox();
      if (b.width < 2 || b.height < 2) return;
      origin.x += origin.x - (b.x + b.width / 2);
      origin.y += origin.y - (b.y + b.height / 2);
    } catch (e) {
      /* ignore */
    }
  }

  function applyLetter(zoom, cutOp) {
    const layer = ensureLayer();
    const svgEl = layer.querySelector(".ai-zoom-svg");
    const text = layer.querySelector(".ai-zoom-text");
    const glyph = layer.querySelector(".ai-zoom-glyph");
    const g = layer.querySelector(".ai-zoom-g");
    const maskBg = layer.querySelector(".ai-zoom-mask-bg");
    const fill = layer.querySelector(".ai-zoom-fill");
    if (!svgEl || !text || !origin) {
      layer.classList.remove("is-on");
      return;
    }
    if (cutOp <= 0) {
      layer.classList.remove("is-on");
      return;
    }
    svgEl.setAttribute("viewBox", "0 0 " + origin.w + " " + origin.h);
    if (maskBg) {
      maskBg.setAttribute("width", String(origin.w));
      maskBg.setAttribute("height", String(origin.h));
    }
    if (fill) {
      fill.setAttribute("width", String(origin.w));
      fill.setAttribute("height", String(origin.h));
    }
    /* Grow font-size around a locked central anchor — no group scale (that walks down). */
    if (g) g.removeAttribute("transform");
    const fsNow = (origin.fs * zoom).toFixed(2);
    for (const t of [text, glyph]) {
      if (!t) continue;
      t.setAttribute("x", origin.x.toFixed(2));
      t.setAttribute("y", origin.y.toFixed(2));
      t.setAttribute("font-size", fsNow);
      t.setAttribute("font-weight", origin.fw);
      t.setAttribute("font-family", origin.ff);
      t.setAttribute("letter-spacing", origin.lsEm.toFixed(4) + "em");
    }
    if (glyph) glyph.textContent = "AI";
    const s1 = layer.querySelector(".ai-glyph-s1");
    const s2 = layer.querySelector(".ai-glyph-s2");
    if (s1 && origin.g1) s1.setAttribute("stop-color", origin.g1);
    if (s2 && origin.g2) s2.setAttribute("stop-color", origin.g2);
    layer.classList.add("is-on");
  }

  function setZoom(zoom, restOp, aiOp, cutOp) {
    sticky.style.setProperty("--ai-zoom", String(zoom));
    sticky.style.setProperty("--ai-veil", String(cutOp));
    if (intro) {
      intro.style.setProperty("--intro-rest-op", String(restOp));
      intro.style.setProperty("--intro-ai-op", String(aiOp));
    }
    if (svg) svg.style.opacity = "0";
    applyLetter(zoom, cutOp);
  }

  function applyFull() {
    setZoom(16, 0, 0, 0);
  }

  if (prefersReducedMotion()) {
    applyFull();
    return function dispose() {
      sticky.style.removeProperty("--ai-zoom");
      sticky.style.removeProperty("--ai-veil");
    };
  }

  function apply() {
    const vh = window.innerHeight;
    const r = track.getBoundingClientRect();
    const travel = Math.max(1, r.height - vh);
    const scrolled = clamp(-r.top, 0, travel);
    const holdPx = Math.min(vh * AI_HOLD_VH, travel * 0.42);
    const zoomPx = Math.min(vh * AI_ZOOM_VH, travel * 0.4);

    /* Page in place (pinned) + extra screen of rest. Overlay stays off. */
    if (scrolled <= holdPx) {
      zooming = false;
      origin = null;
      setZoom(1, 1, 1, 0);
      if (sticky) sticky.classList.remove("is-ai-zooming");
      return;
    }

    /* Lock the title-AI box once; never recapture while zooming (prevents downward drift). */
    if (!zooming) {
      captureOrigin();
      zooming = true;
    }
    const p = clamp((scrolled - holdPx) / Math.max(zoomPx, 1), 0, 1);
    if (sticky) sticky.classList.add("is-ai-zooming");
    /* Ease-in hard so the pair stays legible as "the title AI" through the
     * first half, then rushes past the camera at the end. */
    const diag = Math.hypot(window.innerWidth, window.innerHeight);
    const zoomEnd = Math.max(2, (diag * 1.25) / origin.fs);
    const eased = p * p * p; /* cubic ease-in */
    const zoom = 1 + eased * (zoomEnd - 1);
    /* Back half: veil AND the intro copy dissolve together, scrubbed by
     * scroll. The veil also RAMPS IN over the first third — it used to slam
     * to full darkness on the first tick, which read as the title vanishing
     * and a foreign blob floating on black. */
    const FADE_FROM = 0.55;
    const tail = p <= FADE_FROM ? 0 : clamp((p - FADE_FROM) / (1 - FADE_FROM), 0, 1);
    const rampIn = clamp(p / 0.35, 0, 1);
    const cutOp = (1 - tail) * rampIn;
    const restOp = 1 - tail;
    const aiOp = 0;
    setZoom(zoom, restOp, aiOp, cutOp);
  }

  const prev = window.__updateAiScroll;
  function onAiScroll() {
    if (typeof prev === "function") prev();
    apply();
  }
  window.__updateAiScroll = onAiScroll;
  window.addEventListener("scroll", apply, { passive: true });
  window.addEventListener("resize", apply);
  captureOrigin();
  apply();

  return function dispose() {
    window.removeEventListener("scroll", apply);
    window.removeEventListener("resize", apply);
    sticky.classList.remove("is-ai-zooming");
    const layer = document.getElementById("ai-zoom-layer");
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    if (window.__updateAiScroll === onAiScroll) {
      window.__updateAiScroll = prev;
    }
  };
}

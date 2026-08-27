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
      '<text class="ai-zoom-text" fill="#000" text-anchor="middle">AI</text>' +
      "</g>" +
      /* final sweep: soft-edged bloom, not a crisp circle — reads as the
       * veil dissolving outward while the pair blows past the camera */
      '<radialGradient class="ai-hole-grad">' +
      '<stop offset="0" stop-color="#000"/>' +
      '<stop offset="0.62" stop-color="#000"/>' +
      '<stop offset="1" stop-color="#fff"/>' +
      "</radialGradient>" +
      '<circle class="ai-zoom-hole" fill="url(#ai-hole-grad)" cx="0" cy="0" r="0"/>' +
      "</mask></defs>" +
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
    origin = {
      w: window.innerWidth,
      h: window.innerHeight,
      x: tr.left + tr.width / 2,
      y: tr.top + tr.height / 2,
      fs: fs,
      lsEm: fs ? lsPx / fs : 0,
      fw: cs.fontWeight || "700",
      ff: cs.fontFamily || "Inter, system-ui, sans-serif",
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

  function applyLetter(zoom, cutOp, holeR) {
    const layer = ensureLayer();
    const svgEl = layer.querySelector(".ai-zoom-svg");
    const text = layer.querySelector(".ai-zoom-text");
    const g = layer.querySelector(".ai-zoom-g");
    const maskBg = layer.querySelector(".ai-zoom-mask-bg");
    const fill = layer.querySelector(".ai-zoom-fill");
    const hole = layer.querySelector(".ai-zoom-hole");
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
    text.setAttribute("x", origin.x.toFixed(2));
    text.setAttribute("y", origin.y.toFixed(2));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute("font-size", (origin.fs * zoom).toFixed(2));
    text.setAttribute("font-weight", origin.fw);
    text.setAttribute("font-family", origin.ff);
    text.setAttribute("letter-spacing", origin.lsEm.toFixed(4) + "em");
    if (hole) {
      hole.setAttribute("cx", origin.x.toFixed(2));
      hole.setAttribute("cy", origin.y.toFixed(2));
      hole.setAttribute("r", Math.max(0, holeR || 0).toFixed(2));
    }
    layer.classList.add("is-on");
  }

  function setZoom(zoom, restOp, aiOp, cutOp, holeR) {
    sticky.style.setProperty("--ai-zoom", String(zoom));
    sticky.style.setProperty("--ai-veil", String(cutOp));
    if (intro) {
      intro.style.setProperty("--intro-rest-op", String(restOp));
      intro.style.setProperty("--intro-ai-op", String(aiOp));
    }
    if (svg) svg.style.opacity = "0";
    applyLetter(zoom, cutOp, holeR);
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
    const restOp = p < 0.22 ? 1 - p / 0.22 : 0;
    const aiOp = 0;
    /* Letters grow smoothly across the whole window; the final sweep is done
     * by the expanding mask circle, not by font size — glyph counters and
     * inter-letter gaps never cover a full viewport on their own. */
    const diag = Math.hypot(window.innerWidth, window.innerHeight);
    const zoomEnd = Math.max(2, (diag * 1.25) / origin.fs);
    const eased = p * p * (3 - 2 * p); /* smoothstep: ease-in + ease-out */
    const zoom = 1 + eased * (zoomEnd - 1);
    /* Soft bloom starts at half the window and is fully clear by p=1; the
     * gradient's solid core (0.62R) still swallows every corner. */
    const q = clamp((p - 0.5) / 0.5, 0, 1);
    const holeR = q * q * (3 - 2 * q) * diag * 1.05;
    /* At p=1 the holes cover the viewport, so dropping the layer is seamless. */
    const cutOp = p < 1 ? 1 : 0;
    setZoom(zoom, restOp, aiOp, cutOp, holeR);
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

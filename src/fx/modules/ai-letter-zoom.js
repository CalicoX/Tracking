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
      '<div class="ai-zoom-veil"></div><div class="ai-zoom-word">AI</div>';
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
    origin = {
      left: tr.left,
      top: tr.top,
      width: tr.width,
      height: tr.height,
      fs: parseFloat(cs.fontSize) || tr.height,
      fw: cs.fontWeight || "700",
      ff: cs.fontFamily || "Inter, system-ui, sans-serif",
      ls: cs.letterSpacing || "0px",
    };
  }

  function applyLetter(zoom, cutOp) {
    const layer = ensureLayer();
    const clone = layer.querySelector(".ai-zoom-word");
    if (!clone || !origin) {
      layer.classList.remove("is-on");
      return;
    }
    if (cutOp <= 0) {
      layer.classList.remove("is-on");
      clone.style.transform = "scale(1)";
      return;
    }
    clone.style.left = origin.left + "px";
    clone.style.top = origin.top + "px";
    clone.style.width = origin.width + "px";
    clone.style.height = origin.height + "px";
    clone.style.fontSize = origin.fs + "px";
    clone.style.fontWeight = origin.fw;
    clone.style.fontFamily = origin.ff;
    clone.style.letterSpacing = origin.ls;
    clone.style.transform = "scale(" + Number(zoom).toFixed(4) + ")";
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
      captureOrigin();
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
    const restOp = p < 0.08 ? 1 - p / 0.08 : 0;
    const aiOp = 0;
    /* Follow scroll both ways. Center-scale the pair; hide at full size when done. */
    const zoom = 1 + p * p * 900;
    const cutOp = p < 1 ? 1 : 0;
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

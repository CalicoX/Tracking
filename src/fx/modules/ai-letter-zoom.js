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
  const letterG = sticky && sticky.querySelector(".ai-letter-g");
  const letterText = sticky && sticky.querySelector(".ai-letter-text");
  const maskBg = sticky && sticky.querySelector(".ai-letter-mask-bg");
  const fill = sticky && sticky.querySelector(".ai-letter-fill");
  const word = document.querySelector(".ai-word-ai");
  if (!track || !sticky) return () => {};

  let origin = null;

  function captureOrigin() {
    if (!word) return;
    const range = document.createRange();
    range.selectNodeContents(word);
    const tr = range.getBoundingClientRect();
    range.detach();
    if (tr.width < 4 || tr.height < 4) return;
    const cs = window.getComputedStyle(word);
    const fs = parseFloat(cs.fontSize) || tr.height;
    const pairCx = tr.left + tr.width / 2;
    const pairCy = tr.top + tr.height / 2;
    origin = {
      w: window.innerWidth,
      h: window.innerHeight,
      cx: pairCx,
      cy: pairCy,
      pairCx: pairCx,
      pairCy: pairCy,
      x: pairCx,
      y: pairCy,
      baseline: tr.bottom,
      fs: fs,
      fw: cs.fontWeight || "700",
      ff: cs.fontFamily || "Inter, system-ui, sans-serif",
      ls: cs.letterSpacing || "0px",
    };
    snapGlyphToInk();
    origin.cx = origin.pairCx;
    origin.cy = origin.pairCy;
  }

  function snapGlyphToInk() {
    if (!origin || !letterText) return;
    applyLetter(1);
    try {
      const b = letterText.getBBox();
      if (b.width < 2 || b.height < 2) return;
      origin.x += origin.pairCx - (b.x + b.width / 2);
      origin.baseline += origin.pairCy - (b.y + b.height / 2);
    } catch (e) {
      /* mask text may not expose bbox */
    }
  }

  function applyLetter(zoom) {
    if (!origin || !svg || !letterText || !letterG) return;
    svg.setAttribute("viewBox", "0 0 " + origin.w + " " + origin.h);
    if (maskBg) {
      maskBg.setAttribute("width", String(origin.w));
      maskBg.setAttribute("height", String(origin.h));
    }
    if (fill) {
      fill.setAttribute("width", String(origin.w));
      fill.setAttribute("height", String(origin.h));
    }
    /* Sit on the title baseline; scale around the "AI" glyph center. */
    letterText.setAttribute("x", origin.x.toFixed(2));
    letterText.setAttribute("y", origin.baseline.toFixed(2));
    letterText.setAttribute("font-size", origin.fs.toFixed(2));
    letterText.setAttribute("font-weight", origin.fw);
    letterText.setAttribute("font-family", origin.ff);
    letterText.setAttribute("letter-spacing", origin.ls);
    letterText.setAttribute("text-anchor", "middle");
    letterText.removeAttribute("dominant-baseline");
    letterText.removeAttribute("alignment-baseline");

    letterG.setAttribute(
      "transform",
      "translate(" +
        origin.cx.toFixed(2) +
        " " +
        origin.cy.toFixed(2) +
        ") scale(" +
        Number(zoom).toFixed(4) +
        ") translate(" +
        (-origin.cx).toFixed(2) +
        " " +
        (-origin.cy).toFixed(2) +
        ")"
    );
  }

  function setZoom(zoom, restOp, aiOp, cutOp) {
    sticky.style.setProperty("--ai-zoom", String(zoom));
    sticky.style.setProperty("--ai-veil", String(cutOp));
    if (intro) {
      intro.style.setProperty("--intro-rest-op", String(restOp));
      intro.style.setProperty("--intro-ai-op", String(aiOp));
    }
    const cut = sticky.querySelector(".ai-letter-cut");
    if (cut) cut.style.opacity = String(cutOp);
    applyLetter(zoom);
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
      captureOrigin();
      setZoom(1, 1, 1, 0);
      if (sticky) sticky.classList.remove("is-ai-zooming");
      return;
    }

    /* Lock origin on the first zoom frame so enter-animation offset is gone. */
    if (!origin || !sticky.classList.contains("is-ai-zooming")) {
      captureOrigin();
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
    if (window.__updateAiScroll === onAiScroll) {
      window.__updateAiScroll = prev;
    }
  };
}

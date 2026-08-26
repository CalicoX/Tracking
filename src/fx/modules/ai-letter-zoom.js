import { clamp, prefersReducedMotion } from "../utils.js";

/**
 * After the intro screen pins, extra viewports of scroll before zoom starts.
 * ~1 extra screen so it settles first — do not zoom on arrival.
 */
export const AI_HOLD_VH = 1.05;
/** Viewports spent scaling the title "AI". */
export const AI_ZOOM_VH = 1.1;

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
    if (!word || !sticky) return;
    const prevTx = word.style.transform;
    word.style.transform = "none";
    const wr = word.getBoundingClientRect();
    const sr = sticky.getBoundingClientRect();
    word.style.transform = prevTx;
    if (wr.width < 8 || wr.height < 8 || sr.width < 8) return;
    const cs = window.getComputedStyle(word);
    const fs = parseFloat(cs.fontSize) || wr.height;
    let baseline = wr.top - sr.top + wr.height * 0.8;
    try {
      const ctx = document.createElement("canvas").getContext("2d");
      if (ctx) {
        ctx.font = cs.font;
        const m = ctx.measureText(word.textContent || "AI");
        const ascent = m.fontBoundingBoxAscent || m.actualBoundingBoxAscent || fs * 0.8;
        const descent = m.fontBoundingBoxDescent || m.actualBoundingBoxDescent || fs * 0.2;
        const lead = Math.max(0, (wr.height - (ascent + descent)) / 2);
        baseline = wr.top - sr.top + lead + ascent;
      }
    } catch (e) {
      /* canvas metrics unavailable */
    }
    origin = {
      w: sr.width,
      h: sr.height,
      x: wr.left - sr.left + wr.width / 2,
      y: wr.top - sr.top + wr.height / 2,
      baseline: baseline,
      fs: fs,
      fw: cs.fontWeight || "700",
      ff: cs.fontFamily || "Inter, system-ui, sans-serif",
      ls: cs.letterSpacing || "0px",
    };
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
    /* Sit on the title's alphabetic baseline; scale around the word-box center. */
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
        origin.x.toFixed(2) +
        " " +
        origin.y.toFixed(2) +
        ") scale(" +
        Number(zoom).toFixed(4) +
        ") translate(" +
        (-origin.x).toFixed(2) +
        " " +
        (-origin.y).toFixed(2) +
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
    const restOp = p < 0.16 ? 1 - p / 0.16 : 0;
    /* Title "AI" is CSS-hidden on .is-ai-zooming — never crossfade with the overlay. */
    const aiOp = 0;
    const cutOp = p < 0.86 ? 1 : Math.max(0, 1 - (p - 0.86) / 0.14);
    const zoom = 1 + p * 22;
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

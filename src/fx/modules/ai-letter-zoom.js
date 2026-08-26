import { clamp, prefersReducedMotion } from "../utils.js";

/** Pin progress: hold the title, then zoom the title's AI, then the example stack. */
export const AI_HOLD_END = 0.16;
export const AI_ZOOM_END = 0.42;

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
    const wr = word.getBoundingClientRect();
    const sr = sticky.getBoundingClientRect();
    if (wr.width < 8 || wr.height < 8 || sr.width < 8) return;
    origin = {
      w: sr.width,
      h: sr.height,
      x: wr.left - sr.left + wr.width / 2,
      y: wr.top - sr.top + wr.height * 0.86,
      fs: wr.height * 1.12,
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
    letterText.setAttribute("x", origin.x.toFixed(2));
    letterText.setAttribute("y", origin.y.toFixed(2));
    letterText.setAttribute("font-size", origin.fs.toFixed(2));
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
    const r = track.getBoundingClientRect();
    const travel = Math.max(1, r.height - window.innerHeight);
    const pAll = clamp(-r.top / travel, 0, 1);

    if (pAll <= AI_HOLD_END) {
      captureOrigin();
      setZoom(1, 1, 1, 0);
      return;
    }

    if (!origin) captureOrigin();
    const p = clamp(
      (pAll - AI_HOLD_END) / Math.max(AI_ZOOM_END - AI_HOLD_END, 0.01),
      0,
      1
    );
    const restOp = p < 0.14 ? 1 - p / 0.14 : 0;
    const aiOp = p < 0.08 ? 1 - p / 0.08 : 0;
    const cutOp =
      p < 0.04 ? p / 0.04 : p < 0.84 ? 1 : Math.max(0, 1 - (p - 0.84) / 0.16);
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
    if (window.__updateAiScroll === onAiScroll) {
      window.__updateAiScroll = prev;
    }
  };
}

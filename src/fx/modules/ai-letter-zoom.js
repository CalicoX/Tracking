import { clamp, prefersReducedMotion } from "../utils.js";

/**
 * Sticky "AI" knockout: tracking page shows through the letters,
 * which scale up on scroll until the page fills the viewport.
 * @returns {() => void}
 */
export function mount() {
  const track = document.getElementById("ai-letter-track");
  const sticky = document.getElementById("ai-letter-sticky");
  const letterG = sticky && sticky.querySelector(".ai-letter-g");
  if (!track || !sticky) return () => {};

  function applyFull() {
    sticky.style.setProperty("--ai-zoom", "16");
    sticky.style.setProperty("--ai-veil", "0");
  }

  if (prefersReducedMotion()) {
    applyFull();
    if (letterG) {
      letterG.setAttribute("transform", "translate(720 480) scale(16) translate(-720 -480)");
    }
    return function dispose() {
      sticky.style.removeProperty("--ai-zoom");
      sticky.style.removeProperty("--ai-veil");
    };
  }

  function apply() {
    const r = track.getBoundingClientRect();
    const travel = Math.max(1, r.height - window.innerHeight);
    const p = clamp(-r.top / travel, 0, 1);
    const zoom = 1 + p * 15;
    const veil = p < 0.72 ? 1 : Math.max(0, 1 - (p - 0.72) / 0.28);
    sticky.style.setProperty("--ai-zoom", zoom.toFixed(4));
    sticky.style.setProperty("--ai-veil", veil.toFixed(3));
    if (letterG) {
      letterG.setAttribute(
        "transform",
        "translate(720 480) scale(" + zoom.toFixed(4) + ") translate(-720 -480)"
      );
    }
  }

  const prev = window.__updateAiScroll;
  function onAiScroll() {
    if (typeof prev === "function") prev();
    apply();
  }
  window.__updateAiScroll = onAiScroll;
  window.addEventListener("scroll", apply, { passive: true });
  window.addEventListener("resize", apply);
  apply();

  return function dispose() {
    window.removeEventListener("scroll", apply);
    window.removeEventListener("resize", apply);
    if (window.__updateAiScroll === onAiScroll) {
      window.__updateAiScroll = prev;
    }
  };
}

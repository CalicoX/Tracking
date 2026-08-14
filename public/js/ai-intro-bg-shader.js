/**
 * AI Lab intro background — no JS animation (CSS/SVG only).
 * Kept as a stub so old cache hits don't re-enable heavy canvas.
 */
(function () {
  "use strict";
  var section = document.getElementById("ai-lab-intro");
  var canvas = document.getElementById("ai-intro-bg-canvas");
  if (canvas) canvas.remove();
  if (section) {
    section.classList.remove("ai-intro-bg-webgl", "ai-intro-bg-fallback");
  }
})();

/** @returns {() => void} */
export function mount() {
  let teardown = null;
  try {
/**
 * Business impact — sticky scroll
 * Linear scroll progress → metrics count-up + curve reveal
 * (no early jump, no double-easing spikes)
 */
(function () {
  "use strict";

  var root = document.getElementById("business-impact");
  if (!root) return;

  var sticky = root.querySelector(".impact-band-sticky");
  var curve = root.querySelector(".impact-curve");
  var stats = root.querySelectorAll("[data-impact]");
  if (!sticky || !stats.length) return;

  var displayP = 0;
  var targetP = 0;
  var rafId = 0;
  var running = false;

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function formatNum(v, decimals) {
    if (decimals > 0) return v.toFixed(decimals);
    return String(Math.round(v));
  }

  function applyVisual(p) {
    p = clamp(p, 0, 1);

    root.classList.toggle("is-active", p > 0.01);
    sticky.classList.toggle("is-active", p > 0.01);
    root.style.setProperty("--impact-p", p.toFixed(4));

    if (curve) {
      /* linear draw — no extra ease that rushes the tip */
      curve.style.setProperty("--curve-p", p.toFixed(4));
    }

    Array.prototype.forEach.call(stats, function (stat, i) {
      /*
       * Stagger slightly, but map 0→1 over almost full scroll.
       * Pure linear (no easeOut) so small scrolls stay near 0.
       */
      var start = i * 0.05;
      /* cap span so the last staggered stat still lands on its final value at p=1 */
      var span = Math.min(0.9, 1 - start);
      var local = clamp((p - start) / span, 0, 1);

      var target = parseFloat(stat.getAttribute("data-value") || "0");
      var decimals = parseInt(stat.getAttribute("data-decimals") || "0", 10) || 0;
      var el = stat.querySelector("[data-count]");
      if (el) el.textContent = formatNum(target * local, decimals);

      /* drive colorful gradient position + bar / glow intensity */
      stat.style.setProperty("--metric-p", local.toFixed(4));
      var metric = stat.querySelector(".metric");
      if (metric) metric.style.setProperty("--metric-p", local.toFixed(4));
    });
  }

  function tickSmooth() {
    rafId = 0;
    var diff = targetP - displayP;
    if (Math.abs(diff) < 0.0005) {
      displayP = targetP;
      applyVisual(displayP);
      running = false;
      return;
    }
    /* slower follow = less “snap” when target moves */
    displayP += diff * 0.1;
    applyVisual(displayP);
    running = true;
    rafId = requestAnimationFrame(tickSmooth);
  }

  function setTargetProgress(p) {
    targetP = clamp(p, 0, 1);
    if (!running) {
      running = true;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tickSmooth);
    }
  }

  /**
   * Band is a normal in-flow section (09-22 Park: 不要钉住). Progress maps
   * viewport entry depth: 0 when the section top enters at the viewport
   * bottom, 1 when its top reaches the viewport top (or when the stats grid
   * is fully on screen — whichever first). Mobile short-form keeps its
   * sticky-entry mapping.
   */
  function readScrollProgress() {
    var rect = root.getBoundingClientRect();
    var stickyRect = sticky.getBoundingClientRect();
    var vh = window.innerHeight || 1;

    if (rect.height > vh * 1.15) {
      var scrolled = clamp(vh - rect.top, 0, vh);
      /* reach 1 slightly early so the tail completes while still visible */
      return clamp(scrolled / (vh * 0.85), 0, 1);
    }

    /* mobile / short: based on how far sticky has entered */
    if (stickyRect.bottom <= 0) return 1;
    if (stickyRect.top >= vh) return 0;
    var visible = clamp(1 - stickyRect.top / vh, 0, 1);
    return visible;
  }

  function update() {
    setTargetProgress(readScrollProgress());
  }

  var scrollTick = false;
  function onScroll() {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(function () {
      scrollTick = false;
      update();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update, { passive: true });

  var prev = window.__updateAiScroll;
  window.__updateAiScroll = function () {
    if (typeof prev === "function") prev();
    // Coalesce — Lenis bus may already rAF; still guard with scrollTick
    onScroll();
  };

  displayP = 0;
  targetP = 0;
  applyVisual(0);
  /* delay first read so layout is stable; still starts at 0 until user scrolls */
  requestAnimationFrame(function () {
    requestAnimationFrame(update);
  });

  teardown = function () {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", update);
    window.__updateAiScroll = typeof prev === "function" ? prev : undefined;
  };
})();

  } catch (err) {
    console.warn("[fx:impact-metrics.js]", err);
  }
  return function dispose() {
    if (typeof teardown === "function") {
      try {
        teardown();
      } catch (e) {
        /* ignore */
      }
      teardown = null;
    }
  };
}

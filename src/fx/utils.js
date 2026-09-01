
/** Shared FX helpers — pure + small DOM utils */

export function prefersReducedMotion() {
  return !!(
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function isMobileLayout() {
  return !!(
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 640px)").matches
  );
}

export function shouldReduceFx() {
  return prefersReducedMotion() || isMobileLayout() || !!window.__reduceFx;
}

/**
 * Observe element visibility; call onChange(boolean).
 * @returns {() => void} unobserve/disconnect
 */
export function observeVisibility(el, onChange, options = {}) {
  if (!el || typeof IntersectionObserver === "undefined") {
    onChange(true);
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => onChange(e.isIntersecting));
    },
    { threshold: options.threshold ?? 0.05, rootMargin: options.rootMargin ?? "80px" }
  );
  io.observe(el);
  return () => io.disconnect();
}

/**
 * Run fn once when browser is idle (or after timeout fallback).
 */
export function whenIdle(fn, timeout = 1200) {
  if (typeof window === "undefined") return () => {};
  let cancelled = false;
  let id;
  const run = () => {
    if (!cancelled) fn();
  };
  if (typeof window.requestIdleCallback === "function") {
    id = window.requestIdleCallback(run, { timeout });
    return () => {
      cancelled = true;
      window.cancelIdleCallback?.(id);
    };
  }
  id = window.setTimeout(run, Math.min(timeout, 400));
  return () => {
    cancelled = true;
    clearTimeout(id);
  };
}

/** Parse impact metric attributes from a node */
export function parseImpactMetric(el) {
  if (!el) return null;
  const value = parseFloat(el.getAttribute("data-value") || "0");
  const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
  const plus = el.getAttribute("data-plus") === "1";
  return {
    value: Number.isFinite(value) ? value : 0,
    decimals: Number.isFinite(decimals) ? decimals : 0,
    plus,
  };
}

export function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/**
 * StrictMode-safe dispose adoption after any await.
 * If the React effect already cleaned up (`cancelled`), call dispose immediately
 * so resources (glass dock, beams, rAF) are never leaked / double-mounted.
 * Otherwise push for the normal effect cleanup path.
 *
 * @param {unknown} d
 * @param {boolean} cancelled
 * @param {(fn: () => void) => void} push
 */
export function adoptDisposeHandle(d, cancelled, push) {
  if (typeof d !== "function") return;
  if (cancelled) {
    try {
      d();
    } catch (e) {
      /* ignore dispose errors */
    }
    return;
  }
  push(d);
}

/**
 * Pure gate: continuous GPU/CPU loops should only run when the section is
 * visible and the document tab is focused. Does not change trigger thresholds.
 */
export function shouldRunContinuousFx({
  sectionVisible = true,
  documentHidden = false,
} = {}) {
  return !!sectionVisible && !documentHidden;
}

export function isDocumentHidden() {
  return !!(typeof document !== "undefined" && document.hidden);
}

/**
 * Subscribe to document visibility changes.
 * @returns {() => void}
 */
export function onDocumentVisibility(onChange) {
  if (typeof document === "undefined") return () => {};
  const handler = () => onChange(!!document.hidden);
  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}

/**
 * Hook a scroll listener onto window.__lenis when it appears — no setInterval poll.
 * Retries with rAF until found or maxWaitMs elapses; always attaches native scroll.
 * @returns {() => void} dispose
 */
export function hookLenisWhenReady(onScroll, { maxWaitMs = 3000 } = {}) {
  if (typeof window === "undefined") return () => {};
  let lenisOff = null;
  let stopped = false;
  let raf = 0;
  let usingNative = true;
  const t0 =
    typeof performance !== "undefined" && performance.now
      ? performance.now()
      : Date.now();

  const tryHook = () => {
    if (stopped || lenisOff) return;
    if (window.__lenis && typeof window.__lenis.on === "function") {
      window.__lenis.on("scroll", onScroll);
      lenisOff = () => {
        try {
          window.__lenis?.off?.("scroll", onScroll);
        } catch (e) {
          /* ignore */
        }
      };
      // Drop native once Lenis owns scroll — avoids double-firing each frame (hero jank)
      if (usingNative) {
        window.removeEventListener("scroll", onScroll);
        usingNative = false;
      }
      return;
    }
    const now =
      typeof performance !== "undefined" && performance.now
        ? performance.now()
        : Date.now();
    if (now - t0 < maxWaitMs) {
      raf = requestAnimationFrame(tryHook);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  tryHook();

  return () => {
    stopped = true;
    if (raf) {
      try {
        cancelAnimationFrame(raf);
      } catch (e) {
        /* ignore */
      }
    }
    if (usingNative) window.removeEventListener("scroll", onScroll);
    if (lenisOff) lenisOff();
  };
}

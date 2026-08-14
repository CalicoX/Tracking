import { useEffect } from "react";
import { prefersReducedMotion } from "./utils.js";

/**
 * Smooth scroll — Lenis with built-in autoRaf (no extra manual rAF loop).
 * Scroll consumers are notified via a single rAF-coalesced __updateAiScroll call.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let cancelled = false;
    let lenis = null;
    let onScroll = null;
    let scrollBusRaf = 0;

    (async () => {
      const mod = await import("lenis");
      if (cancelled) return;
      const Lenis = mod.default;
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
        autoRaf: true,
        prevent: (node) =>
          !!(
            node &&
            node.closest &&
            node.closest(
              "[data-lenis-prevent], .ogl-page, .ai-case-lightbox-scroll, .ai-case-lightbox"
            )
          ),
      });

      window.__lenis = lenis;

      // One rAF per frame for the whole scroll bus — prevents N handlers × N work
      const flushScrollBus = () => {
        scrollBusRaf = 0;
        if (typeof window.__updateAiScroll === "function") {
          try {
            window.__updateAiScroll();
          } catch (e) {
            /* ignore */
          }
        }
      };

      onScroll = () => {
        if (scrollBusRaf) return;
        scrollBusRaf = requestAnimationFrame(flushScrollBus);
      };
      lenis.on("scroll", onScroll);
    })();

    return () => {
      cancelled = true;
      if (scrollBusRaf) cancelAnimationFrame(scrollBusRaf);
      if (lenis) {
        try {
          if (onScroll) lenis.off("scroll", onScroll);
        } catch (e) {
          /* ignore */
        }
        try {
          lenis.destroy();
        } catch (e) {
          /* ignore */
        }
        if (window.__lenis === lenis) delete window.__lenis;
      }
    };
  }, []);
}

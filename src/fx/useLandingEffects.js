import { useEffect } from "react";
import { useLenis } from "./useLenis.js";
import { mountProductDock } from "./mountProductDock.js";
import { mount as mountResponsiveFx } from "./modules/responsive-fx.js";
import {
  adoptDisposeHandle,
  observeVisibility,
  prefersReducedMotion,
  shouldReduceFx,
  whenIdle,
} from "./utils.js";

/**
 * Static import map so Vite emits real FX chunks (literal paths only).
 * responsive-fx is sync-imported below so flags apply before any await.
 */
const FX_LOADERS = {
  borderBeam: () => import("./modules/border-beam.js"),
  undertones: () => import("./modules/undertones-shader.js"),
  heroDraw: () => import("./modules/hero-draw.js"),
  impactMetrics: () => import("./modules/impact-metrics.js"),
  impactBg: () => import("./modules/impact-bg-shader.js"),
  landingInline: () => import("./modules/landing-inline.js"),
  thinkingOrb: () => import("./modules/thinking-orb.js"),
  aiLab: () => import("./modules/ai-lab.js"),
  aiTitleParticles: () => import("./modules/ai-title-particles.js"),
  bottomCta: () => import("./modules/bottom-cta-shader.js"),
};

/**
 * Core + deferred FX via React lifecycle.
 * Perf: no page-level rAF monkey-patch; heavy modules stay dynamic + IO/idle gated.
 * Visual triggers (scroll-into-view / hover / pin) unchanged.
 */
export function useLandingEffects() {
  useLenis();

  useEffect(() => {
    const disposers = [];
    let cancelled = false;

    /** After any await: if effect already cleaned up, dispose immediately — never drop the handle. */
    function adoptDispose(d) {
      adoptDisposeHandle(d, cancelled, (fn) => disposers.push(fn));
    }

    // —— Sync first (static parity): breakpoint classes + __reduceFx before heavy FX ——
    try {
      const disposeResponsive = mountResponsiveFx();
      if (typeof disposeResponsive === "function") {
        disposers.push(disposeResponsive);
      }
    } catch (err) {
      console.warn("[useLandingEffects] responsive", err);
    }

    async function mountNamed(key) {
      if (cancelled || !FX_LOADERS[key]) return;
      try {
        const mod = await FX_LOADERS[key]();
        if (cancelled || !mod?.mount) return;
        const d = mod.mount();
        adoptDispose(d);
      } catch (err) {
        console.warn(`[useLandingEffects] ${key}`, err);
      }
    }

    // —— Core above-the-fold ——
    (async () => {
      // border-beam needed for dock chrome; load in parallel with dock factory
      const beamP = mountNamed("borderBeam");
      try {
        const disposeDock = await mountProductDock();
        adoptDispose(disposeDock);
      } catch (err) {
        console.warn("[useLandingEffects] product dock", err);
      }
      await beamP;

      const visual = document.querySelector(".visual-asm");
      if (visual && !shouldReduceFx()) {
        mountNamed("heroDraw");
      }

      const hero = document.querySelector(".hero");
      /* particle earth runs on phone too (Park) — skip only for reduced motion */
      if (hero && !prefersReducedMotion()) {
        // Idle then IO — hero is above-fold but WebGL undertones can wait a tick
        const stopIdle = whenIdle(() => {
          if (cancelled) return;
          const unvis = observeVisibility(
            hero,
            (vis) => {
              if (vis && !hero.dataset.fxUndertones) {
                hero.dataset.fxUndertones = "1";
                mountNamed("undertones");
              }
            },
            { threshold: 0.02, rootMargin: "40px" }
          );
          disposers.push(unvis);
        }, 600);
        disposers.push(stopIdle);
      }
    })();

    // —— Impact deferred ——
    const impact = document.getElementById("business-impact");
    if (impact) {
      let loaded = false;
      disposers.push(
        observeVisibility(impact, (vis) => {
          if (!vis || loaded) return;
          loaded = true;
          // Metrics first (scroll-driven counters); bg shader idle-deferred (same section)
          mountNamed("impactMetrics");
          if (!shouldReduceFx()) {
            const stop = whenIdle(() => {
              if (!cancelled) mountNamed("impactBg");
            }, 400);
            disposers.push(stop);
          }
        })
      );
    }

    // —— Features / explore deferred ——
    const features = document.getElementById("key-features");
    const explore = document.querySelector(".explore-grid");
    const featuresOrExplore = features || explore;
    if (featuresOrExplore) {
      let loaded = false;
      disposers.push(
        observeVisibility(
          featuresOrExplore,
          (vis) => {
            if (!vis || loaded) return;
            loaded = true;
            mountNamed("landingInline");
          },
          { rootMargin: "120px" }
        )
      );
    }

    // —— AI Lab deferred ——
    // Load early enough that scroll handlers exist before sticky intro fills the screen
    // (too-late mount → title already on screen, stagger is missed).
    const ai = document.getElementById("ai-lab");
    if (ai) {
      let loaded = false;
      disposers.push(
        observeVisibility(
          ai,
          (vis) => {
            if (!vis || loaded) return;
            loaded = true;
            (async () => {
              await mountNamed("thinkingOrb");
              await mountNamed("aiLab");
              if (cancelled) return;
              // Kick scroll bus so wantIn → setIn runs while intro is in view
              try {
                window.dispatchEvent(new Event("scroll"));
                if (typeof window.__updateAiScroll === "function") {
                  window.__updateAiScroll();
                }
              } catch (e) {
                /* ignore */
              }
              // Hover particles after lab (title enter is owned by ai-lab setIn)
              if (!cancelled && !prefersReducedMotion()) {
                const stop = whenIdle(() => {
                  if (!cancelled) mountNamed("aiTitleParticles");
                }, 900);
                disposers.push(stop);
              }
            })();
          },
          { rootMargin: "70% 0px" }
        )
      );
    }

    // —— Bottom CTA deferred ——
    const cta = document.getElementById("bottom-cta");
    if (cta && !shouldReduceFx()) {
      let loaded = false;
      disposers.push(
        observeVisibility(cta, (vis) => {
          if (!vis || loaded) return;
          loaded = true;
          mountNamed("bottomCta");
        })
      );
    }

    return () => {
      cancelled = true;
      disposers.forEach((d) => {
        try {
          d();
        } catch (e) {
          /* ignore */
        }
      });
    };
  }, []);
}

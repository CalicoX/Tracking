import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "src");

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

describe("React landing structure (gating)", () => {
  it("App mounts LandingPage section tree, not only LegacyLanding", () => {
    const app = read("App.jsx");
    expect(app).toMatch(/LandingPage/);
    expect(app).not.toMatch(/LegacyLanding/);
    expect(app).not.toMatch(/bootstrapLandingFx/);
  });

  it("LandingPage composes multiple real sections", () => {
    const lp = read("components/LandingPage.jsx");
    for (const name of [
      "Topbar",
      "Hero",
      "TrustBand",
      "ImpactBand",
      "FeaturesSection",
      "AiLab",
      "ExploreMore",
      "BrandsSay",
      "Credentials",
      "BottomCta",
      "Footer",
      "ProductDock",
    ]) {
      expect(lp).toContain(name);
      const sectionPath =
        name === "Topbar" || name === "Footer" || name === "ProductDock"
          ? `components/layout/${name}.jsx`
          : `components/sections/${name}.jsx`;
      expect(existsSync(join(root, sectionPath))).toBe(true);
    }
  });

  it("useLandingEffects is the primary FX path (no SCRIPT_CHAIN inject)", () => {
    const fx = read("fx/useLandingEffects.js");
    expect(fx).toMatch(/useLandingEffects/);
    expect(fx).toMatch(/import\(/);
    // forbid runtime vite-ignore on variable imports (comment prose alone is fine)
    expect(fx).not.toMatch(/import\s*\(\s*\/\*\s*@vite-ignore\s*\*\/\s*path/);
    expect(fx).not.toMatch(/import\s*\(\s*\/\*\s*@vite-ignore\s*\*\/\s*[a-zA-Z_$]/);
    expect(fx).not.toMatch(/createElement\(["']script["']\)/);
    expect(fx).toMatch(/observeVisibility|IntersectionObserver/);
    // responsive-fx is sync-mounted first (static parity); other FX stay dynamic chunks
    expect(fx).toMatch(/mountResponsiveFx|from ["']\.\/modules\/responsive-fx\.js["']/);
    expect(fx).toMatch(/import\(["']\.\/modules\/liquid-glass-dock\.js["']\)|mountProductDock/);
    const boot = read("fx/bootstrapLandingFx.js");
    expect(boot).toMatch(/retired|no-op|useLandingEffects/i);
    expect(boot).not.toMatch(/SCRIPT_CHAIN\s*=\s*\[/);
  });

  it("LandingPage provides glass-source/output canvases for dock FX", () => {
    const land = read("components/LandingPage.jsx");
    expect(land).toMatch(/id="glass-source"/);
    expect(land).toMatch(/id="glass-output"/);
    expect(land).toMatch(/glass-shell/);
    const dock = read("components/layout/ProductDock.jsx");
    expect(dock).toMatch(/product-dock/);
    const hero = read("components/sections/Hero.jsx");
    expect(hero).toMatch(/className="hero"/);
  });

  it("product dock mounts above-the-fold via mountProductDock", () => {
    const fx = read("fx/useLandingEffects.js");
    expect(fx).toMatch(/mountProductDock/);
    // StrictMode mid-await: must adoptDispose / adoptDisposeHandle (never drop disposeDock)
    expect(fx).toMatch(/adoptDisposeHandle|adoptDispose/);
    expect(fx).toMatch(/adoptDispose\(disposeDock\)/);
    const dock = read("fx/mountProductDock.js");
    expect(dock).toMatch(/createLiquidGlassDock/);
    expect(dock).toMatch(/destroy/);
    expect(dock).toMatch(/return function dispose/);
  });

  it("border-beam dispose clears data-beam for StrictMode remount", () => {
    const beam = read("fx/modules/border-beam.js");
    expect(beam).toMatch(/removeAttribute\(["']data-beam["']\)/);
    expect(beam).toMatch(/data-beam-bloom/);
    expect(beam).toMatch(/destroy\s*:\s*function/);
    // dispose path must call destroy (not only setActive(false))
    expect(beam).toMatch(/api\.destroy/);
  });

  it("heavy modules load via deferred visibility gates", () => {
    const fx = read("fx/useLandingEffects.js");
    expect(fx).toMatch(/undertones-shader/);
    expect(fx).toMatch(/impact-bg|impactMetrics|impact-metrics/);
    expect(fx).toMatch(/aiLab|ai-lab/);
    expect(fx).toMatch(/bottomCta|bottom-cta/);
    expect(fx).toMatch(/shouldReduceFx|prefersReducedMotion|whenIdle/);
    // no page-level rAF monkey-patch (main-thread waste)
    expect(fx).not.toMatch(/window\.requestAnimationFrame\s*=/);
    // hover particles idle-deferred after aiLab
    expect(fx).toMatch(/whenIdle/);
    expect(fx).toMatch(/aiTitleParticles/);
  });

  it("Lenis is dynamic-imported (not static entry dep)", () => {
    const lenis = read("fx/useLenis.js");
    expect(lenis).toMatch(/import\(["']lenis["']\)/);
    expect(lenis).not.toMatch(/^import Lenis from/m);
    expect(lenis).toMatch(/autoRaf:\s*true/);
  });

  it("interaction mount points remain wired", () => {
    const fx = read("fx/useLandingEffects.js");
    expect(fx).toMatch(/mountProductDock/);
    expect(fx).toMatch(/key-features|landingInline/);
    expect(fx).toMatch(/business-impact|impactMetrics/);
    expect(fx).toMatch(/ai-lab/);
    expect(fx).toMatch(/bottom-cta|bottomCta/);
    const features = read("components/sections/FeaturesSection.jsx");
    expect(features).toMatch(/feature-scroll|id="feature-scroll"/);
    expect(features).toMatch(/Last-Mile Visibility/);
    expect(features).toMatch(/Split-Order Management/);
    expect(features).toMatch(/Branded Tracking Experience/);
    expect(features).not.toMatch(/Proactive notifications/);
    expect(features).not.toMatch(/data-feature="3"/);
    expect(features).toMatch(/Last-mile Carrier/);
    expect(features).toMatch(/Package #1/);
    expect(features).toMatch(/You may also like/);
    const impact = read("components/sections/ImpactBand.jsx");
    expect(impact).toMatch(/business-impact|data-impact/);
    const dock = read("components/layout/ProductDock.jsx");
    expect(dock).toMatch(/product-tabs|product-dock/);
  });

  it("shader modules pause continuous work when document.hidden", () => {
    for (const name of [
      "undertones-shader.js",
      "impact-bg-shader.js",
      "bottom-cta-shader.js",
    ]) {
      const mod = read(`fx/modules/${name}`);
      expect(mod).toMatch(/document\.hidden/);
      expect(mod).toMatch(/visibilitychange/);
    }
  });

  it("AI Lab title FX: aiLab before particles; particles may be idle-deferred", () => {
    const fx = read("fx/useLandingEffects.js");
    const iLab = fx.indexOf('await mountNamed("aiLab")');
    const iPart = fx.indexOf('mountNamed("aiTitleParticles")');
    expect(iLab).toBeGreaterThan(-1);
    expect(iPart).toBeGreaterThan(iLab);
    const lab = read("fx/modules/ai-lab.js");
    // must not wipe title with bare textContent = "" (destroys particle shell)
    expect(lab).not.toMatch(/h2\.textContent\s*=\s*["']["']/);
    expect(lab).toMatch(/ai-title-solid/);
    const particles = read("fx/modules/ai-title-particles.js");
    expect(particles).toMatch(/ensureShellInDom/);
  });

  it("FX modules export mount() and return a dispose function", () => {
    for (const name of [
      "responsive-fx.js",
      "liquid-glass-dock.js",
      "undertones-shader.js",
      "landing-inline.js",
      "impact-metrics.js",
      "impact-bg-shader.js",
      "bottom-cta-shader.js",
      "thinking-orb.js",
      "ai-title-particles.js",
      "border-beam.js",
      "ai-lab.js",
      "hero-draw.js",
    ]) {
      const mod = read(`fx/modules/${name}`);
      expect(mod).toMatch(/export function mount\s*\(/);
      expect(mod).toMatch(/return function dispose|return \(\)\s*=>/);
      // dispose must not be an empty no-op body
      expect(mod).not.toMatch(/return function dispose\(\)\s*\{\s*\}/);
    }
  });

  it("responsive CSS parity: major breakpoints + mobile layout outcomes", () => {
    const css = read("styles/landing.css");
    for (const bp of ["1024px", "900px", "768px", "480px"]) {
      expect(css).toMatch(new RegExp(`@media\\s*\\(max-width:\\s*${bp}\\)`));
    }
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    // desktop-only mock scale — never default on all widths
    expect(css).toMatch(/@media\s*\(min-width:\s*1025px\)/);
    expect(css).toMatch(/scale\(0\.92\)/);
    // 768 outcomes (main mobile layout block)
    const i768 = css.indexOf("/* —— ≤768");
    expect(i768).toBeGreaterThan(-1);
    const block768 = css.slice(i768, i768 + 12000);
    expect(block768).toMatch(/\.float-card/);
    expect(block768).toMatch(/display:\s*none/);
    expect(block768).toMatch(/order:\s*-1/);
    expect(block768).toMatch(/display:\s*contents/);
    expect(block768).toMatch(/mask-image:\s*linear-gradient/);
    expect(block768).toMatch(/\.ai-lab-intro/);
    expect(block768).toMatch(/position:\s*relative/);
    // mobile keeps earth + logo marquee + growth curve (Park)
    expect(block768).not.toMatch(/hero-undertones/);
    expect(block768).not.toMatch(/\.logos-track/);
    expect(block768).toMatch(/\.impact-curve/);
    // 900 hero stack (comment-marked block, not overflow-x helper)
    const i900 = css.indexOf("/* —— ≤900");
    expect(i900).toBeGreaterThan(-1);
    const block900 = css.slice(i900, i900 + 2000);
    expect(block900).toMatch(/\.hero-inner/);
    expect(block900).toMatch(/grid-template-columns:\s*1fr/);
    // Features mobile accordion (≤980): hide non-active panels
    const i980 = css.indexOf("@media (max-width: 980px)");
    expect(i980).toBeGreaterThan(-1);
    // find the block that contains feature-scroll auto height
    const featMobile = css.includes(".feature-panel:not(.is-active)") &&
      css.includes("display: none !important");
    expect(featMobile).toBe(true);
    const inline = read("fx/modules/landing-inline.js");
    expect(inline).toMatch(/mqMobile\.matches/);
    expect(inline).toMatch(/Accordion/);
  });

  it("responsive-fx is sync-mounted before async heavy FX in useLandingEffects", () => {
    const fx = read("fx/useLandingEffects.js");
    const iSync = fx.indexOf("mountResponsiveFx");
    const iAsync = fx.indexOf("async function mountNamed");
    expect(iSync).toBeGreaterThan(-1);
    expect(iAsync).toBeGreaterThan(-1);
    // call site of sync mount appears before async heavy boot IIFE that uses mountNamed
    const iCall = fx.indexOf("mountResponsiveFx()");
    const iCore = fx.indexOf("// —— Core above-the-fold");
    expect(iCall).toBeGreaterThan(-1);
    expect(iCall).toBeLessThan(iCore);
  });
});


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
      "CoverageBand",
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
    expect(lp).toMatch(/<TrustBand \/>\s*<BrandsSay \/>\s*<ImpactBand \/>/);
    expect(lp).toMatch(
      /<AiLab \/>\s*<Credentials \/>\s*<ExploreMore \/>\s*<CoverageBand \/>\s*<BottomCta \/>/
    );
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
    expect(fx).toMatch(/if \(visual && !prefersReducedMotion\(\)\)/);
    expect(fx).toMatch(/mountNamed\("heroDraw"\)/);
    const draw = read("fx/modules/hero-draw.js");
    expect(draw).toMatch(/if \(prefersReducedMotion\(\)\)/);
    expect(draw).not.toMatch(/shouldReduceFx/);
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
    // 09-08 文案：4 个卖点标签（手风琴，首字母大写），不再锁旧三块标题
    expect(features).toMatch(/Branded Tracking Page/);
    expect(features).toMatch(/Branded Email Notification/);
    expect(features).toMatch(/Split-Order Management/);
    expect(features).toMatch(/Conversion &amp; Loyalty/);
    expect(features).not.toMatch(/Proactive notifications/);
    expect(features).not.toMatch(/data-feature="4"/);
    expect(features).toMatch(/feature-desc/);
    expect(features).toMatch(/Create flow/);
    expect(features).toMatch(/Track order/);
    expect(features).toMatch(/shipping@yourstore\.com/);
    expect(features).toMatch(/notify@17track.net/);
    expect(features).toMatch(/assets\/products\/tips\.jpg/);
    expect(features).toMatch(/Recommended For You/);
    expect(features).toMatch(/You might also like/);
    expect(features).toMatch(/Add to Cart/);
    expect(features).toMatch(/Package #1/);
    expect(features).toMatch(/HeroTrackingMock/);
    expect(features).toMatch(/fx-hero-page/);
    expect(features).not.toMatch(/fx-br-brand/);
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
      "ai-curtain.js",
      "ai-intro-ascii.js",
      "hero-draw.js",
    ]) {
      const mod = read(`fx/modules/${name}`);
      expect(mod).toMatch(/export function mount\s*\(/);
      expect(mod).toMatch(/return function dispose|return \(\)\s*=>/);
      // dispose must not be an empty no-op body
      expect(mod).not.toMatch(/return function dispose\(\)\s*\{\s*\}/);
    }
  });

  it("AI example module is vertically centered below the topbar", () => {
    const css = read("styles/landing.css");
    expect(css).toMatch(
      /\.ai-letter-sticky \.ai-lab-sticky[\s\S]{0,400}padding-top:\s*var\(--topbar-h/
    );
  });

  it("AI curtain: hold after pin, then particles scatter (cloth retired)", () => {
    const curtain = read("fx/modules/ai-curtain.js");
    expect(curtain).toMatch(/AI_HOLD_VH = 0\.36/);
    expect(curtain).toMatch(/scrolled - holdPx/);
    expect(curtain).toMatch(/getContext\("webgl2"/);
    // 反向 particle-scroll：能 html-in-canvas 走活 HTML，否则 html2canvas 抓当前屏幕原样
    expect(curtain).toMatch(/drawElementImage/);
    expect(curtain).toMatch(/layoutsubtree/);
    expect(curtain).toMatch(/requestPaint/);
    expect(curtain).toMatch(/import\("html2canvas"\)/);
    expect(curtain).toMatch(/flattenClipText/);
    expect(curtain).toMatch(/uContent/);
    expect(curtain).toMatch(/drawArraysInstanced/);
    expect(curtain).toMatch(/TRIANGLE_STRIP/);
    expect(curtain).toMatch(/sticky\.appendChild\(view\)/);
    expect(curtain).toMatch(/is-curtain-on/);
    expect(curtain).not.toMatch(/uLift|peelDir|paintIntro/);
    expect(curtain).toMatch(/drawImage\(glc/);
    const fx = read("fx/useLandingEffects.js");
    expect(fx).not.toMatch(/mountNamed\("aiLetterZoom"\)/);
    // 窗帘整屏粒子太卡（html2canvas + 数十万实例），09-09 卸挂载
    expect(fx).not.toMatch(/mountNamed\("aiCurtain"\)/);
  });

  it("AI intro flowing gradient + grain (no html2canvas)", () => {
    const fx = read("fx/useLandingEffects.js");
    expect(fx).toMatch(/mountNamed\("aiIntroAscii"\)/);
    expect(fx).not.toMatch(/mountNamed\("aiCurtain"\)/);
    const ascii = read("fx/modules/ai-intro-ascii.js");
    const sample = read("fx/modules/ai-intro-flow-sample.js");
    const preset = read("fx/modules/ai-intro-synthesis-preset.js");
    const gl = read("fx/modules/ai-intro-flow-gl.js");
    expect(ascii).toMatch(/export function mount\s*\(/);
    expect(ascii).toMatch(/AI_HOLD_VH = 0\.36/);
    expect(ascii).toMatch(/AI_EXIT_VH = 0\.48/);
    expect(ascii).toMatch(/getContext\("2d"/);
    expect(ascii).toMatch(/is-ascii-out/);
    expect(ascii).toMatch(/document\.hidden/);
    expect(ascii).toMatch(/shouldReduceFx|isMobileLayout/);
    expect(ascii).toMatch(/sampleIntroFlow/);
    expect(ascii).toMatch(/createIntroFlowGl/);
    expect(sample).toMatch(/export function sampleIntroFlow/);
    expect(sample).toMatch(/grainTerm/);
    expect(sample).toMatch(/addGlow/);
    expect(preset).toMatch(/c91ae513-d656-4f32-933f-fdcd579495e2/);
    expect(preset).toMatch(/#08071a/);
    expect(preset).toMatch(/#0582e8/);
    expect(preset).toMatch(/#f00e94/);
    expect(gl).toMatch(/createIntroFlowGl/);
    expect(gl).toMatch(/getContext\("webgl"/);
    expect(gl).toMatch(/addGlow/);
    expect(gl).toMatch(/punchLin/);
    expect(gl).toMatch(/GRAIN_AMT/);
    expect(gl).toMatch(/uDpr/);
    expect(gl).not.toMatch(/GRAIN_AMT \* 0\.1/);
    expect(gl).not.toMatch(/gUv \* 0\.5/);
    expect(gl).toMatch(/waveDistort/);
    expect(gl).not.toMatch(/shaders\/react/);
    expect(ascii).not.toMatch(/shaders\/react/);
    expect(ascii).not.toMatch(/import\(["']html2canvas["']\)/);
    expect(ascii).not.toMatch(/drawElementImage/);
    expect(ascii).not.toMatch(/BAYER8/);
    expect(ascii).not.toMatch(/ImageTexture/);
    const jsx = read("components/sections/AiLab.jsx");
    expect(jsx).toMatch(/ai-intro-ascii/);
    expect(jsx).not.toMatch(/ai-intro-matrix/);
    expect(ascii).not.toMatch(/fillMatrix/);
    expect(ascii).not.toMatch(/MATRIX_GLYPHS/);
    expect(ascii).not.toMatch(/pointermove/);
    expect(ascii).not.toMatch(/ai-intro-matrix-fx/);
    const css = read("styles/landing.css");
    expect(css).not.toMatch(/\.ai-intro-matrix/);
    expect(css).toMatch(/rgba\(8, 7, 26, 0\.78\)/);
    expect(css).toMatch(/--ascii-copy/);
    expect(css).toMatch(/is-ascii-out/);
    expect(css).toMatch(
      /\.ai-letter-sticky \.ai-lab-intro\s*\{[^}]*pointer-events:\s*auto/
    );
    expect(css).toMatch(/\.ai-lab-intro\s*\{[^}]*background:\s*#08071a/);
    expect(css).not.toMatch(
      /is-ascii-on\s*>\s*\.ai-lab-intro\s*\{[^}]*background:\s*transparent/
    );
  });

  it("responsive CSS parity: major breakpoints + mobile layout outcomes", () => {
    const css = read("styles/landing.css");
    // 2026-09-01 断点并档（对齐 API 仓，Park 定案）：全站只用 640/768/1024 三档
    for (const bp of ["1024px", "768px", "640px"]) {
      expect(css).toMatch(new RegExp(`@media\\s*\\(max-width:\\s*${bp}\\)`));
    }
    // 旧化石断点不允许回来
    for (const bp of ["480px", "520px", "560px", "680px", "720px", "900px", "980px", "1100px"]) {
      expect(css).not.toMatch(new RegExp(`@media\\s*\\(max-width:\\s*${bp}\\)`));
    }
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    const iHeroOgl = css.indexOf(".hero-ogl {");
    expect(iHeroOgl).toBeGreaterThan(-1);
    const heroOgl = css.slice(iHeroOgl, iHeroOgl + 500);
    expect(heroOgl).toMatch(/font-family:\s*Inter/);
    expect(heroOgl).toMatch(/sans-serif/);
    expect(heroOgl).not.toMatch(/Georgia|Playfair/);
    // desktop-only mock scale — never default on all widths
    expect(css).toMatch(/@media\s*\(min-width:\s*1025px\)/);
    expect(css).toMatch(/scale\(0\.92\)/);
    // 768 outcomes (main mobile layout block)
    const i768 = css.indexOf("/* —— ≤768");
    expect(i768).toBeGreaterThan(-1);
    const block768 = css.slice(i768, i768 + 18000);
    expect(block768).toMatch(/\.float-card/);
    expect(block768).toMatch(/display:\s*none/);
    expect(block768).toMatch(/order:\s*-1/);
    expect(block768).toMatch(/background:\s*transparent/);
    expect(block768).toMatch(/mask-image:\s*linear-gradient/);
    // 768 keeps Hero draw; do not hide overlay via the 768 media query
    expect(css).not.toMatch(
      /@media\s*\(max-width:\s*768px\),\s*\(prefers-reduced-motion:\s*reduce\)/
    );
    expect(css).not.toMatch(/html\.is-reduce-fx\s+\.draw-overlay/);
    expect(block768).toMatch(/grid-template-columns:\s*1fr\s+1fr/);
    expect(block768).toMatch(/\.ai-pill-label/);
    expect(block768).toMatch(/\.ai-lab-intro/);
    expect(block768).toMatch(/position:\s*relative/);
    expect(block768).toMatch(/calc\(100vh - 100px\)/);
    expect(block768).toMatch(/\.ai-case-art \.ogl-status/);
    expect(block768).not.toMatch(/\.api-ascii \{\s*display:\s*none/);
    expect(block768).not.toMatch(/\.api-ascii-a[\s\S]{0,120}animation:\s*none/);
    // mobile keeps earth + logo marquee + growth curve (Park)
    expect(block768).not.toMatch(/hero-undertones/);
    expect(block768).not.toMatch(/\.logos-track/);
    expect(block768).toMatch(/\.impact-curve/);
    expect(block768).toMatch(/\.site-footer-nav/);
    expect(block768).toMatch(/repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
    const i1024feat = css.indexOf("/* 769–1024 two-column Features");
    expect(i1024feat).toBeGreaterThan(-1);
    const block1024feat = css.slice(i1024feat, i1024feat + 900);
    expect(block1024feat).toMatch(/\.fx-hero-page/);
    expect(block1024feat).toMatch(/min-width:\s*min\(280px/);
    expect(block768).toMatch(/\.fx-hero-page/);
    expect(block768).toMatch(/\.fx-br-form/);
    expect(block768).toMatch(/width:\s*264px/);
    expect(block768).toMatch(/margin-left:\s*-24px/);
    expect(block768).toMatch(/\.impact-band h2/);
    // 根 token 已曲线化（fluid type），≤768 不再需要 font-size 覆盖
    expect(css).toMatch(/--fs-h2:\s*clamp\(24px,\s*calc\(18\.24px \+ 1\.6vw\),\s*40px\)/);
    const rootBlock = css.slice(0, css.indexOf("}"));
    expect(rootBlock).not.toMatch(/font-size:\s*var\(--fs-h2\)/);
    const i640 = css.indexOf("/* —— ≤640 phone");
    expect(i640).toBeGreaterThan(-1);
    const block480 = css.slice(i640, i640 + 14000);
    expect(block480).toMatch(/\.features-section > \.section-inner/);
    expect(block480).toMatch(/padding-top:\s*72px/);
    expect(block480).toMatch(/flex-direction:\s*column/);
    expect(block480).toMatch(/grid-template-columns:\s*1fr\s*!important/);
    expect(block480).toMatch(/display:\s*contents/);
    expect(block480).toMatch(/\.explore-card \.explore-link/);
    expect(block480).toMatch(/margin-top:\s*20px/);
    // 768 hero stack（原 ≤900 并档；comment-marked block, not overflow-x helper）
    const i768stack = css.indexOf("/* —— ≤900 → 768");
    expect(i768stack).toBeGreaterThan(-1);
    const block900 = css.slice(i768stack, i768stack + 2000);
    expect(block900).toMatch(/\.hero-inner/);
    expect(block900).toMatch(/grid-template-columns:\s*1fr/);
    // Features phone tiles (≤640): hide-non-active still in CSS, then contents shows all
    const i640media = css.indexOf("@media (max-width: 640px)");
    expect(i640media).toBeGreaterThan(-1);
    // find the block that contains feature-scroll auto height
    const featMobile = css.includes(".feature-panel:not(.is-active)") &&
      css.includes("display: none !important");
    expect(featMobile).toBe(true);
    const inline = read("fx/modules/landing-inline.js");
    expect(inline).toMatch(/mqMobile\.matches/);
    expect(inline).toMatch(/max-width: 640px/);
    expect(inline).toMatch(/Accordion/);
    expect(inline).toMatch(/reduce \|\| phone/);
    expect(inline).not.toMatch(/setTilt/);
    expect(css).toMatch(/returns-ui-photo/);
    expect(css).toMatch(/backdrop-filter:\s*blur/);
    // Vite 8 lightningcss keeps the last of the pair; -webkit- after standard
    // drops the unprefixed property and Chrome loses glass on Vercel.
    expect(css).not.toMatch(/backdrop-filter:[^;]+;\s*-webkit-backdrop-filter:/);
    const explore = read("components/sections/ExploreMore.jsx");
    expect(explore).toMatch(/returns-ui-photo/);
    expect(explore).toMatch(/returns-scene\.jpg/);
    expect(explore).toMatch(/returns-ui-thumb/);
    expect(explore).toMatch(/returns-ui-thumb">\s*<img src="\/assets\/returns-scene\.jpg"/);
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


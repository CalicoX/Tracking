import { describe, it, expect, vi, afterEach } from "vitest";
import {
  shouldRunContinuousFx,
  hookLenisWhenReady,
  adoptDisposeHandle,
} from "./utils.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Perf gates that drive shipped helpers + source contracts.
 * Ensures we improve load/runtime without dropping interaction wiring.
 */
describe("perf gates (shipped path)", () => {
  it("shouldRunContinuousFx matches pause-when-hidden policy", () => {
    // Mirrors undertones / impact-bg / bottom-cta start() guards
    const cases = [
      [{ sectionVisible: true, documentHidden: false }, true],
      [{ sectionVisible: true, documentHidden: true }, false],
      [{ sectionVisible: false, documentHidden: false }, false],
    ];
    for (const [input, want] of cases) {
      expect(shouldRunContinuousFx(input)).toBe(want);
    }
  });

  it("mountProductDock loads dock without extra per-frame scroll hook", () => {
    const src = readFileSync(
      join(process.cwd(), "src/fx/mountProductDock.js"),
      "utf8"
    );
    // frosted dock theme is handled inside liquid-glass (throttled); no setInterval
    expect(src).not.toMatch(/setInterval\s*\(/);
    expect(src).toMatch(/createLiquidGlassDock/);
    expect(src).toMatch(/destroy/);
  });

  it("Lenis uses autoRaf and coalesces scroll bus", () => {
    const src = readFileSync(join(process.cwd(), "src/fx/useLenis.js"), "utf8");
    expect(src).toMatch(/autoRaf:\s*true/);
    expect(src).toMatch(/requestAnimationFrame\(flushScrollBus\)|scrollBusRaf/);
  });

  it("useLandingEffects does not monkey-patch requestAnimationFrame", () => {
    const src = readFileSync(
      join(process.cwd(), "src/fx/useLandingEffects.js"),
      "utf8"
    );
    expect(src).not.toMatch(/window\.requestAnimationFrame\s*=/);
    expect(src).not.toMatch(/origRAF/);
    // still defers heavy work
    expect(src).toMatch(/observeVisibility/);
    expect(src).toMatch(/whenIdle/);
    expect(src).toMatch(/import\(["']\.\/modules\/ai-lab\.js["']\)/);
  });

  it("FX_LOADERS keep heavy modules out of entry via dynamic import literals", () => {
    const src = readFileSync(
      join(process.cwd(), "src/fx/useLandingEffects.js"),
      "utf8"
    );
    const heavy = [
      "undertones-shader",
      "impact-bg-shader",
      "ai-lab",
      "ai-intro-ascii",
      "ai-title-particles",
      "bottom-cta-shader",
      "landing-inline",
    ];
    for (const name of heavy) {
      expect(src).toMatch(new RegExp(`import\\(["']\\.\\/modules\\/${name}\\.js["']\\)`));
    }
  });

  describe("hookLenisWhenReady runtime", () => {
    afterEach(() => {
      delete window.__lenis;
    });

    it("disposes native + lenis listeners", () => {
      const onScroll = vi.fn();
      const off = vi.fn();
      window.__lenis = {
        on: vi.fn(),
        off,
      };
      const dispose = hookLenisWhenReady(onScroll, { maxWaitMs: 50 });
      dispose();
      expect(off).toHaveBeenCalled();
      // after dispose, scroll should not throw
      window.dispatchEvent(new Event("scroll"));
    });
  });

  it("cancelled adoptDispose still tears down (StrictMode + perf unmount)", () => {
    const d = vi.fn();
    adoptDisposeHandle(d, true, () => {
      throw new Error("must not push when cancelled");
    });
    expect(d).toHaveBeenCalledTimes(1);
  });
});

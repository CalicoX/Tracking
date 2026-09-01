import { describe, it, expect, afterEach } from "vitest";
import { mount } from "./modules/responsive-fx.js";
import { shouldReduceFx, isMobileLayout } from "./utils.js";

/**
 * Drives the real responsive-fx mount() — same path heavy shaders read.
 */
describe("responsive-fx mount (shipped)", () => {
  const originalMatch = window.matchMedia;
  let dispose = null;

  afterEach(() => {
    if (typeof dispose === "function") {
      try {
        dispose();
      } catch (e) {
        /* ignore */
      }
      dispose = null;
    }
    window.matchMedia = originalMatch;
    delete window.__reduceFx;
    delete window.__isMobileLayout;
    document.documentElement.classList.remove(
      "is-bp-1024",
      "is-bp-768",
      "is-bp-480",
      "is-reduce-fx",
      "is-touch"
    );
  });

  function mockMqs({ w1024 = false, w768 = false, w640 = false, reduce = false, coarse = false } = {}) {
    window.matchMedia = (q) => {
      const s = String(q);
      let matches = false;
      if (s.includes("1024")) matches = w1024;
      else if (s.includes("768")) matches = w768;
      else if (s.includes("640")) matches = w640;
      else if (s.includes("prefers-reduced-motion")) matches = reduce;
      else if (s.includes("pointer: coarse")) matches = coarse;
      return {
        matches,
        media: s,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
      };
    };
  }

  it("desktop: no mobile layout flags", () => {
    mockMqs({});
    dispose = mount();
    const root = document.documentElement;
    expect(root.classList.contains("is-bp-768")).toBe(false);
    expect(root.classList.contains("is-reduce-fx")).toBe(false);
    expect(window.__isMobileLayout).toBe(false);
    expect(window.__reduceFx).toBe(false);
    expect(isMobileLayout() || shouldReduceFx()).toBe(false);
  });

  it("≤768 tablet keeps desktop FX（2026-09-01 断点并档：FX 降级线=640）", () => {
    mockMqs({ w1024: true, w768: true });
    dispose = mount();
    const root = document.documentElement;
    expect(root.classList.contains("is-bp-1024")).toBe(true);
    expect(root.classList.contains("is-bp-768")).toBe(true);
    expect(root.classList.contains("is-reduce-fx")).toBe(false);
    expect(window.__reduceFx).toBe(false);
    expect(shouldReduceFx()).toBe(false);
  });

  it("≤640 phone sets mobile layout + reduce FX", () => {
    mockMqs({ w1024: true, w768: true, w640: true });
    dispose = mount();
    const root = document.documentElement;
    expect(root.classList.contains("is-bp-480")).toBe(true);
    expect(root.classList.contains("is-reduce-fx")).toBe(true);
    expect(window.__isMobileLayout).toBe(true);
    expect(window.__reduceFx).toBe(true);
    expect(shouldReduceFx()).toBe(true);
  });

  it("prefers-reduced-motion sets reduce without requiring 768", () => {
    mockMqs({ reduce: true });
    dispose = mount();
    expect(document.documentElement.classList.contains("is-reduce-fx")).toBe(true);
    expect(window.__reduceFx).toBe(true);
    expect(shouldReduceFx()).toBe(true);
  });

  it("dispose removes media listeners without throwing", () => {
    mockMqs({ w768: true });
    dispose = mount();
    expect(() => dispose()).not.toThrow();
    dispose = null;
  });
});

import { describe, it, expect, afterEach, vi } from "vitest";
import {
  adoptDisposeHandle,
  clamp,
  hookLenisWhenReady,
  parseImpactMetric,
  prefersReducedMotion,
  shouldReduceFx,
  shouldRunContinuousFx,
} from "./utils.js";

describe("fx/utils", () => {
  describe("clamp", () => {
    it("clamps below min", () => {
      expect(clamp(-1, 0, 10)).toBe(0);
    });
    it("clamps above max", () => {
      expect(clamp(99, 0, 10)).toBe(10);
    });
    it("passes through mid", () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
  });

  describe("parseImpactMetric", () => {
    it("returns null for missing el", () => {
      expect(parseImpactMetric(null)).toBe(null);
    });
    it("parses data attributes from a real element", () => {
      const el = document.createElement("div");
      el.setAttribute("data-value", "95");
      el.setAttribute("data-decimals", "0");
      el.setAttribute("data-plus", "1");
      expect(parseImpactMetric(el)).toEqual({
        value: 95,
        decimals: 0,
        plus: true,
      });
    });
    it("parses decimals metric", () => {
      const el = document.createElement("div");
      el.setAttribute("data-value", "3.3");
      el.setAttribute("data-decimals", "1");
      const m = parseImpactMetric(el);
      expect(m.value).toBeCloseTo(3.3);
      expect(m.decimals).toBe(1);
      expect(m.plus).toBe(false);
    });
  });

  describe("shouldRunContinuousFx (off-screen / tab-hidden gate)", () => {
    it("runs only when section visible and document focused", () => {
      expect(
        shouldRunContinuousFx({ sectionVisible: true, documentHidden: false })
      ).toBe(true);
      expect(
        shouldRunContinuousFx({ sectionVisible: false, documentHidden: false })
      ).toBe(false);
      expect(
        shouldRunContinuousFx({ sectionVisible: true, documentHidden: true })
      ).toBe(false);
      expect(
        shouldRunContinuousFx({ sectionVisible: false, documentHidden: true })
      ).toBe(false);
    });
  });

  describe("hookLenisWhenReady", () => {
    it("hooks __lenis scroll and drops native once Lenis is ready", () => {
      const onScroll = vi.fn();
      const handlers = [];
      const lenis = {
        on: vi.fn((ev, fn) => {
          if (ev === "scroll") handlers.push(fn);
        }),
        off: vi.fn(),
      };
      window.__lenis = lenis;
      const dispose = hookLenisWhenReady(onScroll, { maxWaitMs: 100 });
      expect(lenis.on).toHaveBeenCalled();
      // Lenis path (native is removed after hook to avoid double-fire jank)
      handlers.forEach((fn) => fn());
      expect(onScroll).toHaveBeenCalled();
      // native should not also fire after Lenis owns scroll
      onScroll.mockClear();
      window.dispatchEvent(new Event("scroll"));
      expect(onScroll).not.toHaveBeenCalled();
      dispose();
      delete window.__lenis;
    });

    it("uses native scroll until Lenis appears", () => {
      const onScroll = vi.fn();
      delete window.__lenis;
      const dispose = hookLenisWhenReady(onScroll, { maxWaitMs: 0 });
      window.dispatchEvent(new Event("scroll"));
      expect(onScroll).toHaveBeenCalled();
      dispose();
    });
  });

  describe("adoptDisposeHandle (StrictMode mid-await)", () => {
    it("calls dispose immediately when cancelled (never drop the handle)", () => {
      const dispose = vi.fn();
      const push = vi.fn();
      adoptDisposeHandle(dispose, true, push);
      expect(dispose).toHaveBeenCalledTimes(1);
      expect(push).not.toHaveBeenCalled();
    });

    it("pushes dispose when effect is still live", () => {
      const dispose = vi.fn();
      const bag = [];
      adoptDisposeHandle(dispose, false, (fn) => bag.push(fn));
      expect(dispose).not.toHaveBeenCalled();
      expect(bag).toHaveLength(1);
      bag[0]();
      expect(dispose).toHaveBeenCalledTimes(1);
    });

    it("ignores non-function dispose handles", () => {
      const push = vi.fn();
      adoptDisposeHandle(null, true, push);
      adoptDisposeHandle(undefined, false, push);
      expect(push).not.toHaveBeenCalled();
    });
  });

  describe("prefersReducedMotion / shouldReduceFx", () => {
    const originalMatch = window.matchMedia;
    afterEach(() => {
      window.matchMedia = originalMatch;
      delete window.__reduceFx;
    });

    it("reads matchMedia reduce", () => {
      window.matchMedia = (q) => ({
        matches: String(q).includes("prefers-reduced-motion"),
        media: q,
        addEventListener() {},
        removeEventListener() {},
      });
      expect(prefersReducedMotion()).toBe(true);
      expect(shouldReduceFx()).toBe(true);
    });

    it("honors window.__reduceFx flag", () => {
      window.matchMedia = () => ({
        matches: false,
        media: "",
        addEventListener() {},
        removeEventListener() {},
      });
      window.__reduceFx = true;
      expect(shouldReduceFx()).toBe(true);
    });
  });
});

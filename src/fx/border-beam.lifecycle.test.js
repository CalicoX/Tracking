import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "./modules/border-beam.js";

/**
 * Behavioral test for StrictMode remount of product-dock beam.
 * dispose must clear data-beam / bloom so the next mount can re-init.
 */
describe("border-beam StrictMode remount", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="product-dock">
        <div id="product-tabs" role="tablist"></div>
      </div>
    `;
    // drop leftover styles from prior mounts
    document.querySelectorAll("style[data-border-beam]").forEach((n) => n.remove());
  });

  afterEach(() => {
    document.body.innerHTML = "";
    document.querySelectorAll("style[data-border-beam]").forEach((n) => n.remove());
  });

  it("mount sets data-beam on #product-tabs", () => {
    const dispose = mount();
    const tabs = document.getElementById("product-tabs");
    expect(tabs).toBeTruthy();
    expect(tabs.getAttribute("data-beam")).toBeTruthy();
    expect(tabs.querySelector("[data-beam-bloom]")).toBeTruthy();
    dispose();
  });

  it("dispose clears data-beam and bloom so remount succeeds", () => {
    const d1 = mount();
    const tabs = document.getElementById("product-tabs");
    const firstId = tabs.getAttribute("data-beam");
    expect(firstId).toBeTruthy();

    d1();

    expect(tabs.getAttribute("data-beam")).toBeNull();
    expect(tabs.querySelector("[data-beam-bloom]")).toBeNull();
    expect(tabs.hasAttribute("data-active")).toBe(false);
    expect(tabs.hasAttribute("data-fading")).toBe(false);

    // Second mount must not bail on stale data-beam (StrictMode remount path)
    const d2 = mount();
    expect(tabs.getAttribute("data-beam")).toBeTruthy();
    expect(tabs.querySelector("[data-beam-bloom]")).toBeTruthy();
    d2();
    expect(tabs.getAttribute("data-beam")).toBeNull();
  });

  it("mountProductDockBeam is callable again after full dispose", () => {
    const d1 = mount();
    d1();
    // global API remains; should re-attach after data-beam cleared
    expect(typeof window.mountProductDockBeam).toBe("function");
    const api = window.mountProductDockBeam();
    expect(api).toBeTruthy();
    expect(document.getElementById("product-tabs").getAttribute("data-beam")).toBeTruthy();
    // cleanup via destroy on api
    if (api && typeof api.destroy === "function") api.destroy();
    expect(document.getElementById("product-tabs").getAttribute("data-beam")).toBeNull();
  });
});

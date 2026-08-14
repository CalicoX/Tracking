/**
 * Above-the-fold product dock FX.
 * Loads liquid-glass-dock factory then creates the live dock instance.
 * @returns {Promise<() => void>} dispose
 */
export async function mountProductDock() {
  const { mount: mountLib } = await import("./modules/liquid-glass-dock.js");
  const disposeLib = mountLib();

  const tabs = document.getElementById("product-tabs");
  const source = document.getElementById("glass-source");
  const content = document.getElementById("glass-content");
  const output = document.getElementById("glass-output");

  if (!window.createLiquidGlassDock) {
    document.documentElement.classList.add("glass-mode-frosted");
    return () => {
      if (typeof disposeLib === "function") disposeLib();
    };
  }

  document.documentElement.classList.remove("glass-html-in-canvas");
  if (output) output.style.display = "";
  if (source && content && content.parentNode === source) {
    const shell0 = document.querySelector(".glass-shell");
    if (shell0) shell0.insertBefore(content, source);
  }

  let glass = null;
  try {
    glass = window.createLiquidGlassDock({
      source,
      content,
      output,
      tabsEl: tabs,
    });
    if (!glass) throw new Error("createLiquidGlassDock returned null");
    if (typeof glass.setMode === "function") glass.setMode("frosted");
    document.documentElement.classList.add("glass-mode-frosted");
  } catch (err) {
    console.warn("[mountProductDock]", err);
    document.documentElement.classList.add("glass-mode-frosted");
    glass = { onScroll() {}, destroy() {} };
  }

  // Frosted mode (default): glass has its own throttled theme via __updateAiScroll.
  // Do not add another Lenis scroll listener — it was pure overhead on every frame.

  return function dispose() {
    if (glass && typeof glass.destroy === "function") {
      try {
        glass.destroy();
      } catch (e) {
        /* ignore */
      }
    }
    if (typeof disposeLib === "function") disposeLib();
  };
}

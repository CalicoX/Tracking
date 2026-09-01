/** @returns {() => void} */
export function mount() {
  let teardown = null;
  try {
/**
 * Responsive FX guard — tablet / phone
 * Sets html classes + early flags heavy modules can read.
 */
(function () {
  "use strict";

  var mq1024 = window.matchMedia("(max-width: 1024px)");
  var mq768 = window.matchMedia("(max-width: 768px)");
  /* FX 降级线跟手机档 640（2026-09-01 断点并档对齐 API：768 平板竖屏吃完整桌面 FX） */
  var mq480 = window.matchMedia("(max-width: 640px)");
  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mqCoarse = window.matchMedia("(pointer: coarse)");

  function apply() {
    var root = document.documentElement;
    var t = mq1024.matches;
    var m = mq768.matches;
    var s = mq480.matches;
    var reduce = mqReduce.matches || s;
    root.classList.toggle("is-bp-1024", t);
    root.classList.toggle("is-bp-768", m);
    root.classList.toggle("is-bp-480", s);
    root.classList.toggle("is-reduce-fx", reduce);
    root.classList.toggle("is-touch", mqCoarse.matches);
    /* Global flag for shaders / AI lab */
    window.__reduceFx = reduce;
    window.__isMobileLayout = s;
  }

  apply();
  if (mq1024.addEventListener) {
    mq1024.addEventListener("change", apply);
    mq768.addEventListener("change", apply);
    mq480.addEventListener("change", apply);
    mqReduce.addEventListener("change", apply);
    mqCoarse.addEventListener("change", apply);
  } else if (mq1024.addListener) {
    mq1024.addListener(apply);
    mq768.addListener(apply);
    mq480.addListener(apply);
    mqReduce.addListener(apply);
    mqCoarse.addListener(apply);
  }

  teardown = function () {
    if (mq1024.removeEventListener) {
      mq1024.removeEventListener("change", apply);
      mq768.removeEventListener("change", apply);
      mq480.removeEventListener("change", apply);
      mqReduce.removeEventListener("change", apply);
      mqCoarse.removeEventListener("change", apply);
    } else if (mq1024.removeListener) {
      mq1024.removeListener(apply);
      mq768.removeListener(apply);
      mq480.removeListener(apply);
      mqReduce.removeListener(apply);
      mqCoarse.removeListener(apply);
    }
  };
})();

  } catch (err) {
    console.warn("[fx:responsive-fx.js]", err);
  }
  return function dispose() {
    if (typeof teardown === "function") {
      try {
        teardown();
      } catch (e) {
        /* ignore */
      }
      teardown = null;
    }
  };
}

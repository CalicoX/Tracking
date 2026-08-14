/**
 * Responsive FX guard — tablet / phone
 * Sets html classes + early flags heavy modules can read.
 */
(function () {
  "use strict";

  var mq1024 = window.matchMedia("(max-width: 1024px)");
  var mq768 = window.matchMedia("(max-width: 768px)");
  var mq480 = window.matchMedia("(max-width: 480px)");
  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mqCoarse = window.matchMedia("(pointer: coarse)");

  function apply() {
    var root = document.documentElement;
    var t = mq1024.matches;
    var m = mq768.matches;
    var s = mq480.matches;
    var reduce = mqReduce.matches || m;
    root.classList.toggle("is-bp-1024", t);
    root.classList.toggle("is-bp-768", m);
    root.classList.toggle("is-bp-480", s);
    root.classList.toggle("is-reduce-fx", reduce);
    root.classList.toggle("is-touch", mqCoarse.matches);
    /* Global flag for shaders / AI lab */
    window.__reduceFx = reduce;
    window.__isMobileLayout = m;
  }

  apply();
  if (mq1024.addEventListener) {
    mq1024.addEventListener("change", apply);
    mq768.addEventListener("change", apply);
    mq480.addEventListener("change", apply);
    mqReduce.addEventListener("change", apply);
  } else if (mq1024.addListener) {
    mq1024.addListener(apply);
    mq768.addListener(apply);
    mq480.addListener(apply);
    mqReduce.addListener(apply);
  }
})();

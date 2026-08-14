/**
 * Vanilla port of https://beam.jakubantalik.com/ (border-beam@1.3.0)
 * size=md · colorVariant=colorful · theme=light|dark
 * Used on AI Lab agent panel without React.
 */
(function (global) {
  "use strict";

  var COLORS = {
    colorful: {
      border: [
        { color: "rgb(255, 50, 100)", pos: "33% -7.4%", size: "70px 40px" },
        { color: "rgb(40, 140, 255)", pos: "12% -5%", size: "60px 35px" },
        { color: "rgb(50, 200, 80)", pos: "2.1% 68.3%", size: "40px 70px" },
        { color: "rgb(30, 185, 170)", pos: "2.1% 68.3%", size: "20px 35px" },
        { color: "rgb(100, 70, 255)", pos: "74.4% 100%", size: "180px 32px" },
        { color: "rgb(40, 140, 255)", pos: "55% 100%", size: "85px 26px" },
        { color: "rgb(255, 120, 40)", pos: "93.9% 0%", size: "74px 32px" },
        { color: "rgb(240, 50, 180)", pos: "100% 27.1%", size: "26px 42px" },
        { color: "rgb(180, 40, 240)", pos: "100% 27.1%", size: "52px 48px" },
      ],
    },
  };

  var THEME = {
    light: {
      strokeOpacity: 0.12,
      innerOpacity: 0.26,
      bloomOpacity: 0.34,
      innerShadow: "rgba(0, 0, 0, 0.14)",
      saturation: 1.5,
    },
    dark: {
      strokeOpacity: 0.26,
      innerOpacity: 0.42,
      bloomOpacity: 0.24,
      innerShadow: "rgba(255, 255, 255, 0.27)",
      saturation: 1.2,
    },
  };

  function strokeGradients(variant) {
    return COLORS[variant].border
      .map(function (a) {
        return (
          "radial-gradient(ellipse " +
          a.size +
          " at " +
          a.pos +
          ", " +
          a.color +
          ", transparent)"
        );
      })
      .join(",\n    ");
  }

  function innerGradients(variant) {
    var a = variant === "mono" ? 0.225 : 0.45;
    return COLORS[variant].border
      .map(function (r) {
        var o = r.color.replace("rgb(", "rgba(").replace(")", ", " + a + ")");
        var size = r.size
          .split(" ")
          .map(function (i) {
            return Math.round(parseInt(i, 10) * 0.9) + "px";
          })
          .join(" ");
        return (
          "radial-gradient(ellipse " +
          size +
          " at " +
          r.pos +
          ", " +
          o +
          ", transparent)"
        );
      })
      .join(",\n    ");
  }

  function buildCss(opts) {
    var e = opts.id;
    var a = opts.borderRadius;
    var r = opts.borderWidth;
    var o = opts.duration;
    var s = opts.strokeOpacity;
    var i = opts.innerOpacity;
    var c = opts.bloomOpacity;
    var p = opts.innerShadow;
    var b = opts.colorVariant;
    var n = opts.brightness;
    var l = opts.saturation;
    var d = opts.hueRange;
    var k = opts.theme;
    var f = Math.max(0, a - r);
    var g = b === "mono" ? 0.5 : 1;
    var W = s * g;
    var Y = i * g;
    var z = c * g;
    var H =
      "animation: beam-hue-shift-" + e + " 12s ease-in-out infinite;";
    var w = k === "dark";
    var y = w
      ? "conic-gradient(from var(--beam-angle-" +
        e +
        "), transparent 0%, transparent 54%, rgba(255,255,255,0.1) 57%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.6) 63%, rgba(255,255,255,0.75) 66%, rgba(255,255,255,0.6) 69%, rgba(255,255,255,0.3) 72%, rgba(255,255,255,0.1) 75%, transparent 78%, transparent 100%)"
      : "conic-gradient(from var(--beam-angle-" +
        e +
        "), transparent 0%, transparent 54%, rgba(0,0,0,0.08) 57%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 63%, rgba(0,0,0,0.55) 66%, rgba(0,0,0,0.4) 69%, rgba(0,0,0,0.2) 72%, rgba(0,0,0,0.08) 75%, transparent 78%, transparent 100%)";
    var x = strokeGradients(b);
    var X = innerGradients(b);
    var u = w
      ? "conic-gradient(from var(--beam-angle-" +
        e +
        "), transparent 0%, transparent 58%, rgba(255,255,255,0.03) 62%, rgba(255,255,255,0.08) 65%, rgba(255,255,255,0.2) 67%, rgba(255,255,255,0.45) 69%, rgba(255,255,255,0.85) 70%, rgba(255,255,255,0.85) 70.5%, rgba(255,255,255,0.45) 71.5%, rgba(255,255,255,0.2) 73%, rgba(255,255,255,0.08) 75%, rgba(255,255,255,0.03) 78%, transparent 82%)"
      : "conic-gradient(from var(--beam-angle-" +
        e +
        "), transparent 0%, transparent 58%, rgba(0,0,0,0.02) 62%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.2) 67%, rgba(0,0,0,0.4) 69%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.6) 70.5%, rgba(0,0,0,0.4) 71.5%, rgba(0,0,0,0.2) 73%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0.02) 78%, transparent 82%)";

    var beamMask =
      "conic-gradient(from var(--beam-angle-" +
      e +
      "), transparent 0%, transparent 30%, rgba(255,255,255,0.1) 36%, rgba(255,255,255,0.35) 44%, white 52%, white 80%, rgba(255,255,255,0.35) 86%, rgba(255,255,255,0.1) 92%, transparent 95%, transparent 100%)";

    return (
      "@property --beam-angle-" +
      e +
      ' { syntax: "<angle>"; initial-value: 0deg; inherits: true; }\n' +
      "@property --beam-opacity-" +
      e +
      ' { syntax: "<number>"; initial-value: 0; inherits: true; }\n\n' +
      '[data-beam="' +
      e +
      '"] {\n' +
      "  position: relative;\n" +
      "  border-radius: " +
      a +
      "px;\n" +
      "  overflow: hidden;\n" +
      "  --beam-strength: " +
      (opts.strength != null ? opts.strength : 1) +
      ";\n" +
      "}\n\n" +
      '[data-beam="' +
      e +
      '"][data-active] {\n' +
      "  animation:\n" +
      "    beam-spin-" +
      e +
      " " +
      o +
      "s linear infinite,\n" +
      "    beam-fade-in-" +
      e +
      " 0.6s ease forwards;\n" +
      "}\n\n" +
      '[data-beam="' +
      e +
      '"][data-active]::after,\n' +
      '[data-beam="' +
      e +
      '"][data-fading]::after {\n' +
      '  content: "";\n' +
      "  position: absolute;\n" +
      "  inset: 0;\n" +
      "  border-radius: " +
      f +
      "px;\n" +
      "  padding: " +
      r +
      "px;\n" +
      "  clip-path: inset(0 round " +
      a +
      "px);\n" +
      "  background: " +
      y +
      ",\n    " +
      x +
      ";\n" +
      "  -webkit-mask:\n    " +
      beamMask +
      ",\n    linear-gradient(#fff 0 0) content-box,\n    linear-gradient(#fff 0 0);\n" +
      "  -webkit-mask-composite: source-in, xor;\n" +
      "  mask:\n    " +
      beamMask +
      ",\n    linear-gradient(#fff 0 0) content-box,\n    linear-gradient(#fff 0 0);\n" +
      "  mask-composite: intersect, exclude;\n" +
      "  pointer-events: none;\n" +
      "  z-index: 2;\n" +
      "  opacity: calc(var(--beam-opacity-" +
      e +
      ") * " +
      W.toFixed(2) +
      " * var(--beam-stroke-opacity, 1) * var(--beam-strength, 1));\n" +
      "  " +
      H +
      "\n" +
      "}\n\n" +
      '[data-beam="' +
      e +
      '"][data-active]::before,\n' +
      '[data-beam="' +
      e +
      '"][data-fading]::before {\n' +
      '  content: "";\n' +
      "  position: absolute;\n" +
      "  inset: 0;\n" +
      "  border-radius: " +
      a +
      "px;\n" +
      "  background: " +
      X +
      ";\n" +
      "  box-shadow: inset 0 0 9px 1px " +
      p +
      ";\n" +
      "  -webkit-mask-image:\n    " +
      beamMask +
      ",\n    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),\n    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);\n" +
      "  -webkit-mask-composite: source-in, source-over;\n" +
      "  mask-image:\n    " +
      beamMask +
      ",\n    linear-gradient(white, transparent 28px, transparent calc(100% - 28px), white),\n    linear-gradient(to right, white, transparent 28px, transparent calc(100% - 28px), white);\n" +
      "  mask-composite: intersect, add;\n" +
      "  pointer-events: none;\n" +
      "  z-index: 1;\n" +
      "  opacity: calc(var(--beam-opacity-" +
      e +
      ") * " +
      Y.toFixed(2) +
      " * var(--beam-inner-opacity, 1) * var(--beam-strength, 1));\n" +
      "  clip-path: inset(0 round " +
      a +
      "px);\n" +
      "  " +
      H +
      "\n" +
      "}\n\n" +
      '[data-beam="' +
      e +
      '"] [data-beam-bloom] {\n' +
      "  display: none;\n" +
      "  position: absolute;\n" +
      "  inset: 0;\n" +
      "  border-radius: " +
      f +
      "px;\n" +
      "  clip-path: inset(0 round " +
      a +
      "px);\n" +
      "  background: " +
      u +
      ";\n" +
      "  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n" +
      "  -webkit-mask-composite: xor;\n" +
      "  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n" +
      "  mask-composite: exclude;\n" +
      "  padding: " +
      r +
      "px;\n" +
      "  filter: blur(8px) brightness(" +
      n.toFixed(2) +
      ") saturate(" +
      l.toFixed(2) +
      ");\n" +
      "  pointer-events: none;\n" +
      "  z-index: 3;\n" +
      "  opacity: 0;\n" +
      "}\n\n" +
      '[data-beam="' +
      e +
      '"][data-active] [data-beam-bloom],\n' +
      '[data-beam="' +
      e +
      '"][data-fading] [data-beam-bloom] {\n' +
      "  display: block;\n" +
      "  opacity: calc(var(--beam-opacity-" +
      e +
      ") * " +
      z.toFixed(2) +
      " * var(--beam-bloom-opacity, 1) * var(--beam-strength, 1));\n" +
      "}\n\n" +
      /* content above beam layers */
      '[data-beam="' +
      e +
      '"] > *:not([data-beam-bloom]) {\n' +
      "  position: relative;\n" +
      "  z-index: 4;\n" +
      "}\n\n" +
      "@keyframes beam-spin-" +
      e +
      " {\n  to { --beam-angle-" +
      e +
      ": 360deg; }\n}\n\n" +
      "@keyframes beam-fade-in-" +
      e +
      " {\n  to { --beam-opacity-" +
      e +
      ": 1; }\n}\n\n" +
      "@keyframes beam-fade-out-" +
      e +
      " {\n  from { --beam-opacity-" +
      e +
      ": 1; }\n  to { --beam-opacity-" +
      e +
      ": 0; }\n}\n\n" +
      "@keyframes beam-hue-shift-" +
      e +
      " {\n" +
      "  0% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) - " +
      d +
      "deg)) brightness(" +
      n.toFixed(2) +
      ") saturate(" +
      l.toFixed(2) +
      "); }\n" +
      "  50% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) + " +
      d +
      "deg)) brightness(" +
      n.toFixed(2) +
      ") saturate(" +
      l.toFixed(2) +
      "); }\n" +
      "  100% { filter: hue-rotate(calc(var(--beam-hue-base, 0deg) - " +
      d +
      "deg)) brightness(" +
      n.toFixed(2) +
      ") saturate(" +
      l.toFixed(2) +
      "); }\n" +
      "}\n\n" +
      '[data-beam="' +
      e +
      '"][data-paused],\n' +
      '[data-beam="' +
      e +
      '"][data-paused]::after,\n' +
      '[data-beam="' +
      e +
      '"][data-paused]::before,\n' +
      '[data-beam="' +
      e +
      '"][data-paused] [data-beam-bloom] {\n' +
      "  animation-play-state: paused !important;\n" +
      "}\n\n" +
      "@media (prefers-reduced-motion: reduce) {\n" +
      '  [data-beam="' +
      e +
      '"][data-active] { animation: beam-fade-in-' +
      e +
      " 0.4s ease forwards; }\n" +
      '  [data-beam="' +
      e +
      '"][data-active]::after,\n' +
      '  [data-beam="' +
      e +
      '"][data-active]::before { animation: none; }\n' +
      "}\n"
    );
  }

  var styleCache = {};

  function ensureStyle(id, css) {
    if (styleCache[id]) return;
    var el = document.createElement("style");
    el.setAttribute("data-border-beam", id);
    el.textContent = css;
    document.head.appendChild(el);
    styleCache[id] = el;
  }

  /**
   * @param {HTMLElement} el
   * @param {object} [options]
   */
  function mountBorderBeam(el, options) {
    if (!el) return null;
    options = options || {};
    var id = options.id || "bb-" + Math.random().toString(36).slice(2, 8);
    var theme = options.theme === "dark" ? "dark" : "light";
    var preset = THEME[theme];
    var colorVariant = options.colorVariant || "colorful";
    if (!COLORS[colorVariant]) colorVariant = "colorful";

    var cfg = {
      id: id,
      borderRadius:
        options.borderRadius != null ? options.borderRadius : 22,
      borderWidth: options.borderWidth != null ? options.borderWidth : 1,
      duration: options.duration != null ? options.duration : 1.96,
      strokeOpacity:
        options.strokeOpacity != null
          ? options.strokeOpacity
          : preset.strokeOpacity,
      innerOpacity:
        options.innerOpacity != null
          ? options.innerOpacity
          : preset.innerOpacity,
      bloomOpacity:
        options.bloomOpacity != null
          ? options.bloomOpacity
          : preset.bloomOpacity,
      innerShadow: options.innerShadow || preset.innerShadow,
      colorVariant: colorVariant,
      brightness: options.brightness != null ? options.brightness : 1.3,
      saturation:
        options.saturation != null ? options.saturation : preset.saturation,
      hueRange: options.hueRange != null ? options.hueRange : 30,
      theme: theme,
      strength: options.strength != null ? options.strength : 1,
    };

    ensureStyle(id, buildCss(cfg));

    el.setAttribute("data-beam", id);
    el.style.setProperty("--beam-strength", String(cfg.strength));
    var startActive = options.active !== false;
    if (startActive) {
      el.setAttribute("data-active", "");
    } else {
      el.removeAttribute("data-active");
      el.removeAttribute("data-fading");
    }

    if (!el.querySelector("[data-beam-bloom]")) {
      var bloom = document.createElement("div");
      bloom.setAttribute("data-beam-bloom", "");
      el.appendChild(bloom);
    }

    var fadeTimer = null;
    return {
      id: id,
      el: el,
      setActive: function (on) {
        if (fadeTimer) {
          clearTimeout(fadeTimer);
          fadeTimer = null;
        }
        if (on) {
          el.removeAttribute("data-fading");
          el.setAttribute("data-active", "");
        } else {
          if (el.hasAttribute("data-active") || el.hasAttribute("data-fading")) {
            el.removeAttribute("data-active");
            el.setAttribute("data-fading", "");
            fadeTimer = setTimeout(function () {
              if (!el.hasAttribute("data-active")) {
                el.removeAttribute("data-fading");
              }
              fadeTimer = null;
            }, 520);
          }
        }
      },
      setStrength: function (v) {
        el.style.setProperty("--beam-strength", String(v));
      },
    };
  }

  /** 底栏 product dock：仅深色背景启用 colorful dark beam */
  function mountProductDockBeam() {
    var tabs = document.getElementById("product-tabs");
    var dock = document.querySelector(".product-dock");
    if (!tabs || tabs.getAttribute("data-beam")) return null;

    var r = tabs.getBoundingClientRect();
    var radius = Math.round(Math.max(r.height, 44) / 2);

    var api = mountBorderBeam(tabs, {
      id: "product-dock",
      theme: "dark",
      colorVariant: "colorful",
      borderRadius: radius || 28,
      borderWidth: 1,
      duration: 2.15,
      brightness: 1.45,
      saturation: 1.35,
      strength: 1,
      // 深色毛玻璃上需要更明显一点
      strokeOpacity: 0.42,
      innerOpacity: 0.55,
      bloomOpacity: 0.38,
      active: false,
    });

    function isDark() {
      return !!(dock && dock.classList.contains("dock-on-dark"));
    }

    function sync() {
      if (!api) return;
      // 高度变化时圆角跟着 pill
      var h = tabs.getBoundingClientRect().height;
      if (h > 8) {
        // 仅更新 CSS 变量不够（radius 写死在 stylesheet）；resize 时 remount 成本高，固定用大圆角即可
      }
      api.setActive(isDark());
    }

    if (dock) {
      var mo = new MutationObserver(sync);
      mo.observe(dock, { attributes: true, attributeFilter: ["class"] });
    }
    window.addEventListener("resize", sync, { passive: true });
    /* no setInterval — class MutationObserver + scroll bus cover dark/light */
    var prevBeamScroll = window.__updateAiScroll;
    window.__updateAiScroll = function () {
      if (typeof prevBeamScroll === "function") prevBeamScroll();
      sync();
    };
    requestAnimationFrame(sync);
    return api;
  }

  global.mountBorderBeam = mountBorderBeam;
  global.mountProductDockBeam = mountProductDockBeam;

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mountProductDockBeam);
    } else {
      mountProductDockBeam();
    }
  }
})(typeof window !== "undefined" ? window : this);

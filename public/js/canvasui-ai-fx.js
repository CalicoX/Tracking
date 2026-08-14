/**
 * Canvas UI FX for AI Lab only
 * - Bend: intro only (page scroll drives content.scrollTop)
 * - Particle Scroll: cases stack (work scroll drives content.scrollTop)
 * Requires Chrome html-in-canvas (drawElementImage); falls back to plain HTML.
 */
(function () {
  "use strict";

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function supportsHIC() {
    try {
      if (
        window.CanvasUIBend &&
        typeof window.CanvasUIBend.supportsHtmlInCanvas === "function"
      ) {
        return !!window.CanvasUIBend.supportsHtmlInCanvas();
      }
      if (
        window.CanvasUIParticleScroll &&
        typeof window.CanvasUIParticleScroll.supportsHtmlInCanvas === "function"
      ) {
        return !!window.CanvasUIParticleScroll.supportsHtmlInCanvas();
      }
    } catch (err) {}
    return false;
  }

  function requestPaint(source) {
    if (!source) return;
    try {
      if (typeof source.requestPaint === "function") source.requestPaint();
    } catch (err) {}
  }

  function mountShell(host, opts) {
    if (!host) return null;
    var source = host.querySelector(".canvasui-fx-source");
    var content = host.querySelector(".canvasui-fx-content");
    var output = host.querySelector(".canvasui-fx-output");
    if (!source || !content || !output) return null;

    var native = supportsHIC();
    host.classList.toggle("is-native", native);
    host.classList.toggle("is-fallback", !native);

    if (native) {
      // Official layout: content lives inside layoutsubtree canvas
      if (content.parentElement !== source) {
        source.appendChild(content);
      }
      // layoutsubtree is required for drawElementImage
      try {
        source.setAttribute("layoutsubtree", "true");
      } catch (err) {}
    } else {
      // Keep plain DOM visible; hide canvases via CSS .is-fallback
      if (content.parentElement === source && host !== source.parentElement) {
        host.insertBefore(content, output);
      }
    }

    return {
      host: host,
      source: source,
      content: content,
      output: output,
      native: native,
    };
  }

  /* ——— Intro Bend (only) ——— */
  (function introBend() {
    var root = document.getElementById("ai-lab-intro");
    var host = document.getElementById("ai-intro-bend-host");
    if (!root || !host) return;
    if (!window.CanvasUIBend || typeof window.CanvasUIBend.createBend !== "function") {
      host.classList.add("is-fallback");
      return;
    }

    var shell = mountShell(host);
    if (!shell) return;

    var instance = null;
    if (shell.native) {
      instance = window.CanvasUIBend.createBend(
        {
          source: shell.source,
          content: shell.content,
          output: shell.output,
        },
        {
          zone: 200,
          angle: 72,
          rounding: 120,
          perspective: 720,
          direction: "in",
          ease: 200,
          smoothing: 0.12,
          top: true,
          bottom: true,
          tumble: 0.35,
          tilt: 0.4,
        }
      );
      if (!instance) {
        // WebGL failed — fall back
        host.classList.remove("is-native");
        host.classList.add("is-fallback");
        if (shell.content.parentElement === shell.source) {
          host.insertBefore(shell.content, shell.output);
        }
        return;
      }
    }

    function syncFromPage() {
      if (!shell.native || !instance) return;
      var r = root.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      var maxPage = Math.max(root.offsetHeight - vh, 1);
      var scrolled = clamp(-r.top, 0, maxPage);
      var p = scrolled / maxPage;
      var el = shell.content;
      var max = Math.max(el.scrollHeight - el.clientHeight, 0);
      if (max > 1) {
        var next = p * max;
        if (Math.abs(el.scrollTop - next) > 0.5) {
          el.scrollTop = next;
        }
      }
      requestPaint(shell.source);
    }

    var prev = window.__updateAiScroll;
    window.__updateAiScroll = function () {
      if (typeof prev === "function") prev();
      syncFromPage();
    };
    window.addEventListener("resize", function () {
      if (instance && typeof instance.resize === "function") instance.resize();
      syncFromPage();
    });
    requestAnimationFrame(function () {
      syncFromPage();
      requestPaint(shell.source);
    });

    window.__aiIntroBend = instance;
    window.__aiIntroBendPaint = function () {
      requestPaint(shell.source);
    };
  })();

  /* ——— Cases Particle Scroll ——— */
  (function casesParticle() {
    var work = document.getElementById("ai-lab-work");
    var host = document.getElementById("ai-cases-ps-host");
    if (!work || !host) return;
    if (
      !window.CanvasUIParticleScroll ||
      typeof window.CanvasUIParticleScroll.createParticleScroll !== "function"
    ) {
      host.classList.add("is-fallback");
      return;
    }

    var shell = mountShell(host);
    if (!shell) return;

    var instance = null;
    var stage = shell.content.querySelector(".ai-stack-stage");

    function sizeStage() {
      if (!shell.native || !stage) return;
      var h = Math.max(shell.host.clientHeight || 0, shell.content.clientHeight || 0, 280);
      stage.style.height = h + "px";
      stage.style.minHeight = h + "px";
    }

    if (shell.native) {
      sizeStage();
      instance = window.CanvasUIParticleScroll.createParticleScroll(
        {
          source: shell.source,
          content: shell.content,
          output: shell.output,
        },
        {
          point: 0.72,
          band: 380,
          density: 2.2,
          size: 1.2,
          spread: 180,
          gravity: 0.4,
          drift: 0.55,
          swirl: 48,
          stagger: 0.65,
          fade: 0.8,
          settle: 1.0,
          smoothing: 0.55,
        }
      );
      if (!instance) {
        host.classList.remove("is-native");
        host.classList.add("is-fallback");
        if (shell.content.parentElement === shell.source) {
          host.insertBefore(shell.content, shell.output);
        }
        return;
      }
    }

    function syncFromWork() {
      if (!shell.native || !instance) return;
      sizeStage();
      var rect = work.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      var total = Math.max(work.offsetHeight - vh, 1);
      var scrolled = clamp(-rect.top, 0, total);
      var p = scrolled / total;
      var el = shell.content;
      var max = Math.max(el.scrollHeight - el.clientHeight, 0);
      if (max > 1) {
        var next = p * max;
        if (Math.abs(el.scrollTop - next) > 0.5) {
          el.scrollTop = next;
        }
      }
      requestPaint(shell.source);
    }

    var prev = window.__updateAiScroll;
    window.__updateAiScroll = function () {
      if (typeof prev === "function") prev();
      syncFromWork();
    };
    window.addEventListener("resize", function () {
      sizeStage();
      if (instance && typeof instance.resize === "function") instance.resize();
      syncFromWork();
    });
    requestAnimationFrame(function () {
      sizeStage();
      syncFromWork();
      requestPaint(shell.source);
    });

    window.__aiCasesParticle = instance;
    window.__aiCasesParticlePaint = function () {
      requestPaint(shell.source);
    };
  })();
})();

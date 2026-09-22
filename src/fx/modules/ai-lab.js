/** @returns {() => void} */
export function mount() {
  const rafs = new Set();
  const intervals = new Set();
  const origRAF = window.requestAnimationFrame.bind(window);
  const origCAF = window.cancelAnimationFrame.bind(window);
  const origSI = window.setInterval.bind(window);
  const origCI = window.clearInterval.bind(window);
  window.requestAnimationFrame = (cb) => {
    let id;
    id = origRAF((t) => {
      rafs.delete(id);
      return cb(t);
    });
    rafs.add(id);
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    rafs.delete(id);
    return origCAF(id);
  };
  window.setInterval = (cb, ms, ...a) => {
    const id = origSI(cb, ms, ...a);
    intervals.add(id);
    return id;
  };
  window.clearInterval = (id) => {
    intervals.delete(id);
    return origCI(id);
  };
  try {
/**
 * AI Lab — intro reveal + research-agent timeline + orbs + stack cards
 */
(function () {
  "use strict";

  /* 同步导航高度 → --topbar-h；内容高 = 100vh - 导航 - 100px */
  (function syncTopbarH() {
    function run() {
      var bar = document.querySelector(".topbar");
      if (!bar) return;
      var h = Math.round(bar.getBoundingClientRect().height);
      if (h > 0) {
        document.documentElement.style.setProperty("--topbar-h", h + "px");
      }
    }
    run();
    window.addEventListener("resize", run);
    window.addEventListener("load", run);
  })();

  /* 导航：深色区块下提高不透明度 */
  (function topbarOnDark() {
    var bar = document.querySelector(".topbar");
    if (!bar) return;

    function isDarkUnderNav() {
      var br = bar.getBoundingClientRect();
      var x = Math.min(window.innerWidth - 2, Math.max(1, window.innerWidth * 0.5));
      // 采样导航条下沿稍下方的内容
      var y = Math.min(window.innerHeight - 2, Math.max(1, br.bottom + 2));
      var prev = bar.style.visibility;
      bar.style.visibility = "hidden";
      var el = document.elementFromPoint(x, y);
      bar.style.visibility = prev || "";

      var node = el;
      var hops = 0;
      while (node && node !== document.documentElement && hops < 14) {
        if (node.nodeType === 1) {
          // 已知深色区块（Business Impact 已改为淡蓝浅色主题）
          if (
            node.id === "ai-lab-intro" ||
            node.id === "bottom-cta" ||
            (node.classList &&
              (node.classList.contains("ai-lab-intro") ||
                node.classList.contains("ai-intro-bg") ||
                node.classList.contains("bottom-cta") ||
                node.classList.contains("site-footer") ||
                (node.classList.contains("case-art") &&
                  node.classList.contains("dark"))))
          ) {
            return true;
          }
          // 祖先链命中深色区
          if (
            node.closest &&
            node.closest(
              "#ai-lab-intro, #bottom-cta, .site-footer"
            )
          ) {
            return true;
          }
          var cs = window.getComputedStyle(node);
          var bg = cs.backgroundColor || "";
          var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
          if (m) {
            var R = +m[1],
              G = +m[2],
              B = +m[3];
            var a = 1;
            var am = bg.match(/,\s*([0-9.]+)\s*\)/);
            if (am) a = parseFloat(am[1]);
            if (a > 0.2) {
              var L = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
              return L < 0.42;
            }
          }
        }
        node = node.parentElement;
        hops++;
      }
      return false;
    }

    var topbarRaf = 0;
    function update() {
      if (topbarRaf) return;
      topbarRaf = requestAnimationFrame(function () {
        topbarRaf = 0;
        bar.classList.toggle("topbar-on-dark", isDarkUnderNav());
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    // Lenis / AI scroll 共用钩子，保证 impact 段也刷新导航反色
    var prevTopbarScroll = window.__updateAiScroll;
    window.__updateAiScroll = function () {
      if (typeof prevTopbarScroll === "function") prevTopbarScroll();
      update();
    };
    if (window.__lenis && typeof window.__lenis.on === "function") {
      try {
        window.__lenis.on("scroll", update);
      } catch (err) {}
    }
    setTimeout(function () {
      if (window.__lenis && typeof window.__lenis.on === "function") {
        try {
          window.__lenis.on("scroll", update);
        } catch (err) {}
      }
      update();
    }, 0);
    requestAnimationFrame(update);
    /* no setInterval — MutationObserver-free; scroll + rAF is enough */
  })();


  /* Border beam — official algorithm from beam.jakubantalik.com */
  (function beam() {
    var el = document.querySelector(".ai-think");
    if (!el || typeof window.mountBorderBeam !== "function") return;
    var api = window.mountBorderBeam(el, {
      id: "ai-think",
      theme: "light",
      colorVariant: "colorful",
      size: "md",
      borderRadius: 22,
      borderWidth: 1,
      duration: 1.96,
      brightness: 1.35,
      strength: 1,
      // light 默认 stroke 偏淡；略抬一点更接近图2边缘彩光
      strokeOpacity: 0.22,
      bloomOpacity: 0.42,
      innerOpacity: 0.3,
    });
    // 离屏时 pause（保留 opacity，只停转）
    if (api && typeof IntersectionObserver !== "undefined") {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              el.setAttribute("data-active", "");
              el.removeAttribute("data-paused");
            } else {
              el.setAttribute("data-paused", "");
            }
          });
        },
        { threshold: 0.05 }
      );
      io.observe(el);
    }
  })();

  /* Start free trial — 圆钮固定在右侧，不再滑行，也不挂 border beam */
  (function switchBtnFx() {
    var btns = document.querySelectorAll(".btn-switch");
    if (!btns.length) return;
    btns.forEach(function (el) {
      if (el.querySelector(".btn-switch-shader")) return;
      var sh = document.createElement("span");
      sh.className = "btn-switch-shader";
      sh.setAttribute("aria-hidden", "true");
      el.insertBefore(sh, el.firstChild);
    });
  })();

  /* ——— Intro: 整体渐变字 + 视差背景 + 滚动渐隐 + 桥接竖线点亮 ——— */
  (function intro() {
    var root = document.getElementById("ai-lab-intro");
    if (!root) return;

    var introTrack = document.getElementById("ai-lab-intro-track");
    var introOrbRow = document.getElementById("ai-intro-orb-row");
    var h2 = root.querySelector("h2");
    var lead = root.querySelector(".lead");
    var aiBadge = root.querySelector(".ai-powered-tag");
    var pills = document.getElementById("ai-pills");
    var bgImg = document.getElementById("ai-intro-bg-img");
    var lab = document.getElementById("ai-lab");
    var rail = document.getElementById("ai-intro-rail");
    var railFill = document.getElementById("ai-intro-rail-fill");
    var railDot = document.getElementById("ai-intro-rail-dot");
    var work = document.getElementById("ai-lab-work");
    var productDock = document.querySelector(".product-dock");
    var words = [];
    var wordCount = 0;
    var isIn = false;
    var shineTimer = null;
    var shineClearTimer = null;
    /**
     * Pills — track scroll progress drives morph (sticky pin);
     * wheel scrub is fallback only when no track.
     * 1) appear  2) scroll morph 0→1  3) free scroll rides line
     */
    var pillBases = null;
    var pillHomeLocalX = 0;
    var pillHomeLocalY = 0;
    var pillPhase = "idle"; /* idle | scrubbing | converged */
    var pillMorphP = 0;
    var pillLastRideP = 0;
    var pillTrackP = 0;
    /* Only true a11y reduce — mobile layout is separate */
    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function isMobileLayout() {
      return !!(
        window.__isMobileLayout ||
        (window.matchMedia &&
          window.matchMedia("(max-width: 640px)").matches)
      );
    }

    // 标题拆成单词 — 勿用 textContent="" 清全树（会拆掉 particles 的 solid/canvas，
    // 再被 absorbWords 吸进 detach 节点 → 主标题消失）
    if (h2 && !h2.querySelector(".ai-word")) {
      var text = h2.textContent.replace(/\s+/g, " ").trim();
      h2.setAttribute("aria-label", text);

      var solidEl = h2.querySelector(".ai-title-solid");
      var canvasEl =
        h2.querySelector("canvas.ai-title-particles") ||
        document.getElementById("ai-title-particles");
      // 卸掉现有子节点但保留 solid/canvas 引用
      while (h2.firstChild) {
        h2.removeChild(h2.firstChild);
      }
      if (solidEl) {
        while (solidEl.firstChild) solidEl.removeChild(solidEl.firstChild);
      }

      var host = solidEl || h2;
      text.split(" ").forEach(function (w, i) {
        var span = document.createElement("span");
        span.className = "ai-word";
        span.textContent = w;
        span.style.setProperty("--i", String(i));
        span.style.setProperty("--ri", "0");
        host.appendChild(span);
        host.appendChild(document.createTextNode(" "));
        words.push(span);
      });
      if (solidEl) h2.appendChild(solidEl);
      if (canvasEl && canvasEl.parentNode !== h2) h2.appendChild(canvasEl);

      wordCount = words.length;
      words.forEach(function (span, i) {
        span.style.setProperty("--ri", String(wordCount - 1 - i));
      });
    } else if (h2) {
      words = Array.prototype.slice.call(h2.querySelectorAll(".ai-word"));
      wordCount = words.length;
    }

    /** 整段渐变 + 扫光坐标：各词对齐同一标题宽，扫光共用 --shine-x */
    function syncTitleGradient() {
      if (!h2 || !words.length) return;
      var hRect = h2.getBoundingClientRect();
      var w = Math.max(1, Math.round(hRect.width));
      h2.style.setProperty("--grad-w", w + "px");
      words.forEach(function (span) {
        var sRect = span.getBoundingClientRect();
        var x = Math.round(hRect.left - sRect.left);
        span.style.setProperty("--grad-w", w + "px");
        span.style.setProperty("--grad-x", x + "px");
      });
    }

    var shineRaf = 0;

    function clearShineTimers() {
      if (shineTimer) {
        clearTimeout(shineTimer);
        shineTimer = null;
      }
      if (shineClearTimer) {
        clearTimeout(shineClearTimer);
        shineClearTimer = null;
      }
      if (shineRaf) {
        cancelAnimationFrame(shineRaf);
        shineRaf = 0;
      }
      if (h2) {
        h2.classList.remove("is-shine");
        h2.style.removeProperty("--shine-x");
      }
    }

    /** 整段标题一条高光从右扫到左（嵌在字形内） */
    function playTitleShine() {
      if (!h2 || !isIn) return;
      syncTitleGradient();
      var w = Math.max(1, h2.getBoundingClientRect().width);
      var from = w * 1.08;
      var to = -w * 0.55;
      var dur = 1400;
      var t0 = performance.now();
      h2.classList.add("is-shine");
      h2.style.setProperty("--shine-x", from.toFixed(1) + "px");

      function ease(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      }

      function frame(now) {
        if (!isIn || !h2) {
          shineRaf = 0;
          return;
        }
        var t = Math.min(1, (now - t0) / dur);
        var x = from + (to - from) * ease(t);
        h2.style.setProperty("--shine-x", x.toFixed(1) + "px");
        if (t < 1) {
          shineRaf = requestAnimationFrame(frame);
        } else {
          shineRaf = 0;
          h2.classList.remove("is-shine");
          h2.style.removeProperty("--shine-x");
        }
      }
      shineRaf = requestAnimationFrame(frame);
    }

    var titlePlayed = false;

    /**
     * Per-word blur-in once (static parity). Words start opacity:0 via CSS;
     * adding is-words-in after a double-rAF flush runs the stagger transition.
     */
    function playTitleWordAnim() {
      if (!h2 || titlePlayed) return;
      words = Array.prototype.slice.call(h2.querySelectorAll(".ai-word"));
      wordCount = words.length;
      if (!wordCount) return;
      titlePlayed = true;
      h2.classList.remove("is-words-in");
      words.forEach(function (span) {
        span.style.opacity = "";
        span.style.filter = "";
        span.style.transform = "";
      });
      syncTitleGradient();
      void h2.offsetWidth;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (!h2) return;
          words = Array.prototype.slice.call(h2.querySelectorAll(".ai-word"));
          wordCount = words.length;
          syncTitleGradient();
          h2.classList.add("is-words-in");
        });
      });
    }

    function restoreIntroCopy(opts) {
      var playWordAnim = !!(opts && opts.playWordAnim);
      root.classList.remove("is-intro-out");
      root.classList.add("is-intro-in");
      if (introOrbRow) introOrbRow.classList.add("is-in");
      if (lead) lead.classList.add("is-in");
      if (aiBadge) aiBadge.classList.add("is-in");
      if (pills) pills.classList.add("is-in");
      if (h2) {
        words = Array.prototype.slice.call(h2.querySelectorAll(".ai-word"));
        wordCount = words.length;
        syncTitleGradient();
        if (playWordAnim) {
          playTitleWordAnim();
        } else if (titlePlayed) {
          h2.classList.add("is-words-in");
        }
      }
      /* clear leave fade/blur so copy is readable when scrolling back */
      root.style.setProperty("--intro-fade", "1");
      root.style.setProperty("--intro-blur", "0px");
      var introCopy = document.getElementById("ai-lab-intro-copy");
      if (introCopy) introCopy.classList.remove("has-intro-blur");
    }

    function setIn(on) {
      if (on) {
        /* always re-apply copy visibility (fix reverse-scroll bug:
           isIn was set true elsewhere without restoring is-words-in) */
        var wasIn = isIn;
        isIn = true;
        /* First enter: play per-word blur-in (static tracking/js/ai-lab.js behavior) */
        restoreIntroCopy({ playWordAnim: !wasIn || !titlePlayed });
        if (!wasIn) {
          clearShineTimers();
          shineTimer = setTimeout(function () {
            if (!isIn || !h2) return;
            playTitleShine();
          }, 280 + Math.max(wordCount, 1) * 100 + 700);
        }
        return;
      }

      if (!isIn) return;
      isIn = false;
      root.classList.remove("is-intro-in");
      root.classList.add("is-intro-out");
      if (introOrbRow) introOrbRow.classList.remove("is-in");
      if (lead) lead.classList.remove("is-in");
      if (aiBadge) aiBadge.classList.remove("is-in");
      /* pills keep is-in during morph/rail — only hide via CSS is-intro-out if needed */
      if (h2) {
        clearShineTimers();
        /* keep is-words-in on exit so reverse doesn't require full re-token;
           exit blur uses is-intro-out delays on .ai-word */
        h2.classList.remove("is-words-in");
        titlePlayed = false; /* allow re-play when scrolling back into intro */
      }
    }

    function clamp(v, a, b) {
      return Math.max(a, Math.min(b, v));
    }

    /** 可见比例 0–1 */
    function visibilityRatio(r, vh) {
      var visibleH = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      return clamp(visibleH / Math.max(Math.min(r.height, vh), 1), 0, 1);
    }

    /**
     * 进场 / 离场迟滞，避免阈值附近反复 setIn 造成闪一下
     * 进入：重叠 > 22%；离开：重叠 < 10%
     */
    function wantIn(r, vh) {
      var ratio = visibilityRatio(r, vh);
      /* sticky docked = always treat as in (scroll back re-show title) */
      if (isIntroFullyDocked()) return true;
      /* Title itself in the reading band (works even if sticky rect is odd) */
      if (h2) {
        var hr = h2.getBoundingClientRect();
        var titleVisible =
          hr.bottom > vh * 0.12 &&
          hr.top < vh * 0.88 &&
          hr.height > 0;
        if (titleVisible && !isIn) return true;
      }
      if (isIn) {
        // 已进入：几乎滚没才退出（不要用 fade 卡死回滚）
        return ratio > 0.08 && r.bottom > 48;
      }
      // 回滚进场：只要露出来就恢复文案
      return ratio > 0.15 && r.top < vh * 0.98;
    }

    /**
     * 竖线几何：从「汇聚圆心」→ 案例区顶
     * 起点必须是 pill 圆心，这样 rideT=0 时 tip=圆，开线无跳动
     */
    function layoutRail() {
      if (!lab || !rail || !pills || !work) return;
      var labRect = lab.getBoundingClientRect();
      var pRect = pills.getBoundingClientRect();
      var wRect = work.getBoundingClientRect();
      /* 圆心 = pills 盒内 home（已 capture）或行中心 */
      var homeY =
        pillBases && pillBases.length
          ? pRect.top + pillHomeLocalY
          : pRect.top + pRect.height * 0.5;
      var top = homeY - labRect.top;
      var bottom = wRect.top - labRect.top + 24;
      var height = Math.max(80, bottom - top);
      rail.style.top = top.toFixed(1) + "px";
      rail.style.height = height.toFixed(1) + "px";
      rail.classList.add("is-ready");
    }

    function smoothstep(t) {
      t = clamp(t, 0, 1);
      return t * t * (3 - 2 * t);
    }

    function resetPillStyles() {
      if (!pills) return;
      pills.classList.remove("is-merging", "is-converged");
      pills.style.removeProperty("--pills-h");
      pills.style.removeProperty("--pills-w");
      pills.style.removeProperty("width");
      pills.style.removeProperty("min-height");
      pills.style.removeProperty("min-width");
      pills.style.removeProperty("margin-left");
      pills.style.removeProperty("margin-right");
      var els = pills.querySelectorAll(".ai-pill");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        el.classList.remove("is-merging");
        el.style.removeProperty("--text-op");
        el.style.removeProperty("--pill-left");
        el.style.removeProperty("--pill-top");
        el.style.removeProperty("transform");
        el.style.removeProperty("opacity");
        el.style.removeProperty("width");
        el.style.removeProperty("height");
        el.style.removeProperty("min-width");
        el.style.removeProperty("max-width");
        el.style.removeProperty("padding");
        el.style.removeProperty("box-shadow");
        el.style.removeProperty("background");
        el.style.removeProperty("left");
        el.style.removeProperty("top");
        el.style.removeProperty("position");
        el.style.removeProperty("z-index");
        el.style.removeProperty("margin");
        el.style.removeProperty("transform-origin");
        el.style.removeProperty("box-sizing");
      }
    }

    function clearPillMerge() {
      document.documentElement.classList.remove("ai-pill-scroll-lock");
      if (root) root.classList.remove("is-scrub-pinned");
      pillBases = null;
      pillMorphP = 0;
      pillPhase = "idle";
      pillLastRideP = 0;
      if (rail) rail._rideZero = null;
      resetPillStyles();
    }

    function getTopbarBottom() {
      var el = document.querySelector(".topbar");
      if (!el) {
        return (
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--topbar-h"
            )
          ) || 64
        );
      }
      return el.getBoundingClientRect().bottom;
    }

    /**
     * intro 是否整屏到位（贴 header / 盖住主视口）
     * 正向：top 从下方滚到导航底附近
     * 回滚：top 从负值回到导航底附近也能判为到位
     */
    function isIntroFullyDocked() {
      if (!root) return false;
      var tb = getTopbarBottom();
      var r = root.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      /*
       * sticky 钉住时 top≈0；也兼容略低于导航 / 轻微上溢
       */
      var topOk = r.top <= tb + 16 && r.top >= -100;
      var coverOk = r.bottom >= vh * 0.7;
      return topOk && coverOk;
    }

    /**
     * Track scroll progress 0→1 while sticky pin is active.
     * 0 = track top at viewport top; 1 = track fully scrolled through.
     */
    function getIntroTrackProgress() {
      if (!introTrack) return 0;
      var tr = introTrack.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      var travel = Math.max(introTrack.offsetHeight - vh, 1);
      return clamp(-tr.top / travel, 0, 1);
    }

    /**
     * Map track progress → morph (sticky pin), then free-scroll line ride.
     *   0–0.08  hold expanded pills
     *   0.08–0.72  morph 0→1
     *   ≥0.72  converged + line can start; further scroll rides rail
     */
    function syncPillMorphFromTrack() {
      if (reduceMotion || isMobileLayout()) return;
      if (!introTrack || !pills) return;

      var p = getIntroTrackProgress();
      pillTrackP = p;

      /* Pills only — never flip isIn here (that skipped title restore on reverse) */
      if (p > 0.02 && !pills.classList.contains("is-in")) {
        pills.classList.add("is-in");
      }
      if (!pills.classList.contains("is-in") && !isIn) return;

      var morphStart = 0.08;
      var morphEnd = 0.72;
      var morph = 0;
      if (p <= morphStart) morph = 0;
      else if (p >= morphEnd) morph = 1;
      else {
        var u = (p - morphStart) / (morphEnd - morphStart);
        morph = u * u * (3 - 2 * u);
      }

      if (morph < 0.02) {
        if (pillPhase !== "idle" || pillMorphP > 0.02) {
          releaseFixedPills();
          pillMorphP = 0;
          pillPhase = "idle";
          pillLastRideP = 0;
          if (rail) {
            rail._rideZero = null;
            rail.classList.remove("is-drawing");
          }
          if (railFill) railFill.style.height = "0%";
          resetPillStyles();
          pillBases = null;
        }
        /* reverse complete → title/orb must be back (go through setIn for word anim) */
        if (isIntroFullyDocked() || p < 0.15) {
          setIn(true);
        }
        return;
      }

      if (morph >= 0.998) {
        if (pillPhase !== "converged") {
          if (!pillBases || !pillBases.length) capturePillBases();
          pillMorphP = 1;
          pillPhase = "converged";
          if (rail) rail._rideZero = null;
          pills.classList.add("is-converged", "is-merging");
          layoutRail();
          /* tip visible immediately at rail top */
          updatePillVisual(1, 0);
        }
        pillMorphP = 1;
        return;
      }

      /* mid morph */
      if (pillPhase === "converged") {
        releaseFixedPills();
        pillBases = null;
        if (rail) {
          rail._rideZero = null;
          rail.classList.remove("is-drawing");
        }
        if (railFill) railFill.style.height = "0%";
      }
      if (!pillBases || !pillBases.length) {
        if (!capturePillBases()) return;
      }
      pillPhase = "scrubbing";
      pillMorphP = morph;
      pills.classList.add("is-merging");
      pills.classList.remove("is-converged");
      if (rail) {
        rail.classList.remove("is-drawing");
        rail._rideZero = null;
      }
      if (railFill) railFill.style.height = "0%";
      layoutRail();
      updatePillVisual(pillMorphP, 0);
    }

    /**
     * Wheel scrub — only when no sticky track (fallback).
     * With track, scroll position owns morph so Lenis fast-scroll still works.
     */
    function canScrubPillMorph(deltaY) {
      if (introTrack) return false;
      if (reduceMotion) return false;
      if (!pills || !pills.classList.contains("is-in")) return false;

      if (pillPhase === "scrubbing") return true;

      if (pillPhase === "converged") {
        if (deltaY >= 0) return false;
        if (pillLastRideP > 0.04) return false;
        return true;
      }

      if (deltaY <= 0) return false;
      if (!isIntroFullyDocked()) return false;
      return true;
    }

    /**
     * @returns true = 消费滚轮；false = 放行页面
     */
    function applyPillScrubDelta(deltaY) {
      if (!canScrubPillMorph(deltaY)) return false;

      if (pillPhase === "converged" && deltaY < 0) {
        releaseFixedPills();
        pillBases = null;
      }

      if (!pillBases || !pillBases.length) {
        if (!capturePillBases()) return false;
      }

      if (pillPhase === "converged" && deltaY < 0) {
        pillPhase = "scrubbing";
        pillMorphP = 1;
        if (rail) {
          rail._rideZero = null;
          rail.classList.remove("is-drawing");
        }
        if (railFill) railFill.style.height = "0%";
        pills.classList.add("is-merging");
        pills.classList.remove("is-converged");
        updatePillVisual(1, 0);
      }

      var sens = deltaY < 0 ? 0.0022 : 0.00115;
      var next = clamp(pillMorphP + deltaY * sens, 0, 1);
      pillMorphP = next;

      if (pillMorphP <= 0.02) {
        pillMorphP = 0;
        pillPhase = "idle";
        pillLastRideP = 0;
        if (rail) {
          rail._rideZero = null;
          rail.classList.remove("is-drawing");
        }
        if (railFill) railFill.style.height = "0%";
        resetPillStyles();
        pillBases = null;
        return true;
      }

      if (pillMorphP >= 0.999 && deltaY > 0) {
        pillMorphP = 1;
        pillPhase = "converged";
        if (rail) rail._rideZero = null;
        pills.classList.add("is-converged");
        layoutRail();
        updatePillVisual(1, 0);
        return true;
      }

      pillPhase = "scrubbing";
      pills.classList.remove("is-converged");
      if (rail) {
        rail.classList.remove("is-drawing");
        rail._rideZero = null;
      }
      if (railFill) railFill.style.height = "0%";
      layoutRail();
      updatePillVisual(pillMorphP, 0);
      return true;
    }

    /** 卸掉 fixed，避免 capture 量到堆在 tip 的小圆 */
    function releaseFixedPills() {
      if (!pills) return;
      var els = pills.querySelectorAll(".ai-pill");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        el.style.removeProperty("position");
        el.style.removeProperty("left");
        el.style.removeProperty("top");
        el.style.removeProperty("transform");
        el.style.removeProperty("width");
        el.style.removeProperty("height");
        el.style.removeProperty("z-index");
      }
    }

    /** Measure once at rest; lock parent box so absolute kids don't collapse width→0 */
    function capturePillBases() {
      if (!pills) return false;
      var els = pills.querySelectorAll(".ai-pill");
      if (!els.length) return false;

      for (var z = 0; z < els.length; z++) {
        els[z].classList.remove("is-merging");
        els[z].style.cssText = "";
      }
      pills.classList.remove("is-merging", "is-converged");
      pills.style.removeProperty("--pills-w");
      pills.style.removeProperty("--pills-h");
      pills.style.removeProperty("width");
      pills.style.removeProperty("min-height");
      void pills.offsetWidth;

      /* measure while still in normal flex layout (full row width) */
      var pr = pills.getBoundingClientRect();
      var lockW = Math.ceil(pr.width);
      var lockH = Math.ceil(pr.height);
      if (lockW < 8) return false;

      /* freeze parent size BEFORE children go absolute — prevents origin jump to page center */
      pills.style.setProperty("--pills-w", lockW + "px");
      pills.style.setProperty("--pills-h", lockH + "px");
      pills.style.width = lockW + "px";
      pills.style.minHeight = lockH + "px";
      pills.style.minWidth = lockW + "px";
      pills.style.marginLeft = "auto";
      pills.style.marginRight = "auto";

      pillBases = [];
      var sumX = 0;
      var sumY = 0;
      for (var i = 0; i < els.length; i++) {
        var r = els[i].getBoundingClientRect();
        /* local coords vs locked parent box */
        var left = r.left - pr.left;
        var top = r.top - pr.top;
        var localCx = left + r.width / 2;
        var localCy = top + r.height / 2;
        sumX += localCx;
        sumY += localCy;
        pillBases.push({
          el: els[i],
          w: r.width,
          h: r.height,
          localCx: localCx,
          localCy: localCy,
        });
      }
      /* gather = geometric center of four pills inside locked row */
      pillHomeLocalX = sumX / els.length;
      pillHomeLocalY = sumY / els.length;
      return true;
    }

    /**
     * morphP 滚轮 0→1：
     *   0–0.40  左右收窄（宽→高，高度不变）+ 去字
     *   0.35–0.75 再整体缩小到 tip 圆
     *   0.45–1.0  平移汇到中心
     * rideP：汇聚后连线；圆用 position:fixed 钉在线端（滚出 intro 也不丢）
     */
    function updatePillVisual(morphP, rideP) {
      if (!pills) return;
      var els = pills.querySelectorAll(".ai-pill");
      if (!els.length) return;
      if (reduceMotion) return;

      if (morphP < 0.01 && pillPhase !== "converged") return;

      if (!pillBases || pillBases.length !== els.length) {
        if (!capturePillBases()) return;
      }

      pills.classList.add("is-merging");

      /* phase A: horizontal squeeze only */
      var textT = smoothstep(morphP / 0.22);
      var squeezeT = smoothstep(morphP / 0.4);
      /* phase B: uniform size shrink (after mostly squeezed) */
      var sizeT = smoothstep((morphP - 0.35) / 0.4);
      /* phase C: gather to center */
      var flyT = smoothstep((morphP - 0.4) / 0.55);

      /*
       * 仅「已 converged 且在拉线」时用 fixed 钉 tip。
       * 回滚 scrubbing 时绝不用 fixed，否则四圆叠在 tip 上看起来「没展开」。
       */
      var rideT =
        pillPhase === "converged" ? clamp(rideP, 0, 1) : 0;

      var tipDiam = 12;
      var rr = rail ? rail.getBoundingClientRect() : null;
      var labR = lab ? lab.getBoundingClientRect() : null;
      var tipX = labR
        ? labR.left + labR.width / 2
        : rr
          ? rr.left + rr.width / 2
          : (window.innerWidth || 0) / 2;
      var tipY = rr ? rr.top + rr.height * rideT : 0;

      var useFixed =
        pillPhase === "converged" && rr && (rideT > 0.001 || morphP >= 0.999);

      for (var i = 0; i < pillBases.length; i++) {
        var b = pillBases[i];
        var el = b.el;
        if (!el) continue;

        /* 1) 左右：宽从 b.w → b.h；高保持 b.h */
        var wAfterSqueeze = b.w + (b.h - b.w) * squeezeT;
        var hAfterSqueeze = b.h;
        /* 2) 再整体：宽高一起 → tipDiam */
        var w = wAfterSqueeze + (tipDiam - wAfterSqueeze) * sizeT;
        var h = hAfterSqueeze + (tipDiam - hAfterSqueeze) * sizeT;

        el.classList.add("is-merging");
        el.style.setProperty("--text-op", String(Math.max(0, 1 - textT * 1.15)));
        el.style.width = w.toFixed(2) + "px";
        el.style.height = h.toFixed(2) + "px";
        el.style.minWidth = "0";
        el.style.maxWidth = "none";
        el.style.padding = "0";
        el.style.opacity = "1";
        el.style.filter = "none";
        el.style.boxSizing = "border-box";
        el.style.transformOrigin = "50% 50%";
        el.style.margin = "0";
        el.style.zIndex = "40"; /* below topbar (200) */

        if (squeezeT > 0.4 || sizeT > 0) {
          var k = clamp(Math.max(squeezeT, sizeT), 0, 1);
          el.style.boxShadow =
            "0 0 0 2px rgba(167,139,250," +
            (0.55 + k * 0.4).toFixed(2) +
            "), 0 0 0 4px rgba(167,139,250," +
            (0.12 + k * 0.18).toFixed(2) +
            "), 0 0 16px rgba(192,38,211," +
            (0.3 + k * 0.4).toFixed(2) +
            ")";
          el.style.background =
            "radial-gradient(circle at 40% 35%, #fff 0%, #e9d5ff 40%, #a78bfa 100%)";
        } else {
          el.style.removeProperty("box-shadow");
          el.style.removeProperty("background");
        }

        if (useFixed) {
          /* 圆心 = 线端 tip；滚出 intro 也不丢 */
          el.style.position = "fixed";
          el.style.left = (tipX - w / 2).toFixed(2) + "px";
          el.style.top = (tipY - h / 2).toFixed(2) + "px";
          el.style.transform = "none";
          el.style.removeProperty("--pill-left");
          el.style.removeProperty("--pill-top");
        } else {
          /* 仍在 pills 盒内：pin 中心 + 本地汇聚 */
          var pinLeft = b.localCx - w / 2;
          var pinTop = b.localCy - h / 2;
          var homeDx = (pillHomeLocalX - b.localCx) * flyT;
          var homeDy = (pillHomeLocalY - b.localCy) * flyT;
          el.style.position = "absolute";
          el.style.setProperty("--pill-left", pinLeft.toFixed(2) + "px");
          el.style.setProperty("--pill-top", pinTop.toFixed(2) + "px");
          el.style.left = "";
          el.style.top = "";
          el.style.transform =
            "translate3d(" +
            homeDx.toFixed(2) +
            "px," +
            homeDy.toFixed(2) +
            "px,0)";
        }
      }

      /* 线高 = 到 tip 的比例；与 fixed 圆心同一 tipY，圆不会掉在线下面 */
      if (useFixed && railFill && rr && rr.height > 1) {
        var hPct = clamp(rideT * 100, 0, 100);
        railFill.style.height = hPct.toFixed(2) + "%";
      }

      if (flyT > 0.98) pills.classList.add("is-converged");
      else pills.classList.remove("is-converged");
    }

    /**
     * 视差：背景随滚动移动（相对 intro.top）
     * 渐隐：滚过 intro 中下部 → 整体 fade
     * 竖线：从 intro 标签延伸到案例，滚动点亮
     */
    function updateMotion() {
      var r = root.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      var h = Math.max(r.height, 1);

      // —— 背景滚动进度：从进入视口开始（非整段顶贴顶才动）
      // r.top = vh → 0；滚出上方 r.top = -h → 1
      var pY = clamp((vh - r.top) / (vh + h), 0, 1);
      if (r.top >= vh) pY = 0;
      else if (r.bottom <= 0) pY = 1;
      if (
        window.__aiIntroBgShader &&
        typeof window.__aiIntroBgShader.setScrollProgress === "function"
      ) {
        window.__aiIntroBgShader.setScrollProgress(pY);
      } else if (bgImg) {
        var maxShift = h * 0.85;
        var parallax = -pY * maxShift;
        bgImg.style.transform =
          "translate3d(0," + parallax.toFixed(2) + "px,0)";
      }

      // —— 淡出：仅 intro 整块滚出视口上方时；钉住 / 回滚可见时始终 1
      var fade = 1;
      if (r.bottom <= 0) {
        fade = 0;
      } else if (r.top < -40) {
        /* scrolling away upward — ease out */
        var leave = clamp(r.bottom / Math.max(vh * 1.0, 1), 0, 1);
        var topLeave = clamp(1 + r.top / Math.max(h * 0.6, 1), 0, 1);
        fade = Math.min(leave, topLeave, visibilityRatio(r, vh));
        fade = fade * fade * (3 - 2 * fade);
      }

      root.style.setProperty("--intro-fade", fade.toFixed(3));
      var leaveAmt = 1 - fade;
      var blurPx = leaveAmt * leaveAmt * 8;
      if (blurPx < 0.35) blurPx = 0;
      root.style.setProperty("--intro-blur", blurPx.toFixed(2) + "px");
      var introCopy = document.getElementById("ai-lab-intro-copy");
      if (introCopy) {
        introCopy.classList.toggle("has-intro-blur", blurPx > 0);
      }
      var introInner = document.getElementById("ai-lab-intro-inner");
      if (introInner) {
        introInner.classList.remove("has-intro-blur");
      }

      // intro 或 cases 占主导时隐藏底栏 tab（阈值带滞回，减少开关闪）
      if (productDock) {
        var hideByIntro =
          r.bottom > vh * 0.32 && r.top < vh * 0.68 && fade > 0.35;
        var hideByCases = false;
        if (work) {
          var wr = work.getBoundingClientRect();
          // 案例 sticky 区进入视口中下部即藏 tab
          hideByCases =
            wr.top < vh * 0.88 && wr.bottom > vh * 0.22;
        }
        var hideDock = hideByIntro || hideByCases;
        var wasHidden = productDock.classList.contains("is-hidden-by-intro");
        if (hideDock && !wasHidden) {
          productDock.classList.add("is-hidden-by-intro");
        } else if (!hideDock && wasHidden) {
          // 离开 intro + cases 更干净再显示
          var introClear =
            r.bottom < vh * 0.25 || r.top > vh * 0.78 || fade < 0.15;
          var casesClear = true;
          if (work) {
            var wr2 = work.getBoundingClientRect();
            casesClear = wr2.bottom < vh * 0.15 || wr2.top > vh * 0.9;
          }
          if (introClear && casesClear) {
            productDock.classList.remove("is-hidden-by-intro");
            // 重新露出时立刻按背后区域重算反色（避免粘住深色）
            if (typeof window.__updateDockTheme === "function") {
              requestAnimationFrame(function () {
                window.__updateDockTheme();
              });
            }
          }
        } else if (!hideDock) {
          // Theme already updates via throttled scroll bus — skip per-frame force
        }
      }

      // pills appear first, then morph/line (is-in must be ready for capture)
      setIn(wantIn(r, vh));

      // —— 竖线 + pills（track scroll 驱动 morph）
      layoutRail();
      syncPillMorphFromTrack();

      /*
       * morphP = track progress / scrub
       * rideP  = free scroll after converge; track tail also contributes a little
       */
      var morphP =
        pillPhase === "converged"
          ? 1
          : pillPhase === "scrubbing"
            ? pillMorphP
            : pillMorphP > 0
              ? pillMorphP
              : 0;
      var rideP = 0;

      if (pillPhase === "converged" && rail && !isMobileLayout()) {
        var morphEnd = 0.72;
        var trackTail = 0;
        if (introTrack && pillTrackP > morphEnd) {
          trackTail = clamp(
            (pillTrackP - morphEnd) / Math.max(1 - morphEnd, 0.01),
            0,
            1
          );
        }
        var rrRide = rail.getBoundingClientRect();
        var railH = Math.max(rrRide.height, 1);
        var probeNow = vh * 0.55 - rrRide.top;
        if (rail._rideZero == null) {
          rail._rideZero = probeNow;
        }
        var freeRide = clamp(
          (probeNow - rail._rideZero) / Math.max(railH * 0.85, 140),
          0,
          1
        );
        rideP = Math.max(trackTail * 0.35, freeRide);
        /* keep a tiny tip so line/dot are never fully invisible when converged */
        if (rideP < 0.02) rideP = 0.02;
      } else if (rail && pillPhase !== "converged") {
        rail._rideZero = null;
      }
      pillLastRideP = rideP;

      /* show line as soon as converged (not only after ride grows) */
      var drawing = pillPhase === "converged" && !isMobileLayout();
      if (rail) rail.classList.toggle("is-drawing", drawing);
      if (railFill) {
        if (pillPhase !== "converged") {
          railFill.style.height = "0%";
        }
        railFill.style.transition = "none";
      }
      if (railDot) {
        railDot.style.opacity = "0";
      }

      if (pillPhase === "scrubbing" || pillPhase === "converged" || morphP > 0) {
        updatePillVisual(morphP, rideP);
      }
    }

    var motionRaf = 0;
    function onScroll() {
      if (motionRaf) return;
      motionRaf = requestAnimationFrame(function () {
        motionRaf = 0;
        updateMotion();
      });
    }

    function onWheelScrub(e) {
      var dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      if (e.deltaMode === 2) dy *= window.innerHeight || 800;

      /*
       * 仅当 scrub 成功消费滚轮时才 preventDefault。
       * 失败一律放行 → 永不卡死回滚 / 导航。
       */
      if (applyPillScrubDelta(dy)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    var touchLastY = null;
    function onTouchStartScrub(e) {
      if (e.touches && e.touches[0]) touchLastY = e.touches[0].clientY;
    }
    function onTouchMoveScrub(e) {
      if (!e.touches || !e.touches[0]) return;
      var y = e.touches[0].clientY;
      if (touchLastY == null) {
        touchLastY = y;
        return;
      }
      var dy = touchLastY - y;
      touchLastY = y;
      if (applyPillScrubDelta(dy * 1.6)) {
        e.preventDefault();
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheelScrub, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStartScrub, { passive: true });
    window.addEventListener("touchmove", onTouchMoveScrub, { passive: false });
    window.addEventListener("resize", function () {
      if (pillPhase === "scrubbing" || pillPhase === "converged") {
        layoutRail();
        updateMotion();
        return;
      }
      clearPillMerge();
      syncTitleGradient();
      onScroll();
    });

    // 挂到 Lenis 统一回调（index 里只调 __updateAiScroll）
    var prevUpdate = window.__updateAiScroll;
    window.__updateAiScroll = function () {
      if (typeof prevUpdate === "function") prevUpdate();
      onScroll();
    };

    if (window.__lenis && typeof window.__lenis.on === "function") {
      try {
        window.__lenis.on("scroll", onScroll);
      } catch (err) {}
    }
    setTimeout(function () {
      if (window.__lenis && typeof window.__lenis.on === "function") {
        try {
          window.__lenis.on("scroll", onScroll);
        } catch (err) {}
      }
      onScroll();
    }, 0);

    // 字体/布局稳定后再对齐渐变
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        syncTitleGradient();
        onScroll();
      });
    }

    // 初始：满显、无 blur，再对齐渐变；勿在首帧用半透明进场
    // 标题词保持 opacity:0，等 wantIn / title IO → setIn 再加 is-words-in
    root.style.setProperty("--intro-fade", "1");
    root.style.setProperty("--intro-blur", "0px");
    var introCopy0 = document.getElementById("ai-lab-intro-copy");
    if (introCopy0) introCopy0.classList.remove("has-intro-blur");
    var introInner0 = document.getElementById("ai-lab-intro-inner");
    if (introInner0) introInner0.classList.remove("has-intro-blur");

    /*
     * Dedicated title IO — sticky + Lenis can skip scroll-geometry frames so
     * wantIn alone sometimes never fires while the title is on screen.
     * When ≥25% of the title is visible, play the word stagger once.
     */
    var titleIo = null;
    if (h2 && typeof IntersectionObserver !== "undefined") {
      titleIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting && e.intersectionRatio >= 0.2) {
              setIn(true);
            }
          });
        },
        { threshold: [0, 0.2, 0.35, 0.5, 0.75, 1], rootMargin: "0px" }
      );
      titleIo.observe(h2);
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        syncTitleGradient();
        onScroll();
      });
    });
  })();

  /* ——— ThinkingOrb (thinking-orbs Searching / globe) ——— */
  (function orbs() {
    if (typeof window.mountThinkingOrb !== "function") return;

    // 与 timeline 共用的 playground 文案（intro + 左侧 agent 同步）
    var ORB_LABELS = [
      "Searching…",
      "Solving…",
      "Composing…",
      "Working…",
      "Thinking…",
    ];
    window.__aiOrbLabels = ORB_LABELS;

    /* per-label gen — shared typeGen cancelled the other mid-delete (empty text) */
    var typeGenMap = typeof WeakMap !== "undefined" ? new WeakMap() : null;
    var typeGenFallback = 0;
    var DEL_MS = 26;
    var TYPE_MS = 38;

    function textNode(labelEl) {
      if (!labelEl) return null;
      var t = labelEl.querySelector(".ai-orb-type-text");
      return t || labelEl;
    }

    function nextGen(labelEl) {
      if (typeGenMap) {
        var g = (typeGenMap.get(labelEl) || 0) + 1;
        typeGenMap.set(labelEl, g);
        return g;
      }
      return ++typeGenFallback;
    }

    function currentGen(labelEl) {
      if (typeGenMap) return typeGenMap.get(labelEl) || 0;
      return typeGenFallback;
    }

    function typewriteLabel(labelEl, fullText) {
      if (!labelEl) return;
      var node = textNode(labelEl);
      if (!node) return;
      var gen = nextGen(labelEl);
      labelEl.classList.add("is-typing");
      var cur = node.textContent || "";

      function finish() {
        if (gen !== currentGen(labelEl)) return;
        node.textContent = fullText;
        labelEl.classList.remove("is-typing");
      }

      function typeStep() {
        if (gen !== currentGen(labelEl)) return;
        if (cur.length >= fullText.length) {
          finish();
          return;
        }
        cur = fullText.slice(0, cur.length + 1);
        node.textContent = cur;
        setTimeout(typeStep, TYPE_MS);
      }

      function delStep() {
        if (gen !== currentGen(labelEl)) return;
        if (cur.length === 0) {
          typeStep();
          return;
        }
        cur = cur.slice(0, -1);
        node.textContent = cur;
        setTimeout(delStep, DEL_MS);
      }

      /* same string: no retype */
      if (cur === fullText) {
        labelEl.classList.remove("is-typing");
        return;
      }
      delStep();
    }

    function setOrbLabels(text) {
      typewriteLabel(window.__aiThinkingOrbLabel, text);
      typewriteLabel(window.__aiIntroOrbLabel, text);
    }
    window.__setAiOrbLabels = setOrbLabels;

    // 左侧 agent 面板 orb
    var canvas = document.getElementById("ai-orb-canvas");
    var label = document.querySelector(".ai-orb-label");
    if (canvas) {
      var orb = window.mountThinkingOrb(canvas, {
        state: "searching",
        size: 28,
        theme: "light",
        speed: 1,
      });
      window.__aiThinkingOrb = orb;
      window.__aiThinkingOrbLabel = label;
    }

    // AI examples intro：深色底用 dark theme（亮点）+ 更大尺寸/更粗点
    var introCanvas = document.getElementById("ai-intro-orb-canvas");
    var introLabel =
      document.querySelector(".ai-intro-orb-label") ||
      document.getElementById("ai-intro-orb-label");
    if (introCanvas) {
      window.mountThinkingOrb(introCanvas, {
        state: "searching",
        size: 72,
        theme: "dark", // 亮色圆点，深色 intro 上才看得清
        speed: 1,
        dotScale: 1.55,
      });
    }
    if (introLabel) {
      window.__aiIntroOrbLabel = introLabel;
    }

    // 初始 + 循环：intro 在屏时独立轮换；timeline 推进时接管并对齐
    var orbIdx = 0;
    var timelineOwns = false;
    setOrbLabels(ORB_LABELS[0]);
    var orbTimer = null;
    /* hold long enough for delete+type (~0.9–1.4s) + read */
    var ORB_CYCLE_MS = 3200;
    function tickOrbLabels() {
      if (timelineOwns) return;
      orbIdx = (orbIdx + 1) % ORB_LABELS.length;
      setOrbLabels(ORB_LABELS[orbIdx]);
    }
    function startOrbCycle() {
      if (orbTimer || timelineOwns) return;
      orbTimer = setInterval(tickOrbLabels, ORB_CYCLE_MS);
    }
    function stopOrbCycle() {
      if (!orbTimer) return;
      clearInterval(orbTimer);
      orbTimer = null;
    }
    // timeline 推进时同步 intro + 左侧，并暂停独立循环避免抢写
    window.__syncAiOrbLabelIndex = function (i) {
      timelineOwns = true;
      stopOrbCycle();
      if (i == null || i < 0) {
        setOrbLabels("Done");
        return;
      }
      orbIdx = i % ORB_LABELS.length;
      setOrbLabels(ORB_LABELS[orbIdx]);
    };
    window.__releaseAiOrbLabelCycle = function () {
      timelineOwns = false;
      startOrbCycle();
    };

    var introRoot = document.getElementById("ai-lab-intro");
    if (typeof IntersectionObserver !== "undefined" && introRoot) {
      var ioOrb = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) startOrbCycle();
            else if (!timelineOwns) stopOrbCycle();
          });
        },
        { threshold: 0.12 }
      );
      ioOrb.observe(introRoot);
    } else {
      startOrbCycle();
    }
  })();

  /* ——— Research-agent style step timeline (SSE) ——— */
  (function timeline() {
    var root = document.getElementById("ai-timeline");
    var badge = document.getElementById("ai-agent-badge");
    var scroller = document.getElementById("ai-sse") || (root && root.parentElement);
    if (!root) return;
    var steps = Array.prototype.slice.call(root.querySelectorAll(".ai-step"));

    var ICONS = {
      search:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>',
      image:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M21 16l-5-5-4 4-2-2-5 5"/></svg>',
      globe:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>',
      gear:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
      check:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12l5 5L20 7"/></svg>',
    };

    steps.forEach(function (step) {
      var ico = step.querySelector(".ai-step-ico");
      if (!ico) return;
      var key = ico.getAttribute("data-ico") || "search";
      ico.innerHTML = ICONS[key] || ICONS.search;
      step.classList.add("is-pending");
    });

    // wrap chips for first step
    steps.forEach(function (step) {
      var detail = step.querySelector(".ai-step-detail");
      if (!detail) return;
      var chips = detail.querySelectorAll(".ai-chip");
      if (chips.length > 1 && !detail.querySelector(".ai-chips")) {
        var wrap = document.createElement("div");
        wrap.className = "ai-chips";
        chips.forEach(function (c) {
          wrap.appendChild(c);
        });
        detail.insertBefore(wrap, detail.firstChild);
      }
    });

    var idx = 0;
    var started = false;
    var DUR = 2200;

    function setBadge(text, done) {
      if (!badge) return;
      badge.textContent = text;
      badge.classList.toggle("is-done", !!done);
    }

    /** 溢出时滚到最底（跟住最新步骤）；重置时可 forceTop */
    function scrollTimeline(opts) {
      if (!scroller) return;
      opts = opts || {};
      var maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      var nextTop = opts.forceTop ? 0 : maxScroll;
      // 未溢出且不是强制回顶 → 不动
      if (!opts.forceTop && maxScroll <= 1) return;
      if (Math.abs(nextTop - scroller.scrollTop) < 1) return;

      if (typeof scroller.scrollTo === "function") {
        scroller.scrollTo({
          top: nextTop,
          behavior: opts.smooth === false ? "auto" : "smooth",
        });
      } else {
        scroller.scrollTop = nextTop;
      }
    }

    /**
     * 鼠标滚轮不滚动时间线内部，一律转给页面（Lenis / window）
     * 悬停在左侧 AI 面板时降速：右侧叠卡进度更慢、更可控
     * 程序化 scrollTimeline 仍可用 scrollTop
     */
    (function passWheelToPage() {
      var panel = document.querySelector(".ai-think") || scroller;
      var leftCol = document.querySelector(".ai-lab-left");
      if (!panel) return;

      /* 悬停左栏时的页面滚动倍率（越小越慢） */
      var HOVER_SLOW = 0.32;
      var hoverLeft = false;

      function setHover(on) {
        hoverLeft = !!on;
        if (leftCol) leftCol.classList.toggle("is-scroll-slow", hoverLeft);
        if (panel) panel.classList.toggle("is-scroll-slow", hoverLeft);
      }

      if (leftCol) {
        leftCol.addEventListener("pointerenter", function () {
          setHover(true);
        });
        leftCol.addEventListener("pointerleave", function () {
          setHover(false);
        });
      } else {
        panel.addEventListener("pointerenter", function () {
          setHover(true);
        });
        panel.addEventListener("pointerleave", function () {
          setHover(false);
        });
      }

      function onWheel(e) {
        // 拦截内部滚动
        e.preventDefault();
        e.stopPropagation();
        var dy = e.deltaY;
        // deltaMode: 1 = lines, 2 = pages
        if (e.deltaMode === 1) dy *= 16;
        if (e.deltaMode === 2) dy *= window.innerHeight;

        /* 鼠标在左侧 AI 区：降速驱动右侧叠卡 */
        if (hoverLeft || (leftCol && leftCol.matches(":hover")) || panel.matches(":hover")) {
          dy *= HOVER_SLOW;
        }

        if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
          try {
            var cur =
              typeof window.__lenis.scroll === "number"
                ? window.__lenis.scroll
                : window.scrollY || 0;
            window.__lenis.scrollTo(cur + dy, {
              immediate: true, /* 跟手降速，避免平滑叠加速度 */
              force: true,
            });
            return;
          } catch (err) {}
        }
        window.scrollBy(0, dy);
      }

      // 整块 agent 面板（含 timeline）+ 左栏
      panel.addEventListener("wheel", onWheel, { passive: false });
      if (scroller && scroller !== panel) {
        scroller.addEventListener("wheel", onWheel, { passive: false });
      }
      if (leftCol && leftCol !== panel) {
        leftCol.addEventListener("wheel", onWheel, { passive: false });
      }
    })();

    function activate(i) {
      steps.forEach(function (s, j) {
        s.classList.remove("is-active", "is-done", "is-pending");
        if (j < i) s.classList.add("is-done");
        else if (j === i) s.classList.add("is-active");
        else s.classList.add("is-pending");
      });
      if (i >= steps.length) {
        steps.forEach(function (s) {
          s.classList.remove("is-active", "is-pending");
          s.classList.add("is-done");
        });
        setBadge("Complete", true);
        if (typeof window.__syncAiOrbLabelIndex === "function") {
          window.__syncAiOrbLabelIndex(-1); // Done
        } else if (typeof window.__setAiOrbLabels === "function") {
          window.__setAiOrbLabels("Done");
        }
        // 全部完成：滚到底
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            scrollTimeline();
          });
        });
        return;
      }
      var labels = [
        "Fetching…",
        "Analyzing…",
        "Generating…",
        "Adjusting…",
        "Finishing…",
      ];
      // thinking-orbs playground labels（intro + 左侧同步）
      var orbLabels =
        window.__aiOrbLabels ||
        [
          "Searching…",
          "Solving…",
          "Composing…",
          "Working…",
          "Thinking…",
        ];
      setBadge(labels[i] || "Processing", false);
      if (typeof window.__syncAiOrbLabelIndex === "function") {
        window.__syncAiOrbLabelIndex(i);
      } else if (typeof window.__setAiOrbLabels === "function") {
        window.__setAiOrbLabels(orbLabels[i] || "Searching…");
      }
      // detail 展开后滚到底，露出最新步骤
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          scrollTimeline();
        });
      });
    }

    function tick() {
      if (idx < steps.length) {
        activate(idx);
        idx++;
        setTimeout(tick, DUR);
      } else {
        activate(steps.length);
        setTimeout(function () {
          idx = 0;
          setBadge("Processing", false);
          steps.forEach(function (s) {
            s.classList.remove("is-active", "is-done");
            s.classList.add("is-pending");
          });
          // 循环重置：回顶；orb 文案重新从 Searching 开始
          if (typeof window.__syncAiOrbLabelIndex === "function") {
            window.__syncAiOrbLabelIndex(0);
          }
          scrollTimeline({ forceTop: true });
          setTimeout(tick, 900);
        }, 2400);
      }
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) {
            started = true;
            tick();
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(root);
  })();

  /* ——— Branded tracking page mocks into stack cards (each case unique) ——— */
  (function injectOglPages() {
    var mounts = document.querySelectorAll("[data-ogl-page]");
    if (!mounts.length) return;

    var ICONS =
      '<div class="ogl-nav-icons" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/></svg>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 7h12l-1 12H7L6 7z"/><path d="M9 7a3 3 0 016 0"/></svg>' +
      "</div>";

    // Four distinct merchant experiences — each with a different LAYOUT
    // layouts: hero | split | steps | stack
    var CASES = [
      {
        layout: "noissey",
        logo: "NOISSEY",
        nav: ["Shop", "Drops"],
        theme: "theme-noissey",
        kicker: "Order tracking",
        formTitle: "Track Your Order",
        btnLabel: "Track order",
        hero: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=80",
        heroAlt: "NOISSEY streetwear",
        trackTitle: "Track Your NOISSEY Order",
        statusH: "Your order is on the way",
        statusSub: "Label created — carrier has the package.",
        order: "NS-48219",
        email: "alex@example.com",
        carrier: "UPS",
        tracking: "1Z999AA10123456784",
        eta: "Today · by 8:00 PM",
        note: { title: "SMS · Out for delivery soon", body: "We'll notify you again when the courier is nearby." },
        items: [
          { img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=120&q=80", t: "Merino Overcoat", m: "Size M · $248" },
          { img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=120&q=80", t: "Soft Knit Scarf", m: "One size · $68" },
        ],
        timeline: [
          { cls: "done", t: "Order confirmed", s: "Mon · Mar 12 · 10:24 AM", loc: "NOISSEY · Hong Kong" },
          { cls: "done", t: "Label created · Carrier accepted", s: "Mon · Mar 12 · 4:02 PM", loc: "Shipment information received" },
          { cls: "done", t: "Departed origin facility", s: "Tue · Mar 13 · 08:15 AM", loc: "In transit to destination city" },
          { cls: "done", t: "Arrived at local facility", s: "Wed · Mar 14 · 10:24 AM", loc: "Los Angeles, CA · Distribution center" },
          { cls: "active", t: "Out for delivery", s: "Wed · Mar 14 · 07:40 AM", loc: "With courier · On vehicle for delivery" },
          { cls: "", t: "Delivered", s: "Fri · Est.", loc: "Awaiting delivery confirmation" },
        ],
        favH: "Viral piece right now",
        favP: "Heavyweight tees and graphics shipping with this drop.",
        favs: [
          { img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80", n: "Field Jacket", p: "$198" },
          { img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80", n: "Cashmere Crew", p: "$128" },
          { img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80", n: "Leather Gloves", p: "$86" },
          { img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=400&q=80", n: "Wool Beanie", p: "$42" },
        ],
        why: [
          { h: "Why NOISSEY", p: "Premium heavyweight streetwear. Bold graphics, built for loud self-expression." },
          { h: "Worldwide shipping", p: "NOISSEY ships globally so the look travels with you." },
        ],
        footer: "Premium high streetwear built for loud self-expression.",
        shop: ["Tees", "Denim", "Graphics"],
      },
      {
        layout: "brand",
        logo: "OutIn",
        nav: ["Shop", "Explore"],
        theme: "theme-outin",
        kicker: "Traccia",
        formTitle: "Traccia il tuo ordine",
        btnLabel: "Traccia l'ordine",
        hero: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
        heroAlt: "OutIn portable espresso",
        trackTitle: "Traccia il tuo ordine",
        statusH: "Your order is placed and is about to be shipped",
        statusSub: "Label created · Amazon MCF · 2 Sep, 2026.",
        order: "TB******278",
        email: "mia@example.com",
        carrier: "DHL Express",
        tracking: "JD014600012345678901",
        eta: "Sat · Apr 6",
        note: { title: "Cold-chain care", body: "Actives ship with insulated pack — keep unopened until it arrives." },
        items: [
          { img: "https://images.unsplash.com/photo-1620916565523-9ad18c81e2be?auto=format&fit=crop&w=120&q=80", t: "Vitamin C Serum", m: "30ml · $64" },
          { img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=120&q=80", t: "Clay Mask Duo", m: "Set · $48" },
        ],
        timeline: [
          { cls: "done", t: "Order confirmed", s: "Wed · Apr 2 · 09:12 AM", loc: "Payment captured · OutIn checkout" },
          { cls: "done", t: "Quality checked & packed", s: "Wed · Apr 2 · 02:40 PM", loc: "OutIn studio · packed" },
          { cls: "done", t: "Label created", s: "Thu · Apr 3 · 08:05 AM", loc: "Shipment information received" },
          { cls: "active", t: "Picked up by carrier", s: "Thu · Apr 3 · 11:22 AM", loc: "DHL Express · Portland sort facility" },
          { cls: "", t: "In transit", s: "Upcoming", loc: "En route to destination hub" },
          { cls: "", t: "Out for delivery", s: "Est. Sat · Apr 6", loc: "Local delivery vehicle" },
          { cls: "", t: "Delivered", s: "Pending", loc: "Signature not required" },
        ],
        favH: "Espresso Fresco, Ovunque",
        favP: "Grinders, accessories, and gift sets for the road.",
        favs: [
          { img: "https://images.unsplash.com/photo-1608248543804-c03c01e4f0c8?auto=format&fit=crop&w=400&q=80", n: "Gentle Cleanser", p: "$32" },
          { img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80", n: "SPF Fluid", p: "$38" },
          { img: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?auto=format&fit=crop&w=400&q=80", n: "Night Cream", p: "$54" },
          { img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80", n: "Lip Balm Trio", p: "$22" },
        ],
        why: [
          { h: "Perché scegliere OutIn", p: "Portable espresso, built for travel. Battery-powered coffee wherever you land." },
          { h: "La tua stazione del caffè", p: "Track the kit from the studio to your doorstep in one branded page." },
        ],
        footer: "Espresso fresco, ovunque.",
        shop: ["Machines", "Accessories", "Gifts"],
      },
      {
        layout: "brand",
        logo: "SwellPro",
        nav: ["Drones", "Support"],
        theme: "theme-swellpro",
        kicker: "Official SwellPro store",
        formTitle: "Track Your Order",
        btnLabel: "Track Order",
        hero: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1400&q=80",
        heroAlt: "SwellPro fishing drone",
        trackTitle: "Track Your SwellPro Order",
        statusH: "Your order has been delivered.",
        statusSub: "Time of delivery: Aug 10, 2026 · DHL Express.",
        order: "89********876",
        email: "dev@example.com",
        carrier: "FedEx International",
        tracking: "794612345678",
        eta: "Tomorrow · by 6:00 PM",
        note: { title: "Webhook · TRACKING_UPDATED", body: "latest_status: InTransit · sub_status: Arrival" },
        items: [
          { img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=120&q=80", t: "Nova Pulse Pro", m: "Black · $299" },
          { img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=120&q=80", t: "Travel Case", m: "Graphite · $39" },
        ],
        timeline: [
          { cls: "done", t: "Order confirmed", s: "Thu · May 1 · 11:05 AM", loc: "SwellPro store · Checkout complete" },
          { cls: "done", t: "Picked up from factory", s: "Fri · May 2 · 06:40 AM", loc: "Shenzhen, CN · Export warehouse" },
          { cls: "done", t: "Departed origin country", s: "Fri · May 2 · 09:18 PM", loc: "PVG · International linehaul" },
          { cls: "done", t: "Customs released", s: "Sun · May 4 · 02:11 PM", loc: "Los Angeles, CA · LAX gateway" },
          { cls: "active", t: "Arrived at local facility", s: "Mon · May 5 · 07:03 AM", loc: "City hub · Sort facility" },
          { cls: "", t: "Out for delivery", s: "Est. Tue", loc: "With courier" },
          { cls: "", t: "Delivered", s: "Pending", loc: "Adult signature may be required" },
        ],
        favH: "SwellPro Support & Services",
        favP: "After-sales, repair, and technical support for your drone.",
        favs: [
          { img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80", n: "USB-C Hub", p: "$49" },
          { img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80", n: "Desk Stand", p: "$59" },
          { img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80", n: "Earbuds Mini", p: "$129" },
          { img: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=400&q=80", n: "Cable Pack", p: "$24" },
        ],
        why: [
          { h: "Free express shipping", p: "Free express shipping on orders over $900 for select countries." },
          { h: "Global support", p: "Online technical support and local repair for SwellPro drones." },
        ],
        footer: "Official SwellPro store.",
        shop: ["Drones", "Accessories", "Parts"],
      },
      {
        layout: "brand",
        logo: "Aussie Betta",
        nav: ["Shop", "Journal"],
        theme: "theme-aussie",
        kicker: "Australian face & body care",
        formTitle: "Track Your Order",
        btnLabel: "Track order",
        hero: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1400&q=80",
        heroAlt: "Aussie Betta pasture",
        trackTitle: "Track Your Aussie Betta Order",
        statusH: "Your order has been delivered.",
        statusSub: "Time of delivery: Aug 11, 2026 · Myrtle Beach, SC.",
        order: "11**********45",
        email: "jordan@example.com",
        carrier: "USPS Priority",
        tracking: "9400111899223344556677",
        eta: "Delivered",
        note: { title: "Proof of delivery", body: "Left with front desk · photo on file in tracking history." },
        items: [
          { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80", t: "Summit Runner", m: "EU 42 · $158" },
          { img: "https://images.unsplash.com/photo-1622260614927-88c26c0e6c5d?auto=format&fit=crop&w=120&q=80", t: "Daypack 20L", m: "Olive · $112" },
        ],
        timeline: [
          { cls: "done", t: "Order confirmed", s: "Wed · May 14 · 08:00 AM", loc: "Aussie Betta · packed" },
          { cls: "done", t: "Picked up", s: "Wed · May 14 · 03:20 PM", loc: "USPS · Origin acceptance" },
          { cls: "done", t: "In transit", s: "Thu · May 15 · 11:48 AM", loc: "Regional distribution center" },
          { cls: "done", t: "Arrived at unit", s: "Sat · May 17 · 06:55 AM", loc: "Destination post office" },
          { cls: "done", t: "Out for delivery", s: "Sun · May 18 · 09:10 AM", loc: "On postal vehicle" },
          { cls: "active", t: "Delivered", s: "Sun · May 18 · 03:41 PM", loc: "Front desk · Building lobby" },
        ],
        favH: "Recommended For You",
        favP: "Tallow skincare you might also like.",
        favs: [
          { img: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=400&q=80", n: "Bottle 1L", p: "$28" },
          { img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80", n: "Headlamp", p: "$46" },
          { img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=400&q=80", n: "Trail Poles", p: "$89" },
          { img: "https://images.unsplash.com/photo-1504281666720-87b3e3f0e0c1?auto=format&fit=crop&w=400&q=80", n: "Camp Mug", p: "$19" },
        ],
        why: [
          { h: "Why Aussie Betta", p: "Targeted Australian skincare for face and body, from grass-fed tallow." },
          { h: "Natural ingredients", p: "Scientific results. Care that travels from the pasture to your door." },
        ],
        footer: "Australian face and body care.",
        shop: ["Tallow", "Serums", "Soap"],
      },
    ];

    function esc(s) {
      return String(s == null ? "" : s);
    }

    function buildTimeline(steps) {
      return steps
        .map(function (st) {
          var loc = st.loc
            ? '<span class="ogl-tl-loc">' + esc(st.loc) + "</span>"
            : "";
          return (
            '<div class="ogl-tl-item ' +
            esc(st.cls || "") +
            '"><div class="ogl-tl-dot"></div><div class="ogl-tl-body"><strong>' +
            esc(st.t) +
            '</strong><span class="ogl-tl-time">' +
            esc(st.s) +
            "</span>" +
            loc +
            "</div></div>"
          );
        })
        .join("");
    }

    function buildEventsPanel(c, title) {
      return (
        '<div class="ogl-events">' +
        '<div class="ogl-events-head">' +
        "<h4>" +
        esc(title || "Tracking history") +
        "</h4>" +
        '<span class="ogl-events-meta">' +
        esc(c.carrier) +
        " · " +
        esc(c.tracking) +
        "</span></div>" +
        '<div class="ogl-timeline ogl-timeline-rich">' +
        buildTimeline(c.timeline) +
        "</div></div>"
      );
    }

    function buildNote(c) {
      if (!c.note) return "";
      return (
        '<div class="ogl-note">' +
        '<span class="ogl-note-ico" aria-hidden="true">🔔</span>' +
        "<div><strong>" +
        esc(c.note.title) +
        "</strong><span>" +
        esc(c.note.body) +
        "</span></div></div>"
      );
    }

    function buildItems(items) {
      return items
        .map(function (it) {
          return (
            '<div class="ogl-order-item"><img src="' +
            esc(it.img) +
            '" alt="" loading="lazy" /><div><div class="t">' +
            esc(it.t) +
            '</div><div class="m">' +
            esc(it.m) +
            "</div></div></div>"
          );
        })
        .join("");
    }

    function buildFavs(favs) {
      return favs
        .map(function (f) {
          return (
            '<div class="ogl-fav-card"><img src="' +
            esc(f.img) +
            '" alt="" loading="lazy" /><div class="cap">' +
            esc(f.n) +
            '<span class="price">' +
            esc(f.p) +
            "</span></div></div>"
          );
        })
        .join("");
    }

    function buildNav(c) {
      return (
        '<header class="ogl-nav">' +
        '<div class="ogl-nav-links"><span>' +
        esc(c.nav[0]) +
        "</span><span>" +
        esc(c.nav[1]) +
        "</span></div>" +
        '<div class="ogl-logo">' +
        esc(c.logo) +
        "</div>" +
        ICONS +
        "</header>"
      );
    }

    function buildTrackForm(c, btnLabel) {
      return (
        "<h3>" +
        esc(c.trackTitle) +
        "</h3>" +
        '<div class="ogl-fields">' +
        '<input type="text" placeholder="Order number" value="' +
        esc(c.order) +
        '" readonly tabindex="-1" />' +
        '<input type="email" placeholder="Email address" value="' +
        esc(c.email || "") +
        '" readonly tabindex="-1" />' +
        "</div>" +
        '<button type="button" class="ogl-track-btn" tabindex="-1">' +
        esc(btnLabel || "Track") +
        "</button>"
      );
    }

    function buildOrderAside(c) {
      var eta = c.eta
        ? '<div class="ogl-order-row"><span>ETA</span><b>' + esc(c.eta) + "</b></div>"
        : "";
      return (
        '<aside class="ogl-order-card">' +
        "<h4>Order summary</h4>" +
        '<div class="ogl-order-row"><span>Order</span><b>' +
        esc(c.order) +
        "</b></div>" +
        '<div class="ogl-order-row"><span>Carrier</span><b>' +
        esc(c.carrier) +
        "</b></div>" +
        '<div class="ogl-order-row"><span>Tracking</span><b class="ogl-mono">' +
        esc(c.tracking) +
        "</b></div>" +
        eta +
        '<div class="ogl-order-items">' +
        buildItems(c.items) +
        "</div></aside>"
      );
    }

    /** Layout A — full-bleed hero + centered track float + 2-col status (fashion) */
    function buildLayoutHero(c) {
      return (
        '<div class="ogl-page layout-hero ' +
        esc(c.theme) +
        '">' +
        buildNav(c) +
        '<div class="ogl-hero">' +
        '<img src="' +
        esc(c.hero) +
        '" alt="' +
        esc(c.heroAlt) +
        '" loading="lazy" decoding="async" />' +
        '<div class="ogl-track-float">' +
        buildTrackForm(c, "Track") +
        "</div></div>" +
        '<section class="ogl-status">' +
        '<div class="ogl-status-main"><h2>' +
        esc(c.statusH) +
        '</h2><p class="ogl-sub">' +
        esc(c.statusSub) +
        "</p>" +
        buildNote(c) +
        '<div class="ogl-events-inline"><div class="ogl-events-head"><h4>Shipment activity</h4><span class="ogl-events-meta">' +
        esc(c.eta || "") +
        '</span></div><div class="ogl-timeline ogl-timeline-rich">' +
        buildTimeline(c.timeline) +
        "</div></div></div>" +
        buildOrderAside(c) +
        "</section>" +
        '<section class="ogl-fav"><h3>' +
        esc(c.favH) +
        "</h3><p>" +
        esc(c.favP) +
        '</p><div class="ogl-fav-grid">' +
        buildFavs(c.favs) +
        "</div></section>" +
        '<section class="ogl-why"><div class="ogl-why-card"><h4>' +
        esc(c.why[0].h) +
        "</h4><p>" +
        esc(c.why[0].p) +
        '</p></div><div class="ogl-why-card"><h4>' +
        esc(c.why[1].h) +
        "</h4><p>" +
        esc(c.why[1].p) +
        "</p></div></section>" +
        '<footer class="ogl-footer"><div><div class="brand">' +
        esc(c.logo) +
        "</div><div>" +
        esc(c.footer) +
        "</div></div>" +
        "<div><h5>Shop</h5><ul><li>" +
        esc(c.shop[0]) +
        "</li><li>" +
        esc(c.shop[1]) +
        "</li><li>" +
        esc(c.shop[2]) +
        "</li></ul></div>" +
        "<div><h5>Help</h5><ul><li>Shipping</li><li>Returns</li><li>Contact</li></ul></div>" +
        "<div><h5>Follow</h5><ul><li>Instagram</li><li>Pinterest</li><li>Newsletter</li></ul></div>" +
        "</footer></div>"
      );
    }

    /** Layout B — split: left track + full event list, right image (beauty) */
    function buildLayoutSplit(c) {
      return (
        '<div class="ogl-page layout-split ' +
        esc(c.theme) +
        '">' +
        buildNav(c) +
        '<div class="ogl-split">' +
        '<div class="ogl-split-left">' +
        '<div class="ogl-split-track">' +
        buildTrackForm(c, "Find order") +
        "</div>" +
        '<div class="ogl-split-status">' +
        '<p class="ogl-kicker">Shipment status</p>' +
        "<h2>" +
        esc(c.statusH) +
        '</h2><p class="ogl-sub">' +
        esc(c.statusSub) +
        "</p>" +
        buildNote(c) +
        "</div>" +
        buildEventsPanel(c, "Tracking events") +
        buildOrderAside(c) +
        "</div>" +
        '<div class="ogl-split-right">' +
        '<img src="' +
        esc(c.hero) +
        '" alt="' +
        esc(c.heroAlt) +
        '" loading="lazy" />' +
        '<div class="ogl-split-rail-wrap"><p class="ogl-rail-label">Also for you</p><div class="ogl-split-rail">' +
        buildFavs(c.favs.slice(0, 3)) +
        "</div></div></div>" +
        "</div>" +
        '<section class="ogl-why ogl-why-row"><div class="ogl-why-card"><h4>' +
        esc(c.why[0].h) +
        "</h4><p>" +
        esc(c.why[0].p) +
        '</p></div><div class="ogl-why-card"><h4>' +
        esc(c.why[1].h) +
        "</h4><p>" +
        esc(c.why[1].p) +
        "</p></div></section>" +
        '<footer class="ogl-footer"><div><div class="brand">' +
        esc(c.logo) +
        "</div><div>" +
        esc(c.footer) +
        "</div></div>" +
        "<div><h5>Shop</h5><ul><li>" +
        esc(c.shop[0]) +
        "</li><li>" +
        esc(c.shop[1]) +
        "</li><li>" +
        esc(c.shop[2]) +
        "</li></ul></div>" +
        "<div><h5>Help</h5><ul><li>Shipping</li><li>Returns</li><li>Contact</li></ul></div>" +
        "<div><h5>Care</h5><ul><li>Rituals</li><li>Ingredients</li><li>Refills</li></ul></div>" +
        "</footer></div>"
      );
    }

    /** Layout C — dark dashboard: milestone steps + map + full event log */
    function buildLayoutSteps(c) {
      // Compact milestone chips (first 5 key stages)
      var milestones = c.timeline.slice(0, 5);
      var steps = milestones
        .map(function (st, i) {
          return (
            '<div class="ogl-hstep ' +
            esc(st.cls || "") +
            '"><span class="ogl-hstep-n">' +
            (i + 1) +
            '</span><strong>' +
            esc(st.t) +
            '</strong><span class="ogl-hstep-time">' +
            esc(st.s) +
            "</span></div>"
          );
        })
        .join("");
      return (
        '<div class="ogl-page layout-steps ' +
        esc(c.theme) +
        '">' +
        buildNav(c) +
        '<div class="ogl-dash">' +
        '<div class="ogl-dash-head">' +
        '<div><p class="ogl-kicker ogl-kicker-dark">Live tracking</p><h2>' +
        esc(c.statusH) +
        '</h2><p class="ogl-sub">' +
        esc(c.statusSub) +
        "</p></div>" +
        '<div class="ogl-dash-track">' +
        buildTrackForm(c, "Lookup") +
        "</div></div>" +
        '<p class="ogl-section-label">Milestones</p>' +
        '<div class="ogl-hsteps">' +
        steps +
        "</div>" +
        '<div class="ogl-dash-body">' +
        '<div class="ogl-map-panel" aria-hidden="true">' +
        '<img src="' +
        esc(c.hero) +
        '" alt="" loading="lazy" />' +
        '<div class="ogl-map-pin"></div>' +
        '<div class="ogl-map-label">' +
        esc(c.carrier) +
        " · " +
        esc(c.tracking) +
        "</div></div>" +
        buildOrderAside(c) +
        "</div>" +
        '<div class="ogl-dash-events">' +
        buildEventsPanel(c, "Carrier scan events") +
        buildNote(c) +
        "</div>" +
        '<section class="ogl-fav ogl-fav-dark"><h3>' +
        esc(c.favH) +
        "</h3><p>" +
        esc(c.favP) +
        '</p><div class="ogl-fav-grid">' +
        buildFavs(c.favs) +
        "</div></section>" +
        "</div></div>"
      );
    }

    /** Layout D — wide outdoor: banner + progress + 2-col events/order + product grid */
    function buildLayoutStack(c) {
      var segs = c.timeline
        .map(function (st) {
          return '<i class="' + esc(st.cls || "") + '"></i>';
        })
        .join("");
      return (
        '<div class="ogl-page layout-stack ' +
        esc(c.theme) +
        '">' +
        buildNav(c) +
        '<div class="ogl-trail-banner">' +
        '<img src="' +
        esc(c.hero) +
        '" alt="' +
        esc(c.heroAlt) +
        '" loading="lazy" />' +
        '<div class="ogl-trail-banner-copy">' +
        '<span class="ogl-badge">Live</span>' +
        "<h2>" +
        esc(c.statusH) +
        '</h2><p class="ogl-sub">' +
        esc(c.statusSub) +
        "</p></div></div>" +
        '<div class="ogl-trail-wrap">' +
        '<div class="ogl-progress-segs" aria-hidden="true">' +
        segs +
        "</div>" +
        buildNote(c) +
        '<div class="ogl-trail-grid">' +
        '<div class="ogl-trail-main">' +
        buildEventsPanel(c, "Tracking events") +
        '<section class="ogl-fav ogl-trail-fav"><h3>' +
        esc(c.favH) +
        "</h3><p>" +
        esc(c.favP) +
        '</p><div class="ogl-fav-grid">' +
        buildFavs(c.favs) +
        "</div></section></div>" +
        '<div class="ogl-trail-side">' +
        '<div class="ogl-m-card ogl-trail-track">' +
        buildTrackForm(c, "Track kit") +
        "</div>" +
        buildOrderAside(c) +
        "</div></div>" +
        '<section class="ogl-why ogl-why-row"><div class="ogl-why-card"><h4>' +
        esc(c.why[0].h) +
        "</h4><p>" +
        esc(c.why[0].p) +
        '</p></div><div class="ogl-why-card"><h4>' +
        esc(c.why[1].h) +
        "</h4><p>" +
        esc(c.why[1].p) +
        "</p></div></section>" +
        '<footer class="ogl-footer"><div><div class="brand">' +
        esc(c.logo) +
        "</div><div>" +
        esc(c.footer) +
        "</div></div>" +
        "<div><h5>Shop</h5><ul><li>" +
        esc(c.shop[0]) +
        "</li><li>" +
        esc(c.shop[1]) +
        "</li><li>" +
        esc(c.shop[2]) +
        "</li></ul></div>" +
        "<div><h5>Help</h5><ul><li>Shipping</li><li>Returns</li><li>Contact</li></ul></div>" +
        "<div><h5>Trails</h5><ul><li>Guides</li><li>Repairs</li><li>Club</li></ul></div>" +
        "</footer></div></div>"
      );
    }

    function buildLayoutBrand(c) {
      var steps = (c.timeline || [])
        .slice(0, 5)
        .map(function (st) {
          return '<span class="' + esc(st.cls || "") + '">' + esc(st.t) + "</span>";
        })
        .join("");
      var products = (c.favs || [])
        .slice(0, 3)
        .map(function (f) {
          return (
            '<article class="ob-prod"><img src="' +
            esc(f.img) +
            '" alt="" loading="lazy"><strong>' +
            esc(f.n) +
            "</strong><span>" +
            esc(f.p) +
            "</span></article>"
          );
        })
        .join("");
      return (
        '<div class="ogl-page ob-page ' +
        esc(c.theme) +
        '">' +
        '<header class="ob-nav"><div class="ob-nav-links"><span>' +
        esc(c.nav[0]) +
        "</span><span>" +
        esc(c.nav[1]) +
        '</span></div><div class="ob-logo">' +
        esc(c.logo) +
        "</div>" +
        ICONS +
        "</header>" +
        '<section class="ob-hero"><img src="' +
        esc(c.hero) +
        '" alt="' +
        esc(c.heroAlt) +
        '" loading="lazy">' +
        '<div class="ob-hero-copy"><p class="ob-kicker">' +
        esc(c.kicker || "") +
        "</p><h2>" +
        esc(c.trackTitle) +
        "</h2><p>" +
        esc(c.statusSub) +
        "</p></div>" +
        '<div class="ob-card"><h3>' +
        esc(c.formTitle || "Track Your Order") +
        '</h3><div class="ob-tabs"><span class="is-on">Tracking number</span><span>Order number</span></div><input readonly tabindex="-1" value="' +
        esc(c.order) +
        '"><button type="button" class="ogl-track-btn" tabindex="-1">' +
        esc(c.btnLabel || "Track order") +
        "</button></div></section>" +
        '<section class="ob-body"><div class="ob-status"><h3>' +
        esc(c.statusH) +
        '</h3><div class="ob-steps">' +
        steps +
        '</div><div class="ogl-timeline ogl-timeline-rich">' +
        buildTimeline((c.timeline || []).slice(0, 4)) +
        '</div></div><aside class="ob-aside"><h4>Order Information</h4><p class="ob-carrier">' +
        esc(c.carrier) +
        ' · <b class="ogl-mono">' +
        esc(c.tracking) +
        "</b></p>" +
        buildItems(c.items) +
        "</aside></section>" +
        '<section class="ob-fav"><h3>' +
        esc(c.favH) +
        '</h3><p>' +
        esc(c.favP) +
        '</p><div class="ob-prods">' +
        products +
        "</div></section>" +
        '<section class="ob-why"><div><h4>' +
        esc(c.why[0].h) +
        "</h4><p>" +
        esc(c.why[0].p) +
        "</p></div><div><h4>" +
        esc(c.why[1].h) +
        "</h4><p>" +
        esc(c.why[1].p) +
        "</p></div></section></div>"
      );
    }

    function buildLayoutNoissey() {
      var iconUser =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 19.2c1.3-3 3.6-4.4 6.5-4.4s5.2 1.4 6.5 4.4"/></svg>';
      var iconSearch =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M16 16.5L20 20.5"/></svg>';
      var iconBag =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8h11l-.8 12H7.3L6.5 8z"/><path d="M9 8V6.8A3 3 0 0112 3.8 3 3 0 0115 6.8V8"/></svg>';
      return (
        '<div class="ogl-page ns-page">' +
        '<header class="ns-head"><span class="ns-lang">English</span><div class="ns-bar"><span class="ns-menu" aria-hidden="true"></span><img class="ns-logo" src="/assets/features/noissey-logo.png" alt="NOISSEY"><span class="ns-tools" aria-hidden="true">' +
        iconUser +
        iconSearch +
        iconBag +
        "</span></div></header>" +
        '<div class="ns-ticker">JOIN THE INNER CIRCLE. UNLOCK CLASSIFIED DROPS.</div>' +
        '<section class="ns-hero">' +
        '<img src="/assets/features/noissey-hero.jpg" alt="NOISSEY streetwear">' +
        '<div class="ns-hero-copy"><p>Order Tracking</p><h2>Track Your NOISSEY Order</h2><span>From our studio to your doorstep — built for the streets, tracked for peace of mind.</span></div>' +
        "</section>" +
        '<section class="ns-query"><div class="ns-card"><h3>Track Your Order</h3><small>Enter your details below</small><div class="ns-tabs"><span class="is-on">Tracking Number</span><span>Order Number</span></div><input readonly tabindex="-1" placeholder="Enter your tracking number"><button type="button" tabindex="-1">Track Order</button></div></section>' +
        '<section class="ns-viral"><h3>🔥 Viral piece right now 🔥</h3><div class="ns-pieces"><span><img src="/assets/features/noissey-p1.jpg" alt=""></span><span><img src="/assets/features/noissey-p2.jpg" alt=""></span><span><img src="/assets/features/noissey-p3.jpg" alt=""></span></div></section>' +
        '<section class="ns-why"><div class="ns-why-head"><h3>Why NOISSEY</h3><p>Premium high streetwear built for loud self-expression</p></div><div class="ns-why-grid">' +
        "<article><b>01</b><strong>300g Heavyweight Tees</strong><span>Substantial fabric weight designed to hold shape and structure.</span></article>" +
        "<article><b>02</b><strong>Stacked Denim</strong><span>Silhouettes engineered for a stacked, statement-ready fit.</span></article>" +
        "<article><b>03</b><strong>High-Impact Graphics</strong><span>Bold visuals made to carry your self-expression loud.</span></article>" +
        "<article><b>04</b><strong>Worldwide Shipping</strong><span>NOISSEY ships globally so the look travels with you.</span></article>" +
        "</div></section>" +
        '<section class="ns-band"><img src="/assets/features/noissey-story.jpg" alt=""><div><p>Premium high streetwear and heavyweight aesthetics</p><h3>Define Your Look with NOISSEY</h3><span>This ain\'t just threads; it\'s a revolution in self-expression where street culture meets your soul. We craft every piece from the finest, channeling music, art, and life\'s realest moments directly to your fit. Our designs? Unapologetic symbols of attitude, your statement to the world. Wear NOISSEY. Own your boldest life.</span><div class="ns-tags"><i>Premium</i><i>Heavyweight</i><i>Streetwear</i><i>Color-Led</i></div></div></section>' +
        '<footer class="ns-foot"><div class="ns-foot-cols"><div><b>Track order</b><span>Track orders</span></div><div><b>Quick links</b><span>Account</span><span>Payment method</span><span>Customer reviews</span><span>Wholesale</span><span>All reviews</span><span>NOISSEY in Shop APP</span></div><div><b>Customer service</b><span>Shipping policy</span><span>Return guidelines</span><span>Contact us</span><span>Refund policy</span><span>Privacy policy</span><span>Terms of service</span><span>Do not sell my info</span></div><div><b>Discover NOISSEY</b><span>About NOISSEY</span><span>Compamy info</span><span>NOISSEY\'s blog</span></div></div><div class="ns-foot-meta"><div><p>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p><em>Enter your email</em></div><div><strong>NOISSEY LIMITED</strong><span>Rm D07, 8/F, Kai Tak Fty Building, No. 99 King Fuk Street, San Po Kong, Kowloon, Hong Kong</span><b>Contact email</b><span>SUPPORT@NOISSEY.COM</span></div></div><small>© 2026 NOISSEY ALL RIGHTS RESERVED.</small></footer>' +
        "</div>"
      );
    }

    function buildCaseHtml(c) {
      var layout = c.layout || "hero";
      if (layout === "noissey") return buildLayoutNoissey();
      if (layout === "brand") return buildLayoutBrand(c);
      if (layout === "split") return buildLayoutSplit(c);
      if (layout === "steps") return buildLayoutSteps(c);
      if (layout === "stack") return buildLayoutStack(c);
      return buildLayoutHero(c);
    }

    window.__oglPageHtml = function (idx) {
      return buildCaseHtml(CASES[idx % CASES.length]);
    };
    window.__oglCases = CASES;

    Array.prototype.forEach.call(mounts, function (el, i) {
      var card = el.closest(".ai-case");
      var attr = el.getAttribute("data-ogl-i");
      var idx;
      if (attr != null && attr !== "") idx = parseInt(attr, 10);
      else if (card) idx = parseInt(card.getAttribute("data-i"), 10);
      else idx = i;
      if (isNaN(idx)) idx = 0;
      el.innerHTML = buildCaseHtml(CASES[idx % CASES.length]);
    });
  })();

  /* ——— Scroll-stacked cards + expand lightbox ———
   * 叠卡滚动：内部不滚，只预览裁切
   * 点击放大：居中 1440-48，背后模糊，弹层内可滚
   */
  (function stack() {
    var work = document.getElementById("ai-lab-work");
    var stage = document.getElementById("ai-stack-stage");
    if (!work || !stage) return;
    var cards = Array.prototype.slice.call(stage.querySelectorAll(".ai-case"));
    if (!cards.length) return;

    var PEEK = 14;

    function clamp(v, a, b) {
      return Math.max(a, Math.min(b, v));
    }

    function update() {
      var nsPages = stage.querySelectorAll(".ns-page");
      for (var ni = 0; ni < nsPages.length; ni++) {
        var nsArt = nsPages[ni].closest(".ai-case-art");
        if (!nsArt) continue;
        var nsW = nsArt.clientWidth || 1;
        nsArt.style.setProperty("--ns-fit", String(Math.min(1, nsW / 1120)));
      }
      var pin =
        document.getElementById("ai-lab-intro-track") || work;
      var rect = pin.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = Math.max(pin.offsetHeight - vh, 1);
      var scrolled = clamp(-rect.top, 0, total);
      /* Same pin-hold + zoom window as ai-letter-zoom.js (do not start stack during hold). */
      var holdPx = Math.min(vh * 0.36, total * 0.42);
      var zoomPx = Math.min(vh * 0.48, total * 0.4);
      var zoomEndPx = holdPx + zoomPx;
      var p =
        scrolled <= zoomEndPx
          ? 0
          : (scrolled - zoomEndPx) / Math.max(total - zoomEndPx, 1);
      var n = cards.length;
      var stageH = stage.clientHeight || 480;
      var active = p * (n - 1);

      for (var i = 0; i < n; i++) {
        var d = i - active;
        var y;
        var scale = 1;
        var opacity = 1;
        var z = 10 + i;

        if (d > 0) {
          var slide = clamp(d, 0, 1);
          y = slide * (stageH + 24);
          opacity = slide > 0.98 ? 0 : 1;
          scale = 1;
        } else {
          var depth = Math.min(-d, n - 1);
          y = -depth * PEEK;
          scale = 1 - depth * 0.035;
          if (scale < 0.9) scale = 0.9;
          opacity = 1;
        }

        cards[i].style.zIndex = String(z);
        cards[i].style.opacity = String(opacity);
        cards[i].style.transform =
          "translate3d(0," + y.toFixed(2) + "px,0) scale(" + scale.toFixed(4) + ")";
      }
    }

    /* Lightbox — FLIP zoom card ↔ centered (1440-48)
     * 开/关同一路径：top-left origin + 打开时缓存 originRect，收回严格反播
     */
    var EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
    var DUR = 620; // ms

    var lb = document.getElementById("ai-case-lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.id = "ai-case-lightbox";
      lb.className = "ai-case-lightbox";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.setAttribute("aria-label", "Case preview");
      lb.innerHTML =
        '<div class="ai-case-lightbox-backdrop" data-close="1"></div>' +
        '<div class="ai-case-lightbox-panel">' +
        '  <button type="button" class="ai-case-lightbox-close" aria-label="Close" data-close="1">' +
        '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        "  </button>" +
        '  <div class="ai-case-lightbox-scroll" data-lenis-prevent data-lenis-prevent-wheel></div>' +
        "</div>";
      document.body.appendChild(lb);
    }
    var lbPanel = lb.querySelector(".ai-case-lightbox-panel");
    var lbScroll = lb.querySelector(".ai-case-lightbox-scroll");
    var open = false;
    var animating = false;
    var sourceCard = null;
    /** @type {{left:number,top:number,width:number,height:number}|null} */
    var originRect = null;
    var endTimer = null;

    function lockScroll(on) {
      document.body.classList.toggle("ai-case-lightbox-active", on);
      if (window.__lenis) {
        try {
          if (on) window.__lenis.stop();
          else window.__lenis.start();
        } catch (err) {}
      }
    }

    function clearEndTimer() {
      if (endTimer) {
        clearTimeout(endTimer);
        endTimer = null;
      }
    }

    function snapshotRect(r) {
      return {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      };
    }

    /** top-left origin FLIP：把 last 矩形视觉对齐到 first */
    function invertTL(first, last) {
      return {
        dx: first.left - last.left,
        dy: first.top - last.top,
        sx: first.width / Math.max(last.width, 1),
        sy: first.height / Math.max(last.height, 1),
      };
    }

    function applyFlipTransform(inv) {
      lbPanel.style.transformOrigin = "0 0";
      lbPanel.style.transform =
        "translate3d(" +
        inv.dx.toFixed(2) +
        "px," +
        inv.dy.toFixed(2) +
        "px,0) scale(" +
        inv.sx.toFixed(4) +
        "," +
        inv.sy.toFixed(4) +
        ")";
    }

    function clearFlipStyles() {
      lbPanel.style.transition = "none";
      lbPanel.style.transform = "none";
      lbPanel.style.transformOrigin = "";
      lbPanel.style.opacity = "";
      lbPanel.style.borderRadius = "";
    }

    function fillContent(card) {
      var src = card && card.querySelector(".ogl-page");
      if (!lbScroll) return;
      if (src) {
        lbScroll.innerHTML = src.outerHTML;
      } else if (typeof window.__oglPageHtml === "function") {
        var idx = card ? parseInt(card.getAttribute("data-i"), 10) : 0;
        if (isNaN(idx)) idx = 0;
        lbScroll.innerHTML = window.__oglPageHtml(idx);
      }
      lbScroll.scrollTop = 0;
    }

    function openCase(card) {
      if (open || animating || !card || !lbPanel) return;
      animating = true;
      open = true;
      sourceCard = card;
      clearEndTimer();

      // 打开瞬间冻结卡片视口矩形（收回必须原路）
      originRect = snapshotRect(card.getBoundingClientRect());
      fillContent(card);

      lb.style.visibility = "visible";
      lb.classList.add("is-open");
      lb.classList.remove("is-closing");
      lbPanel.style.transition = "none";
      lbPanel.style.transform = "none";
      lbPanel.style.transformOrigin = "0 0";
      lbPanel.style.borderRadius = "18px";
      lbPanel.style.opacity = "1";
      void lbPanel.offsetWidth;
      var last = snapshotRect(lbPanel.getBoundingClientRect());
      var inv = invertTL(originRect, last);

      applyFlipTransform(inv);
      lbPanel.style.borderRadius = "22px";
      card.classList.add("is-zooming");
      lockScroll(true);

      // 播到居中全尺寸（与收回同一坐标系，反方向）
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          lbPanel.style.transition =
            "transform " +
            DUR +
            "ms " +
            EASE +
            ", border-radius " +
            DUR +
            "ms " +
            EASE;
          lbPanel.style.transform = "translate3d(0,0,0) scale(1,1)";
          lbPanel.style.borderRadius = "18px";
        });
      });

      endTimer = setTimeout(function () {
        animating = false;
        lbPanel.style.transition = "";
      }, DUR + 40);
    }

    function closeCase() {
      if (!open || animating || !lbPanel) return;
      animating = true;
      clearEndTimer();

      var card = sourceCard;
      // 严格用打开时缓存的矩形；不再 live 量卡片（避免叠卡/sticky 漂移成「往上飞」）
      var first = originRect;
      if (!first || first.width < 2 || first.height < 2) {
        if (card) first = snapshotRect(card.getBoundingClientRect());
      }

      // 复位到最终态再量 last，保证与打开同一终点
      lbPanel.style.transition = "none";
      lbPanel.style.transform = "none";
      lbPanel.style.transformOrigin = "0 0";
      lbPanel.style.opacity = "1";
      void lbPanel.offsetWidth;
      var last = snapshotRect(lbPanel.getBoundingClientRect());

      if (first && first.width > 2 && first.height > 2) {
        var inv = invertTL(first, last);
        // 保持 is-open：面板不瞬间 opacity:0；仅加 is-closing 淡遮罩
        lb.classList.add("is-closing");
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            lbPanel.style.transition =
              "transform " +
              DUR +
              "ms " +
              EASE +
              ", border-radius " +
              DUR +
              "ms " +
              EASE;
            applyFlipTransform(inv);
            lbPanel.style.borderRadius = "22px";
          });
        });
      } else {
        lb.classList.add("is-closing");
        lbPanel.style.transition =
          "opacity " + DUR + "ms " + EASE;
        lbPanel.style.opacity = "0";
      }

      endTimer = setTimeout(function () {
        if (card) card.classList.remove("is-zooming");
        clearFlipStyles();
        lb.classList.remove("is-open", "is-closing");
        lb.style.visibility = "";
        if (lbScroll) {
          lbScroll.innerHTML = "";
          lbScroll.scrollTop = 0;
        }
        sourceCard = null;
        originRect = null;
        open = false;
        animating = false;
        lockScroll(false);
      }, DUR + 40);
    }

    lb.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.closest && t.closest("[data-close]")) {
        e.preventDefault();
        if (!animating) closeCase();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open && !animating) closeCase();
    });

    cards.forEach(function (card) {
      function openFrom(e) {
        e.preventDefault();
        e.stopPropagation();
        openCase(card);
      }
      card.addEventListener("click", openFrom);
      var btn = card.querySelector(".ai-case-zoom");
      if (btn) {
        btn.addEventListener("click", openFrom);
        btn.setAttribute("aria-label", "Expand case");
        btn.setAttribute("title", "Expand");
      }
    });

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    requestAnimationFrame(update);
    // 与 intro 等回调串联，勿覆盖
    var prevScroll = window.__updateAiScroll;
    window.__updateAiScroll = function () {
      if (typeof prevScroll === "function") prevScroll();
      update();
    };
    window.__closeAiCaseLightbox = closeCase;
  })();
})();

  } catch (err) {
    console.warn("[fx:ai-lab.js]", err);
  }
  return function dispose() {
    rafs.forEach((id) => {
      try {
        origCAF(id);
      } catch (e) {
        /* ignore */
      }
    });
    rafs.clear();
    intervals.forEach((id) => {
      try {
        origCI(id);
      } catch (e) {
        /* ignore */
      }
    });
    intervals.clear();
    window.requestAnimationFrame = origRAF;
    window.cancelAnimationFrame = origCAF;
    window.setInterval = origSI;
    window.clearInterval = origCI;
  };
}

/** Explore + features sticky */
export function mount() {
  const rafs = new Set();
  const intervals = new Set();
  const origRAF = window.requestAnimationFrame.bind(window);
  const origCAF = window.cancelAnimationFrame.bind(window);
  const origSI = window.setInterval.bind(window);
  const origCI = window.clearInterval.bind(window);
  window.requestAnimationFrame = (cb) => {
    let id;
    id = origRAF((t) => { rafs.delete(id); return cb(t); });
    rafs.add(id);
    return id;
  };
  window.cancelAnimationFrame = (id) => { rafs.delete(id); return origCAF(id); };
  window.setInterval = (cb, ms, ...a) => {
    const id = origSI(cb, ms, ...a);
    intervals.add(id);
    return id;
  };
  window.clearInterval = (id) => { intervals.delete(id); return origCI(id); };

  try {
/* Extracted from tracking/index.html inline scripts */
/* Explore CTAs — colorful border beam (same engine as AI Lab / dock) */
    (function () {
      if (typeof window.mountBorderBeam !== "function") return;
      var links = document.querySelectorAll(".explore-link");
      if (!links.length) return;

      var io =
        typeof IntersectionObserver !== "undefined"
          ? new IntersectionObserver(
              function (entries) {
                entries.forEach(function (e) {
                  if (e.isIntersecting) {
                    e.target.setAttribute("data-active", "");
                    e.target.removeAttribute("data-paused");
                  } else {
                    e.target.setAttribute("data-paused", "");
                  }
                });
              },
              { threshold: 0.08 }
            )
          : null;

      Array.prototype.forEach.call(links, function (el, i) {
        if (el.getAttribute("data-beam")) return;
        var h = el.getBoundingClientRect().height || 42;
        var radius = Math.round(h / 2) || 22;
        window.mountBorderBeam(el, {
          id: "explore-cta-" + i,
          theme: "dark",
          colorVariant: "colorful",
          borderRadius: radius,
          borderWidth: 1,
          duration: 1.9 + i * 0.15,
          brightness: 1.55,
          saturation: 1.4,
          strength: 1.1,
          strokeOpacity: 0.58,
          innerOpacity: 0.52,
          bloomOpacity: 0.48,
          active: true,
        });
        if (io) io.observe(el);
      });
    })();

    /* API card — fill + animate faint ASCII matrix */
    (function () {
      var root = document.querySelector(".explore-card-api .api-ascii");
      if (!root) return;
      var reduce =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      /* 768 keeps ASCII drift + twinkle (Park). Static fill only at 640 / reduced-motion. */
      var phone =
        !!(window.matchMedia && window.matchMedia("(max-width: 640px)").matches);
      var glyphs = "+*#=-.|:";
      var rows = 36;
      var cols = 64;

      function make(seed) {
        var out = "";
        var s = seed | 0;
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            s = (s * 1664525 + 1013904223) | 0;
            /* more empty → quieter field */
            if ((s >>> 0) % 100 < 48) out += " ";
            else out += glyphs[(Math.abs(s) + r * 17 + c * 31) % glyphs.length];
          }
          out += "\n";
        }
        return out;
      }

      function fillLayer(el, seed) {
        if (!el) return;
        /* double block for seamless -50% CSS loop */
        var block = make(seed);
        el.textContent = block + block;
      }

      var a = root.querySelector(".api-ascii-a");
      var b = root.querySelector(".api-ascii-b");
      /* fill only when card near viewport — frees DOM text when far */
      var filled = false;
      var bufs = [null, null];
      function ensureFilled() {
        if (filled) return;
        fillLayer(a, 42);
        fillLayer(b, 917);
        filled = true;
        bufs[0] = a ? a.textContent.split("") : null;
        bufs[1] = b ? b.textContent.split("") : null;
      }
      function releaseAscii() {
        if (!filled) return;
        if (a) a.textContent = "";
        if (b) b.textContent = "";
        bufs[0] = null;
        bufs[1] = null;
        filled = false;
      }

      if (reduce || phone) {
        ensureFilled();
        return;
      }
      var layers = [a, b].filter(Boolean);
      var visible = false;
      var twinkleTimer = 0;
      function twinkle() {
        if (!visible || !filled) return;
        for (var i = 0; i < layers.length; i++) {
          var arr = bufs[i];
          if (!arr || arr.length < 40) continue;
          for (var n = 0; n < 4; n++) {
            var idx = (Math.random() * arr.length) | 0;
            if (arr[idx] === "\n") continue;
            if (Math.random() < 0.45) arr[idx] = " ";
            else arr[idx] = glyphs[(Math.random() * glyphs.length) | 0];
          }
          layers[i].textContent = arr.join("");
        }
      }
      var card = document.querySelector(".explore-card-api");
      if (card && typeof IntersectionObserver !== "undefined") {
        var ioA = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              visible = e.isIntersecting;
              if (visible) {
                ensureFilled();
                if (!twinkleTimer) twinkleTimer = setInterval(twinkle, 220);
              } else {
                if (twinkleTimer) {
                  clearInterval(twinkleTimer);
                  twinkleTimer = 0;
                }
                releaseAscii();
              }
            });
          },
          { threshold: 0.05, rootMargin: "80px" }
        );
        ioA.observe(card);
      } else {
        ensureFilled();
        twinkleTimer = setInterval(twinkle, 220);
      }
    })();

    /* Explore cards — pointer spotlight only (Park: no 3D transform) */
    (function () {
      var cards = document.querySelectorAll(".explore-card");
      if (!cards.length) return;

      function setSpot(card, xPct, yPct, on) {
        card.style.setProperty("--spot-x", xPct.toFixed(2) + "%");
        card.style.setProperty("--spot-y", yPct.toFixed(2) + "%");
        card.style.setProperty("--spot-opacity", on ? "1" : "0");
      }

      Array.prototype.forEach.call(cards, function (card) {
        var raf = 0;
        var latest = null;

        function applyLatest() {
          raf = 0;
          if (!latest) return;
          var e = latest;
          latest = null;
          var r = card.getBoundingClientRect();
          var x = e.clientX - r.left;
          var y = e.clientY - r.top;
          var xPct = (x / Math.max(r.width, 1)) * 100;
          var yPct = (y / Math.max(r.height, 1)) * 100;
          setSpot(card, xPct, yPct, true);
        }

        card.addEventListener("pointerenter", function () {
          card.classList.remove("is-leaving");
          card.classList.add("is-tilting");
          card.style.setProperty("--spot-opacity", "1");
        });

        card.addEventListener("pointermove", function (e) {
          latest = e;
          if (!raf) raf = requestAnimationFrame(applyLatest);
        });

        card.addEventListener("pointerleave", function () {
          if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
          latest = null;
          card.classList.remove("is-tilting");
          card.classList.add("is-leaving");
          setSpot(card, 50, 35, false);
          window.setTimeout(function () {
            card.classList.remove("is-leaving");
          }, 560);
        });
      });
    })();


    /*
     * Features sticky-frame:
     * 1) Module hits header → frame sticks (title + left + right viewport stay)
     * 2) Continue scroll → right stack translates; left switches; leaving panels blur
     * 3) Past last panel → sticky ends; whole module scrolls away
     */
    (function () {
      var section = document.getElementById("key-features");
      var track = document.getElementById("feature-scroll");
      var sticky = track ? track.querySelector(".feature-sticky") : null;
      var panelsRoot = document.getElementById("feature-panels");
      var panelsCol = panelsRoot ? panelsRoot.closest(".feature-panels-col") : null;
      var topbarEl = document.querySelector(".topbar");
      var buttons = document.querySelectorAll(".feature-list .feature[data-feature]");
      var panels = panelsRoot
        ? Array.prototype.slice.call(panelsRoot.querySelectorAll(".feature-panel[data-feature]"))
        : [];
      if (!section || !track || !sticky || !panelsRoot || !panels.length || !buttons.length) return;

      var n = panels.length;
      var current = -1;
      var clickUnlockTimer = 0;
      var mqMobile = window.matchMedia("(max-width: 640px)");
      var panelGap = 28;
      var panelH = 0;
      var travelPx = 1;
      var lastP = -1;
      var rafTick = 0;

      section.style.setProperty("--feature-n", String(n));

      function measureTopbar() {
        if (!topbarEl) return 64;
        var th = Math.max(
          Math.ceil(topbarEl.getBoundingClientRect().height),
          Math.ceil(topbarEl.offsetHeight || 0),
          56
        );
        document.documentElement.style.setProperty("--topbar-h", th + "px");
        section.style.setProperty("--feature-pin-top", th + "px");
        return th;
      }

      function pinTop() {
        return (
          parseFloat(getComputedStyle(section).getPropertyValue("--feature-pin-top")) ||
          parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--topbar-h")) ||
          64
        );
      }

      function pageScrollY() {
        if (window.__lenis && typeof window.__lenis.scroll === "number") {
          return window.__lenis.scroll;
        }
        return window.pageYOffset || document.documentElement.scrollTop || 0;
      }

      var SCENE_DIMS = [
        { w: 680, h: 700 }, /* Tab 0: Branded Tracking Page */
        { w: 780, h: 660 }, /* Tab 1: Branded Email (Letter + Flow) */
        { w: 736, h: 500 }, /* Tab 2: Split-Order 左右叠，邮件下层 */
        { w: 584, h: 480 }  /* Tab 3: Conversion 左右叠，购物车下层 */
      ];

      function updateFeatureScales() {
        var inner = section.querySelector(".section-inner") || section;
        panels.forEach(function (panel, i) {
          var dim = SCENE_DIMS[i] || { w: 540, h: 440 };
          var visual = panel.querySelector(".feature-visual");
          var stage = panel.querySelector(".feature-stage");
          var mock = panel.querySelector(".fx-mock");
          if (!visual || !mock) return;
          var visCs = getComputedStyle(visual);
          var padX = (parseFloat(visCs.paddingLeft) || 0) + (parseFloat(visCs.paddingRight) || 0);
          var availW = (stage && stage.clientWidth) || (visual.clientWidth - padX);
          if (!availW) {
            availW = (panelsCol && panelsCol.clientWidth) || inner.clientWidth || (window.innerWidth - 32);
          }
          availW = Math.max(120, availW);
          var scene = mock.firstElementChild;
          var natW = dim.w;
          var natH = Math.max(
            dim.h,
            scene ? Math.max(scene.scrollHeight, scene.offsetHeight) : 0,
            mock.scrollHeight
          );
          var isPhone = mqMobile.matches;
          var shadowPad = isPhone ? 16 : 72;
          var s = Math.min(
            1,
            Math.max(0.12, (availW - (isPhone ? 0 : 2 * shadowPad)) / natW)
          );
          var availH = (visual && visual.clientHeight) || 0;
          if (!isPhone && availH > 2 * shadowPad + 80) {
            s = Math.min(s, Math.max(0.12, (availH - 2 * shadowPad) / natH));
          }
          var scaledH = Math.round(natH * s);
          var left = (availW - natW * s) / 2;
          [panel, visual, stage, mock].forEach(function (el) {
            if (!el) return;
            el.style.setProperty("--fx-scale", s.toFixed(4));
            el.style.setProperty("--fx-design-w", natW + "px");
            el.style.setProperty("--fx-design-h", natH + "px");
            el.style.setProperty("--fx-scaled-h", scaledH + "px");
            el.style.setProperty("--fx-left", left.toFixed(1) + "px");
            el.style.setProperty("--fx-shadow-pad", shadowPad + "px");
          });
        });
      }

      function measureLayout() {
        if (mqMobile.matches) {
          track.style.height = "";
          if (panelsCol) panelsCol.style.height = "";
          section.style.removeProperty("--feature-panel-h");
          section.style.removeProperty("--feature-side-h");
          section.style.removeProperty("--feature-list-h");
          panels.forEach(function (p) {
            p.style.height = "";
            p.style.removeProperty("--fp-blur");
            p.style.removeProperty("--fp-op");
            p.classList.remove("is-fp-blur");
          });
          panelsRoot.style.transform = "";
          travelPx = 1;
          updateFeatureScales();
          return;
        }
        measureTopbar();
        var gap =
          parseFloat(getComputedStyle(section).getPropertyValue("--feature-panel-gap")) || 28;
        panelGap = gap;

        /*
         * Panel height fills leftover sticky space under the section head
         * (left copy + right visual sit in that band).
         */
        var stickyH = sticky.offsetHeight || Math.max(320, window.innerHeight - pinTop());
        var headEl = sticky.querySelector(".section-head");
        var headH = headEl ? headEl.getBoundingClientRect().height : 120;
        var padY = 36; /* sticky padding-top 20 + padding-bottom 16 */
        var avail = Math.max(320, stickyH - headH - padY);
        panelH = Math.round(avail);

        panels.forEach(function (p) {
          p.style.height = panelH + "px";
        });
        if (panelsCol) {
          panelsCol.style.height = panelH + "px";
          section.style.setProperty("--feature-panel-h", panelH + "px");
        }
        measureSideHeight();
        updateFeatureScales();

        /*
         * Travel = first-panel hold (iso gather/spread/flatten + dwell)
         * + (n-1) strides. Last panel centers, then page keeps scrolling.
         */
        var stride = panelH + panelGap;
        var holdStart = Math.round(stride * 0.32);
        travelPx = Math.max(1, Math.round(holdStart + (n - 1) * stride));
        track.style.height = stickyH + travelPx + "px";
      }

      /* Lock accordion list to the tallest expanded height so the CTA
         (24px below the list) stays put. Copy + buttons stay one block. */
      function measureSideHeight() {
        var list = section.querySelector(".feature-list");
        if (!list) return;
        var prev = [];
        buttons.forEach(function (b) {
          prev.push(b.classList.contains("active"));
        });
        list.style.height = "auto";
        list.classList.add("is-measuring");
        var maxH = 0;
        buttons.forEach(function (b, i) {
          buttons.forEach(function (x, j) {
            x.classList.toggle("active", j === i);
          });
          void list.offsetHeight;
          var h = list.getBoundingClientRect().height;
          if (h > maxH) maxH = h;
        });
        buttons.forEach(function (b, i) {
          b.classList.toggle("active", prev[i]);
        });
        list.classList.remove("is-measuring");
        list.style.height = "";
        var listH = Math.round(maxH);
        if (panelH) listH = Math.min(panelH, listH);
        section.style.setProperty("--feature-list-h", listH + "px");
      }

      function stridePx() {
        return panelH + panelGap;
      }

      function holdStartPx() {
        return Math.round(stridePx() * 0.32);
      }

      /** 0 = just pinned, 1 = last panel centered → sticky unsticks immediately after */
      function scrollProgress() {
        var pt = pinTop();
        var travel = Math.max(1, travelPx);
        var rect = track.getBoundingClientRect();
        var scrolled = Math.min(travel, Math.max(0, pt - rect.top));
        return scrolled / travel;
      }

      function setActive(idx) {
        if (idx < 0 || idx >= n) return;
        if (idx === current) return;
        current = idx;
        buttons.forEach(function (b) {
          var i = parseInt(b.getAttribute("data-feature"), 10);
          var on = i === idx;
          b.classList.toggle("active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        panels.forEach(function (p, i) {
          p.classList.toggle("is-active", i === idx);
          var stage = p.querySelector(".feature-stage");
          if (stage && mqMobile.matches) {
            stage.style.setProperty("--fx-c", i === idx ? "1" : "0");
            stage.style.setProperty("--fx-iso", "0");
            stage.style.setProperty("--fx-spread", "0");
          }
        });
        updateFeatureScales();
        alignActiveMock();
      }

      /* Park：图/文水平中心对齐——短内容面板（Conversion 卡）mock 中心平移到面板中心 */
      function alignActiveMock() {
        if (mqMobile.matches) return;
        var p = panels[current];
        if (!p) return;
        var pr = p.getBoundingClientRect();
        var mock = p.querySelector(".fx-mock");
        if (!mock || !pr.height) return;
        var mr = mock.getBoundingClientRect();
        if (!mr.height) return;
        var shift = (pr.top + pr.height / 2) - (mr.top + mr.height / 2);
        p.style.setProperty("--mock-shift", shift.toFixed(1) + "px");
      }

      /**
       * Map scroll progress → continuous index 0..n-1
       * brief start hold at 0; at p≈1 continuous = n-1 and sticky ends
       */
      function continuousFromProgress(p) {
        if (n <= 1) return 0;
        var stride = stridePx();
        var hold = holdStartPx();
        var y = Math.max(0, Math.min(1, p)) * travelPx;
        var y2 = Math.max(0, y - hold);
        var continuous = y2 / Math.max(1, stride);
        return Math.min(n - 1, Math.max(0, continuous));
      }

      function progressToIndex(p) {
        return Math.min(n - 1, Math.max(0, Math.round(continuousFromProgress(p))));
      }

      /** scroll progress that places panel idx fully in view */
      function indexToProgress(idx) {
        if (n <= 1) return 0;
        var stride = stridePx();
        var hold = holdStartPx();
        var i = Math.max(0, Math.min(n - 1, idx));
        var y = hold + i * stride;
        return Math.max(0, Math.min(1, y / Math.max(1, travelPx)));
      }

      function applyProgress(p) {
        if (mqMobile.matches) return;
        if (!panelH || panelH < 80) measureLayout();
        p = Math.max(0, Math.min(1, p));
        lastP = p;

        var continuous = continuousFromProgress(p);
        setActive(progressToIndex(p));

        var stride = panelH + panelGap;
        var y = -continuous * stride;
        panelsRoot.style.transform = "translate3d(0, " + y.toFixed(2) + "px, 0)";

        /*
         * Blur only when LEAVING the center band.
         * |offset| ≈ 0 (scrolled to middle of a panel) → sharpest.
         */
        panels.forEach(function (panel, i) {
          var offset = continuous - i;
          var leave = Math.abs(offset);
          var blurPx = 0;
          var op = 1;
          /* fully clear within ±0.28 of center; then ramp blur outward */
          if (leave > 0.28) {
            var t = Math.min(1, (leave - 0.28) / 0.72);
            var ease = t * t;
            blurPx = ease * 16;
            op = 1 - ease * 0.55;
          }
          if (blurPx > 0.05) {
            panel.classList.add("is-fp-blur");
            panel.style.setProperty("--fp-blur", blurPx.toFixed(2) + "px");
          } else {
            panel.classList.remove("is-fp-blur");
            panel.style.removeProperty("--fp-blur");
          }
          panel.style.setProperty("--fp-op", Math.max(0.35, op).toFixed(3));

          /* 1 when centered, 0 when far — panel blur only. Illustrations stay flat. */
          var c = Math.max(0, 1 - leave);
          c = c * c * (3 - 2 * c); /* smoothstep */
          var stage = panel.querySelector(".feature-stage");
          if (stage) {
            stage.style.setProperty("--fx-c", c.toFixed(3));
            stage.style.setProperty("--fx-iso", "0");
            stage.style.setProperty("--fx-spread", "1");
          }
        });
      }

      function onScroll() {
        if (mqMobile.matches) {
          /* Accordion mode: only active panel is visible — no scroll-spy switching */
          return;
        }
        /* always follow real scroll — including during click-driven scrollTo */
        applyProgress(scrollProgress());
      }

      /* rAF poll — reliable with Lenis (native scroll events may not fire) */
      function tick() {
        rafTick = requestAnimationFrame(tick);
        if (mqMobile.matches) return;
        var p = scrollProgress();
        if (Math.abs(p - lastP) > 0.0005) applyProgress(p);
      }

      function finishClickAnim() {
        if (clickUnlockTimer) {
          clearTimeout(clickUnlockTimer);
          clickUnlockTimer = 0;
        }
        /* snap UI to true scroll position after animation */
        applyProgress(scrollProgress());
      }

      function scrollToFeature(idx) {
        if (idx < 0 || idx >= n) return;
        if (mqMobile.matches) {
          /* Accordion: swap visible panel in place (no long scroll stack) */
          setActive(idx);
          var panel = panels[idx];
          if (panel) {
            try {
              panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
            } catch (e) {
              /* ignore */
            }
          }
          return;
        }

        measureLayout();
        var pt = pinTop();
        var travel = Math.max(1, travelPx);
        var pageY = pageScrollY();
        var trackTop = track.getBoundingClientRect().top + pageY;
        var p = indexToProgress(idx);
        var target = trackTop - pt + p * travel;

        /*
         * Scroll-only navigation: do NOT applyProgress(p) here.
         * Panels / left nav follow scroll progress as the page animates.
         */
        if (clickUnlockTimer) clearTimeout(clickUnlockTimer);
        /* safety unlock — Lenis onComplete can miss */
        clickUnlockTimer = setTimeout(finishClickAnim, 1600);

        if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
          window.__lenis.scrollTo(target, {
            duration: 1.25,
            onComplete: finishClickAnim,
          });
        } else {
          window.scrollTo({ top: target, behavior: "smooth" });
          setTimeout(finishClickAnim, 1300);
        }
      }

      buttons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          var idx = parseInt(btn.getAttribute("data-feature"), 10);
          if (!isNaN(idx)) scrollToFeature(idx);
        });
      });

      function onResize() {
        measureLayout();
        onScroll();
        if (mqMobile.matches) {
          /* ensure a panel stays visible in accordion mode */
          if (current < 0) setActive(0);
          else setActive(current);
        }
      }

      if (window.__lenis && typeof window.__lenis.on === "function") {
        window.__lenis.on("scroll", onScroll);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      if (mqMobile.addEventListener) {
        mqMobile.addEventListener("change", onResize);
      } else if (mqMobile.addListener) {
        mqMobile.addListener(onResize);
      }

      if (typeof ResizeObserver !== "undefined") {
        if (topbarEl) new ResizeObserver(onResize).observe(topbarEl);
        if (panelsCol) new ResizeObserver(onResize).observe(panelsCol);
        new ResizeObserver(onResize).observe(sticky);
        if (section) new ResizeObserver(onResize).observe(section);
      }

      measureLayout();
      setActive(0);
      if (!mqMobile.matches) applyProgress(0);
      requestAnimationFrame(function () {
        measureLayout();
        onScroll();
        if (!rafTick) rafTick = requestAnimationFrame(tick);
      });

      document.querySelectorAll("#product-tabs .tab").forEach(function (tab) {
        tab.addEventListener("click", function (e) {
          e.preventDefault();
          document.querySelectorAll("#product-tabs .tab").forEach(function (t) {
            t.classList.remove("active");
          });
          tab.classList.add("active");
        });
      });
    })();

    /* Brands marquee — pause only the hovered row */
    (function () {
      var rows = document.querySelectorAll(".brands-say .brands-marquee");
      if (!rows.length) return;
      Array.prototype.forEach.call(rows, function (row) {
        var track = row.querySelector(":scope > .brands-track") || row.querySelector(".brands-track");
        if (!track) return;
        row.addEventListener("pointerenter", function () {
          track.style.animationPlayState = "paused";
        });
        row.addEventListener("pointerleave", function () {
          track.style.animationPlayState = "running";
        });
      });
    })();

    /* Credentials — stagger cards in on scroll */
    (function () {
      var section = document.getElementById("credentials");
      if (!section) return;
      var cards = section.querySelectorAll(".cred-card");
      if (!cards.length) return;

      var reduce =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        section.classList.add("is-inview");
        return;
      }

      if (!("IntersectionObserver" in window)) {
        section.classList.add("is-inview");
        return;
      }

      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            section.classList.add("is-inview");
            io.disconnect();
          });
        },
        { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(section);
    })();

    /* Explore code-window: char-by-char typewriter + caret + task progress */
    (function () {
      var windows = document.querySelectorAll(".code-window[data-code-anim]");
      if (!windows.length) return;

      /* longer script — types continuously with caret */
      var SCRIPT = [
        { n: 10, k: "", t: "import axios from 'axios'" },
        { n: 11, k: "", t: "" },
        { n: 12, k: "", t: "const key = process.env.TRACK_TOKEN" },
        { n: 13, k: "", t: "const res = await axios.post(" },
        { n: 14, k: "add", t: "  'https://api.17track.net/track/v2.4/register'," },
        { n: 15, k: "add", t: "  [{ number: 'RR123456789CN', carrier: 3011 }]," },
        { n: 16, k: "del", t: "  { headers: { Authorization: token } }" },
        { n: 17, k: "add", t: "  { headers: { '17token': key, 'content-type': 'application/json' } }" },
        { n: 18, k: "", t: ")" },
        { n: 19, k: "", t: "" },
        { n: 20, k: "", t: "if (res.data.code !== 0) throw res.data" },
        { n: 21, k: "add", t: "const accepted = res.data.data.accepted || []" },
        { n: 22, k: "add", t: "const rejected = res.data.data.rejected || []" },
        { n: 23, k: "", t: "console.log('registered', accepted.length)" },
        { n: 24, k: "", t: "" },
        { n: 25, k: "", t: "// poll status until delivered" },
        { n: 26, k: "add", t: "const get = await axios.post(" },
        { n: 27, k: "add", t: "  'https://api.17track.net/track/v2.4/gettrackinfo'," },
        { n: 28, k: "add", t: "  accepted.map((n) => ({ number: n.number }))," },
        { n: 29, k: "add", t: "  { headers: { '17token': key } }" },
        { n: 30, k: "", t: ")" },
        { n: 31, k: "", t: "return get.data.data" },
      ];

      var CHAR_MS = 28;
      var LINE_PAUSE = 160;
      var END_PAUSE = 1600;

      function setTask(el, state) {
        if (!el) return;
        el.classList.remove("is-running", "is-done", "is-pending");
        el.classList.add("is-" + state);
        var st = el.querySelector(".cw-status");
        if (!st) return;
        if (state === "running") st.textContent = "[running]";
        else if (state === "done") st.textContent = "[done]";
        else st.textContent = "[queued]";
      }

      function esc(s) {
        return String(s)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }

      /* lightweight highlight after a full line is typed */
      function highlight(text, kind) {
        if (!text) return "";
        if (kind === "del") return esc(text);
        var out = "";
        var i = 0;
        while (i < text.length) {
          if (text[i] === "'" || text[i] === '"') {
            var q = text[i];
            var j = i + 1;
            while (j < text.length && text[j] !== q) j++;
            if (j < text.length) j++;
            out += '<span class="s">' + esc(text.slice(i, j)) + "</span>";
            i = j;
            continue;
          }
          if (/\d/.test(text[i])) {
            var k = i;
            while (k < text.length && /[\d.]/.test(text[k])) k++;
            out += '<span class="n">' + esc(text.slice(i, k)) + "</span>";
            i = k;
            continue;
          }
          if (/[A-Za-z_$]/.test(text[i])) {
            var m = i;
            while (m < text.length && /[A-Za-z0-9_$]/.test(text[m])) m++;
            var word = text.slice(i, m);
            var next = text.slice(m).match(/^\s*\(/);
            if (
              word === "const" ||
              word === "await" ||
              word === "import" ||
              word === "from" ||
              word === "if" ||
              word === "throw" ||
              word === "return"
            ) {
              out += '<span class="k">' + esc(word) + "</span>";
            } else if (next || word === "post" || word === "map" || word === "log") {
              out += '<span class="f">' + esc(word) + "</span>";
            } else if (
              word === "number" ||
              word === "carrier" ||
              word === "headers" ||
              word === "Authorization" ||
              word === "code" ||
              word === "data" ||
              word === "accepted" ||
              word === "rejected" ||
              word === "length"
            ) {
              out += '<span class="n">' + esc(word) + "</span>";
            } else {
              out += esc(word);
            }
            i = m;
            continue;
          }
          if (text[i] === "/" && text[i + 1] === "/") {
            out += '<span class="c">' + esc(text.slice(i)) + "</span>";
            break;
          }
          out += esc(text[i]);
          i++;
        }
        return out;
      }

      function runWindow(win) {
        var bar = win.querySelector("[data-cw-bar]");
        var pct = win.querySelector("[data-cw-pct]");
        var thought = win.querySelector("[data-cw-thought]");
        var tasks = win.querySelectorAll("[data-cw-task]");
        var t0 = tasks[0];
        var t1 = tasks[1];
        var host = win.querySelector("[data-cw-typewriter]");
        var scroll = win.querySelector("[data-cw-scroll]");
        if (!host || !scroll) return;

        var totalChars = 0;
        for (var si = 0; si < SCRIPT.length; si++) {
          totalChars += Math.max(SCRIPT[si].t.length, 1);
        }

        var lineIdx = 0;
        var charIdx = 0;
        var typedChars = 0;
        var lastTick = 0;
        var pauseUntil = 0;
        var cycleStart = 0;
        var active = false;
        var currentSrc = null;
        var currentLine = null;
        var caret = document.createElement("span");
        caret.className = "cw-caret";
        caret.setAttribute("aria-hidden", "true");

        function keepCaretVisible() {
          /* measure real pixels — em transform lagged and clipped late lines */
          if (!host || !currentLine) return;
          var viewH = host.clientHeight || 0;
          if (viewH < 8) return;
          var lineTop = currentLine.offsetTop;
          var lineBottom = lineTop + currentLine.offsetHeight;
          var pad = 4;
          var nextTop = host.scrollTop;
          if (lineBottom > host.scrollTop + viewH - pad) {
            nextTop = lineBottom - viewH + pad;
          } else if (lineTop < host.scrollTop + pad) {
            nextTop = Math.max(0, lineTop - pad);
          }
          if (nextTop < 0) nextTop = 0;
          if (Math.abs(host.scrollTop - nextTop) > 0.5) {
            host.scrollTop = nextTop;
          }
        }

        function resetScript() {
          scroll.innerHTML = "";
          scroll.style.transform = "";
          host.scrollTop = 0;
          lineIdx = 0;
          charIdx = 0;
          typedChars = 0;
          currentSrc = null;
          currentLine = null;
          if (caret.parentNode) caret.parentNode.removeChild(caret);
          win.classList.remove("is-typing");
          setTask(t0, "running");
          setTask(t1, "pending");
        }

        function ensureLine() {
          if (lineIdx >= SCRIPT.length) return false;
          if (currentLine) return true;
          var meta = SCRIPT[lineIdx];
          var row = document.createElement("div");
          row.className = "cw-line" + (meta.k ? " is-" + meta.k : "");
          var ln = document.createElement("span");
          ln.className = "cw-ln";
          ln.textContent = String(meta.n);
          var src = document.createElement("span");
          src.className = "cw-src";
          row.appendChild(ln);
          row.appendChild(src);
          scroll.appendChild(row);
          currentLine = row;
          currentSrc = src;
          src.appendChild(caret);
          keepCaretVisible();
          return true;
        }

        function finishLine() {
          if (!currentSrc) return;
          var meta = SCRIPT[lineIdx];
          if (caret.parentNode) caret.parentNode.removeChild(caret);
          currentSrc.innerHTML = highlight(meta.t, meta.k);
          keepCaretVisible();
          currentLine = null;
          currentSrc = null;
          lineIdx++;
          charIdx = 0;
          if (lineIdx < SCRIPT.length) {
            pauseUntil = performance.now() + LINE_PAUSE;
          } else {
            pauseUntil = performance.now() + END_PAUSE;
            setTask(t0, "done");
            setTask(t1, "done");
            win.classList.remove("is-typing");
          }
        }

        function typeOne() {
          if (lineIdx >= SCRIPT.length) {
            resetScript();
            cycleStart = performance.now();
            setTask(t0, "running");
            setTask(t1, "pending");
            return;
          }
          if (!ensureLine()) return;
          var meta = SCRIPT[lineIdx];
          var text = meta.t;
          win.classList.add("is-typing");

          if (text.length === 0) {
            typedChars += 1;
            finishLine();
            return;
          }

          charIdx++;
          typedChars++;
          var shown = text.slice(0, charIdx);
          currentSrc.textContent = shown;
          currentSrc.appendChild(caret);
          keepCaretVisible();

          if (charIdx >= text.length) {
            finishLine();
          }
        }

        function syncChrome() {
          var p = totalChars > 0 ? Math.min(1, typedChars / totalChars) : 0;
          if (lineIdx >= SCRIPT.length) p = 1;
          var shown = p >= 0.995 ? 100 : Math.min(99.9, p * 100);
          if (bar) bar.style.width = shown + "%";
          if (pct) pct.textContent = (shown >= 100 ? "100" : shown.toFixed(1)) + "%";

          var thoughtSec = 0.3 + p * 4.5;
          if (thought) thought.textContent = "Thought for " + thoughtSec.toFixed(1) + "s";

          if (p < 0.48) {
            setTask(t0, "running");
            setTask(t1, "pending");
          } else if (p < 0.82) {
            setTask(t0, "done");
            setTask(t1, "running");
          } else {
            setTask(t0, "done");
            setTask(t1, p >= 1 ? "done" : "running");
          }
        }

        function frame(now) {
          if (!active) {
            requestAnimationFrame(frame);
            return;
          }
          if (!cycleStart) cycleStart = now;
          if (now >= pauseUntil && now - lastTick >= CHAR_MS) {
            lastTick = now;
            typeOne();
          }
          syncChrome();
          requestAnimationFrame(frame);
        }

        resetScript();
        requestAnimationFrame(frame);

        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (en) {
              active = en.isIntersecting;
              if (en.isIntersecting) {
                lastTick = 0;
                pauseUntil = 0;
                if (lineIdx === 0 && charIdx === 0 && !scroll.children.length) {
                  cycleStart = performance.now();
                }
              }
            });
          },
          { threshold: 0.2 }
        );
        io.observe(win);
      }

      windows.forEach(runWindow);
    })();

    
// stripped


  } catch (err) {
    console.warn("[fx:landing-inline]", err);
  }

  return function dispose() {
    rafs.forEach((id) => { try { origCAF(id); } catch (e) {} });
    rafs.clear();
    intervals.forEach((id) => { try { origCI(id); } catch (e) {} });
    intervals.clear();
    window.requestAnimationFrame = origRAF;
    window.cancelAnimationFrame = origCAF;
    window.setInterval = origSI;
    window.clearInterval = origCI;
  };
}

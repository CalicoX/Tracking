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
      var mobile =
        !!window.__isMobileLayout ||
        !!(window.matchMedia && window.matchMedia("(max-width: 768px)").matches);
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

      if (reduce || mobile) {
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

    /* Explore cards — board tilts with mouse; inner layers move OPPOSITE (reverse hover) */
    (function () {
      var cards = document.querySelectorAll(".explore-card");
      if (!cards.length) return;
      var max = 9; /* board tilt degrees — clear but not extreme */
      var reduce =
        window.__reduceFx ||
        window.__isMobileLayout ||
        (window.matchMedia &&
          (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
            window.matchMedia("(max-width: 768px)").matches ||
            window.matchMedia("(pointer: coarse)").matches));

      function setTilt(card, rx, ry, tz) {
        card.style.setProperty("--rx", rx.toFixed(2) + "deg");
        card.style.setProperty("--ry", ry.toFixed(2) + "deg");
        card.style.setProperty("--tz", tz.toFixed(2) + "px");
      }

      function setSpot(card, xPct, yPct, on) {
        card.style.setProperty("--spot-x", xPct.toFixed(2) + "%");
        card.style.setProperty("--spot-y", yPct.toFixed(2) + "%");
        card.style.setProperty("--spot-opacity", on ? "1" : "0");
      }

      function setLayer(el, px, py, ampX, ampY) {
        if (!el) return;
        el.style.setProperty("--layer-x", (px * ampX).toFixed(2) + "px");
        el.style.setProperty("--layer-y", (py * ampY).toFixed(2) + "px");
      }

      /*
       * Outer board leans WITH mouse (rotateY ~ pointer X, rotateX ~ -pointer Y).
       * Inner content translates OPPOSITE to board motion — reverse hover parallax.
       * Returns: product vs method cards also reverse each other.
       * API: window + carriers share opposite XY so lines stay attached.
       */
      function setCardLayers(card, px, py) {
        var ox = -px;
        var oy = -py;
        /* copy always reverse to board */
        setLayer(card.querySelector(".explore-card-copy"), ox, oy, 14, 11);

        if (card.classList.contains("explore-card-api")) {
          /* reverse parallax — keep amps modest so terminal is not edge-clipped */
          setLayer(card.querySelector(".explore-api-visual"), ox, oy, 12, 10);
          setLayer(card.querySelector(".code-window"), ox, oy, 16, 12);
          setLayer(card.querySelector(".api-carriers"), ox, oy, 16, 12);
        } else if (card.classList.contains("explore-card-returns")) {
          /* same model as API: stage reverse; product vs method counter each other */
          setLayer(card.querySelector(".returns-ui"), ox, oy, 12, 10);
          setLayer(card.querySelector(".returns-ui-card"), px, py, 10, 8);
          setLayer(card.querySelector(".returns-method"), ox, oy, 14, 11);
        }
      }

      function resetCardLayers(card) {
        setCardLayers(card, 0, 0);
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
          if (reduce) return;
          var px = (x / Math.max(r.width, 1)) * 2 - 1;
          var py = (y / Math.max(r.height, 1)) * 2 - 1;
          px = Math.max(-1, Math.min(1, px));
          py = Math.max(-1, Math.min(1, py));
          /* board leans with mouse (Returns + API same) */
          setTilt(card, -py * max, px * max, 0);
          /* inner layers move opposite */
          setCardLayers(card, px, py);
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
          setTilt(card, 0, 0, 0);
          setSpot(card, 50, 35, false);
          resetCardLayers(card);
          window.setTimeout(function () {
            card.classList.remove("is-leaving");
          }, 560);
        });
      });
    })();

    
// stripped


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
      var mqMobile = window.matchMedia("(max-width: 480px)");
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

      function measureLayout() {
        if (mqMobile.matches) {
          track.style.height = "";
          if (panelsCol) panelsCol.style.height = "";
          section.style.removeProperty("--feature-panel-h");
          panels.forEach(function (p) {
            p.style.height = "";
            p.style.removeProperty("--fp-blur");
            p.style.removeProperty("--fp-op");
          });
          panelsRoot.style.transform = "";
          travelPx = 1;
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

        /*
         * Travel = first-panel hold (iso gather/spread/flatten + dwell)
         * + (n-1) strides. Last panel centers, then page keeps scrolling.
         */
        var stride = panelH + panelGap;
        var holdStart = Math.round(stride * 0.32);
        travelPx = Math.max(1, Math.round(holdStart + (n - 1) * stride));
        track.style.height = stickyH + travelPx + "px";
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
        var yAbs = Math.max(0, Math.min(1, p)) * travelPx;
        var hold = holdStartPx();
        var holdProg = Math.min(1, yAbs / Math.max(1, hold));

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
          panel.style.setProperty("--fp-blur", blurPx.toFixed(2) + "px");
          panel.style.setProperty("--fp-op", Math.max(0.35, op).toFixed(3));

          /* 1 when centered, 0 when far — float pieces scatter/converge */
          var c = Math.max(0, 1 - leave);
          c = c * c * (3 - 2 * c); /* smoothstep */
          /*
           * Last-mile: gather in the center (spread=0) → fan out (spread=1)
           * while isometric, then flatten (iso=0).
           * --fx-iso: 1 = lying isometric, 0 = flat.
           * --fx-spread: 0 = packed to the tracking card, 1 = layered apart.
           */
          var iso;
          var spread;
          if (i === 0) {
            /* Hold clock: pack → fan → flatten → dwell, then the panel can slide. */
            if (holdProg < 0.34) {
              var s = holdProg / 0.34;
              s = s * s * (3 - 2 * s);
              spread = s;
              iso = 1;
            } else if (holdProg < 0.7) {
              spread = 1;
              var f = (holdProg - 0.34) / 0.36;
              f = f * f * (3 - 2 * f);
              iso = 1 - f;
            } else {
              spread = 1;
              iso = 0;
            }
          } else {
            /*
             * Split/branded wait until the panel is mostly centered,
             * then pack → fan → flatten. Starting at c=0.35 made the
             * sequence fire while the card was still sliding in.
             */
            var c0 = 0.7;
            var cAnim = c <= c0 ? 0 : (c - c0) / (1 - c0);
            if (cAnim < 0.42) {
              var s2 = cAnim / 0.42;
              s2 = s2 * s2 * (3 - 2 * s2);
              spread = s2;
              iso = 1;
            } else if (cAnim < 0.92) {
              spread = 1;
              var f2 = (cAnim - 0.42) / 0.5;
              f2 = f2 * f2 * (3 - 2 * f2);
              iso = 1 - f2;
            } else {
              spread = 1;
              iso = 0;
            }
          }
          var stage = panel.querySelector(".feature-stage");
          if (stage) {
            stage.style.setProperty("--fx-c", c.toFixed(3));
            stage.style.setProperty("--fx-iso", iso.toFixed(3));
            stage.style.setProperty("--fx-spread", spread.toFixed(3));
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

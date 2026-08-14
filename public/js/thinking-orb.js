/**
 * Vanilla port of thinking-orbs "searching" (globe) mode
 * Source: https://github.com/Jakubantalik/thinking-orbs (MIT-style package thinking-orbs)
 * State shown in playground Image #2: Searching · 64px · light theme
 */
(function (global) {
  "use strict";

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function fract(x) {
    return x - Math.floor(x);
  }
  function hash2(x, y) {
    var s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return s - Math.floor(s);
  }
  function angDiff(a, b) {
    return Math.atan2(Math.sin(a - b), Math.cos(a - b));
  }

  /** camera tilt projector */
  function makeProjector(yaw, pitch, cx, cy, scale) {
    var sp = Math.sin(pitch),
      cp = Math.cos(pitch),
      sy = Math.sin(yaw),
      cy0 = Math.cos(yaw);
    return function (x, y, z) {
      var g = x * cy0 + z * sy;
      var u = -x * sy + z * cy0;
      var h = y * cp - u * sp;
      var R = y * sp + u * cp;
      return [cx + g * scale, cy - h * scale, R];
    };
  }

  function rScale(size, pow) {
    return Math.pow(size / 300, pow);
  }

  function paintDots(ctx, dots, dark, rMin) {
    dots.sort(function (a, b) {
      return a.z - b.z;
    });
    for (var i = 0; i < dots.length; i++) {
      var t = dots[i];
      var a = t.a == null ? 1 : t.a;
      if (a < 0.02) continue;
      // thinking-orbs paint: dark theme inverts white
      var w = Math.min(1, Math.max(0, t.white));
      var g = Math.round((dark ? 1 - w : w) * 255);
      ctx.fillStyle = "rgba(" + g + "," + g + "," + g + "," + a + ")";
      ctx.beginPath();
      ctx.arc(t.x, t.y, Math.max(rMin, t.r), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * searching / globe — scan meridian sweeps a dotted sphere
   * (MODE_DRAWS.globe from thinking-orbs)
   */
  function drawGlobe(ctx, size, t, dark, opts) {
    var cx = size / 2;
    var cy = size / 2;
    var rad = (size / 2) * 0.82;
    var pitch = 0.4 + 0.06 * Math.sin(t * 0.35);
    var proj = makeProjector(t * 0.5, pitch, cx, cy, rad);
    var scan =
      t * (0.5 + (1.7 - 0.5) * (opts.scanMul != null ? opts.scanMul : 1));
    var vs = rScale(size, opts.rsPow != null ? opts.rsPow : 0.6);
    var dimBase = opts.dimBase != null ? opts.dimBase : 1;
    var dots = [];
    var latRings = opts.latRings != null ? opts.latRings : 17;
    var lonDensity = opts.lonDensity != null ? opts.lonDensity : 44;

    for (var D = 0; D <= latRings; D++) {
      var lat = -Math.PI / 2 + (D / latRings) * Math.PI;
      var cosLat = Math.cos(lat);
      var sinLat = Math.sin(lat);
      var p = Math.max(1, Math.round(Math.abs(cosLat) * lonDensity));
      for (var f = 0; f < p; f++) {
        var lon = (f / p) * 2 * Math.PI;
        var pr = proj(
          cosLat * Math.cos(lon),
          sinLat,
          cosLat * Math.sin(lon)
        );
        var depth = (pr[2] + 1) / 2;
        var N = angDiff(lon + t * 0.5, scan);
        var E = Math.exp(-(N * N) / 0.18) * Math.max(0, pr[2]);
        dots.push({
          x: pr[0],
          y: pr[1],
          z: pr[2],
          r:
            ((opts.rBase != null ? opts.rBase : 0.6) +
              (opts.rDepth != null ? opts.rDepth : 1.7) * depth +
              (opts.rBoost != null ? opts.rBoost : 1) * E) *
            vs,
          white:
            (opts.inkFar != null ? opts.inkFar : 0.62) -
            (opts.inkSpan != null ? opts.inkSpan : 0.54) * depth,
          a: dimBase + (1 - dimBase) * Math.min(1, E),
        });
      }
    }
    paintDots(ctx, dots, dark, opts.rMin != null ? opts.rMin : 0.3);
  }

  // thinking-orbs resolvePreset('searching', size) — 64 / 20 tuned, else interpolate
  function optsSearching(size) {
    var preset = size <= 32 ? 20 : 64;
    // globe base Ct + qt
    var count = preset === 20 ? 0.105 : 0.42;
    var sizeMul = preset === 20 ? 1.75 : 1.15;
    var scanMul = preset === 20 ? 4.335 : 4.08;
    var speed = preset === 20 ? 2.665 : 2.015;
    var sq = Math.sqrt(count);
    return {
      speed: speed,
      opts: {
        latRings: Math.max(2, Math.round(17 * sq)),
        lonDensity: Math.max(2, Math.round(44 * sq)),
        rBase: 0.6 * sizeMul,
        rDepth: 1.7 * sizeMul,
        rBoost: 1 * sizeMul,
        inkFar: 0.62,
        inkSpan: 0.54,
        rsPow: 0.6,
        rMin: 0.3 * sizeMul,
        scanMul: scanMul,
        dimBase: 0.45,
      },
    };
  }

  function getPreset(state, size) {
    var g = optsSearching(size);
    return { speed: g.speed, opts: g.opts, draw: drawGlobe };
  }

  /**
   * Mount ThinkingOrb-like animation on a canvas.
   * @param {HTMLCanvasElement} canvas
   * @param {{ state?: string, size?: number, theme?: 'light'|'dark', speed?: number }} options
   */
  function mountThinkingOrb(canvas, options) {
    options = options || {};
    var state = options.state || "searching";
    var size = options.size || 28;
    var theme = options.theme || "light";
    var speedMul = options.speed != null ? options.speed : 1;
    var dark = theme === "dark";

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas.style.display = "block";

    var ctx = canvas.getContext("2d");
    if (!ctx) return { destroy: function () {} };

    var preset = getPreset(state, size);
    // 可选加粗圆点（intro 等深色底需要更清晰）
    if (options.dotScale != null && options.dotScale > 0 && preset.opts) {
      var ds = options.dotScale;
      preset.opts.rBase = (preset.opts.rBase || 0.6) * ds;
      preset.opts.rDepth = (preset.opts.rDepth || 1.7) * ds;
      preset.opts.rBoost = (preset.opts.rBoost || 1) * ds;
      preset.opts.rMin = Math.max(0.45, (preset.opts.rMin || 0.3) * ds);
    }
    var running = false;
    var visible = true;
    var raf = 0;

    function paint(now) {
      var t = (now / 1000) * preset.speed * speedMul;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      preset.draw(ctx, size, t, dark, preset.opts);
    }

    function loop(now) {
      if (!running) return;
      paint(now);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running || !visible) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    var io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          visible = e.isIntersecting;
          if (visible) start();
          else stop();
        });
      });
      io.observe(canvas);
    }

    start();
    paint(performance.now());

    return {
      setState: function (next) {
        state = next;
        preset = getPreset(state, size);
      },
      setTheme: function (th) {
        theme = th;
        dark = theme === "dark";
      },
      destroy: function () {
        stop();
        if (io) io.disconnect();
      },
    };
  }

  global.mountThinkingOrb = mountThinkingOrb;
})(typeof window !== "undefined" ? window : globalThis);

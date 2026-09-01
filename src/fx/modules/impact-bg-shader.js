/** @returns {() => void} */
export function mount() {
  let teardown = null;
  try {
/**
 * Impact band — light dotted particle earth
 * Fibonacci sphere + continent blobs; spin follows scroll progress
 */
(function () {
  "use strict";

  function boot() {
    var canvas = document.getElementById("impact-bg-shader");
    var sticky = document.querySelector(".impact-band-sticky");
    var section = document.getElementById("business-impact");
    if (!canvas || !sticky || !section) return;
    if (
      window.__reduceFx ||
      window.__isMobileLayout ||
      (window.matchMedia && window.matchMedia("(max-width: 640px)").matches)
    ) {
      canvas.style.display = "none";
      sticky.classList.add("impact-shader-fallback");
      return;
    }

    var gl =
      canvas.getContext("webgl", {
        alpha: false,
        antialias: true,
        premultipliedAlpha: false,
        powerPreference: "low-power",
      }) ||
      canvas.getContext("experimental-webgl", {
        alpha: false,
        antialias: true,
      });

    if (!gl) {
      sticky.classList.add("impact-shader-fallback");
      return;
    }

    sticky.classList.add("has-impact-shader");

    /* —— pale sky wash —— */
    var VERT_BG =
      "attribute vec2 aPos;\n" +
      "void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }\n";

    var FRAG_BG =
      "precision mediump float;\n" +
      "uniform vec2 uRes;\n" +
      "uniform float uTime;\n" +
      "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\n" +
      "void main(){\n" +
      "  vec2 uv = gl_FragCoord.xy / uRes;\n" +
      "  vec3 top = vec3(0.99, 0.995, 1.0);\n" +
      "  vec3 mid = vec3(0.97, 0.98, 0.995);\n" +
      "  /* match page --bg-subtle #f7f8fa at bottom — no hard white floor */\n" +
      "  vec3 bot = vec3(0.969, 0.973, 0.980);\n" +
      "  vec3 c = mix(top, mid, smoothstep(0.0, 0.55, uv.y));\n" +
      "  c = mix(c, bot, smoothstep(0.45, 1.0, uv.y));\n" +
      "  float aspect = uRes.x / max(uRes.y, 1.0);\n" +
      "  /* soft bloom tracks smaller globe on the far right */\n" +
      "  vec2 g = (uv - vec2(0.86, 0.48)) * vec2(aspect, 1.0);\n" +
      "  float glow = exp(-dot(g, g) * 2.1);\n" +
      "  c = mix(c, vec3(0.94, 0.97, 1.0), glow * 0.28 * (1.0 - smoothstep(0.55, 0.95, uv.y)));\n" +
      "  c += (hash(gl_FragCoord.xy + floor(uTime * 2.0)) - 0.5) * 0.004;\n" +
      "  gl_FragColor = vec4(c, 1.0);\n" +
      "}\n";

    /* —— points: uSpin from scroll —— */
    var VERT_PT =
      "attribute vec3 aPos;\n" +
      "attribute float aLand;\n" +
      "attribute float aSeed;\n" +
      "uniform vec2 uRes;\n" +
      "uniform float uSpin;\n" +
      "uniform float uDpr;\n" +
      "varying float vLand;\n" +
      "varying float vFront;\n" +
      "varying float vSeed;\n" +
      "\n" +
      "void main(){\n" +
      "  vec3 p = normalize(aPos);\n" +
      "  float t = uSpin;\n" +
      "  float cy = cos(t), sy = sin(t);\n" +
      "  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);\n" +
      "  float tilt = -0.32;\n" +
      "  float ct = cos(tilt), st = sin(tilt);\n" +
      "  p = vec3(p.x, ct * p.y - st * p.z, st * p.y + ct * p.z);\n" +
      "\n" +
      "  float scale = 0.72;\n" +
      "  vec3 world = p * scale;\n" +
      "  float camZ = 2.15;\n" +
      "  float z = world.z + camZ;\n" +
      "  float invZ = 1.0 / max(z, 0.2);\n" +
      "  float fov = 0.95;\n" +
      "  float aspect = uRes.x / max(uRes.y, 1.0);\n" +
      "  float k = mix(1.0, invZ / fov, 0.2);\n" +
      "  vec2 ndc = vec2(world.x * k / aspect, world.y * k) * 1.05;\n" +
      "  /* smaller globe, right of metrics / under curve tip */\n" +
      "  ndc.x += 0.68;\n" +
      "  ndc.y -= 0.02;\n" +
      "  gl_Position = vec4(ndc, 0.0, 1.0);\n" +
      "\n" +
      "  float front = clamp(world.z * 0.5 + 0.5, 0.0, 1.0);\n" +
      "  float sz = mix(1.2, 2.8, front);\n" +
      "  sz *= mix(0.7, 1.2, aLand);\n" +
      "  sz *= uDpr * (uRes.y / 900.0);\n" +
      "  gl_PointSize = clamp(sz, 0.9, 5.5);\n" +
      "\n" +
      "  vLand = aLand;\n" +
      "  vFront = front;\n" +
      "  vSeed = aSeed;\n" +
      "}\n";

    var FRAG_PT =
      "precision mediump float;\n" +
      "varying float vLand;\n" +
      "varying float vFront;\n" +
      "varying float vSeed;\n" +
      "void main(){\n" +
      "  vec2 c = gl_PointCoord - 0.5;\n" +
      "  float d = length(c) * 2.0;\n" +
      "  if (d > 1.0) discard;\n" +
      "  float soft = smoothstep(1.0, 0.15, d);\n" +
      "  /* softer, quieter ice-blue — ambient not hero */\n" +
      "  vec3 land = vec3(0.58, 0.74, 0.96);\n" +
      "  vec3 landHi = vec3(0.68, 0.82, 0.99);\n" +
      "  vec3 ocean = vec3(0.76, 0.88, 0.98);\n" +
      "  vec3 oceanHi = vec3(0.86, 0.93, 1.0);\n" +
      "  vec3 L = mix(land, landHi, vFront);\n" +
      "  vec3 O = mix(ocean, oceanHi, vFront);\n" +
      "  vec3 col = mix(O, L, vLand);\n" +
      "  float a = soft;\n" +
      "  a *= mix(0.22, 0.48, mix(0.4, 1.0, vLand));\n" +
      "  a *= mix(0.4, 1.0, vFront);\n" +
      "  a *= 0.9 + 0.08 * sin(vSeed * 28.0);\n" +
      "  if (vFront < 0.12) a *= 0.42;\n" +
      "  if (a < 0.018) discard;\n" +
      "  gl_FragColor = vec4(col * a, a);\n" +
      "}\n";

    function compile(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("[impact-earth]", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    }

    function link(vsSrc, fsSrc) {
      var vs = compile(gl.VERTEX_SHADER, vsSrc);
      var fs = compile(gl.FRAGMENT_SHADER, fsSrc);
      if (!vs || !fs) return null;
      var p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.warn("[impact-earth] link", gl.getProgramInfoLog(p));
        return null;
      }
      return p;
    }

    var progBg = link(VERT_BG, FRAG_BG);
    var progPt = link(VERT_PT, FRAG_PT);
    if (!progBg || !progPt) {
      sticky.classList.add("impact-shader-fallback");
      return;
    }

    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    function landWeight(lon, lat) {
      function blob(lon0, lat0, w, h, power) {
        var dlon = lon - lon0;
        while (dlon > Math.PI) dlon -= Math.PI * 2;
        while (dlon < -Math.PI) dlon += Math.PI * 2;
        var x = dlon / w;
        var y = (lat - lat0) / h;
        return Math.exp(-(x * x + y * y) * (power || 1.1));
      }
      var w =
        blob(-1.7, 0.55, 1.1, 0.55, 1.0) +
        blob(-1.05, -0.25, 0.55, 0.85, 1.15) +
        blob(0.25, 0.2, 0.55, 0.75, 1.0) +
        blob(0.5, 0.85, 1.4, 0.45, 0.95) +
        blob(1.4, 0.55, 1.0, 0.55, 1.05) +
        blob(2.3, -0.45, 0.55, 0.35, 1.2) +
        blob(-0.7, 1.15, 1.2, 0.25, 1.3) +
        blob(1.9, 0.15, 0.35, 0.25, 1.4);
      w += blob(0.0, -1.2, 2.5, 0.28, 0.9) * 0.85;
      w +=
        Math.sin(lon * 6.2 + lat * 4.1) * 0.04 +
        Math.sin(lon * 11.0 - lat * 7.0) * 0.03;
      return w;
    }

    var N = 14000;
    var positions = [];
    var lands = [];
    var seeds = [];
    var golden = Math.PI * (3 - Math.sqrt(5));

    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var theta = golden * i;
      var x = Math.cos(theta) * r;
      var z = Math.sin(theta) * r;
      var lat = Math.asin(Math.max(-1, Math.min(1, y)));
      var lon = Math.atan2(z, x);
      var lw = landWeight(lon, lat);
      var isLand = lw > 0.4 ? 1 : 0;

      if (isLand) {
        positions.push(x, y, z);
        lands.push(1);
        seeds.push((i * 0.618) % 1);
        /* denser continents */
        if (lw > 0.55) {
          var jx = x + (Math.random() - 0.5) * 0.014;
          var jy = y + (Math.random() - 0.5) * 0.014;
          var jz = z + (Math.random() - 0.5) * 0.014;
          var len = Math.sqrt(jx * jx + jy * jy + jz * jz) || 1;
          positions.push(jx / len, jy / len, jz / len);
          lands.push(1);
          seeds.push(Math.random());
        }
        if (lw > 0.75 && i % 2 === 0) {
          var jx2 = x + (Math.random() - 0.5) * 0.01;
          var jy2 = y + (Math.random() - 0.5) * 0.01;
          var jz2 = z + (Math.random() - 0.5) * 0.01;
          var len2 = Math.sqrt(jx2 * jx2 + jy2 * jy2 + jz2 * jz2) || 1;
          positions.push(jx2 / len2, jy2 / len2, jz2 / len2);
          lands.push(1);
          seeds.push(Math.random());
        }
      } else if (Math.random() < 0.42) {
        positions.push(x, y, z);
        lands.push(0);
        seeds.push(Math.random());
      }
    }

    function addRing(lat, count, landish) {
      for (var k = 0; k < count; k++) {
        var lonR = (k / count) * Math.PI * 2 - Math.PI;
        var cl = Math.cos(lat);
        positions.push(Math.cos(lonR) * cl, Math.sin(lat), Math.sin(lonR) * cl);
        lands.push(landish ? 0.35 : 0);
        seeds.push(k / count);
      }
    }
    addRing(0, 160, false);
    addRing(0.35, 120, false);
    addRing(-0.35, 120, false);
    addRing(0.7, 90, false);
    addRing(-0.7, 90, false);

    var count = lands.length;

    var bufPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    var bufLand = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufLand);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lands), gl.STATIC_DRAW);

    var bufSeed = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufSeed);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(seeds), gl.STATIC_DRAW);

    /* free CPU copies — GPU buffers keep geometry */
    positions.length = 0;
    lands.length = 0;
    seeds.length = 0;

    var running = false;
    var visible = false;
    var t0 = performance.now();
    var dpr = 1;
    var scrollP = 0;
    var smoothScroll = 0;
    var lastCssW = 0;
    var lastCssH = 0;
    var scrollRaf = 0;
    var uBgRes = gl.getUniformLocation(progBg, "uRes");
    var uBgTime = gl.getUniformLocation(progBg, "uTime");
    var aPosBg = gl.getAttribLocation(progBg, "aPos");
    var uPtRes = gl.getUniformLocation(progPt, "uRes");
    var uPtSpin = gl.getUniformLocation(progPt, "uSpin");
    var uPtDpr = gl.getUniformLocation(progPt, "uDpr");
    var aPos = gl.getAttribLocation(progPt, "aPos");
    var aLand = gl.getAttribLocation(progPt, "aLand");
    var aSeed = gl.getAttribLocation(progPt, "aSeed");

    function resize() {
      var cssW = Math.max(sticky.clientWidth || 1, 1);
      var cssH = Math.max(sticky.clientHeight || 1, 1);
      if (cssW === lastCssW && cssH === lastCssH && canvas.width > 0) return;
      lastCssW = cssW;
      lastCssH = cssH;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(cssW * dpr));
      var h = Math.max(1, Math.round(cssH * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      gl.viewport(0, 0, w, h);
    }

    function readScroll() {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(function () {
        scrollRaf = 0;
        var rect = section.getBoundingClientRect();
        var total = Math.max(section.offsetHeight - window.innerHeight, 1);
        scrollP = Math.max(0, Math.min(1, -rect.top / total));
      });
    }

    function releaseBackbuffer() {
      if (canvas.width > 1 || canvas.height > 1) {
        canvas.width = 1;
        canvas.height = 1;
        lastCssW = 0;
        lastCssH = 0;
      }
    }

    function draw(now) {
      if (!visible || (typeof document !== "undefined" && document.hidden)) {
        running = false;
        if (!visible) releaseBackbuffer();
        return;
      }
      resize();
      var t = (now - t0) / 1000;
      /* smooth follow scroll; tiny idle drift so it never freezes */
      smoothScroll += (scrollP - smoothScroll) * 0.05;
      var spin = smoothScroll * 0.95 + t * 0.012;

      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      gl.useProgram(progBg);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(aPosBg);
      gl.vertexAttribPointer(aPosBg, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uBgRes, canvas.width, canvas.height);
      gl.uniform1f(uBgTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(progPt);

      gl.bindBuffer(gl.ARRAY_BUFFER, bufPos);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, bufLand);
      gl.enableVertexAttribArray(aLand);
      gl.vertexAttribPointer(aLand, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, bufSeed);
      gl.enableVertexAttribArray(aSeed);
      gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uPtRes, canvas.width, canvas.height);
      gl.uniform1f(uPtSpin, spin);
      gl.uniform1f(uPtDpr, dpr);
      gl.drawArrays(gl.POINTS, 0, count);

      requestAnimationFrame(draw);
    }

    function start() {
      if (running || !visible) return;
      if (typeof document !== "undefined" && document.hidden) return;
      running = true;
      requestAnimationFrame(draw);
    }

    var io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            visible = e.isIntersecting;
            if (visible) start();
            else {
              running = false;
              releaseBackbuffer();
            }
          });
        },
        { threshold: 0.02, rootMargin: "80px" }
      );
      io.observe(section);
    } else {
      visible = true;
      start();
    }

    function onDocVis() {
      if (document.hidden) {
        running = false;
      } else if (visible) {
        start();
      }
    }
    document.addEventListener("visibilitychange", onDocVis);

    function onResize() {
      if (visible) resize();
    }
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", readScroll, { passive: true });
    if (window.__lenis && typeof window.__lenis.on === "function") {
      try {
        window.__lenis.on("scroll", readScroll);
      } catch (err) {}
    }

    /* don't allocate full-size buffer until section is near */
    readScroll();

    teardown = function () {
      running = false;
      visible = false;
      document.removeEventListener("visibilitychange", onDocVis);
      if (scrollRaf) {
        try {
          cancelAnimationFrame(scrollRaf);
        } catch (e) {
          /* ignore */
        }
        scrollRaf = 0;
      }
      if (io) {
        try {
          io.disconnect();
        } catch (e) {
          /* ignore */
        }
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", readScroll);
      try {
        if (window.__lenis && typeof window.__lenis.off === "function") {
          window.__lenis.off("scroll", readScroll);
        }
      } catch (e) {
        /* ignore */
      }
      try {
        releaseBackbuffer();
      } catch (e) {
        /* ignore */
      }
      try {
        var ext = gl && gl.getExtension && gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      } catch (e) {
        /* ignore */
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

  } catch (err) {
    console.warn("[fx:impact-bg-shader.js]", err);
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

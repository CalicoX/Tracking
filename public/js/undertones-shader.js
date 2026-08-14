/**
 * Hero background — Particle Earth (readable globe)
 * - Fibonacci sphere + continent blobs (lon/lat)
 * - Soft atmosphere disc + limb darkening
 * - Starts fully assembled (no scatter→gather intro); only continuous spin
 */
(function () {
  "use strict";

  var section = document.querySelector(".hero");
  var canvas = document.getElementById("hero-undertones-canvas");
  if (!section || !canvas) return;
  if (
    window.__reduceFx ||
    window.__isMobileLayout ||
    (window.matchMedia && window.matchMedia("(max-width: 768px)").matches)
  ) {
    canvas.style.display = "none";
    section.classList.add("hero-shader-fallback");
    return;
  }

  /* alpha:true → empty buffer is transparent (hero CSS shows), avoids black flash */
  var gl =
    canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    }) ||
    canvas.getContext("experimental-webgl", {
      alpha: true,
      antialias: true,
    });

  if (!gl) {
    section.classList.add("hero-shader-fallback");
    return;
  }

  /* sky-ish clear so any pre-draw frame never reads pure black */
  gl.clearColor(0.96, 0.976, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  /* —— Fullscreen: soft sky + atmosphere disc —— */
  var VERT_BG =
    "attribute vec2 aPos;\n" +
    "void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }";

  var FRAG_BG =
    "precision mediump float;\n" +
    "uniform vec2 uRes;\n" +
    "uniform float uTime;\n" +
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\n" +
    "void main(){\n" +
    "  vec2 uv = gl_FragCoord.xy / uRes;\n" +
    "  // light blue wash only — no solid disc / blue ring\n" +
    "  vec3 top = vec3(0.94, 0.97, 1.0);\n" +
    "  vec3 bot = vec3(0.88, 0.93, 0.99);\n" +
    "  vec3 c = mix(top, bot, uv.y);\n" +
    "  // soft bloom aligned with globe (right of copy, under product mock)\n" +
    "  float aspect = uRes.x / max(uRes.y, 1.0);\n" +
    "  vec2 g = (uv - vec2(0.72, 0.48)) * vec2(aspect, 1.0);\n" +
    "  float glow = exp(-dot(g, g) * 1.15);\n" +
    "  c = mix(c, vec3(0.91, 0.95, 1.0), glow * 0.35);\n" +
    "  c += (hash(gl_FragCoord.xy + floor(uTime)) - 0.5) * 0.006;\n" +
    "  gl_FragColor = vec4(c, 1.0);\n" +
    "}\n";

  /* —— Particles —— */
  var VERT_PT =
    "attribute vec3 aPos;\n" +
    "attribute float aLand;\n" +
    "attribute float aSeed;\n" +
    "uniform vec2 uRes;\n" +
    "uniform float uTime;\n" +
    "uniform float uDpr;\n" +
    "uniform float uAssemble;\n" +
    "varying float vLand;\n" +
    "varying float vDepth;\n" +
    "varying float vSeed;\n" +
    "varying float vAssemble;\n" +
    "varying float vFront;\n" +
    "\n" +
    "float hash1(float n){ return fract(sin(n) * 43758.5453); }\n" +
    "\n" +
    "void main(){\n" +
    "  float t = uTime * 0.11;\n" +
    "  float a = clamp(uAssemble, 0.0, 1.0);\n" +
    "  float ease = 1.0 - pow(1.0 - a, 2.4);\n" +
    "  float delay = aSeed * 0.32;\n" +
    "  float localA = smoothstep(delay, delay + 0.62, ease);\n" +
    "\n" +
    "  vec3 home = normalize(aPos);\n" +
    "  float h1 = hash1(aSeed * 12.7 + 1.3);\n" +
    "  float h2 = hash1(aSeed * 27.1 + 4.9);\n" +
    "  float h3 = hash1(aSeed * 41.3 + 8.2);\n" +
    "  float phi = h1 * 6.2831853;\n" +
    "  float cosT = h2 * 2.0 - 1.0;\n" +
    "  float sinT = sqrt(max(0.0, 1.0 - cosT * cosT));\n" +
    "  vec3 dir = vec3(sinT * cos(phi), cosT, sinT * sin(phi));\n" +
    "  vec3 scatter = dir * (2.2 + h3 * 3.6);\n" +
    "  vec3 p = mix(scatter, home, localA);\n" +
    "  p = normalize(mix(p, home, localA * 0.35)) * mix(length(p), 1.0, localA);\n" +
    "\n" +
    "  // spin + axial tilt (~23° feel)\n" +
    "  float cy = cos(t), sy = sin(t);\n" +
    "  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);\n" +
    "  float tilt = -0.35;\n" +
    "  float ct = cos(tilt), st = sin(tilt);\n" +
    "  p = vec3(p.x, ct * p.y - st * p.z, st * p.y + ct * p.z);\n" +
    "\n" +
    "  // scale to fill hero as round globe\n" +
    "  float scale = 1.05;\n" +
    "  vec3 world = p * scale;\n" +
    "\n" +
    "  // camera: orthographic-ish for round silhouette\n" +
    "  float camZ = 2.05;\n" +
    "  float z = world.z + camZ;\n" +
    "  float invZ = 1.0 / max(z, 0.2);\n" +
    "  // orthographic blend keeps sphere round across aspect\n" +
    "  float fov = 0.95;\n" +
    "  float aspect = uRes.x / max(uRes.y, 1.0);\n" +
    "  // use mostly ortho so the earth stays circular\n" +
    "  float k = mix(1.0, invZ / fov, 0.22);\n" +
    "  vec2 ndc = vec2(world.x * k / aspect, world.y * k) * 1.55;\n" +
    "  // under product mock on the right (keep globe visible in frame)\n" +
    "  ndc.x += 0.52;\n" +
    "  gl_Position = vec4(ndc, 0.0, 1.0);\n" +
    "\n" +
    "  float front = clamp(world.z * 0.5 + 0.5, 0.0, 1.0);\n" +
    "  float sz = mix(1.6, 3.6, front);\n" +
    "  sz *= mix(0.7, 1.35, aLand);\n" +
    "  sz *= mix(1.4, 1.0, localA);\n" +
    "  sz *= uDpr * (uRes.y / 900.0);\n" +
    "  gl_PointSize = clamp(sz, 1.0, 7.5);\n" +
    "\n" +
    "  vLand = aLand;\n" +
    "  vDepth = front;\n" +
    "  vSeed = aSeed;\n" +
    "  vAssemble = localA;\n" +
    "  vFront = front;\n" +
    "}\n";

  var FRAG_PT =
    "precision mediump float;\n" +
    "varying float vLand;\n" +
    "varying float vDepth;\n" +
    "varying float vSeed;\n" +
    "varying float vAssemble;\n" +
    "varying float vFront;\n" +
    "void main(){\n" +
    "  vec2 c = gl_PointCoord - 0.5;\n" +
    "  float d = length(c) * 2.0;\n" +
    "  if (d > 1.0) discard;\n" +
    "  float soft = smoothstep(1.0, 0.18, d);\n" +
    "  // soft blue only (no gray/green) — a step deeper than light-blue bg\n" +
    "  vec3 land = vec3(0.42, 0.62, 0.92);\n" +
    "  vec3 landHi = vec3(0.52, 0.70, 0.96);\n" +
    "  vec3 ocean = vec3(0.58, 0.74, 0.94);\n" +
    "  vec3 oceanHi = vec3(0.66, 0.80, 0.98);\n" +
    "  vec3 L = mix(land, landHi, vFront);\n" +
    "  vec3 O = mix(ocean, oceanHi, vFront);\n" +
    "  vec3 col = mix(O, L, vLand);\n" +
    "  col *= mix(0.9, 1.06, vFront);\n" +
    "  float a = soft;\n" +
    "  a *= mix(0.28, 0.62, mix(0.45, 1.0, vLand));\n" +
    "  a *= mix(0.5, 1.0, vFront);\n" +
    "  a *= mix(0.4, 1.0, 0.4 + 0.6 * vAssemble);\n" +
    "  a *= 0.94 + 0.06 * sin(vSeed * 30.0);\n" +
    "  if (vFront < 0.1) a *= 0.55;\n" +
    "  if (a < 0.016) discard;\n" +
    "  gl_FragColor = vec4(col * a, a);\n" +
    "}\n";

  function compile(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("[hero-earth]", gl.getShaderInfoLog(sh));
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
      console.warn("[hero-earth] link", gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  var progBg = link(VERT_BG, FRAG_BG);
  var progPt = link(VERT_PT, FRAG_PT);
  if (!progBg || !progPt) {
    section.classList.add("hero-shader-fallback");
    return;
  }

  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );

  /**
   * Approximate continents as lat/lon ellipses (radians)
   * lon [-PI, PI], lat [-PI/2, PI/2]
   */
  function landWeight(lon, lat) {
    // normalized ellipse falloff
    function blob(lon0, lat0, w, h, power) {
      var dlon = lon - lon0;
      while (dlon > Math.PI) dlon -= Math.PI * 2;
      while (dlon < -Math.PI) dlon += Math.PI * 2;
      var x = dlon / w;
      var y = (lat - lat0) / h;
      var r2 = x * x + y * y;
      return Math.exp(-r2 * (power || 1.1));
    }

    // rough real-world placement
    var w =
      blob(-1.7, 0.55, 1.1, 0.55, 1.0) + // N America
      blob(-1.05, -0.25, 0.55, 0.85, 1.15) + // S America
      blob(0.25, 0.2, 0.55, 0.75, 1.0) + // Africa
      blob(0.5, 0.85, 1.4, 0.45, 0.95) + // Europe / Siberia band
      blob(1.4, 0.55, 1.0, 0.55, 1.05) + // Asia
      blob(2.3, -0.45, 0.55, 0.35, 1.2) + // Australia
      blob(-0.7, 1.15, 1.2, 0.25, 1.3) + // Greenland-ish (clip)
      blob(1.9, 0.15, 0.35, 0.25, 1.4); // SE Asia islands

    // poles less land except antarctica band
    var ant = blob(0.0, -1.2, 2.5, 0.28, 0.9) * 0.85;
    w += ant;

    // coast noise
    var n =
      Math.sin(lon * 6.2 + lat * 4.1) * 0.04 +
      Math.sin(lon * 11.0 - lat * 7.0) * 0.03;
    return w + n;
  }

  var N = 7200;
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
    var isLand = lw > 0.42 ? 1 : 0;

    // denser land, sparse ocean for sphere volume
    if (isLand) {
      positions.push(x, y, z);
      lands.push(1);
      seeds.push((i * 0.618) % 1);
      // extra land density
      if (lw > 0.7 && i % 2 === 0) {
        // slight jitter on surface
        var jx = x + (Math.random() - 0.5) * 0.012;
        var jy = y + (Math.random() - 0.5) * 0.012;
        var jz = z + (Math.random() - 0.5) * 0.012;
        var len = Math.sqrt(jx * jx + jy * jy + jz * jz) || 1;
        positions.push(jx / len, jy / len, jz / len);
        lands.push(1);
        seeds.push(Math.random());
      }
    } else {
      // keep ~28% of ocean points for globe ball
      if (Math.random() < 0.28) {
        positions.push(x, y, z);
        lands.push(0);
        seeds.push(Math.random());
      }
    }
  }

  // latitude rings (read as globe)
  function addRing(lat, count, landish) {
    for (var k = 0; k < count; k++) {
      var lon = (k / count) * Math.PI * 2 - Math.PI;
      var cl = Math.cos(lat);
      var sx = Math.cos(lon) * cl;
      var sy = Math.sin(lat);
      var sz = Math.sin(lon) * cl;
      positions.push(sx, sy, sz);
      lands.push(landish ? 0.35 : 0);
      seeds.push(k / count);
    }
  }
  addRing(0, 120, false); // equator
  addRing(0.4, 90, false);
  addRing(-0.4, 90, false);

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
  positions = null;
  lands = null;
  seeds = null;

  var running = false;
  var visible = false;
  var t0 = performance.now();
  var dpr = 1;
  var lastCssW = 0;
  var lastCssH = 0;
  /* cache locations — avoid per-frame getUniformLocation / getAttribLocation */
  var uBgRes = gl.getUniformLocation(progBg, "uRes");
  var uBgTime = gl.getUniformLocation(progBg, "uTime");
  var aPosBg = gl.getAttribLocation(progBg, "aPos");
  var uPtRes = gl.getUniformLocation(progPt, "uRes");
  var uPtTime = gl.getUniformLocation(progPt, "uTime");
  var uPtDpr = gl.getUniformLocation(progPt, "uDpr");
  var uPtAssemble = gl.getUniformLocation(progPt, "uAssemble");
  var aPos = gl.getAttribLocation(progPt, "aPos");
  var aLand = gl.getAttribLocation(progPt, "aLand");
  var aSeed = gl.getAttribLocation(progPt, "aSeed");

  function resize() {
    var cssW = section.clientWidth;
    var cssH = section.clientHeight;
    if (cssW === lastCssW && cssH === lastCssH && canvas.width > 1) return;
    lastCssW = cssW;
    lastCssH = cssH;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(cssW * dpr));
    var h = Math.max(1, Math.round(cssH * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      /* resize clears buffer — fill sky immediately, no black frame */
      gl.viewport(0, 0, w, h);
      gl.clearColor(0.96, 0.976, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function releaseBackbuffer() {
    /* hide canvas instead of 1×1 black buffer flash */
    canvas.classList.remove("is-ready");
    if (canvas.width > 1 || canvas.height > 1) {
      canvas.width = 1;
      canvas.height = 1;
      lastCssW = 0;
      lastCssH = 0;
    }
  }

  var paintedOnce = false;

  function draw(now) {
    if (!visible) {
      running = false;
      releaseBackbuffer();
      return;
    }
    resize();
    var t = (now - t0) / 1000;

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
    gl.uniform1f(uPtTime, t);
    gl.uniform1f(uPtDpr, dpr);
    gl.uniform1f(uPtAssemble, 1.0);

    gl.drawArrays(gl.POINTS, 0, count);

    if (!paintedOnce) {
      paintedOnce = true;
      canvas.classList.add("is-ready");
    }

    requestAnimationFrame(draw);
  }

  function start() {
    if (running || !visible) return;
    running = true;
    paintedOnce = false;
    requestAnimationFrame(draw);
  }

  /* hero is above the fold — start immediately, don't wait for IO (avoids black gap) */
  visible = true;
  start();

  if (typeof IntersectionObserver !== "undefined") {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            visible = true;
            start();
          } else {
            visible = false;
            running = false;
            releaseBackbuffer();
          }
        });
      },
      { threshold: 0.02, rootMargin: "40px" }
    );
    io.observe(section);
  }

  window.addEventListener("resize", function () {
    if (visible) resize();
  }, { passive: true });
})();

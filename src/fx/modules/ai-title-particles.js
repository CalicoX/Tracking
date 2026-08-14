/** @returns {() => void} */
export function mount() {
  let teardown = null;
  try {
/**
 * Intro title — local fluid brush particles
 *
 * Idle：纯 CSS 实字
 * Hover：仅鼠标附近 mask 藏实字 + 该区粒子飘起
 * 坐标：一律以 canvas.getBoundingClientRect 为原点（避免相对 h2 / PAD 漂移）
 */
(function () {
  "use strict";

  var h2 = document.getElementById("ai-intro-title");
  if (!h2) return;

  h2.style.position = "relative";

  /* Prefer existing shell (ai-lab may have already put words under solid). */
  var solid = h2.querySelector(".ai-title-solid");
  if (!solid) {
    solid = document.createElement("div");
    solid.className = "ai-title-solid";
  }

  var canvas =
    h2.querySelector("canvas.ai-title-particles") ||
    document.getElementById("ai-title-particles");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "ai-title-particles";
    canvas.className = "ai-title-particles";
    canvas.setAttribute("aria-hidden", "true");
  }

  /**
   * Only wrap once .ai-word spans exist. Wrapping raw text before ai-lab
   * tokenizes (or racing with textContent wipe) used to detach the title.
   */
  /** Move h2 children into solid in document order (keep spaces between .ai-word). */
  function moveTitleNodesIntoSolid() {
    var batch = [];
    for (var n = h2.firstChild; n; n = n.nextSibling) {
      if (n !== solid && n !== canvas) batch.push(n);
    }
    batch.forEach(function (node) {
      solid.appendChild(node);
    });
  }

  function installShell() {
    if (!h2.contains(solid)) {
      var wordsNow = h2.querySelectorAll(".ai-word");
      if (wordsNow.length) {
        moveTitleNodesIntoSolid();
      } else if (!solid.childNodes.length) {
        /* no words yet — leave raw text on h2 until boot/absorb */
      }
      if (canvas && canvas.parentNode === h2) h2.insertBefore(solid, canvas);
      else h2.appendChild(solid);
    }
    if (canvas && canvas.parentNode !== h2) h2.appendChild(canvas);
  }

  installShell();

  var gl =
    canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      depth: false,
    }) ||
    canvas.getContext("experimental-webgl", {
      alpha: true,
      premultipliedAlpha: true,
    });

  if (!gl) {
    canvas.style.display = "none";
    return;
  }

  var GRAD = [
    { t: 0, c: [245 / 255, 243 / 255, 255 / 255] },
    { t: 0.14, c: [233 / 255, 213 / 255, 255 / 255] },
    { t: 0.32, c: [196 / 255, 181 / 255, 253 / 255] },
    { t: 0.48, c: [167 / 255, 139 / 255, 250 / 255] },
    { t: 0.72, c: [192 / 255, 38 / 255, 211 / 255] },
    { t: 1, c: [232 / 255, 121 / 255, 249 / 255] },
  ];

  var BRUSH = 52;
  var MAX = 12000;
  var particles = [];
  var sampleCache = null;
  var hovering = false;
  var running = false;
  var raf = 0;
  var dpr = 1;
  var cssW = 1;
  var cssH = 1;
  var PAD = 120;
  var t0 = performance.now();
  var mx = 0;
  var my = 0;
  var pmx = 0;
  var pmy = 0;
  var hasPointer = false;
  var brushX = 0;
  var brushY = 0;

  // hx hy ox oy r g b lift size phase amp seed — allocate on first hover only
  var STRIDE = 12;
  var data = null;
  var count = 0;
  function ensureData() {
    if (!data) data = new Float32Array(MAX * STRIDE);
    return data;
  }

  var VERT =
    "attribute vec2 aCorner;\n" +
    "attribute vec2 aHome;\n" +
    "attribute vec2 aOff;\n" +
    "attribute vec3 aColor;\n" +
    "attribute float aLift;\n" +
    "attribute float aSize;\n" +
    "attribute float aPhase;\n" +
    "attribute float aAmp;\n" +
    "attribute float aSeed;\n" +
    "uniform vec2 uRes;\n" +
    "uniform float uTime;\n" +
    "varying vec3 vColor;\n" +
    "varying float vLift;\n" +
    "varying vec2 vCorner;\n" +
    "void main(){\n" +
    "  float s = clamp(aLift, 0.0, 1.0);\n" +
    "  if (s < 0.06) {\n" +
    "    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);\n" +
    "    vLift = 0.0;\n" +
    "    vColor = aColor;\n" +
    "    vCorner = aCorner;\n" +
    "    return;\n" +
    "  }\n" +
    // 多频叠加 + 每粒子随机相位/振幅 → 更乱、摆动更大
    "  float t = uTime;\n" +
    "  float p = aPhase;\n" +
    "  float sd = aSeed;\n" +
    "  float amp = aAmp * s;\n" +
    "  float fx1 = 0.7 + sd * 1.1;\n" +
    "  float fy1 = 0.55 + fract(sd * 1.7) * 1.0;\n" +
    "  float fx2 = 1.6 + fract(p * 0.37) * 1.8;\n" +
    "  float fy2 = 1.4 + fract(p * 0.53) * 1.6;\n" +
    "  float fx3 = 2.8 + fract(sd * 3.1) * 2.2;\n" +
    "  float fy3 = 2.4 + fract(sd * 2.3) * 2.0;\n" +
    "  float wx = sin(t * fx1 + p) * 11.0 * amp\n" +
    "           + sin(t * fx2 + p * 2.3 + sd) * 5.5 * amp\n" +
    "           + cos(t * fx3 + sd * 4.0) * 2.8 * amp\n" +
    "           + sin(t * 0.35 + p * 0.7) * 3.0 * amp;\n" +
    "  float wy = cos(t * fy1 + p * 1.3) * 9.5 * amp\n" +
    "           + sin(t * fy2 + p * 1.9 + sd * 2.0) * 5.0 * amp\n" +
    "           + cos(t * fy3 + p * 3.1) * 2.6 * amp\n" +
    "           + cos(t * 0.42 + sd) * 2.8 * amp;\n" +
    "  vec2 pos = aHome + aOff + vec2(wx, wy);\n" +
    "  float px = (pos.x / uRes.x) * 2.0 - 1.0;\n" +
    "  float py = 1.0 - (pos.y / uRes.y) * 2.0;\n" +
    "  float sz = aSize * (0.9 + 0.55 * s);\n" +
    "  vec2 corner = aCorner * sz;\n" +
    "  corner.x = corner.x / uRes.x * 2.0;\n" +
    "  corner.y = -corner.y / uRes.y * 2.0;\n" +
    "  gl_Position = vec4(px + corner.x, py + corner.y, 0.0, 1.0);\n" +
    "  vColor = aColor;\n" +
    "  vLift = s;\n" +
    "  vCorner = aCorner;\n" +
    "}\n";

  var FRAG =
    "precision mediump float;\n" +
    "varying vec3 vColor;\n" +
    "varying float vLift;\n" +
    "varying vec2 vCorner;\n" +
    "void main(){\n" +
    "  if (vLift < 0.06) discard;\n" +
    "  float d = length(vCorner);\n" +
    "  if (d > 1.0) discard;\n" +
    "  float core = smoothstep(1.0, 0.28, d);\n" +
    "  float a = core * smoothstep(0.06, 0.25, vLift) * 0.94;\n" +
    "  if (a < 0.03) discard;\n" +
    "  gl_FragColor = vec4(vColor * a, a);\n" +
    "}\n";

  function compile(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("[title-particles]", gl.getShaderInfoLog(sh));
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
      console.warn("[title-particles] link", gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  var progP = link(VERT, FRAG);
  if (!progP) {
    canvas.style.display = "none";
    return;
  }

  var ext =
    gl.getExtension("ANGLE_instanced_arrays") ||
    gl.getExtension("WEBGL_instanced_arrays");
  if (!ext) {
    canvas.style.display = "none";
    return;
  }

  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  var instBuf = gl.createBuffer();

  function loc(p, name) {
    return gl.getAttribLocation(p, name);
  }
  function uloc(p, name) {
    return gl.getUniformLocation(p, name);
  }

  function lerpColor(t) {
    t = Math.max(0, Math.min(1, t));
    for (var i = 0; i < GRAD.length - 1; i++) {
      if (t >= GRAD[i].t && t <= GRAD[i + 1].t) {
        var u = (t - GRAD[i].t) / (GRAD[i + 1].t - GRAD[i].t + 1e-6);
        var a = GRAD[i].c;
        var b = GRAD[i + 1].c;
        return [
          a[0] + (b[0] - a[0]) * u,
          a[1] + (b[1] - a[1]) * u,
          a[2] + (b[2] - a[2]) * u,
        ];
      }
    }
    return GRAD[GRAD.length - 1].c.slice();
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var hr = h2.getBoundingClientRect();
    cssW = Math.max(1, Math.round(hr.width) + PAD * 2);
    cssH = Math.max(1, Math.round(hr.height) + PAD * 2);
    var w = Math.round(cssW * dpr);
    var h = Math.round(cssH * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.style.left = -PAD + "px";
    canvas.style.top = -PAD + "px";
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  /** 屏幕坐标 → canvas 逻辑像素（与 uRes / aHome 同一空间） */
  function screenToCanvas(clientX, clientY) {
    var cr = canvas.getBoundingClientRect();
    var sx = cssW / Math.max(cr.width, 1);
    var sy = cssH / Math.max(cr.height, 1);
    return {
      x: (clientX - cr.left) * sx,
      y: (clientY - cr.top) * sy,
    };
  }

  function cacheKey() {
    var r = h2.getBoundingClientRect();
    var fs = window.getComputedStyle(h2).fontSize;
    return (
      Math.round(r.width) +
      "x" +
      Math.round(r.height) +
      "@" +
      fs +
      ":" +
      (h2.querySelectorAll(".ai-word").length || 0)
    );
  }

  /**
   * 整幅标题画进离屏 canvas 再采样：
   * 每个字用 Range 的 client 位置换算到 canvas 空间，textBaseline=middle 贴 Range 中心
   * （比「单独小 canvas 再猜 baseline」稳，偏移会小很多）
   */
  function sampleTitle() {
    var key = cacheKey();
    if (sampleCache && sampleCache.key === key) return sampleCache;
    if (!h2.classList.contains("is-words-in")) return null;

    resize();
    var words = h2.querySelectorAll(".ai-word");
    if (!words.length) return null;

    var cr = canvas.getBoundingClientRect();
    if (cr.width < 2 || cr.height < 2) return null;
    var sx = cssW / cr.width;
    var sy = cssH / cr.height;

    var scale = Math.min(2, dpr);
    var off = document.createElement("canvas");
    off.width = Math.max(1, Math.round(cssW * scale));
    off.height = Math.max(1, Math.round(cssH * scale));
    var octx = off.getContext("2d", { willReadFrequently: true });
    if (!octx) return null;
    octx.setTransform(scale, 0, 0, scale, 0, 0);
    octx.clearRect(0, 0, cssW, cssH);

    var hr = h2.getBoundingClientRect();

    Array.prototype.forEach.call(words, function (word) {
      var textNode = null;
      for (var n = 0; n < word.childNodes.length; n++) {
        if (word.childNodes[n].nodeType === 3) {
          textNode = word.childNodes[n];
          break;
        }
      }
      if (!textNode) return;

      var cs = window.getComputedStyle(word);
      // 用完整 font 简写，避免 weight/family 拼错导致字形度量漂移
      var font = cs.font;
      if (!font || font.length < 3) {
        font =
          (cs.fontWeight || "700") +
          " " +
          (cs.fontSize || "48px") +
          " " +
          (cs.fontFamily || "Inter, sans-serif");
      }
      octx.font = font;
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";

      var text = textNode.textContent || "";
      for (var i = 0; i < text.length; i++) {
        var ch = text[i];
        if (ch === " " || ch === "\n" || ch === "\t") continue;

        var range = document.createRange();
        try {
          range.setStart(textNode, i);
          range.setEnd(textNode, i + 1);
        } catch (err) {
          continue;
        }
        var rects = range.getClientRects();
        if (!rects || !rects.length) continue;
        var rect = rects[0];
        if (rect.width < 0.4 || rect.height < 0.4) continue;

        // 屏幕中心 → canvas 逻辑坐标
        var cx = ((rect.left + rect.right) * 0.5 - cr.left) * sx;
        var cy = ((rect.top + rect.bottom) * 0.5 - cr.top) * sy;
        octx.fillText(ch, cx, cy);
      }
    });

    var img = octx.getImageData(0, 0, off.width, off.height).data;
    var step = Math.max(1, Math.floor(scale * 0.7));
    var pts = [];

    for (var y = 0; y < off.height; y += step) {
      for (var x = 0; x < off.width; x += step) {
        if (img[(y * off.width + x) * 4 + 3] < 100) continue;
        var hx = x / scale;
        var hy = y / scale;
        // 渐变：按 h2 横向位置
        var gt = (hx - PAD) / Math.max(hr.width, 1);
        var col = lerpColor(gt);
        pts.push({
          hx: hx,
          hy: hy,
          cr: col[0],
          cg: col[1],
          cb: col[2],
        });
      }
    }

    if (pts.length > MAX) {
      var stride = Math.ceil(pts.length / MAX);
      var slim = [];
      for (var j = 0; j < pts.length; j += stride) slim.push(pts[j]);
      pts = slim;
    }

    if (!pts.length) return null;
    sampleCache = { pts: pts, key: key };
    return sampleCache;
  }

  function ensureParticles() {
    var samp = sampleTitle();
    if (!samp || !samp.pts.length) return false;
    if (particles.length === samp.pts.length) return true;

    particles = [];
    count = samp.pts.length;
    for (var i = 0; i < count; i++) {
      var pt = samp.pts[i];
      particles.push({
        hx: pt.hx,
        hy: pt.hy,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
        cr: pt.cr,
        cg: pt.cg,
        cb: pt.cb,
        lift: 0,
        target: 0,
        // 尺寸更散
        size: 0.45 + Math.random() * 1.15,
        phase: Math.random() * Math.PI * 2,
        // 摆动幅度 0.65–1.45，每粒子不同
        amp: 0.65 + Math.random() * 0.8,
        seed: Math.random(),
      });
    }
    return true;
  }

  function pack() {
    ensureData();
    var n = particles.length;
    count = n;
    for (var i = 0; i < n; i++) {
      var p = particles[i];
      var o = i * STRIDE;
      data[o] = p.hx;
      data[o + 1] = p.hy;
      data[o + 2] = p.ox;
      data[o + 3] = p.oy;
      data[o + 4] = p.cr;
      data[o + 5] = p.cg;
      data[o + 6] = p.cb;
      data[o + 7] = p.lift;
      data[o + 8] = p.size;
      data[o + 9] = p.phase;
      data[o + 10] = p.amp;
      data[o + 11] = p.seed;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, instBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      data.subarray(0, n * STRIDE),
      gl.DYNAMIC_DRAW
    );
  }

  function brushAt(x, y, dx, dy) {
    var r2 = BRUSH * BRUSH;
    var speed = Math.sqrt(dx * dx + dy * dy);
    var trail = Math.min(1.1, 0.28 + speed * 0.05);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var ddx = p.hx - x;
      var ddy = p.hy - y;
      var d2 = ddx * ddx + ddy * ddy;
      if (d2 > r2) {
        p.target *= 0.72;
        if (p.target < 0.04) p.target = 0;
        continue;
      }
      var d = Math.sqrt(d2) || 0.001;
      var fall = 1 - d / BRUSH;
      fall = fall * fall;
      // 每粒子 lift 目标略抖，避免整片齐刷刷
      p.target = Math.max(
        p.target,
        0.45 + 0.55 * fall * (0.75 + p.seed * 0.5)
      );

      var nx = ddx / d;
      var ny = ddy / d;
      // 径向推开 + 切向旋 + 鼠标速度 + 随机踢
      var force = fall * 1.45 * trail * (0.7 + p.amp * 0.5);
      var tx = -ny;
      var ty = nx;
      var spin = (p.seed - 0.5) * 2.2 * fall;
      var kick = (Math.random() - 0.5) * fall * 1.8;
      var kick2 = (Math.random() - 0.5) * fall * 1.8;
      p.vx +=
        nx * force * 1.6 +
        tx * spin +
        dx * fall * 0.16 +
        kick;
      p.vy +=
        ny * force * 1.6 +
        ty * spin +
        dy * fall * 0.16 +
        kick2;
    }
  }

  function stepPhysics() {
    var allHome = true;
    var maxLift = 0;
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      if (!hovering) {
        p.target *= 0.8;
        if (p.target < 0.03) p.target = 0;
      }

      // 悬停时弹簧更软 → 飘得更远更乱；离开再弹回
      var kSpring = hovering ? 0.055 : 0.26;
      p.vx += -p.ox * kSpring;
      p.vy += -p.oy * kSpring;
      // 悬停阻尼更小 → 轨迹更活
      var damp = hovering ? 0.86 : 0.66;
      p.vx *= damp;
      p.vy *= damp;

      // 轻微持续噪声，避免整齐同步
      if (hovering && p.lift > 0.15) {
        p.vx += (Math.random() - 0.5) * 0.35 * p.lift;
        p.vy += (Math.random() - 0.5) * 0.35 * p.lift;
      }

      p.ox += p.vx;
      p.oy += p.vy;

      var od = Math.sqrt(p.ox * p.ox + p.oy * p.oy);
      // 允许更大位移幅度
      var maxD = hovering ? 42 * (0.75 + p.amp * 0.45) : 12;
      if (od > maxD) {
        p.ox = (p.ox / od) * maxD;
        p.oy = (p.oy / od) * maxD;
        p.vx *= 0.45;
        p.vy *= 0.45;
      }

      var kLift = p.target > p.lift ? 0.3 : 0.22;
      p.lift += (p.target - p.lift) * kLift;
      if (p.lift < 0.03 && p.target < 0.03) {
        p.lift = 0;
        p.ox = 0;
        p.oy = 0;
        p.vx = 0;
        p.vy = 0;
      }

      if (p.lift > maxLift) maxLift = p.lift;
      if (p.lift > 0.02 || p.target > 0.02 || od > 0.15) allHome = false;
    }
    return { allHome: allHome, maxLift: maxLift };
  }

  function updateSolidMask(maxLift) {
    if (!hovering && maxLift < 0.06) {
      solid.style.webkitMaskImage = "";
      solid.style.maskImage = "";
      return;
    }

    var r = hovering
      ? BRUSH * 1.2
      : BRUSH * 1.2 * Math.min(1, maxLift * 1.5);

    // mask 坐标相对 solid（与 h2 内容区对齐，不含 PAD）
    var gx =
      "radial-gradient(" +
      r +
      "px " +
      r +
      "px at " +
      brushX +
      "px " +
      brushY +
      "px, transparent 0%, transparent 40%, rgba(0,0,0,0.5) 70%, #000 100%)";
    solid.style.webkitMaskImage = gx;
    solid.style.maskImage = gx;
    solid.style.webkitMaskRepeat = "no-repeat";
    solid.style.maskRepeat = "no-repeat";
    solid.style.webkitMaskSize = "100% 100%";
    solid.style.maskSize = "100% 100%";
  }

  function bindParticles() {
    gl.useProgram(progP);

    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    var aCorner = loc(progP, "aCorner");
    gl.enableVertexAttribArray(aCorner);
    gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 0, 0);
    ext.vertexAttribDivisorANGLE(aCorner, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, instBuf);
    var bytes = 4;
    var stride = STRIDE * bytes;

    function attr(name, size, offset) {
      var a = loc(progP, name);
      if (a < 0) return;
      gl.enableVertexAttribArray(a);
      gl.vertexAttribPointer(a, size, gl.FLOAT, false, stride, offset * bytes);
      ext.vertexAttribDivisorANGLE(a, 1);
    }

    attr("aHome", 2, 0);
    attr("aOff", 2, 2);
    attr("aColor", 3, 4);
    attr("aLift", 1, 7);
    attr("aSize", 1, 8);
    attr("aPhase", 1, 9);
    attr("aAmp", 1, 10);
    attr("aSeed", 1, 11);

    gl.uniform2f(uloc(progP, "uRes"), cssW, cssH);
    gl.uniform1f(uloc(progP, "uTime"), (performance.now() - t0) / 1000);
  }

  function draw() {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!count) return;
    bindParticles();
    ext.drawArraysInstancedANGLE(gl.TRIANGLE_STRIP, 0, 4, count);
  }

  function clearAll() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    solid.style.webkitMaskImage = "";
    solid.style.maskImage = "";
  }

  function tick() {
    if (!running) return;
    var st = stepPhysics();
    updateSolidMask(st.maxLift);
    pack();
    draw();

    if (!hovering && st.allHome) {
      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.lift = 0;
        p.target = 0;
        p.ox = 0;
        p.oy = 0;
        p.vx = 0;
        p.vy = 0;
      }
      clearAll();
      /* free heavy CPU buffers while idle — rebuild on next hover */
      particles = [];
      count = 0;
      sampleCache = null;
      data = null;
      if (canvas.width > 1) {
        canvas.width = 1;
        canvas.height = 1;
      }
      running = false;
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(tick);
  }

  function overTitle(e) {
    var r = h2.getBoundingClientRect();
    var pad = 10;
    return (
      e.clientX >= r.left - pad &&
      e.clientX <= r.right + pad &&
      e.clientY >= r.top - pad &&
      e.clientY <= r.bottom + pad
    );
  }

  function onMove(e) {
    if (!h2.classList.contains("is-words-in")) return;
    if (!overTitle(e)) {
      if (hovering) {
        hovering = false;
        start();
      }
      hasPointer = false;
      return;
    }

    // 布局可能变了 → 强制重采样，避免旧坐标偏移
    if (!sampleCache || sampleCache.key !== cacheKey() || canvas.width <= 1) {
      particles = [];
      sampleCache = null;
      resize();
    }
    if (!ensureParticles()) return;

    var p = screenToCanvas(e.clientX, e.clientY);
    var dx = 0;
    var dy = 0;
    if (hasPointer) {
      dx = p.x - pmx;
      dy = p.y - pmy;
    }
    pmx = mx = p.x;
    pmy = my = p.y;

    // mask 相对 solid / h2 内容（去掉 PAD）
    var hr = h2.getBoundingClientRect();
    brushX = e.clientX - hr.left;
    brushY = e.clientY - hr.top;

    hasPointer = true;
    hovering = true;
    brushAt(mx, my, dx, dy);
    start();
  }

  function onLeave() {
    hovering = false;
    hasPointer = false;
    start();
  }

  h2.addEventListener("pointerenter", onMove, { passive: true });
  h2.addEventListener("pointermove", onMove, { passive: true });
  h2.addEventListener("pointerleave", onLeave, { passive: true });

  function onWinResize() {
    sampleCache = null;
    particles = [];
    count = 0;
    hovering = false;
    resize();
    clearAll();
  }
  window.addEventListener("resize", onWinResize);

  /** Keep solid+canvas under h2 even if ai-lab rewrote the tree. */
  function ensureShellInDom() {
    if (!h2) return;
    if (!solid || !solid.isConnected || solid.parentNode !== h2) {
      if (!solid || !solid.classList || !solid.classList.contains("ai-title-solid")) {
        solid = document.createElement("div");
        solid.className = "ai-title-solid";
      }
      var canvasRef =
        (canvas && canvas.isConnected && canvas.parentNode === h2 && canvas) ||
        h2.querySelector("canvas.ai-title-particles") ||
        document.getElementById("ai-title-particles");
      if (canvasRef && canvasRef.parentNode === h2) {
        h2.insertBefore(solid, canvasRef);
      } else {
        h2.appendChild(solid);
      }
      if (canvasRef && canvasRef.parentNode !== h2) {
        h2.appendChild(canvasRef);
        canvas = canvasRef;
      } else if (canvas && !canvas.isConnected) {
        h2.appendChild(canvas);
      }
    } else if (canvas && canvas.isConnected && canvas.parentNode === h2) {
      /* solid already under h2 — keep canvas after solid */
      if (solid.nextSibling !== canvas) {
        h2.appendChild(canvas);
      }
    }
  }

  function absorbWords() {
    ensureShellInDom();
    // Preserve sibling order so spaces between .ai-word are not dropped
    // (moving only .ai-word first produced "ShowhowAI…")
    moveTitleNodesIntoSolid();
  }

  var bootTries = 0;
  function boot() {
    installShell();
    absorbWords();
    if (!solid.querySelector(".ai-word") && !h2.querySelector(".ai-word")) {
      bootTries += 1;
      if (bootTries < 40) setTimeout(boot, 80);
      return;
    }
    /* keep shell connected; re-apply words-in if ai-lab already revealed */
    if (h2.classList.contains("is-words-in") === false) {
      /* leave reveal to ai-lab setIn — but ensure nodes are connected */
    }
    /* no eager sampleTitle — only on first hover */
  }

  var lastWordsIn = h2.classList.contains("is-words-in");
  var mo = new MutationObserver(function () {
    var now = h2.classList.contains("is-words-in");
    if (now === lastWordsIn) return;
    lastWordsIn = now;
    /* invalidate only — rebuild on hover */
    sampleCache = null;
    particles = [];
    count = 0;
  });
  mo.observe(h2, { attributes: true, attributeFilter: ["class"] });

  var mo2 = new MutationObserver(function () {
    absorbWords();
  });
  mo2.observe(h2, { childList: true, subtree: false });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(boot);
  } else {
    setTimeout(boot, 120);
  }

  teardown = function () {
    running = false;
    if (raf) {
      try {
        cancelAnimationFrame(raf);
      } catch (e) {
        /* ignore */
      }
      raf = 0;
    }
    h2.removeEventListener("pointerenter", onMove);
    h2.removeEventListener("pointermove", onMove);
    h2.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("resize", onWinResize);
    try {
      mo.disconnect();
    } catch (e) {
      /* ignore */
    }
    try {
      mo2.disconnect();
    } catch (e) {
      /* ignore */
    }
    particles = [];
    count = 0;
    sampleCache = null;
    data = null;
    try {
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
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
})();

  } catch (err) {
    console.warn("[fx:ai-title-particles.js]", err);
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

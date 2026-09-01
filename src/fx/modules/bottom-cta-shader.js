/** @returns {() => void} */
export function mount() {
  let teardown = null;
  try {
/**
 * Bottom CTA — particle sea (performance-first)
 * Sparse lattice + light DOF; ~9× cheaper than particle-sea-2
 */
(function () {
  "use strict";

  var canvas = document.getElementById("bottom-cta-shader");
  var section = document.getElementById("bottom-cta");
  if (!canvas || !section) return;

  /* Mobile / reduce-fx: skip WebGL entirely (CSS hides canvas too) */
  if (
    window.__reduceFx ||
    window.__isMobileLayout ||
    (window.matchMedia && window.matchMedia("(max-width: 640px)").matches)
  ) {
    canvas.style.display = "none";
    return;
  }

  var gl =
    canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    }) ||
    canvas.getContext("experimental-webgl", {
      alpha: false,
      antialias: false,
    });
  if (!gl) return;

  var VERT =
    "attribute vec2 aPos;\n" +
    "void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }";

  var FRAG =
    "precision mediump float;\n" +
    "uniform vec2 uRes;\n" +
    "uniform float uTime;\n" +
    "\n" +
    "float hash(vec2 p){\n" +
    "  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);\n" +
    "}\n" +
    "\n" +
    "float waveH(vec2 xz, float t){\n" +
    "  float x = xz.x * 0.42 + t * 0.38;\n" +
    "  float z = xz.y * 0.32;\n" +
    "  float h = 0.0;\n" +
    "  h += sin(x * 0.72 + z * 0.35) * 1.1;\n" +
    "  h += sin(x * 1.45 - t * 0.32 + z * 0.2) * 0.55;\n" +
    "  h += sin(z * 1.05 + x * 0.28) * 0.4;\n" +
    "  h += sin(x * 2.6 + t * 0.48) * exp(-abs(z) * 0.24) * 0.35;\n" +
    "  return h;\n" +
    "}\n" +
    "\n" +
    "void main(){\n" +
    "  vec2 frag = gl_FragCoord.xy;\n" +
    "  float t = uTime;\n" +
    "  float aspect = uRes.x / max(uRes.y, 1.0);\n" +
    "  vec2 uv = frag / uRes;\n" +
    "  vec2 ndc = vec2((uv.x - 0.5) * 2.0 * aspect, uv.y * 2.0 - 1.0);\n" +
    "\n" +
    "  vec3 ro = vec3(0.0, 2.0, -6.0);\n" +
    "  float pitch = 0.24;\n" +
    "  vec3 f = normalize(vec3(0.0, -sin(pitch), cos(pitch)));\n" +
    "  vec3 rgt = normalize(cross(f, vec3(0.0, 1.0, 0.0)));\n" +
    "  vec3 upv = cross(rgt, f);\n" +
    "  float fov = 0.98;\n" +
    "  vec3 rd = normalize(f + ndc.x * rgt * fov + ndc.y * upv * fov);\n" +
    "\n" +
    "  if (rd.y >= -0.01) {\n" +
    "    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n" +
    "    return;\n" +
    "  }\n" +
    "\n" +
    "  float amp = 1.55;\n" +
    "  float meanY = 0.95;\n" +
    "  float tHit = (meanY - ro.y) / rd.y;\n" +
    "  if (tHit < 1.8 || tHit > 48.0) {\n" +
    "    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n" +
    "    return;\n" +
    "  }\n" +
    "\n" +
    "  vec2 flow = vec2(t * 0.48, t * 0.14);\n" +
    "  for (int k = 0; k < 3; k++) {\n" +
    "    vec3 p = ro + rd * tHit;\n" +
    "    float hSurf = meanY + waveH(p.xz + flow, t) * amp;\n" +
    "    tHit += (hSurf - p.y) / max(abs(rd.y), 0.035) * 0.6;\n" +
    "    tHit = clamp(tHit, 1.8, 48.0);\n" +
    "  }\n" +
    "  vec3 hit = ro + rd * tHit;\n" +
    "\n" +
    "  /* sparse: ~9×9 cells, single layer ≈ 81 iters/px (was ~675) */\n" +
    "  float spacing = 0.13;\n" +
    "  vec2 xzA = hit.xz + flow;\n" +
    "  vec2 cell = floor(xzA / spacing);\n" +
    "\n" +
    "  float best = 0.0;\n" +
    "  float softAcc = 0.0;\n" +
    "  float focusZ = 11.0;\n" +
    "\n" +
    "  for (int j = -4; j <= 4; j++) {\n" +
    "    for (int i = -4; i <= 4; i++) {\n" +
    "      vec2 id = cell + vec2(float(i), float(j));\n" +
    "      float jx = (hash(id) - 0.5) * 0.3;\n" +
    "      float jz = (hash(id + 19.7) - 0.5) * 0.3;\n" +
    "      vec2 pXZ = (id + 0.5 + vec2(jx, jz)) * spacing - flow;\n" +
    "\n" +
    "      float h = waveH(pXZ, t);\n" +
    "      float crestN = smoothstep(-0.45, 1.05, h);\n" +
    "      float py = meanY + h * amp;\n" +
    "      vec3 pw = vec3(pXZ.x, py, pXZ.y);\n" +
    "\n" +
    "      vec3 toP = pw - ro;\n" +
    "      float zCam = dot(toP, f);\n" +
    "      if (zCam < 1.8 || zCam > 32.0) continue;\n" +
    "\n" +
    "      float invZ = 1.0 / zCam;\n" +
    "      vec2 scr = vec2(dot(toP, rgt), dot(toP, upv)) * invZ / fov;\n" +
    "      vec2 dPx = (scr - ndc) * (uRes.y * 0.5);\n" +
    "      float distPx = length(dPx);\n" +
    "\n" +
    "      float base = clamp(1.4 * invZ * uRes.y * 0.4, 0.4, 3.6);\n" +
    "      float coc = abs(zCam - focusZ);\n" +
    "      float focusW = exp(-coc * coc * 0.06);\n" +
    "      float sizeSharp = base * mix(0.6, 1.0, focusW);\n" +
    "      float sizeSoft = min(base * (1.1 + coc * 0.35), 5.5);\n" +
    "\n" +
    "      float core = exp(-distPx * distPx / max(sizeSharp * sizeSharp * 0.45, 0.08));\n" +
    "      float bokeh = exp(-distPx * distPx / max(sizeSoft * sizeSoft * 1.0, 0.5));\n" +
    "      float sharpPt = core * focusW;\n" +
    "      float softPt = bokeh * (1.0 - focusW * 0.8) * 0.45;\n" +
    "      if (sharpPt + softPt < 0.004) continue;\n" +
    "\n" +
    "      float depth = pow(smoothstep(32.0, 2.2, zCam), 1.05);\n" +
    "      float haze = exp(-zCam * 0.025);\n" +
    "      float crest = 0.35 + 0.95 * pow(crestN, 1.2);\n" +
    "      /* cheap form — no extra waveH samples */\n" +
    "      float form = 0.7 + 0.3 * crestN;\n" +
    "      float band = smoothstep(-1.5, -0.3, scr.y) * smoothstep(1.2, 0.12, scr.y);\n" +
    "      band = mix(0.2, 1.0, band);\n" +
    "\n" +
    "      float w = depth * haze * crest * form * band;\n" +
    "      best = max(best, sharpPt * w * 1.1);\n" +
    "      softAcc += softPt * w * 0.2;\n" +
    "    }\n" +
    "  }\n" +
    "\n" +
    "  softAcc = min(softAcc, 0.7);\n" +
    "  float luma = best * 0.82 + softAcc * 0.65;\n" +
    "  float vBand = smoothstep(0.02, 0.16, uv.y) * smoothstep(0.98, 0.8, uv.y);\n" +
    "  vBand = mix(0.1, 1.0, vBand);\n" +
    "  luma *= vBand;\n" +
    "\n" +
    "  vec3 col = vec3(clamp(luma, 0.0, 1.0));\n" +
    "  gl_FragColor = vec4(col, 1.0);\n" +
    "}\n";

  function compile(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("[bottom-cta particle-sea]", gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[bottom-cta particle-sea] link", gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  var aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, "uRes");
  var uTime = gl.getUniformLocation(prog, "uTime");

  var running = false;
  var visible = false;
  var t0 = performance.now();
  var lastDraw = 0;
  var lastW = 0;
  var lastH = 0;
  var FRAME_MS = 33; /* same visual cadence as before */

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    var w = Math.max(1, Math.round(section.clientWidth * dpr));
    var h = Math.max(1, Math.round(section.clientHeight * dpr));
    if (w === lastW && h === lastH) return;
    lastW = w;
    lastH = h;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function releaseBackbuffer() {
    if (canvas.width > 1 || canvas.height > 1) {
      canvas.width = 1;
      canvas.height = 1;
      lastW = 0;
      lastH = 0;
    }
  }

  function frame(now) {
    if (!visible || (typeof document !== "undefined" && document.hidden)) {
      running = false;
      if (!visible) releaseBackbuffer();
      return;
    }
    requestAnimationFrame(frame);
    if (now - lastDraw < FRAME_MS) return;
    lastDraw = now;
    resize();
    gl.useProgram(prog);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function start() {
    if (running || !visible) return;
    if (typeof document !== "undefined" && document.hidden) return;
    running = true;
    lastDraw = 0;
    requestAnimationFrame(frame);
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
      { threshold: 0.05, rootMargin: "60px" }
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

  teardown = function () {
    running = false;
    visible = false;
    document.removeEventListener("visibilitychange", onDocVis);
    if (io) {
      try {
        io.disconnect();
      } catch (e) {
        /* ignore */
      }
    }
    window.removeEventListener("resize", onResize);
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
})();

  } catch (err) {
    console.warn("[fx:bottom-cta-shader.js]", err);
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

/** @returns {() => void} */
export function mount() {
  const instances = new Set();
  try {
/**
 * 底栏液态玻璃 — 套用 demos/glass-lens-longpage 同款管线
 *
 * 2D drawScene(scrollY) → texImage2D → WebGL SDF 折射
 * 透镜钉在 product-tabs；透镜外透明
 * 不依赖 html-in-canvas / Lenis；滚动实时、不卡
 */
(function (global) {
  "use strict";

  const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

  // longpage demo 光学 + 透镜外透明（落地页要叠在真 DOM 上）
  const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform sampler2D uContent;
uniform vec2 uResolution;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uCorner;
uniform float uEdge;
uniform float uBevel;
uniform float uIor;
uniform float uDepth;
uniform float uAberration;
uniform float uBlur;
uniform float uReflect;
uniform float uShine;
uniform float uZoom;
uniform float uAlpha;

const float PI = 3.14159265358979;
const float AIR_IOR = 1.0003;
const vec3 INCIDENT = vec3(0.0, 0.0, 1.0);

float pow2(float x){ return x*x; }
float pow5(float x){ float x2=x*x; return x2*x2*x; }
float linearStep(float e0,float e1,float x){ return clamp((x-e0)/(e1-e0),0.0,1.0); }
float ign(vec2 v){ return fract(52.9829189*fract(0.06711056*v.x+0.00583715*v.y)); }
float sdf(vec2 p){
  vec2 q = abs(p)-(uHalf-vec2(uCorner));
  return length(max(q,0.0))+min(max(q.x,q.y),0.0)-uCorner;
}
vec3 page(vec2 px, float lod){
  vec2 uv = clamp(px / uResolution, vec2(0.001), vec2(0.999));
  return pow(textureLod(uContent, vec2(uv.x, 1.0 - uv.y), lod).rgb, vec3(2.2));
}
float iorForWavelength(float wavelength){
  float ab = uAberration * 0.1;
  return mix(uIor+ab, uIor-ab, 1.0 - pow(1.0 - linearStep(450.0,650.0,wavelength), 4.0));
}
vec3 pageBlur(vec2 px, float minLod, float sigma){
  float footprint = max(length(fwidth(px)), 1.0);
  float lod = max(minLod, log2(footprint));
  if (sigma < 0.35) return page(px, lod);
  float s2 = 2.0 * sigma * sigma;
  vec3 acc = vec3(0.0);
  float wsum = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j)) * sigma;
      float w = exp(-(o.x*o.x + o.y*o.y) / s2);
      acc += page(px + o, lod) * w;
      wsum += w;
    }
  }
  return acc / max(wsum, 1e-4);
}
vec3 pageAA(vec2 px, float minLod){
  return pageBlur(px, minLod, uBlur * 2.8);
}
vec3 sampleRefraction(vec2 basePx, float rim, vec3 normal, float glassIor){
  vec3 rv = refract(INCIDENT, normal, AIR_IOR / glassIor);
  if (rv.z == 0.0 && rv.x == 0.0 && rv.y == 0.0) {
    return pageAA(basePx, uBlur * (1.0 + rim));
  }
  rv /= max(abs(rv.z), 1e-4) / max(uDepth, 1.0);
  return pageAA(basePx + rv.xy, uBlur * (1.0 + rim));
}
float fresnelSchlick(float cosTheta, float f0){
  return f0 + (1.0 - f0) * pow5(1.0 - cosTheta);
}

void main(){
  vec2 fragPx = gl_FragCoord.xy;
  vec2 p = fragPx - uCenter;
  float sd = sdf(p);
  float aa = 1.5;
  float mask = 1.0 - smoothstep(-aa, 0.0, sd);
  float alpha = mask * uAlpha;
  if (alpha < 0.001) {
    outColor = vec4(0.0);
    return;
  }

  float minHalf = min(uHalf.x, uHalf.y);
  float edgeW = max(minHalf * (1.0 - clamp(uEdge, 0.0, 0.98)), 1.0);
  float rim = pow(linearStep(-edgeW, 0.0, sd), max(uBevel, 0.5));

  float e = 1.0;
  vec2 grad = vec2(
    sdf(p+vec2(e,0.0))-sdf(p-vec2(e,0.0)),
    sdf(p+vec2(0.0,e))-sdf(p-vec2(0.0,e)));
  vec3 rimNormal = vec3(normalize(grad + vec2(1e-5)), 0.0);
  float scatter = min(uBlur, 1.0) * 0.03;
  float randAngle = ign(fragPx) * PI * 2.0;
  vec3 flatNormal = normalize(vec3(sin(randAngle)*scatter, cos(randAngle)*scatter, -1.0));
  vec3 normal = normalize(mix(flatNormal, rimNormal, rim));

  vec2 basePx = uCenter + p / max(uZoom, 1.0);
  vec3 refracted;
  if (uAberration > 0.001) {
    refracted  = sampleRefraction(basePx, rim, normal, iorForWavelength(611.4)) * vec3(1.,0.,0.);
    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(570.5)) * vec3(1.,1.,0.);
    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(549.1)) * vec3(0.,1.,0.);
    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(491.4)) * vec3(0.,1.,1.);
    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(464.2)) * vec3(0.,0.,1.);
    refracted += sampleRefraction(basePx, rim, normal, iorForWavelength(374.0)) * vec3(1.,0.,1.);
    refracted /= 3.0;
  } else {
    refracted = sampleRefraction(basePx, rim, normal, uIor);
  }

  vec3 glass = refracted;
  if (uReflect > 0.001) {
    const vec3 V = vec3(0.0,0.0,-1.0);
    float NDotV = clamp(dot(V, normal), 0.0, 1.0);
    float f0 = pow2((uIor - AIR_IOR) / (uIor + AIR_IOR));
    float fresnelV = fresnelSchlick(NDotV, f0) * uReflect;
    vec3 reflectVector = reflect(INCIDENT, normal);
    reflectVector /= max(abs(reflectVector.z), 1e-4) / max(uDepth, 1.0);
    vec3 reflected = pageBlur(basePx + reflectVector.xy, 2.0 + uBlur, uBlur * 2.0);
    glass = mix(refracted, reflected, clamp(fresnelV, 0.0, 1.0));
  }
  if (uShine > 0.001) {
    float ldot = dot(rimNormal.xy, normalize(vec2(-0.6, 0.8)));
    float band = pow(rim, 1.8);
    float arcs = pow(abs(ldot), 3.0) * (ldot > 0.0 ? 0.5 : 0.28);
    glass += band * (0.04 + arcs) * uShine;
  }
  outColor = vec4(pow(glass, vec3(1.0/2.2)) * alpha, alpha);
}`;

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(sh));
    }
    return sh;
  }

  function createLiquidGlassDock(els) {
    var output = els.output;
    var tabsEl = els.tabsEl;
    var onStatus = els.onStatus || function () {};
    var root = document.documentElement;

    var config = {
      ior: 1.5,
      depth: 250,
      edge: 0.7,
      bevel: 4,
      aberration: 1,
      blur: 0,
      reflection: 1,
      shine: 0.4,
      zoom: 1,
      padX: 4,
      padY: 4,
    };

    var mode = "frosted";
    var lastStatus = "";
    var dockRoot =
      (tabsEl && tabsEl.closest && tabsEl.closest(".product-dock")) ||
      document.querySelector(".product-dock");
    function status(msg) {
      if (msg === lastStatus) return;
      lastStatus = msg;
      onStatus(msg);
    }

    /** 已知深色整段（中心点命中才算，离开后必须清掉反色） */
    function isKnownDarkSection(node) {
      if (!node || !node.classList) return false;
      /* business-impact is light-blue theme — not dark */
      if (
        node.id === "bottom-cta" ||
        node.id === "ai-lab-intro"
      ) {
        return true;
      }
      if (node.classList.contains("site-footer")) return true;
      if (node.classList.contains("bottom-cta")) return true;
      if (node.classList.contains("ai-lab-intro")) return true;
      if (node.classList.contains("ai-intro-bg")) return true;
      // 子节点采样时沿最近祖先
      if (
        node.closest &&
        node.closest(
          "#ai-lab-intro, #bottom-cta, .site-footer"
        )
      ) {
        return true;
      }

      return false;
    }

    function isUiChrome(node) {
      if (!node || node.nodeType !== 1) return true;
      var id = node.id || "";
      if (id === "glass-output" || id === "glass-source") return true;
      if (node.tagName === "CANVAS") return true;
      if (node.closest) {
        if (node.closest(".product-dock")) return true;
      }
      if (node.classList) {
        if (node.classList.contains("bottom-cta-shader")) return true;
      }
      return false;
    }

    function luminanceOf(node) {
      try {
        var cs = window.getComputedStyle(node);
        var bg = cs.backgroundColor || "";
        var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (!m) return null;
        var R = +m[1],
          G = +m[2],
          B = +m[3];
        var a = 1;
        var am = bg.match(/,\s*([0-9.]+)\s*\)/);
        if (am) a = parseFloat(am[1]);
        if (!(a > 0.25)) return null;
        return (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
      } catch (err) {
        return null;
      }
    }

    /**
     * 沿祖先链判定深浅：
     * - 已知深色 section → dark
     * - 第一个可靠不透明背景 L >= 0.45 → light（明确返回浅色，避免粘住）
     * - L < 0.42 → dark
     */
    function themeFromNode(start) {
      var node = start;
      var hops = 0;
      while (node && node !== document.documentElement && hops < 22) {
        if (node.nodeType === 1) {
          if (isKnownDarkSection(node)) {
            return "dark";
          }
          // 明确浅色区域（hero / section / work 等）
          if (
            node.classList &&
            (node.classList.contains("hero") ||
              node.classList.contains("section") ||
              node.classList.contains("ai-lab-sticky") ||
              node.classList.contains("ai-lab-work") ||
              node.classList.contains("ai-lab") ||
              node.classList.contains("page") ||
              node.id === "glass-content")
          ) {
            var Ls = luminanceOf(node);
            if (Ls == null) return "light"; // 这些壳默认浅
            return Ls < 0.42 ? "dark" : "light";
          }
          if (!isUiChrome(node)) {
            var L = luminanceOf(node);
            if (L != null) {
              if (L >= 0.45) return "light";
              if (L < 0.42) return "dark";
            }
          }
        }
        node = node.parentElement;
        hops++;
      }
      try {
        var bodyL = luminanceOf(document.body);
        if (bodyL != null) return bodyL < 0.42 ? "dark" : "light";
      } catch (err) {}
      return "light";
    }

    /** dock 采样点是否落在已知深色 section 矩形内 */
    function darkByCenterPoint(cx, cy) {
      var darkEls = [];
      var intro = document.getElementById("ai-lab-intro");
      var cta = document.getElementById("bottom-cta");
      var footer = document.querySelector(".site-footer");
      if (intro) darkEls.push(intro);
      if (cta) darkEls.push(cta);
      if (footer) darkEls.push(footer);
      var i;
      for (i = 0; i < darkEls.length; i++) {
        var sr = darkEls[i].getBoundingClientRect();
        // 必须真正落在矩形内（离开后 top/bottom 不包含 cy）
        if (
          sr.height > 2 &&
          cx >= sr.left &&
          cx <= sr.right &&
          cy >= sr.top &&
          cy <= sr.bottom
        ) {
          return true;
        }
      }
      return false;
    }

    /** 取采样点下第一个真实内容节点（跳过 dock / glass UI） */
    function contentNodeAt(x, y) {
      x = Math.min(window.innerWidth - 1, Math.max(0, x));
      y = Math.min(window.innerHeight - 1, Math.max(0, y));
      var list =
        typeof document.elementsFromPoint === "function"
          ? document.elementsFromPoint(x, y)
          : [document.elementFromPoint(x, y)];
      if (!list || !list.length) return null;
      var i;
      for (i = 0; i < list.length; i++) {
        var el = list[i];
        if (!el || el.nodeType !== 1) continue;
        if (isUiChrome(el)) continue;
        return el;
      }
      return null;
    }

    var themeBusy = false;
    var lastThemeAt = 0;
    var lastThemeDark = null;
    var THEME_MIN_MS = 100; /* elementFromPoint is expensive — max ~10/s while scrolling */

    /** 采样 dock 背后是否深色 → 自动反色；离开深色必须清掉 */
    function updateDockTheme(force) {
      if (!dockRoot || !tabsEl) return;
      if (mode === "solid") {
        dockRoot.classList.remove("dock-on-dark");
        return;
      }
      if (themeBusy) return;
      var now =
        typeof performance !== "undefined" && performance.now
          ? performance.now()
          : Date.now();
      if (!force && now - lastThemeAt < THEME_MIN_MS) return;
      lastThemeAt = now;
      themeBusy = true;
      try {
        var r = tabsEl.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) {
          dockRoot.classList.remove("dock-on-dark");
          lastThemeDark = false;
          return;
        }

        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        cx = Math.min(window.innerWidth - 2, Math.max(1, cx));
        cy = Math.min(window.innerHeight - 2, Math.max(1, cy));

        var dark = false;

        // Fast path: geometry center in known dark section
        if (darkByCenterPoint(cx, cy)) {
          dark = true;
        } else {
          // Cheap sample: center + one side (was 4× elementFromPoint every frame)
          var samples = [
            [cx, cy],
            [Math.min(window.innerWidth - 2, cx + r.width * 0.28), cy],
          ];
          var darkVotes = 0;
          var s;
          for (s = 0; s < samples.length; s++) {
            var node = contentNodeAt(samples[s][0], samples[s][1]);
            if (node && themeFromNode(node) === "dark") darkVotes++;
          }
          dark = darkVotes >= 1;
        }

        if (dark === lastThemeDark) return;
        lastThemeDark = dark;
        if (dark) dockRoot.classList.add("dock-on-dark");
        else dockRoot.classList.remove("dock-on-dark");
      } finally {
        themeBusy = false;
      }
    }

    var gl = output.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl || gl.isContextLost()) {
      status("无 WebGL2");
      root.classList.add("glass-mode-frosted");
      return null;
    }

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    var uniforms = {};
    var nU = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < nU; i++) {
      var info = gl.getActiveUniform(program, i);
      uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }

    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    var scene = document.createElement("canvas");
    var sctx = scene.getContext("2d", { alpha: false });

    var destroyed = false;
    var running = false;
    var cssW = 1;
    var cssH = 1;

    function scrollY() {
      return window.scrollY || document.documentElement.scrollTop || 0;
    }

    function setUiClasses() {
      root.classList.remove(
        "glass-mode-liquid",
        "glass-mode-frosted",
        "glass-mode-solid",
        "glass-webgl-ready",
        "glass-html-in-canvas"
      );
      if (mode === "frosted") {
        root.classList.add("glass-mode-frosted");
        if (output) output.style.display = "none";
        updateDockTheme();
        return;
      }
      if (mode === "solid") {
        root.classList.add("glass-mode-solid");
        if (output) output.style.display = "none";
        if (dockRoot) dockRoot.classList.remove("dock-on-dark");
        return;
      }
      root.classList.add("glass-mode-liquid", "glass-webgl-ready");
      if (output) {
        output.style.display = "block";
        output.style.pointerEvents = "none";
        output.style.zIndex = "55";
      }
      // 液态玻璃 tabs 透明，但仍需 dock-on-dark 控制文字反色
      updateDockTheme();
    }

    function dockGeom() {
      var r = tabsEl.getBoundingClientRect();
      return {
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        halfW: Math.max(r.width / 2 + config.padX, 10),
        halfH: Math.max(r.height / 2 + config.padY, 10),
      };
    }

    function syncSize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = Math.max(1, window.innerWidth);
      cssH = Math.max(1, window.innerHeight);
      var w = Math.round(cssW * dpr);
      var h = Math.round(cssH * dpr);
      if (output.width !== w || output.height !== h) {
        output.width = w;
        output.height = h;
      }
      output.style.width = cssW + "px";
      output.style.height = cssH + "px";
      if (scene.width !== w || scene.height !== h) {
        scene.width = w;
        scene.height = h;
      }
    }

    /**
     * longpage demo 同款：按 scrollY 画「当前视口」进 scene（轻量 2D，实时不卡）
     * 色调对齐落地页：浅底 + 品牌蓝/橙/紫
     */
    function drawScene() {
      var w = scene.width;
      var h = scene.height;
      if (w < 2 || h < 2) return;
      var dpr = w / cssW;
      var ctx = sctx;
      var sy = scrollY();
      var t = sy / Math.max(document.documentElement.scrollHeight - cssH, 1);

      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // 落地页浅底
      var g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#f7f9fc");
      g.addColorStop(0.45, "#eef2f8");
      g.addColorStop(1, "#e4ebf5");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      function orb(x, y, r, c) {
        var og = ctx.createRadialGradient(x, y, 0, x, y, r);
        og.addColorStop(0, c);
        og.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = og;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      var R = Math.max(w, h);
      // 随滚动移动，透镜里内容跟着变
      var off = (sy * dpr) % (h * 1.5);
      orb(w * 0.18, h * 0.25 - off * 0.15, R * 0.32, "rgba(0,58,155,0.28)");
      orb(w * 0.82, h * 0.4 + off * 0.1, R * 0.28, "rgba(255,140,0,0.26)");
      orb(w * 0.5, h * 0.75 + off * 0.08, R * 0.35, "rgba(139,92,246,0.32)");
      orb(w * 0.3, h * 0.9 - off * 0.12, R * 0.22, "rgba(14,165,233,0.3)");

      // 底部高对比色带（dock 附近折射最明显）
      var bandY = h * (0.62 + t * 0.12);
      var ig = ctx.createLinearGradient(0, bandY, w, h);
      ig.addColorStop(0, "#0ea5e9");
      ig.addColorStop(0.3, "#003a9b");
      ig.addColorStop(0.55, "#8b5cf6");
      ig.addColorStop(0.8, "#f43f5e");
      ig.addColorStop(1, "#ff8c00");
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = ig;
      ctx.fillRect(0, bandY, w, h - bandY + 2);
      ctx.globalAlpha = 1;
      for (var i = 0; i < 42; i++) {
        ctx.fillStyle = "rgba(255,255,255," + (0.05 + (i % 3) * 0.045) + ")";
        ctx.fillRect(
          ((i * 38 * dpr + sy * 0.4 * dpr) % (w + 40 * dpr)) - 20 * dpr,
          bandY,
          12 * dpr,
          h - bandY
        );
      }

      // 模拟卡片条带（中上区域）
      var cardY = h * 0.2 - (sy * 0.08 * dpr) % (h * 0.3);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.strokeStyle = "rgba(0,58,155,0.12)";
      ctx.lineWidth = 1 * dpr;
      for (var c = 0; c < 3; c++) {
        var cx = w * (0.15 + c * 0.28);
        var cy = cardY + c * 20 * dpr;
        roundRect(ctx, cx, cy, w * 0.22, h * 0.12, 12 * dpr);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "rgba(0,58,155,0.15)";
        ctx.fillRect(cx + 12 * dpr, cy + 16 * dpr, w * 0.12, 8 * dpr);
        ctx.fillStyle = "rgba(0,0,0,0.06)";
        ctx.fillRect(cx + 12 * dpr, cy + 32 * dpr, w * 0.16, 6 * dpr);
        ctx.fillStyle = "rgba(255,255,255,0.85)";
      }

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scene);
      gl.generateMipmap(gl.TEXTURE_2D);
    }

    function roundRect(ctx, x, y, w, h, r) {
      var rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    }

    function render() {
      if (mode !== "liquid" || destroyed) return;
      drawScene();

      var dpr = output.width / Math.max(cssW, 1);
      gl.viewport(0, 0, output.width, output.height);
      gl.disable(gl.SCISSOR_TEST);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      var dock = dockGeom();
      if (dock.halfW < 4 || dock.halfH < 4) return;

      var halfW = dock.halfW;
      var halfH = dock.halfH;
      var cx = dock.cx * dpr;
      var cy = output.height - dock.cy * dpr;
      var margin = 8 * dpr;
      var corner = Math.min(halfW, halfH);

      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(
        Math.max(0, Math.floor(cx - halfW * dpr - margin)),
        Math.max(0, Math.floor(cy - halfH * dpr - margin)),
        Math.min(output.width, Math.ceil(halfW * dpr * 2 + margin * 2)),
        Math.min(output.height, Math.ceil(halfH * dpr * 2 + margin * 2))
      );

      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uniforms.uContent, 0);
      gl.uniform2f(uniforms.uResolution, output.width, output.height);
      gl.uniform2f(uniforms.uCenter, cx, cy);
      gl.uniform2f(uniforms.uHalf, halfW * dpr, halfH * dpr);
      gl.uniform1f(uniforms.uCorner, corner * dpr);
      gl.uniform1f(uniforms.uEdge, Math.min(Math.max(config.edge, 0), 0.98));
      gl.uniform1f(uniforms.uBevel, Math.max(config.bevel, 0.5));
      gl.uniform1f(uniforms.uIor, Math.min(Math.max(config.ior, 1.01), 2.5));
      gl.uniform1f(uniforms.uDepth, Math.max(config.depth, 0) * dpr);
      gl.uniform1f(uniforms.uAberration, Math.max(config.aberration, 0));
      gl.uniform1f(uniforms.uBlur, Math.max(config.blur, 0));
      gl.uniform1f(uniforms.uReflect, Math.max(config.reflection, 0));
      gl.uniform1f(uniforms.uShine, Math.max(config.shine, 0));
      gl.uniform1f(uniforms.uZoom, Math.max(config.zoom, 1));
      gl.uniform1f(uniforms.uAlpha, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disable(gl.SCISSOR_TEST);
    }

    function start() {
      if (destroyed || mode !== "liquid") return;
      if (running) return;
      running = true;
      requestAnimationFrame(function frame() {
        if (destroyed || mode !== "liquid") {
          running = false;
          return;
        }
        render();
        requestAnimationFrame(frame);
      });
    }

    function onScroll() {
      start();
    }

    setUiClasses();
    syncSize();
    if (mode === "liquid") start();
    status(
      mode === "frosted"
        ? "毛玻璃 · 深色区域自动反色 · 调参可切回 WebGL 液态"
        : "demo 长页同款：drawScene→WebGL · 原生滚动"
    );

    var themeRaf = 0;
    function scheduleTheme(force) {
      if (themeRaf) return;
      themeRaf = requestAnimationFrame(function () {
        themeRaf = 0;
        updateDockTheme(!!force);
      });
    }
    function onWinScroll() {
      if (mode === "liquid") onScroll();
      scheduleTheme(false);
    }
    function onWinResize() {
      syncSize();
      scheduleTheme(true);
      if (mode === "liquid") start();
    }
    /* Frosted: theme only. Liquid: onScroll starts WebGL. One scroll path via bus. */
    window.addEventListener("scroll", onWinScroll, { passive: true });
    window.addEventListener("resize", onWinResize, { passive: true });
    // Single chain entry — Lenis already coalesces to 1 rAF; do not also lenis.on(scroll)
    var prevAi = window.__updateAiScroll;
    window.__updateAiScroll = function () {
      if (typeof prevAi === "function") prevAi();
      if (mode === "liquid") onScroll();
      scheduleTheme(false);
    };
    // 首屏主题
    requestAnimationFrame(function () {
      updateDockTheme(true);
    });
    window.__updateDockTheme = function () {
      updateDockTheme(true);
    };

    var ro = new ResizeObserver(function () {
      syncSize();
      start();
    });
    ro.observe(tabsEl);
    ro.observe(output);

    var api = {
      opts: config,
      setOpts: function (p) {
        Object.assign(config, p);
        start();
      },
      getOpts: function () {
        return Object.assign({}, config);
      },
      setMode: function (m) {
        mode = m || "frosted";
        setUiClasses();
        if (mode === "liquid") start();
        else running = false;
        updateDockTheme(true);
      },
      getMode: function () {
        return mode;
      },
      getEffective: function () {
        return mode === "liquid" ? "demo-realtime" : mode;
      },
      recapture: function () {
        start();
      },
      render: function () {
        start();
      },
      onScroll: onScroll,
      resize: function () {
        syncSize();
        start();
      },
      webglOk: function () {
        return true;
      },
      htmlInCanvas: false,
      destroy: function () {
        destroyed = true;
        running = false;
        window.removeEventListener("scroll", onWinScroll);
        window.removeEventListener("resize", onWinResize);
        window.__updateAiScroll =
          typeof prevAi === "function" ? prevAi : undefined;
        try {
          ro.disconnect();
        } catch (e) {
          /* ignore */
        }
        instances.delete(api);
      },
    };
    instances.add(api);
    return api;
  }

  global.supportsHtmlInCanvas = function () {
    return false;
  };
  global.createLiquidGlassDock = createLiquidGlassDock;
})(typeof window !== "undefined" ? window : globalThis);

  } catch (err) {
    console.warn("[fx:liquid-glass-dock.js]", err);
  }
  return function dispose() {
    instances.forEach(function (api) {
      try {
        if (api && typeof api.destroy === "function") api.destroy();
      } catch (e) {
        /* ignore */
      }
    });
    instances.clear();
  };
}

/**
 * AI intro 整屏一块布（Park：把真实 intro 画进 canvas 当布面，不要另画一版）。
 * - 掀开前按 DOM 实测把 intro（背景/流线/orb canvas/标签/标题/副标）画进纹理；
 * - 右下角沿对角线柱面掀开；卷过 π 的片元丢掉，底下案例透出；
 * - is-curtain-on 藏整块 intro DOM。可见层 2D blit。
 */
import { clamp, prefersReducedMotion } from "../utils.js";

const AI_HOLD_VH = 0.36;

function cssPx(cs, prop) {
  return parseFloat(cs[prop]) || 0;
}

function paintIntro(ctx, intro, cssW, cssH, ox, oy) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const dpr = ctx.canvas.width / Math.max(1, cssW);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const bg = ctx.createLinearGradient(0, 0, 0, cssH);
  bg.addColorStop(0, "#0a0514");
  bg.addColorStop(0.48, "#0e081c");
  bg.addColorStop(1, "#090412");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, cssW, cssH);
  const glow = ctx.createRadialGradient(
    cssW * 0.5,
    cssH * 0.42,
    8,
    cssW * 0.5,
    cssH * 0.42,
    cssW * 0.55,
  );
  glow.addColorStop(0, "rgba(88, 40, 140, 0.2)");
  glow.addColorStop(1, "rgba(88, 40, 140, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, cssW, cssH);

  const wrap = intro.querySelector(".ai-intro-streams");
  const svg = intro.querySelector(".ai-intro-streams-svg");
  if (wrap && svg) {
    const wr = wrap.getBoundingClientRect();
    ctx.save();
    ctx.translate(wr.left - ox, wr.top - oy);
    ctx.scale(wr.width / 1440, wr.height / 900);
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(196,181,253,0.28)";
    svg.querySelectorAll(".ai-stream").forEach((p) => {
      const d = p.getAttribute("d");
      if (!d) return;
      ctx.lineWidth = p.closest(".ai-stream-layer-a") ? 1.15 : 0.9;
      ctx.stroke(new Path2D(d));
    });
    ctx.restore();
  }

  ctx.fillStyle = "rgba(196,181,253,0.10)";
  for (let y = 8; y < cssH; y += 52) {
    for (let x = 8; x < cssW; x += 56) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const veil = ctx.createRadialGradient(
    cssW * 0.5,
    cssH * 0.48,
    4,
    cssW * 0.5,
    cssH * 0.48,
    cssW * 0.55,
  );
  veil.addColorStop(0, "rgba(8, 4, 18, 0.58)");
  veil.addColorStop(0.5, "rgba(8, 4, 18, 0.3)");
  veil.addColorStop(1, "rgba(8, 4, 18, 0)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, cssW, cssH);

  function local(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left - ox, y: r.top - oy, w: r.width, h: r.height, r };
  }

  const eb = intro.querySelector(".ai-intro-eyebrow");
  if (eb) {
    const b = local(eb);
    const cs = getComputedStyle(eb);
    ctx.save();
    ctx.beginPath();
    const rr = Math.min(b.h / 2, 999);
    if (typeof ctx.roundRect === "function") ctx.roundRect(b.x, b.y, b.w, b.h, rr);
    else ctx.rect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = cs.backgroundColor || "rgba(124, 58, 237, 0.12)";
    ctx.fill();
    ctx.strokeStyle = cs.borderColor || "rgba(167, 139, 250, 0.42)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ctx.fillStyle = cs.color || "#c4b5fd";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((eb.textContent || "").replace(/\s+/g, " ").trim(), b.x + b.w / 2, b.y + b.h / 2);
    ctx.restore();
  }

  const orbCanvas = intro.querySelector("#ai-intro-orb-canvas");
  if (orbCanvas && orbCanvas.width) {
    const b = local(orbCanvas);
    try {
      ctx.drawImage(orbCanvas, b.x, b.y, b.w, b.h);
    } catch (err) {
      /* tainted / empty */
    }
  }

  const orbLabel = intro.querySelector("#ai-intro-orb-label");
  if (orbLabel) {
    const b = local(orbLabel);
    const cs = getComputedStyle(orbLabel);
    const textEl = orbLabel.querySelector(".ai-orb-type-text") || orbLabel;
    ctx.save();
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ctx.fillStyle = "#ede9fe";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(textEl.textContent || "", b.x, b.y + b.h / 2);
    ctx.restore();
  }

  const h2 = intro.querySelector("#ai-intro-title");
  if (h2) {
    const words = h2.querySelectorAll(".ai-word");
    const hr = h2.getBoundingClientRect();
    const grad = ctx.createLinearGradient(hr.left - ox, 0, hr.right - ox, 0);
    grad.addColorStop(0, "#f5f3ff");
    grad.addColorStop(0.14, "#e9d5ff");
    grad.addColorStop(0.32, "#c4b5fd");
    grad.addColorStop(0.48, "#a78bfa");
    grad.addColorStop(0.72, "#c026d3");
    grad.addColorStop(1, "#e879f9");
    words.forEach((w) => {
      const cs = getComputedStyle(w);
      const b = local(w);
      ctx.save();
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      if (cs.letterSpacing) ctx.letterSpacing = cs.letterSpacing;
      ctx.fillStyle = grad;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(w.textContent || "", b.x + b.w / 2, b.y + b.h / 2);
      ctx.restore();
    });
  }

  const lead = intro.querySelector(".ai-lab-intro-copy .lead");
  if (lead) {
    const b = local(lead);
    const cs = getComputedStyle(lead);
    ctx.save();
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ctx.fillStyle = cs.color || "rgba(237, 233, 254, 0.82)";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const lh = cssPx(cs, "lineHeight") || cssPx(cs, "fontSize") * 1.6;
    const text = (lead.textContent || "").trim();
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > b.w && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    lines.forEach((ln, i) => {
      ctx.fillText(ln, b.x + b.w / 2, b.y + i * lh);
    });
    ctx.restore();
  }
}

const VS = `
attribute vec2 aP;
uniform float uLift;
varying vec2 vUv;
varying float vShade;
varying float vBack;
varying float vHide;
void main(){
  vUv = aP;
  vHide = 0.0;
  vBack = 0.0;
  vec2 pos = vec2(aP.x * 2.0 - 1.0, aP.y * 2.0 - 1.0);

  // 右下角 → 左上：沿对角线柱面掀开
  vec2 br = vec2(1.0, -1.0);
  vec2 peelDir = normalize(vec2(-1.0, 1.0));
  vec2 fromBr = pos - br;
  float along = dot(fromBr, peelDir);
  vec2 lat = fromBr - peelDir * along;

  float R = 0.28;
  float maxAlong = 2.828427;
  float front = mix(-0.12, maxAlong + 3.3 * R, uLift);
  float s = front - along;
  float z = 0.0;
  vec3 n = vec3(0.0, 0.0, 1.0);

  if (s > 0.0 && uLift > 0.001) {
    float theta = s / R;
    if (theta >= 3.12) {
      vHide = 1.0;
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      return;
    }
    float newAlong = front - R * sin(theta);
    z = R * (1.0 - cos(theta));
    pos = br + peelDir * newAlong + lat;
    n = vec3(-peelDir * sin(theta), cos(theta));
    if (theta > 1.5708) vBack = 1.0;
  }

  float rip = sin(aP.x * 11.0 + uLift * 8.0) * 0.5
            + sin(aP.y * 15.0 - aP.x * 3.0 + uLift * 10.0) * 0.35;
  z += rip * 0.022 * (0.18 + uLift);
  pos.x += rip * 0.012 * uLift;
  n.x += rip * 0.18;
  n = normalize(n);
  vShade = 0.50 + 0.50 * max(dot(n, normalize(vec3(-0.28, 0.38, 0.88))), 0.0);

  float zCam = 2.55;
  float persp = zCam / max(0.18, zCam - z);
  gl_Position = vec4(pos * persp, z * 0.12 * persp, 1.0);
}`;

const FS = `
precision highp float;
varying vec2 vUv;
varying float vShade;
varying float vBack;
varying float vHide;
uniform sampler2D uTex;
uniform float uAlpha;
void main(){
  if (vHide > 0.5) discard;
  vec3 col = texture2D(uTex, vUv).rgb;
  col *= vShade;
  col += vec3(0.16, 0.11, 0.24) * pow(vShade, 5.0) * 0.45;
  col = mix(col, col * 0.26, vBack);
  gl_FragColor = vec4(col, uAlpha);
}`;

export function mount() {
  const track =
    document.getElementById("ai-lab-intro-track") ||
    document.getElementById("ai-letter-track");
  const sticky = document.getElementById("ai-letter-sticky");
  const intro = document.getElementById("ai-lab-intro");
  if (!track || !sticky) return () => {};
  if (sticky.dataset.curtainMounted) return () => {};
  sticky.dataset.curtainMounted = "1";

  if (prefersReducedMotion()) {
    return function dispose() {
      delete sticky.dataset.curtainMounted;
    };
  }

  const view = document.createElement("canvas");
  view.id = "ai-curtain-view";
  view.style.cssText =
    "position:fixed;left:0;right:0;top:var(--topbar-h,64px);bottom:0;width:100vw;height:calc(100vh - var(--topbar-h,64px));z-index:180;pointer-events:none;display:none;";
  document.body.appendChild(view);
  const vctx = view.getContext("2d", { alpha: true });

  let gl = null;
  const glc = document.createElement("canvas");
  try {
    gl = glc.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) throw new Error("no webgl");
  } catch (err) {
    console.warn("[ai-curtain] webgl unavailable", err);
    view.remove();
    return () => {};
  }

  const COLS = 64, ROWS = 48;
  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
    return s;
  }
  let prog;
  const U = {};
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
    gl.useProgram(prog);
  } catch (err) {
    console.warn("[ai-curtain] shader", err);
    view.remove();
    return () => {};
  }

  const verts = [];
  const idx = [];
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      verts.push(c / COLS, r / ROWS);
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const a = r * (COLS + 1) + c;
      idx.push(a, a + 1, a + COLS + 1, a + 1, a + COLS + 2, a + COLS + 1);
    }
  }
  const vbuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  const ibuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
  const aP = gl.getAttribLocation(prog, "aP");
  gl.enableVertexAttribArray(aP);
  gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 5, 20, 255]));
  for (const name of ["uLift", "uAlpha", "uTex"]) {
    U[name] = gl.getUniformLocation(prog, name);
  }
  gl.uniform1i(U.uTex, 0);

  let captured = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const W = Math.round(window.innerWidth * dpr);
    const H = Math.round((window.innerHeight - 64) * dpr);
    if (view.width !== W) view.width = W;
    if (view.height !== H) view.height = H;
    glc.width = W;
    glc.height = H;
    gl.viewport(0, 0, W, H);
  }
  resize();
  window.addEventListener("resize", resize);

  function captureCloth() {
    if (!intro || view.width < 2) return false;
    const cssW = view.clientWidth || window.innerWidth;
    const cssH = view.clientHeight || Math.max(1, window.innerHeight - 64);
    const ox = 0;
    const oy = 64;
    const snap = document.createElement("canvas");
    snap.width = view.width;
    snap.height = view.height;
    paintIntro(snap.getContext("2d"), intro, cssW, cssH, ox, oy);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snap);
    captured = true;
    return true;
  }

  function progress() {
    const vh = window.innerHeight;
    const r = track.getBoundingClientRect();
    const travel = Math.max(1, r.height - vh);
    const scrolled = clamp(-r.top, 0, travel);
    const holdPx = Math.min(vh * AI_HOLD_VH, travel * 0.42);
    const zoomPx = Math.min(vh * 0.48, travel * 0.4);
    return clamp((scrolled - holdPx) / Math.max(zoomPx, 1), 0, 1);
  }

  function draw() {
    const p = progress();
    const on = p > 0.0001 && p < 0.999;
    if (on && !captured) captureCloth();
    if (!on) captured = false;
    view.style.display = on ? "block" : "none";
    sticky.classList.toggle("is-curtain-on", on && captured);
    if (!on || !captured) return;

    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const lift = ease;
    const alpha = 1 - clamp((p - 0.96) / 0.04, 0, 1);

    gl.useProgram(prog);
    gl.uniform1f(U.uLift, lift);
    gl.uniform1f(U.uAlpha, alpha);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    vctx.clearRect(0, 0, view.width, view.height);
    vctx.drawImage(glc, 0, 0, view.width, view.height);
  }

  const prev = window.__updateAiScroll;
  function onAiScroll() {
    if (typeof prev === "function") prev();
    draw();
  }
  window.__updateAiScroll = onAiScroll;
  window.addEventListener("scroll", draw, { passive: true });
  window.addEventListener("resize", draw);
  draw();

  return function dispose() {
    window.removeEventListener("scroll", draw);
    window.removeEventListener("resize", draw);
    window.removeEventListener("resize", resize);
    if (window.__updateAiScroll === onAiScroll) {
      window.__updateAiScroll = prev;
    }
    sticky.classList.remove("is-curtain-on");
    view.remove();
    delete sticky.dataset.curtainMounted;
  };
}

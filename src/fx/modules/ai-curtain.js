/**
 * AI intro 布幕（Park：html2canvas 抓当前 intro 当唯一布面）。
 * - 掀开前 html2canvas 拍 intro；立刻藏掉真 DOM，只留这一张布；
 * - 右下角柱面掀开，卷过的片元丢掉，底下案例透出。
 * - 可见层 2D blit。
 */
import { clamp, prefersReducedMotion } from "../utils.js";

const AI_HOLD_VH = 0.36;

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
  vec2 br = vec2(1.0, -1.0);
  vec2 peelDir = normalize(vec2(-1.0, 1.0));
  vec2 fromBr = pos - br;
  float along = dot(fromBr, peelDir);
  vec2 lat = fromBr - peelDir * along;

  float R = 0.28;
  float front = mix(-0.12, 2.828427 + 3.3 * R, uLift);
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
  z += rip * 0.018 * uLift;
  n.x += rip * 0.16;
  n = normalize(n);
  vShade = 0.55 + 0.45 * max(dot(n, normalize(vec3(-0.28, 0.38, 0.88))), 0.0);

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
  col *= mix(1.0, vShade, 0.35);
  col += vec3(0.12, 0.08, 0.2) * pow(vShade, 6.0) * 0.25;
  col = mix(col, col * 0.22, vBack);
  gl_FragColor = vec4(col, uAlpha);
}`;

export function mount() {
  const track =
    document.getElementById("ai-lab-intro-track") ||
    document.getElementById("ai-letter-track");
  const sticky = document.getElementById("ai-letter-sticky");
  const intro = document.getElementById("ai-lab-intro");
  if (!track || !sticky || !intro) return () => {};
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
    "position:fixed;left:0;right:0;top:0;bottom:0;width:100vw;height:100vh;z-index:180;pointer-events:none;display:none;";
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
  let capturing = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const W = Math.round(window.innerWidth * dpr);
    const H = Math.round(window.innerHeight * dpr);
    if (view.width !== W) view.width = W;
    if (view.height !== H) view.height = H;
    glc.width = W;
    glc.height = H;
    gl.viewport(0, 0, W, H);
  }
  resize();
  window.addEventListener("resize", resize);

  function progress() {
    const vh = window.innerHeight;
    const r = track.getBoundingClientRect();
    const travel = Math.max(1, r.height - vh);
    const scrolled = clamp(-r.top, 0, travel);
    const holdPx = Math.min(vh * AI_HOLD_VH, travel * 0.42);
    const zoomPx = Math.min(vh * 0.48, travel * 0.4);
    return clamp((scrolled - holdPx) / Math.max(zoomPx, 1), 0, 1);
  }

  function captureCloth() {
    if (capturing || captured) return;
    capturing = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    import("html2canvas")
      .then((mod) => {
        const html2canvas = mod.default || mod;
        return html2canvas(intro, {
          backgroundColor: "#0a0514",
          scale: dpr,
          useCORS: true,
          logging: false,
          foreignObjectRendering: false,
        });
      })
      .then((shot) => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, shot);
        captured = true;
        capturing = false;
        sticky.classList.add("is-curtain-on");
        draw();
      })
      .catch((err) => {
        console.warn("[ai-curtain] html2canvas", err);
        capturing = false;
      });
  }

  function draw() {
    const p = progress();
    const on = p > 0.0001 && p < 0.999;
    if (on && !captured && !capturing) captureCloth();
    if (!on) {
      captured = false;
      capturing = false;
      sticky.classList.remove("is-curtain-on");
      view.style.display = "none";
      return;
    }
    if (!captured) return;

    view.style.display = "block";
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

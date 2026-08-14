/**
 * Explore cards — glass lens magnifier (glass-lens-demo pipeline)
 * Snapshot card (html2canvas) → WebGL2 SDF refraction + zoom under cursor
 */
(function () {
  "use strict";

  var VERT =
    "#version 300 es\n" +
    "layout(location=0) in vec2 aPos;\n" +
    "void main(){ gl_Position=vec4(aPos,0.0,1.0); }\n";

  /* Transparent outside lens (overlay on real DOM) */
  var FRAG =
    "#version 300 es\n" +
    "precision highp float;\n" +
    "out vec4 outColor;\n" +
    "uniform sampler2D uContent;\n" +
    "uniform vec2 uResolution;\n" +
    "uniform vec2 uCenter;\n" +
    "uniform vec2 uHalf;\n" +
    "uniform float uCorner;\n" +
    "uniform float uEdge;\n" +
    "uniform float uBevel;\n" +
    "uniform float uIor;\n" +
    "uniform float uDepth;\n" +
    "uniform float uAberration;\n" +
    "uniform float uBlur;\n" +
    "uniform float uReflect;\n" +
    "uniform float uShine;\n" +
    "uniform float uZoom;\n" +
    "uniform float uAlpha;\n" +
    "const float PI=3.14159265358979;\n" +
    "const float AIR_IOR=1.0003;\n" +
    "const vec3 INCIDENT=vec3(0.0,0.0,1.0);\n" +
    "float pow2(float x){return x*x;}\n" +
    "float pow5(float x){float x2=x*x;return x2*x2*x;}\n" +
    "float linearStep(float e0,float e1,float x){return clamp((x-e0)/(e1-e0),0.0,1.0);}\n" +
    "float ign(vec2 v){return fract(52.9829189*fract(0.06711056*v.x+0.00583715*v.y));}\n" +
    "float sdf(vec2 p){\n" +
    "  vec2 q=abs(p)-(uHalf-vec2(uCorner));\n" +
    "  return length(max(q,0.0))+min(max(q.x,q.y),0.0)-uCorner;\n" +
    "}\n" +
    "vec3 page(vec2 px,float lod){\n" +
    "  vec2 uv=clamp(px/uResolution,vec2(0.001),vec2(0.999));\n" +
    "  return pow(textureLod(uContent,vec2(uv.x,1.0-uv.y),lod).rgb,vec3(2.2));\n" +
    "}\n" +
    "float iorForWavelength(float wavelength){\n" +
    "  float ab=uAberration*0.1;\n" +
    "  return mix(uIor+ab,uIor-ab,1.0-pow(1.0-linearStep(450.0,650.0,wavelength),4.0));\n" +
    "}\n" +
    "vec3 pageBlur(vec2 px,float minLod,float sigma){\n" +
    "  float footprint=max(length(fwidth(px)),1.0);\n" +
    "  float lod=max(minLod,log2(footprint));\n" +
    "  if(sigma<0.35) return page(px,lod);\n" +
    "  float s2=2.0*sigma*sigma;\n" +
    "  vec3 acc=vec3(0.0); float wsum=0.0;\n" +
    "  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){\n" +
    "    vec2 o=vec2(float(i),float(j))*sigma;\n" +
    "    float w=exp(-(o.x*o.x+o.y*o.y)/s2);\n" +
    "    acc+=page(px+o,lod)*w; wsum+=w;\n" +
    "  }\n" +
    "  return acc/max(wsum,1e-4);\n" +
    "}\n" +
    "vec3 pageAA(vec2 px,float minLod){ return pageBlur(px,minLod,uBlur*2.8); }\n" +
    "vec3 sampleRefraction(vec2 basePx,float rim,vec3 normal,float glassIor){\n" +
    "  vec3 rv=refract(INCIDENT,normal,AIR_IOR/glassIor);\n" +
    "  if(rv.z==0.0&&rv.x==0.0&&rv.y==0.0) return pageAA(basePx,uBlur*(1.0+rim));\n" +
    "  rv/=max(abs(rv.z),1e-4)/max(uDepth,1.0);\n" +
    "  return pageAA(basePx+rv.xy,uBlur*(1.0+rim));\n" +
    "}\n" +
    "float fresnelSchlick(float cosTheta,float f0){\n" +
    "  return f0+(1.0-f0)*pow5(1.0-cosTheta);\n" +
    "}\n" +
    "void main(){\n" +
    "  vec2 fragPx=vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y);\n" +
    "  vec2 p=fragPx-uCenter;\n" +
    "  float sd=sdf(p);\n" +
    "  float aa=1.5;\n" +
    "  float mask=1.0-smoothstep(-aa,0.0,sd);\n" +
    "  float alpha=mask*uAlpha;\n" +
    "  if(alpha<0.004){ outColor=vec4(0.0); return; }\n" +
    "  float minHalf=min(uHalf.x,uHalf.y);\n" +
    "  float edgeW=max(minHalf*(1.0-clamp(uEdge,0.0,0.98)),1.0);\n" +
    "  float rim=pow(linearStep(-edgeW,0.0,sd),max(uBevel,0.5));\n" +
    "  float e=1.0;\n" +
    "  vec2 grad=vec2(\n" +
    "    sdf(p+vec2(e,0.0))-sdf(p-vec2(e,0.0)),\n" +
    "    sdf(p+vec2(0.0,e))-sdf(p-vec2(0.0,e)));\n" +
    "  vec3 rimNormal=vec3(normalize(grad+vec2(1e-5)),0.0);\n" +
    "  float scatter=min(uBlur,1.0)*0.03;\n" +
    "  float randAngle=ign(fragPx)*PI*2.0;\n" +
    "  vec3 flatNormal=normalize(vec3(sin(randAngle)*scatter,cos(randAngle)*scatter,-1.0));\n" +
    "  vec3 normal=normalize(mix(flatNormal,rimNormal,rim));\n" +
    "  vec2 basePx=uCenter+p/max(uZoom,1.0);\n" +
    "  vec3 refracted;\n" +
    "  if(uAberration>0.001){\n" +
    "    refracted =sampleRefraction(basePx,rim,normal,iorForWavelength(611.4))*vec3(1.,0.,0.);\n" +
    "    refracted+=sampleRefraction(basePx,rim,normal,iorForWavelength(570.5))*vec3(1.,1.,0.);\n" +
    "    refracted+=sampleRefraction(basePx,rim,normal,iorForWavelength(549.1))*vec3(0.,1.,0.);\n" +
    "    refracted+=sampleRefraction(basePx,rim,normal,iorForWavelength(491.4))*vec3(0.,1.,1.);\n" +
    "    refracted+=sampleRefraction(basePx,rim,normal,iorForWavelength(464.2))*vec3(0.,0.,1.);\n" +
    "    refracted+=sampleRefraction(basePx,rim,normal,iorForWavelength(374.0))*vec3(1.,0.,1.);\n" +
    "    refracted/=3.0;\n" +
    "  } else {\n" +
    "    refracted=sampleRefraction(basePx,rim,normal,uIor);\n" +
    "  }\n" +
    "  vec3 glass=refracted;\n" +
    "  if(uReflect>0.001){\n" +
    "    const vec3 V=vec3(0.0,0.0,-1.0);\n" +
    "    float NDotV=clamp(dot(V,normal),0.0,1.0);\n" +
    "    float f0=pow2((uIor-AIR_IOR)/(uIor+AIR_IOR));\n" +
    "    float fresnelV=fresnelSchlick(NDotV,f0)*uReflect;\n" +
    "    vec3 reflectVector=reflect(INCIDENT,normal);\n" +
    "    reflectVector/=max(abs(reflectVector.z),1e-4)/max(uDepth,1.0);\n" +
    "    vec3 reflected=pageBlur(basePx+reflectVector.xy,2.0+uBlur,uBlur*2.0);\n" +
    "    glass=mix(refracted,reflected,clamp(fresnelV,0.0,1.0));\n" +
    "  }\n" +
    "  if(uShine>0.001){\n" +
    "    float ldot=dot(rimNormal.xy,normalize(vec2(-0.6,0.8)));\n" +
    "    float band=pow(rim,1.8);\n" +
    "    float arcs=pow(abs(ldot),3.0)*(ldot>0.0?0.5:0.28);\n" +
    "    glass+=band*(0.04+arcs)*uShine;\n" +
    "  }\n" +
    "  outColor=vec4(pow(glass,vec3(1.0/2.2))*alpha,alpha);\n" +
    "}\n";

  var OPTS = {
    size: 118,
    ior: 1.48,
    edge: 0.68,
    bevel: 3.5,
    depth: 220,
    aberration: 0.85,
    blur: 0.15,
    reflection: 0.9,
    shine: 0.42,
    zoom: 1.85,
    zoomIdle: 1.35,
    follow: 0.22,
  };

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("[explore-glass]", gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src =
        "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      s.async = true;
      s.onload = function () {
        resolve(window.html2canvas);
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function createLens(card) {
    var canvas = document.createElement("canvas");
    canvas.className = "explore-glass-canvas";
    canvas.setAttribute("aria-hidden", "true");
    card.appendChild(canvas);

    var gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      depth: false,
      stencil: false,
    });
    if (!gl) {
      canvas.remove();
      return null;
    }

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      canvas.remove();
      return null;
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.remove();
      return null;
    }
    gl.useProgram(prog);
    var uniforms = {};
    var ucount = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < ucount; i++) {
      var info = gl.getActiveUniform(prog, i);
      uniforms[info.name] = gl.getUniformLocation(prog, info.name);
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
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0])
    );

    var posX = 0;
    var posY = 0;
    var targetX = 0;
    var targetY = 0;
    var presence = 0;
    var presenceTarget = 0;
    var zoom = 1;
    var zoomTarget = 1;
    var hasSnap = false;
    var snapping = false;
    var raf = 0;
    var lastT = performance.now();
    var running = false;

    function syncSize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(card.clientWidth * dpr));
      var h = Math.max(1, Math.round(card.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    function uploadSnap(snapCanvas) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        snapCanvas
      );
      gl.generateMipmap(gl.TEXTURE_2D);
      hasSnap = true;
    }

    function capture() {
      if (snapping || typeof window.html2canvas !== "function") return;
      snapping = true;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      /* hide canvas so snapshot is clean DOM */
      canvas.style.visibility = "hidden";
      window
        .html2canvas(card, {
          backgroundColor: null,
          scale: dpr,
          useCORS: true,
          logging: false,
          ignoreElements: function (el) {
            return el === canvas || (el.classList && el.classList.contains("explore-glass-canvas"));
          },
        })
        .then(function (snap) {
          canvas.style.visibility = "";
          uploadSnap(snap);
          snapping = false;
          start();
        })
        .catch(function () {
          canvas.style.visibility = "";
          snapping = false;
        });
    }

    function render() {
      if (!hasSnap || presence < 0.01) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }
      var dpr = canvas.width / Math.max(card.clientWidth, 1);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      var half = (OPTS.size * 0.5) * presence;
      var cx = posX * dpr;
      var cy = canvas.height - posY * dpr;
      var alpha = Math.min(presence * 4, 1);

      gl.useProgram(prog);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uniforms.uContent, 0);
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.uCenter, cx, cy);
      gl.uniform2f(uniforms.uHalf, half * dpr, half * dpr);
      gl.uniform1f(uniforms.uCorner, half * dpr);
      gl.uniform1f(uniforms.uEdge, OPTS.edge);
      gl.uniform1f(uniforms.uBevel, OPTS.bevel);
      gl.uniform1f(uniforms.uIor, OPTS.ior);
      gl.uniform1f(uniforms.uDepth, OPTS.depth * dpr);
      gl.uniform1f(uniforms.uAberration, OPTS.aberration);
      gl.uniform1f(uniforms.uBlur, OPTS.blur);
      gl.uniform1f(uniforms.uReflect, OPTS.reflection);
      gl.uniform1f(uniforms.uShine, OPTS.shine);
      gl.uniform1f(uniforms.uZoom, Math.max(zoom, 1));
      gl.uniform1f(uniforms.uAlpha, alpha);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disable(gl.BLEND);
    }

    function frame(now) {
      if (!running) return;
      var dt = Math.min((now - lastT) / 1000, 1 / 30);
      lastT = now;
      var follow = OPTS.follow;
      var kPos = 1 - Math.exp(-dt * (5 + follow * 24));
      var kZ = 1 - Math.exp(-dt * 8);
      var kP = 1 - Math.exp(-dt * 10);
      posX += (targetX - posX) * kPos;
      posY += (targetY - posY) * kPos;
      zoom += (zoomTarget - zoom) * kZ;
      presence += (presenceTarget - presence) * kP;
      render();
      var settled =
        Math.abs(targetX - posX) < 0.15 &&
        Math.abs(targetY - posY) < 0.15 &&
        Math.abs(zoomTarget - zoom) < 0.003 &&
        Math.abs(presenceTarget - presence) < 0.003 &&
        presenceTarget < 0.01;
      if (settled) {
        running = false;
        if (presence < 0.01) render();
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      lastT = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function setPointer(clientX, clientY, targetEl) {
      var rect = card.getBoundingClientRect();
      targetX = clientX - rect.left;
      targetY = clientY - rect.top;
      presenceTarget = 1;
      /* hot UI zones get stronger zoom (demo crystal-ball) */
      var hot =
        targetEl &&
        targetEl.closest &&
        targetEl.closest(
          ".returns-ui, .returns-ui-card, .returns-method, .code-window, .api-carriers, .explore-api-visual"
        );
      zoomTarget = hot ? OPTS.zoom : OPTS.zoomIdle;
      start();
    }

    function onEnter(e) {
      syncSize();
      var rect = card.getBoundingClientRect();
      posX = targetX = e.clientX - rect.left;
      posY = targetY = e.clientY - rect.top;
      presenceTarget = 1;
      zoomTarget = OPTS.zoomIdle;
      if (!hasSnap) capture();
      else start();
      card.classList.add("is-glass-lens");
    }

    function onMove(e) {
      setPointer(e.clientX, e.clientY, e.target);
    }

    function onLeave() {
      presenceTarget = 0;
      zoomTarget = 1;
      card.classList.remove("is-glass-lens");
      start();
    }

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove, { passive: true });
    card.addEventListener("pointerleave", onLeave);

    var ro = new ResizeObserver(function () {
      syncSize();
      hasSnap = false;
      if (presenceTarget > 0.5) capture();
    });
    ro.observe(card);

    syncSize();
    return {
      destroy: function () {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect();
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
        canvas.remove();
      },
    };
  }

  function boot() {
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    var cards = document.querySelectorAll(".explore-card");
    if (!cards.length) return;

    loadHtml2Canvas()
      .then(function () {
        Array.prototype.forEach.call(cards, function (card) {
          createLens(card);
        });
      })
      .catch(function (err) {
        console.warn("[explore-glass] html2canvas unavailable", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

import { shouldReduceFx } from "../utils.js";

/**
 * AI intro Duo：进屏顶铰链立正 + 底糊；离开底边折 + 顶糊。
 * 行程跟现有 letter-track hold/exit，不另加 sticky 锁屏。
 */
export function mount() {
  const intro = document.getElementById("ai-lab-intro");
  const track =
    document.getElementById("ai-lab-intro-track") ||
    intro?.closest(".ai-letter-track");
  const shell = intro?.querySelector(".ai-intro-shell");
  const persp = intro?.querySelector(".ai-intro-persp");
  const pblur = intro?.querySelector(".ai-intro-pblur");
  if (!intro || !track || !shell) return () => {};

  if (shouldReduceFx()) {
    intro.style.setProperty("--ai-duo", "1");
    intro.style.setProperty("--ai-leave", "0");
    intro.style.setProperty("--ai-blur", "0");
    intro.classList.add("is-duo-settled");
    return () => {};
  }

  let raf = 0;
  let looping = false;

  function originPx(value, w, h) {
    const parts = String(value || "").trim().split(/\s+/);
    const toPx = (s, basis) =>
      String(s).endsWith("%") ? (parseFloat(s) / 100) * basis : parseFloat(s) || 0;
    return { x: toPx(parts[0], w), y: toPx(parts[1] || parts[0], h) };
  }

  function clipPblurToShell() {
    if (!pblur || !persp) return;
    if (!intro.classList.contains("is-leaving")) {
      pblur.style.clipPath = "";
      pblur.style.webkitClipPath = "";
      return;
    }
    const w = shell.offsetWidth;
    const h = shell.offsetHeight;
    if (w < 2 || h < 2) return;

    const cs = getComputedStyle(shell);
    const matrix = cs.transform === "none" ? new DOMMatrix() : new DOMMatrix(cs.transform);
    const origin = originPx(cs.transformOrigin, w, h);
    const pcs = getComputedStyle(persp);
    const depth = parseFloat(pcs.perspective);
    const po = originPx(pcs.perspectiveOrigin, persp.offsetWidth, persp.offsetHeight);

    const pts = [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ].map(([x, y]) => {
      let p = new DOMPoint(x - origin.x, y - origin.y, 0);
      p = matrix.transformPoint(p);
      const lx = p.x + origin.x;
      const ly = p.y + origin.y;
      const lz = p.z;
      if (!depth || !isFinite(depth)) return [lx, ly];
      const denom = 1 - lz / depth;
      if (Math.abs(denom) < 1e-4) return [lx, ly];
      return [po.x + (lx - po.x) / denom, po.y + (ly - po.y) / denom];
    });

    const ox = pblur.offsetLeft;
    const oy = pblur.offsetTop;
    const poly = pts
      .map(([x, y]) => `${(x - ox).toFixed(1)}px ${(y - oy).toFixed(1)}px`)
      .join(",");
    const clip = `polygon(${poly})`;
    pblur.style.clipPath = clip;
    pblur.style.webkitClipPath = clip;
  }

  function target() {
    const vh = window.innerHeight || 1;
    const top = track.getBoundingClientRect().top;
    const start = vh * 1.45;
    const almost = vh * 0.08;
    const atAlmost = 0.94;
    const hold = vh * 0.36;
    const exit = vh * 0.48;

    if (top >= start) return { enter: 0, leave: 0 };

    if (top < 0) {
      const scrolled = -top;
      if (scrolled <= hold) return { enter: 1, leave: 0 };
      const u = Math.max(0, Math.min(1, (scrolled - hold) / Math.max(exit, 1)));
      return { enter: 1, leave: u };
    }

    if (top > almost) {
      return { enter: atAlmost * (start - top) / (start - almost), leave: 0 };
    }
    return {
      enter: atAlmost + (1 - atAlmost) * (almost - top) / almost,
      leave: 0,
    };
  }

  function write(state) {
    const enter = state.enter;
    const leave = state.leave;
    const leaving = leave > 0.008;
    const kEnter = 1 - enter;
    const blur = leaving ? leave : kEnter;

    intro.style.setProperty("--ai-duo", enter.toFixed(4));
    intro.style.setProperty("--ai-leave", leave.toFixed(4));
    intro.style.setProperty("--ai-blur", blur.toFixed(4));
    intro.classList.toggle("is-leaving", leaving);
    intro.classList.toggle("is-duo-settled", enter > 0.992 && !leaving);
    const sticky = intro.closest(".ai-letter-sticky");
    if (sticky) sticky.classList.toggle("is-leaving", leaving);

    if (leaving) {
      const pitch = leave * 54;
      const pullY = 1 + leave * 0.48;
      const pullX = 1 + leave * 0.05;
      shell.style.transformOrigin = "50% 100%";
      shell.style.transform =
        `rotateX(${pitch.toFixed(2)}deg) scale3d(${pullX.toFixed(3)}, ${pullY.toFixed(3)}, 1)`;
      clipPblurToShell();
      return;
    }

    if (enter > 0.992) {
      shell.style.transformOrigin = "";
      shell.style.transform = "";
      clipPblurToShell();
      return;
    }

    const pitch = kEnter * 78;
    const pullY = 1 + kEnter * 0.72;
    const pullX = 1 + kEnter * 0.1;
    const sink = kEnter * 140;
    shell.style.transformOrigin = "50% 0%";
    shell.style.transform =
      `rotateX(${(-pitch).toFixed(2)}deg) scale3d(${pullX.toFixed(3)}, ${pullY.toFixed(3)}, 1) translateZ(${(-sink).toFixed(1)}px)`;
    clipPblurToShell();
  }

  function tick() {
    write(target());
    if (looping) raf = requestAnimationFrame(tick);
    else raf = 0;
  }

  function start() {
    if (looping) return;
    looping = true;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    looping = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  write(target());
  start();

  window.addEventListener("scroll", start, { passive: true });
  window.addEventListener("resize", start, { passive: true });
  let lenisOff = null;
  if (window.__lenis?.on) {
    window.__lenis.on("scroll", start);
    lenisOff = () => window.__lenis?.off?.("scroll", start);
  }

  const io =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) start();
            else stop();
          },
          { threshold: 0, rootMargin: "120px" }
        );
  if (io) io.observe(track);

  return function dispose() {
    stop();
    window.removeEventListener("scroll", start);
    window.removeEventListener("resize", start);
    if (typeof lenisOff === "function") lenisOff();
    if (io) io.disconnect();
    shell.style.transform = "";
    shell.style.transformOrigin = "";
    if (pblur) {
      pblur.style.clipPath = "";
      pblur.style.webkitClipPath = "";
    }
    intro.classList.remove("is-leaving");
    intro.closest(".ai-letter-sticky")?.classList.remove("is-leaving");
  };
}

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

    if (leaving) {
      const pitch = leave * 54;
      const pullY = 1 + leave * 0.48;
      const pullX = 1 + leave * 0.05;
      shell.style.transformOrigin = "50% 100%";
      shell.style.transform =
        `rotateX(${pitch.toFixed(2)}deg) scale3d(${pullX.toFixed(3)}, ${pullY.toFixed(3)}, 1)`;
      return;
    }

    if (enter > 0.992) {
      shell.style.transformOrigin = "";
      shell.style.transform = "";
      return;
    }

    const pitch = kEnter * 78;
    const pullY = 1 + kEnter * 0.72;
    const pullX = 1 + kEnter * 0.1;
    const sink = kEnter * 140;
    shell.style.transformOrigin = "50% 0%";
    shell.style.transform =
      `rotateX(${(-pitch).toFixed(2)}deg) scale3d(${pullX.toFixed(3)}, ${pullY.toFixed(3)}, 1) translateZ(${(-sink).toFixed(1)}px)`;
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
    intro.classList.remove("is-leaving");
  };
}

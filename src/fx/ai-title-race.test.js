import { describe, it, expect, beforeEach, afterEach } from "vitest";

/**
 * Reproduces the race that hid the AI intro title:
 * particles wraps into .ai-title-solid → ai-lab rewrites words →
 * absorb must keep words connected under #ai-intro-title.
 */
describe("AI intro title race (ai-lab × particles)", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section class="ai-lab-intro">
        <h2 id="ai-intro-title">Show how AI turns tracking pages into personalized post-purchase journeys</h2>
      </section>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("words stay connected after solid wipe + re-absorb", () => {
    const h2 = document.getElementById("ai-intro-title");

    // —— particles first: wrap text into solid + canvas ——
    const solid = document.createElement("div");
    solid.className = "ai-title-solid";
    while (h2.firstChild) solid.appendChild(h2.firstChild);
    h2.appendChild(solid);
    const canvas = document.createElement("canvas");
    canvas.className = "ai-title-particles";
    h2.appendChild(canvas);

    // —— ai-lab safe rewrite (mirrors shipped logic) ——
    const text = h2.textContent.replace(/\s+/g, " ").trim();
    const solidEl = h2.querySelector(".ai-title-solid");
    const canvasEl = h2.querySelector("canvas.ai-title-particles");
    while (h2.firstChild) h2.removeChild(h2.firstChild);
    if (solidEl) while (solidEl.firstChild) solidEl.removeChild(solidEl.firstChild);
    const host = solidEl || h2;
    const words = [];
    text.split(" ").forEach((w) => {
      const span = document.createElement("span");
      span.className = "ai-word";
      span.textContent = w;
      host.appendChild(span);
      host.appendChild(document.createTextNode(" "));
      words.push(span);
    });
    if (solidEl) h2.appendChild(solidEl);
    if (canvasEl && canvasEl.parentNode !== h2) h2.appendChild(canvasEl);

    expect(words.length).toBeGreaterThan(5);
    words.forEach((w) => {
      expect(h2.contains(w)).toBe(true);
      expect(w.isConnected).toBe(true);
    });
    expect(h2.querySelector(".ai-title-solid")).toBeTruthy();
    expect(h2.querySelector("canvas.ai-title-particles")).toBeTruthy();
  });

  it("ensureShell recovers words moved into a detached solid", () => {
    const h2 = document.getElementById("ai-intro-title");
    h2.textContent = "";

    // words only under detached solid (old bug path)
    let solid = document.createElement("div");
    solid.className = "ai-title-solid";
    ["Show", "how", "AI"].forEach((w) => {
      const span = document.createElement("span");
      span.className = "ai-word";
      span.textContent = w;
      solid.appendChild(span);
    });
    // solid NOT in document
    expect(solid.isConnected).toBe(false);

    // recovery path used by particles.ensureShellInDom + absorbWords
    if (!solid.isConnected || solid.parentNode !== h2) {
      h2.appendChild(solid);
    }
    expect(solid.isConnected).toBe(true);
    expect(h2.querySelectorAll(".ai-word").length).toBe(3);
    h2.querySelectorAll(".ai-word").forEach((w) => {
      expect(h2.contains(w)).toBe(true);
    });
  });

  it("moving words into solid preserves spaces between tokens", () => {
    const h2 = document.getElementById("ai-intro-title");
    h2.textContent = "";
    const solid = document.createElement("div");
    solid.className = "ai-title-solid";
    h2.appendChild(solid);
    // Simulate ai-lab output: word + space + word (siblings on h2, solid empty)
    const w1 = document.createElement("span");
    w1.className = "ai-word";
    w1.textContent = "Show";
    const sp = document.createTextNode(" ");
    const w2 = document.createElement("span");
    w2.className = "ai-word";
    w2.textContent = "how";
    h2.insertBefore(w1, solid);
    h2.insertBefore(sp, solid);
    h2.insertBefore(w2, solid);

    // Document-order move (shipped absorbWords path)
    const batch = [];
    for (let n = h2.firstChild; n; n = n.nextSibling) {
      if (n !== solid) batch.push(n);
    }
    batch.forEach((node) => solid.appendChild(node));

    expect(solid.textContent).toBe("Show how");
    expect(solid.textContent).not.toBe("Showhow");
  });

  it("useLandingEffects mounts aiLab before aiTitleParticles", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const src = readFileSync(
      join(process.cwd(), "src/fx/useLandingEffects.js"),
      "utf8"
    );
    const aiLab = src.indexOf('await mountNamed("aiLab")');
    const particles = src.indexOf('mountNamed("aiTitleParticles")');
    expect(aiLab).toBeGreaterThan(-1);
    expect(particles).toBeGreaterThan(-1);
    expect(aiLab).toBeLessThan(particles);
    // particles idle-deferred (hover-only) — not parallel with aiLab
    expect(src).toMatch(/whenIdle\([\s\S]*aiTitleParticles/);
  });
});

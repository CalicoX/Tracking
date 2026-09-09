import { describe, it, expect } from "vitest";
import {
  sampleIntroFlow,
  grainTerm,
} from "./modules/ai-intro-flow-sample.js";

describe("sampleIntroFlow (shipped intro bg)", () => {
  const uv = { x: 0.42, y: 0.51 };

  it("time-shifted mixing yields different colors at the same UV", () => {
    const pts = [
      uv,
      { x: 0.64, y: 0.62 },
      { x: 0.42, y: 0.5 },
      { x: 0.2, y: 0.3 },
    ];
    let maxDelta = 0;
    let sampleA;
    let sampleB;
    for (const p of pts) {
      const a = sampleIntroFlow(p, 0.15, null);
      const b = sampleIntroFlow(p, 2.6, null);
      const delta =
        Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      if (delta > maxDelta) {
        maxDelta = delta;
        sampleA = a;
        sampleB = b;
      }
    }
    expect(sampleA).toHaveLength(3);
    expect(sampleB).toHaveLength(3);
    expect(maxDelta).toBeGreaterThan(0.02);
  });

  it("screen-space grain changes the sample vs grain off and vs a second offset", () => {
    const plain = sampleIntroFlow(uv, 0.8, null);
    const g0 = sampleIntroFlow(uv, 0.8, { x: 12, y: 40 });
    const g1 = sampleIntroFlow(uv, 0.8, { x: 13, y: 40 });
    const vsOff =
      Math.abs(plain[0] - g0[0]) +
      Math.abs(plain[1] - g0[1]) +
      Math.abs(plain[2] - g0[2]);
    const vsShift =
      Math.abs(g0[0] - g1[0]) +
      Math.abs(g0[1] - g1[1]) +
      Math.abs(g0[2] - g1[2]);
    expect(vsOff).toBeGreaterThan(0.0003);
    expect(vsShift).toBeGreaterThan(0.0003);
    expect(grainTerm(12, 40)).not.toBe(grainTerm(13, 40));
  });
});

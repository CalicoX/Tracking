import { describe, it, expect } from "vitest";
import {
  DISTORT,
  FLOW_BACK_HEX,
  GRAIN,
  SYNTHESIS_ID,
  WAVE_A,
  WAVE_B,
  WAVE_BLUE_HEX,
  WAVE_PINK_HEX,
} from "./modules/ai-intro-synthesis-preset.js";

describe("Synthesis 1 preset (shaders.com c91ae513)", () => {
  it("locks the public collection id and authored colors", () => {
    expect(SYNTHESIS_ID).toBe("c91ae513-d656-4f32-933f-fdcd579495e2");
    expect(FLOW_BACK_HEX).toBe("#08071a");
    expect(WAVE_BLUE_HEX).toBe("#0582e8");
    expect(WAVE_PINK_HEX).toBe("#f00e94");
  });

  it("locks official wave / distort / grain numbers", () => {
    expect(WAVE_A.blendMode).toBe("normal-oklch");
    expect(WAVE_B.blendMode).toBe("normal-oklch");
    expect(WAVE_A.speed).toBe(0.3);
    expect(WAVE_B.speed).toBe(0.5);
    expect(WAVE_A.amplitude).toBe(0.36);
    expect(WAVE_B.amplitude).toBe(0.17);
    expect(WAVE_A.thickness).toBe(0.72);
    expect(WAVE_B.thickness).toBe(0.35);
    expect(WAVE_A.softness).toBe(0.55);
    expect(WAVE_B.softness).toBe(0.54);
    expect(WAVE_A.frequency).toBe(0.2);
    expect(DISTORT.angle).toBe(299);
    expect(DISTORT.strength).toBe(1);
    expect(DISTORT.frequency).toBe(0.3);
    expect(DISTORT.speed).toBe(0.2);
    expect(DISTORT.waveType).toBe("sine");
    expect(GRAIN.strength).toBe(0.07);
  });
});

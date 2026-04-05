import { describe, expect, it, vi } from "vitest";
import {
  checkStep,
  extendSequence,
  gapDurationMs,
  PAD_COUNT,
  randomPad,
  stepDurationMs,
} from "./simon";

describe("checkStep", () => {
  it("matches sequence", () => {
    const seq = [0, 2, 1] as const;
    expect(checkStep(seq, 0, 0)).toBe(true);
    expect(checkStep(seq, 1, 2)).toBe(true);
    expect(checkStep(seq, 2, 1)).toBe(true);
    expect(checkStep(seq, 1, 1)).toBe(false);
  });
});

describe("extendSequence", () => {
  it("adds one pad", () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0);
    expect(extendSequence([])).toEqual([0]);
    spy.mockRestore();
  });
});

describe("randomPad", () => {
  it("stays in range", () => {
    for (let i = 0; i < 30; i++) {
      const p = randomPad();
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThan(PAD_COUNT);
    }
  });
});

describe("timing", () => {
  it("does not go below floor", () => {
    expect(stepDurationMs(999)).toBe(280);
    expect(gapDurationMs(999)).toBe(80);
  });
});

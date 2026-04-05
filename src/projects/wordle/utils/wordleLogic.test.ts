import { describe, expect, it } from "vitest";
import {
  dailyIndex,
  gradeGuess,
  localDateKey,
  rowsToShareEmoji,
} from "./wordleLogic";

describe("gradeGuess", () => {
  it("marks all correct", () => {
    expect(gradeGuess("crane", "crane")).toEqual([
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("handles double letters when answer has one", () => {
    expect(gradeGuess("apple", "papal")).toEqual([
      "present",
      "present",
      "correct",
      "absent",
      "present",
    ]);
  });

  it("marks absent when guess repeats letter more than answer", () => {
    expect(gradeGuess("erase", "eerie")).toEqual([
      "correct",
      "absent",
      "present",
      "absent",
      "correct",
    ]);
  });

  it("is case-insensitive", () => {
    expect(gradeGuess("Crane", "crane")).toEqual([
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });
});

describe("dailyIndex", () => {
  it("is deterministic", () => {
    expect(dailyIndex("2026-04-04", 100)).toBe(dailyIndex("2026-04-04", 100));
  });

  it("stays in range", () => {
    for (const key of ["2020-01-01", "2026-12-31", "2030-06-15"]) {
      const i = dailyIndex(key, 500);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(500);
    }
  });
});

describe("localDateKey", () => {
  it("formats as YYYY-MM-DD", () => {
    expect(localDateKey(new Date(2026, 3, 4))).toBe("2026-04-04");
  });
});

describe("rowsToShareEmoji", () => {
  it("renders a grid", () => {
    const s = rowsToShareEmoji([
      ["correct", "absent", "absent", "absent", "absent"],
      ["absent", "absent", "present", "absent", "absent"],
    ]);
    expect(s).toBe("🟩⬜⬜⬜⬜\n⬜⬜🟨⬜⬜");
  });
});

import { describe, expect, it } from "vitest";
import { CONNECTION_PUZZLES } from "./puzzles";
import {
  evaluateSelection,
  filterOutGroup,
  makePlacedWords,
  MAX_MISTAKES,
} from "./game";

const p0 = CONNECTION_PUZZLES[0]!;

describe("makePlacedWords", () => {
  it("creates 16 unique ids", () => {
    const w = makePlacedWords(p0);
    expect(w).toHaveLength(16);
    expect(new Set(w.map((x) => x.id)).size).toBe(16);
  });
});

describe("evaluateSelection", () => {
  it("detects a correct group", () => {
    const remaining = makePlacedWords(p0);
    const g0 = remaining.filter((x) => x.groupIndex === 0);
    expect(g0).toHaveLength(4);
    const ids = g0.map((x) => x.id);
    const r = evaluateSelection(p0, remaining, ids);
    expect(r.kind).toBe("solved");
    if (r.kind === "solved") {
      expect(r.strip.title).toBe(p0.groups[0]!.title);
    }
  });

  it("returns need_four when not four tiles", () => {
    const remaining = makePlacedWords(p0);
    expect(evaluateSelection(p0, remaining, []).kind).toBe("need_four");
    expect(
      evaluateSelection(p0, remaining, [remaining[0]!.id]).kind,
    ).toBe("need_four");
  });

  it("flags one away when three share a group", () => {
    const remaining = makePlacedWords(p0);
    const g0 = remaining.filter((x) => x.groupIndex === 0);
    const stray = remaining.find((x) => x.groupIndex === 1)!;
    const ids = [g0[0]!.id, g0[1]!.id, g0[2]!.id, stray.id];
    const r = evaluateSelection(p0, remaining, ids);
    expect(r.kind).toBe("wrong");
    if (r.kind === "wrong") expect(r.oneAway).toBe(true);
  });

  it("wrong without one away for two and two split", () => {
    const remaining = makePlacedWords(p0);
    const g0 = remaining.filter((x) => x.groupIndex === 0);
    const g1 = remaining.filter((x) => x.groupIndex === 1);
    const ids = [g0[0]!.id, g0[1]!.id, g1[0]!.id, g1[1]!.id];
    const r = evaluateSelection(p0, remaining, ids);
    expect(r.kind).toBe("wrong");
    if (r.kind === "wrong") expect(r.oneAway).toBe(false);
  });
});

describe("filterOutGroup", () => {
  it("removes four words", () => {
    const remaining = makePlacedWords(p0);
    const next = filterOutGroup(remaining, 0);
    expect(next).toHaveLength(12);
  });
});

describe("MAX_MISTAKES", () => {
  it("is four like NYT", () => {
    expect(MAX_MISTAKES).toBe(4);
  });
});

describe("CONNECTION_PUZZLES", () => {
  it("has sixteen unique words per puzzle", () => {
    for (const p of CONNECTION_PUZZLES) {
      const flat = p.groups.flatMap((g) => g.words);
      expect(flat).toHaveLength(16);
      expect(new Set(flat).size).toBe(16);
    }
  });
});

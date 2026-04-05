import { describe, expect, it } from "vitest";
import {
  canPlace,
  conflictKeys,
  isSolved,
  parsePuzzle,
} from "./sudoku";

describe("parsePuzzle", () => {
  it("parses 81 chars", () => {
    const g = parsePuzzle("0".repeat(81));
    expect(g).toHaveLength(9);
    expect(g[0]).toHaveLength(9);
    expect(g[0][0]).toBe(0);
  });
});

describe("canPlace", () => {
  it("rejects duplicate in row", () => {
    const g = Array.from({ length: 9 }, () => Array(9).fill(0));
    g[0][1] = 5;
    expect(canPlace(g, 0, 0, 5)).toBe(false);
    expect(canPlace(g, 0, 0, 7)).toBe(true);
  });
});

describe("isSolved", () => {
  it("is false on empty", () => {
    expect(isSolved(Array.from({ length: 9 }, () => Array(9).fill(0)))).toBe(
      false,
    );
  });
});

describe("conflictKeys", () => {
  it("finds row duplicate", () => {
    const g = Array.from({ length: 9 }, () => Array(9).fill(0));
    g[0][0] = 3;
    g[0][5] = 3;
    expect(conflictKeys(g).size).toBeGreaterThan(0);
  });
});

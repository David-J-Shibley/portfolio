import { describe, expect, it } from "vitest";
import {
  emptyBoard,
  isSolved,
  randomPuzzle,
  SIZE,
  toggleAt,
} from "./lightsOut";

describe("toggleAt", () => {
  it("toggles center and neighbors", () => {
    const b = emptyBoard();
    const t = toggleAt(b, 2, 2);
    expect(t[2][2]).toBe(1);
    expect(t[1][2]).toBe(1);
    expect(t[3][2]).toBe(1);
    expect(t[2][1]).toBe(1);
    expect(t[2][3]).toBe(1);
    expect(t[0][0]).toBe(0);
  });

  it("double toggle restores", () => {
    const b = emptyBoard();
    expect(toggleAt(toggleAt(b, 1, 1), 1, 1)).toEqual(b);
  });
});

describe("isSolved", () => {
  it("is true for empty board", () => {
    expect(isSolved(emptyBoard())).toBe(true);
  });
});

describe("randomPuzzle", () => {
  it("produces non-solved 5x5", () => {
    const p = randomPuzzle(5, 10);
    expect(p).toHaveLength(SIZE);
    expect(p[0]).toHaveLength(SIZE);
    expect(isSolved(p)).toBe(false);
  });
});

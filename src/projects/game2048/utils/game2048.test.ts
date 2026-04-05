import { describe, expect, it } from "vitest";
import {
  addRandomTile,
  canMove,
  emptyBoard,
  GRID_SIZE,
  mergeLine,
  move,
  moveLeft,
  maxTile,
} from "./game2048";

describe("mergeLine", () => {
  it("merges a pair once", () => {
    expect(mergeLine([2, 2, 0, 0]).next).toEqual([4, 0, 0, 0]);
    expect(mergeLine([2, 2, 0, 0]).gained).toBe(4);
  });

  it("does not triple-merge in one swipe", () => {
    const { next, gained } = mergeLine([2, 2, 2, 0]);
    expect(next).toEqual([4, 2, 0, 0]);
    expect(gained).toBe(4);
  });

  it("merges two pairs", () => {
    expect(mergeLine([2, 2, 4, 4]).next).toEqual([4, 8, 0, 0]);
  });

  it("keeps distinct tiles", () => {
    expect(mergeLine([2, 4, 8, 16]).next).toEqual([2, 4, 8, 16]);
  });
});

describe("moveLeft", () => {
  it("returns moved false when unchanged", () => {
    const b = [
      [2, 4, 8, 16],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { moved, gained } = moveLeft(b);
    expect(moved).toBe(false);
    expect(gained).toBe(0);
  });

  it("slides and merges", () => {
    const b = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { board, moved, gained } = moveLeft(b);
    expect(moved).toBe(true);
    expect(gained).toBe(4);
    expect(board[0]).toEqual([4, 0, 0, 0]);
  });
});

describe("move", () => {
  it("moves in all directions without throwing", () => {
    const b = [
      [2, 0, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 2, 0],
      [0, 0, 0, 2],
    ];
    for (const d of ["up", "down", "left", "right"] as const) {
      const { board } = move(b, d);
      expect(board).toHaveLength(GRID_SIZE);
      expect(board.every((r) => r.length === GRID_SIZE)).toBe(true);
    }
  });
});

describe("canMove", () => {
  it("is false on full board with no merges", () => {
    const b = [
      [2, 4, 8, 16],
      [4, 8, 16, 2],
      [8, 16, 2, 4],
      [16, 2, 4, 8],
    ];
    expect(canMove(b)).toBe(false);
  });

  it("is true with empty cell", () => {
    const b = emptyBoard();
    b[0][0] = 2;
    expect(canMove(b)).toBe(true);
  });
});

describe("addRandomTile", () => {
  it("adds exactly one tile", () => {
    const b = emptyBoard();
    const next = addRandomTile(b);
    const before = b.flat().filter((x) => x !== 0).length;
    const after = next.flat().filter((x) => x !== 0).length;
    expect(after).toBe(before + 1);
    const vals = next.flat().filter((x) => x !== 0);
    expect(vals.every((v) => v === 2 || v === 4)).toBe(true);
  });
});

describe("maxTile", () => {
  it("finds maximum", () => {
    expect(
      maxTile([
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
    ).toBe(16);
  });
});

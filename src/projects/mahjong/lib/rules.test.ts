import { describe, expect, it } from "vitest";
import type { BoardTile } from "./types";
import {
  hasMatchingFreePair,
  isCovered,
  isTileFree,
} from "./rules";

function T(
  id: string,
  kind: BoardTile["kind"],
  z: number,
  x: number,
  y: number,
): BoardTile {
  return { id, kind, z, x, y };
}

describe("isCovered", () => {
  it("is true when another tile sits above same cell", () => {
    const base = T("a", "b1", 0, 2, 2);
    const top = T("b", "b2", 1, 2, 2);
    expect(isCovered(base, [base, top])).toBe(true);
    expect(isCovered(top, [base, top])).toBe(false);
  });
});

describe("isTileFree", () => {
  it("allows tile with no left neighbor", () => {
    const t = T("a", "b1", 0, 0, 1);
    const right = T("b", "b2", 0, 1, 1);
    expect(isTileFree(t, [t, right])).toBe(true);
  });

  it("blocks when sandwiched on same row and layer", () => {
    const L = T("L", "b1", 0, 1, 1);
    const M = T("M", "b2", 0, 2, 1);
    const R = T("R", "b3", 0, 3, 1);
    expect(isTileFree(M, [L, M, R])).toBe(false);
  });

  it("is false when covered", () => {
    const low = T("a", "b1", 0, 2, 2);
    const high = T("b", "b2", 3, 2, 2);
    expect(isTileFree(low, [low, high])).toBe(false);
  });
});

describe("hasMatchingFreePair", () => {
  it("detects two free matching tiles", () => {
    const a = T("a", "d4", 0, 0, 0);
    const b = T("b", "d4", 0, 4, 0);
    expect(hasMatchingFreePair([a, b])).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { isStandardWin, isWinWithTile } from "./winningHand";

/** Helper: bamboo 1-9 are 0-8 */
const b = (n: number) => n - 1;
const c = (n: number) => 8 + n;
const d = (n: number) => 17 + n;
describe("isStandardWin", () => {
  it("accepts four chows + pair (sample)", () => {
    const tiles = [
      b(1),
      b(2),
      b(3),
      b(4),
      b(5),
      b(6),
      b(7),
      b(8),
      b(9),
      d(1),
      d(1),
      d(1),
      c(5),
      c(5),
    ];
    expect(isStandardWin(tiles)).toBe(true);
  });

  it("accepts four pungs + pair", () => {
    const tiles = [
      ...Array(3).fill(b(1)),
      ...Array(3).fill(b(2)),
      ...Array(3).fill(b(3)),
      ...Array(3).fill(b(4)),
      b(5),
      b(5),
    ];
    expect(tiles.length).toBe(14);
    expect(isStandardWin(tiles)).toBe(true);
  });

  it("rejects 13 tiles", () => {
    expect(isStandardWin(Array(13).fill(0))).toBe(false);
  });

  it("rejects unrelated fourteen tiles", () => {
    expect(isStandardWin([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])).toBe(
      false,
    );
  });
});

describe("isWinWithTile", () => {
  it("detects ron tile completing hand", () => {
    const hand13 = [
      b(1),
      b(2),
      b(3),
      b(4),
      b(5),
      b(6),
      b(7),
      b(8),
      b(9),
      d(1),
      d(1),
      d(1),
      c(5),
    ];
    expect(isWinWithTile(hand13, c(5))).toBe(true);
  });
});

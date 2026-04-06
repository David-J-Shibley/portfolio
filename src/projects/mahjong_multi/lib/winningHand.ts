import { TILE_TYPES } from "./tileSet";

/** Multiset 0..33 from tile list (length 13 or 14). */
export function toCounts(tiles: number[]): number[] {
  const c = new Array(TILE_TYPES).fill(0);
  for (const t of tiles) {
    if (t >= 0 && t < TILE_TYPES) c[t] = (c[t] ?? 0) + 1;
  }
  return c;
}

function cloneCounts(c: number[]): number[] {
  return [...c];
}

/** Can `counts` (sum 3×groupsLeft) be partitioned into triplets and suited sequences? */
function canFormMelds(counts: number[], groupsLeft: number): boolean {
  if (groupsLeft === 0) return counts.every((x) => x === 0);

  const i = counts.findIndex((x) => x > 0);
  if (i === -1) return groupsLeft === 0;

  const c = cloneCounts(counts);

  if (c[i]! >= 3) {
    c[i]! -= 3;
    if (canFormMelds(c, groupsLeft - 1)) return true;
    c[i]! += 3;
  }

  if (i < 27 && i % 9 <= 6) {
    if (c[i]! >= 1 && c[i + 1]! >= 1 && c[i + 2]! >= 1) {
      c[i]!--;
      c[i + 1]!--;
      c[i + 2]!--;
      if (canFormMelds(c, groupsLeft - 1)) return true;
    }
  }

  return false;
}

/**
 * Standard winning hand: 4 groups (pung or chow) + 1 pair, 14 tiles.
 * Honors (winds/dragons) only form pungs, not sequences.
 */
export function isStandardWin(tiles: number[]): boolean {
  if (tiles.length !== 14) return false;
  const counts = toCounts(tiles);
  const sum = counts.reduce((a, b) => a + b, 0);
  if (sum !== 14) return false;

  for (let pair = 0; pair < TILE_TYPES; pair++) {
    if (counts[pair]! < 2) continue;
    const c = cloneCounts(counts);
    c[pair]! -= 2;
    if (canFormMelds(c, 4)) return true;
  }
  return false;
}

/** 13 tiles + one candidate tile (for ron / tenpai check). */
export function isWinWithTile(hand13: number[], drawn: number): boolean {
  return isStandardWin([...hand13, drawn]);
}

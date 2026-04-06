/** 34 tile types × 4 = 136 (riichi-style set, no flowers). */
export const TILE_TYPES = 34;
export const TILES_IN_WALL = 136;

/** 0–8 bamboo, 9–17 characters, 18–26 dots, 27–30 ESWN, 31–33 dragons. */
export function tileLabel(idx: number): string {
  if (idx < 0 || idx >= TILE_TYPES) return "?";
  if (idx < 9) return `${idx + 1}b`;
  if (idx < 18) return `${idx - 8}c`;
  if (idx < 27) return `${idx - 17}d`;
  if (idx === 27) return "E";
  if (idx === 28) return "S";
  if (idx === 29) return "W";
  if (idx === 30) return "N";
  if (idx === 31) return "Wh";
  if (idx === 32) return "Gr";
  return "Rd";
}

export type TileTone = "bamboo" | "character" | "dot" | "honor";

/** Short category + main glyph for on-tile layout. */
export function tileFaceParts(idx: number): {
  category: string;
  main: string;
  tone: TileTone;
} {
  if (idx < 0 || idx >= TILE_TYPES) {
    return { category: "", main: "?", tone: "honor" };
  }
  if (idx < 9) {
    return { category: "Bamboo", main: String(idx + 1), tone: "bamboo" };
  }
  if (idx < 18) {
    return { category: "Chars", main: String(idx - 8), tone: "character" };
  }
  if (idx < 27) {
    return { category: "Dots", main: String(idx - 17), tone: "dot" };
  }
  const winds = ["East", "South", "West", "North"] as const;
  if (idx < 31) {
    return { category: "Wind", main: winds[idx - 27]!, tone: "honor" };
  }
  const dragons = ["White", "Green", "Red"] as const;
  return { category: "Dragon", main: dragons[idx - 31]!, tone: "honor" };
}

/** Spoken label for buttons / screen readers. */
export function tileAriaDescription(idx: number): string {
  if (idx < 0 || idx >= TILE_TYPES) return "Unknown tile";
  if (idx < 9) return `${idx + 1} of bamboo`;
  if (idx < 18) return `${idx - 8} of characters`;
  if (idx < 27) return `${idx - 17} of dots`;
  if (idx === 27) return "East wind";
  if (idx === 28) return "South wind";
  if (idx === 29) return "West wind";
  if (idx === 30) return "North wind";
  if (idx === 31) return "White dragon";
  if (idx === 32) return "Green dragon";
  return "Red dragon";
}

export function createWall(): number[] {
  const wall: number[] = [];
  for (let t = 0; t < TILE_TYPES; t++) {
    for (let k = 0; k < 4; k++) wall.push(t);
  }
  return wall;
}

export function shuffleWall(wall: number[]): number[] {
  const a = [...wall];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Build hands: dealer (0) gets 14, others 13. Returns { hands, wall }. */
export function deal(wall: number[]): {
  hands: number[][];
  wall: number[];
} {
  const w = [...wall];
  const hands: number[][] = [[], [], [], []];
  let i = 0;
  for (let p = 0; p < 4; p++) {
    const n = p === 0 ? 14 : 13;
    for (let k = 0; k < n; k++) {
      hands[p]!.push(w[i]!);
      i++;
    }
  }
  for (let p = 0; p < 4; p++) {
    hands[p]!.sort((a, b) => a - b);
  }
  return { hands, wall: w.slice(i) };
}

import type { Card, Rank } from "@/projects/card_games/lib/cards";

/** Ace high; wheel uses ace as 1 only inside straight detection. */
export function pokerRankHigh(rank: Rank): number {
  if (rank === "A") return 14;
  if (rank === "K") return 13;
  if (rank === "Q") return 12;
  if (rank === "J") return 11;
  if (rank === "10") return 10;
  return Number.parseInt(rank, 10);
}

/** Lexicographic score — compare element-wise, higher wins. */
export type HandScore = readonly number[];

export type NamedHand = {
  name: string;
  score: HandScore;
};

const CAT_HIGH = 0;
const CAT_PAIR = 1;
const CAT_TWO_PAIR = 2;
const CAT_TRIPS = 3;
const CAT_STRAIGHT = 4;
const CAT_FLUSH = 5;
const CAT_FULL = 6;
const CAT_QUADS = 7;
const CAT_STRAIGHT_FLUSH = 8;

function combinations5<T>(items: T[]): T[][] {
  const out: T[][] = [];
  const cur: T[] = [];
  function rec(i: number) {
    if (cur.length === 5) {
      out.push([...cur]);
      return;
    }
    for (let j = i; j < items.length; j++) {
      cur.push(items[j]!);
      rec(j + 1);
      cur.pop();
    }
  }
  rec(0);
  return out;
}

function countRanks(ranks: number[]): Map<number, number> {
  const m = new Map<number, number>();
  for (const r of ranks) m.set(r, (m.get(r) ?? 0) + 1);
  return m;
}

/** Unique sorted descending. */
function uniqSortDesc(ranks: number[]): number[] {
  return [...new Set(ranks)].sort((a, b) => b - a);
}

/** Highest straight top card, or null. Wheel = 5 (not 14). */
function straightTop(ranks: number[]): number | null {
  const u = uniqSortDesc(ranks);
  const set = new Set(u);
  if (set.has(14) && set.has(2) && set.has(3) && set.has(4) && set.has(5)) {
    return 5;
  }
  for (let i = 0; i <= u.length - 5; i++) {
    let ok = true;
    for (let k = 0; k < 4; k++) {
      if (u[i + k]! !== u[i + k + 1]! + 1) ok = false;
    }
    if (ok) return u[i]!;
  }
  return null;
}

function isFlush(cards: Card[]): boolean {
  const s = cards[0]!.suit;
  return cards.every((c) => c.suit === s);
}

function evaluate5(cards: Card[]): NamedHand {
  const ranks = cards.map((c) => pokerRankHigh(c.rank));
  const freq = countRanks(ranks);
  const byCount = [...freq.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return b[0] - a[0];
  });

  const flush = isFlush(cards);
  const st = straightTop(ranks);

  if (flush && st !== null) {
    const name =
      st === 14 ? "Royal flush" : `Straight flush, ${rankName(st)} high`;
    return { name, score: [CAT_STRAIGHT_FLUSH, st] };
  }

  if (byCount[0]![1] === 4) {
    const quad = byCount[0]![0];
    const kicker = byCount[1]![0];
    return {
      name: `Four of a kind, ${rankName(quad)}`,
      score: [CAT_QUADS, quad, kicker],
    };
  }

  if (byCount[0]![1] === 3 && byCount[1]![1] === 2) {
    return {
      name: `Full house, ${rankName(byCount[0]![0])} full of ${rankName(byCount[1]![0])}`,
      score: [CAT_FULL, byCount[0]![0], byCount[1]![0]],
    };
  }

  if (flush) {
    const sorted = [...ranks].sort((a, b) => b - a);
    return {
      name: `Flush, ${rankName(sorted[0]!)} high`,
      score: [CAT_FLUSH, ...sorted],
    };
  }

  if (st !== null) {
    return {
      name: `Straight, ${rankName(st)} high`,
      score: [CAT_STRAIGHT, st],
    };
  }

  if (byCount[0]![1] === 3) {
    const t = byCount[0]![0];
    const kickers = byCount
      .slice(1)
      .map((x) => x[0])
      .sort((a, b) => b - a);
    return {
      name: `Three of a kind, ${rankName(t)}`,
      score: [CAT_TRIPS, t, ...kickers],
    };
  }

  if (byCount[0]![1] === 2 && byCount[1]![1] === 2) {
    const hi = Math.max(byCount[0]![0], byCount[1]![0]);
    const lo = Math.min(byCount[0]![0], byCount[1]![0]);
    const kicker = byCount[2]![0];
    return {
      name: `Two pair, ${rankName(hi)} and ${rankName(lo)}`,
      score: [CAT_TWO_PAIR, hi, lo, kicker],
    };
  }

  if (byCount[0]![1] === 2) {
    const p = byCount[0]![0];
    const kickers = byCount
      .slice(1)
      .map((x) => x[0])
      .sort((a, b) => b - a);
    return {
      name: `Pair of ${rankName(p)}`,
      score: [CAT_PAIR, p, ...kickers],
    };
  }

  const sorted = [...ranks].sort((a, b) => b - a);
  return {
    name: `High card, ${rankName(sorted[0]!)}`,
    score: [CAT_HIGH, ...sorted],
  };
}

function rankName(r: number): string {
  if (r === 14) return "Ace";
  if (r === 13) return "King";
  if (r === 12) return "Queen";
  if (r === 11) return "Jack";
  if (r === 10) return "Ten";
  return String(r);
}

export function bestHand7(cards: Card[]): NamedHand {
  if (cards.length < 5) {
    return { name: "Incomplete", score: [CAT_HIGH, 0] };
  }
  const combs = combinations5(cards);
  let best = evaluate5(combs[0]!);
  for (let i = 1; i < combs.length; i++) {
    const h = evaluate5(combs[i]!);
    if (compareScores(h.score, best.score) > 0) best = h;
  }
  return best;
}

/** Positive if a wins, negative if b wins, 0 tie. */
export function compareScores(a: HandScore, b: HandScore): number {
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

export function compareNamedHands(a: NamedHand, b: NamedHand): number {
  return compareScores(a.score, b.score);
}

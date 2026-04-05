import { describe, expect, it } from "vitest";
import {
  compareWarRanks,
  createDeck,
  handTotal,
  isNaturalBlackjack,
  shuffle,
  type Card,
} from "./cards";

describe("createDeck", () => {
  it("has 52 unique cards", () => {
    const d = createDeck();
    expect(d).toHaveLength(52);
    const keys = new Set(d.map((c) => `${c.rank}${c.suit}`));
    expect(keys.size).toBe(52);
  });
});

describe("shuffle", () => {
  it("preserves length and multiset", () => {
    const d = createDeck();
    let i = 0;
    const rng = () => {
      i = (i * 9301 + 49297) % 233280;
      return i / 233280;
    };
    const s = shuffle(d, rng);
    expect(s).toHaveLength(52);
    const count = (arr: Card[], r: string, suit: string) =>
      arr.filter((c) => c.rank === r && c.suit === suit).length;
    expect(count(s, "A", "H")).toBe(1);
  });
});

describe("handTotal", () => {
  it("counts aces soft then hard", () => {
    const ace: Card = { rank: "A", suit: "S" };
    const nine: Card = { rank: "9", suit: "H" };
    const five: Card = { rank: "5", suit: "C" };
    expect(handTotal([ace, nine])).toBe(20);
    expect(handTotal([ace, nine, five])).toBe(15);
  });

  it("detects natural blackjack", () => {
    const cards: Card[] = [
      { rank: "A", suit: "H" },
      { rank: "K", suit: "D" },
    ];
    expect(isNaturalBlackjack(cards)).toBe(true);
  });
});

describe("compareWarRanks", () => {
  it("ace beats king", () => {
    expect(compareWarRanks("A", "K")).toBeGreaterThan(0);
  });
  it("two loses to three", () => {
    expect(compareWarRanks("2", "3")).toBeLessThan(0);
  });
});

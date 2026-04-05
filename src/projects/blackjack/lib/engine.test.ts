import { describe, expect, it } from "vitest";
import type { Card } from "@/projects/card_games/lib/cards";
import { dealerDraws, settleRegular } from "./engine";

describe("dealerDraws", () => {
  it("hits on 16, stands on 17", () => {
    const dealer: Card[] = [
      { rank: "10", suit: "H" },
      { rank: "6", suit: "C" },
    ];
    const shoe: Card[] = [{ rank: "5", suit: "S" }];
    const { dealer: d } = dealerDraws(shoe, dealer);
    expect(d).toHaveLength(3);
  });

  it("stands on hard 17", () => {
    const dealer: Card[] = [
      { rank: "10", suit: "H" },
      { rank: "7", suit: "C" },
    ];
    const shoe: Card[] = [{ rank: "A", suit: "S" }];
    const { dealer: d } = dealerDraws(shoe, dealer);
    expect(d).toHaveLength(2);
  });
});

describe("settleRegular", () => {
  it("pays double on dealer bust", () => {
    const p: Card[] = [
      { rank: "10", suit: "H" },
      { rank: "8", suit: "C" },
    ];
    const d: Card[] = [
      { rank: "10", suit: "D" },
      { rank: "6", suit: "S" },
      { rank: "K", suit: "C" },
    ];
    const r = settleRegular(p, d, 10);
    expect(r.delta).toBe(20);
  });
});

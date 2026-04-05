import { describe, expect, it } from "vitest";
import type { Card } from "@/projects/card_games/lib/cards";
import { bestHand7, compareNamedHands } from "./handEvaluator";

function c(rank: Card["rank"], suit: Card["suit"]): Card {
  return { rank, suit };
}

describe("bestHand7", () => {
  it("finds best pair from seven", () => {
    const cards: Card[] = [
      c("2", "H"),
      c("2", "D"),
      c("3", "C"),
      c("4", "S"),
      c("6", "H"),
      c("K", "C"),
      c("A", "D"),
    ];
    const h = bestHand7(cards);
    expect(h.name).toContain("Pair");
    expect(h.score[0]).toBe(1);
  });

  it("full house beats flush", () => {
    const fh: Card[] = [
      c("K", "H"),
      c("K", "D"),
      c("K", "C"),
      c("7", "S"),
      c("7", "H"),
    ];
    const fl: Card[] = [
      c("2", "S"),
      c("5", "S"),
      c("8", "S"),
      c("J", "S"),
      c("A", "S"),
    ];
    expect(compareNamedHands(bestHand7(fh), bestHand7(fl))).toBeGreaterThan(0);
  });

  it("wheel straight", () => {
    const wheel: Card[] = [
      c("A", "H"),
      c("2", "D"),
      c("3", "C"),
      c("4", "S"),
      c("5", "H"),
    ];
    const h = bestHand7(wheel);
    expect(h.name).toContain("Straight");
    expect(h.score[1]).toBe(5);
  });
});

import { describe, expect, it } from "vitest";
import type { Card } from "@/projects/card_games/lib/cards";
import { canPlayCard, removeCard } from "./engine";

const c = (rank: Card["rank"], suit: Card["suit"]): Card => ({ rank, suit });

describe("canPlayCard", () => {
  it("matches rank or suit", () => {
    expect(canPlayCard(c("7", "H"), c("7", "C"), null)).toBe(true);
    expect(canPlayCard(c("5", "H"), c("K", "H"), null)).toBe(true);
    expect(canPlayCard(c("5", "D"), c("K", "H"), null)).toBe(false);
  });

  it("8 is always wild", () => {
    expect(canPlayCard(c("8", "D"), c("K", "H"), null)).toBe(true);
  });

  it("after 8, must match declared suit unless playing 8", () => {
    expect(canPlayCard(c("5", "H"), c("8", "D"), "H")).toBe(true);
    expect(canPlayCard(c("5", "D"), c("8", "C"), "H")).toBe(false);
    expect(canPlayCard(c("8", "S"), c("8", "C"), "H")).toBe(true);
  });
});

describe("removeCard", () => {
  it("removes by identity", () => {
    const a = c("A", "H");
    const b = c("K", "S");
    expect(removeCard([a, b], a)).toEqual([b]);
  });
});

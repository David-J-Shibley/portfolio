import { describe, expect, it } from "vitest";
import { resolveGuess } from "./hilo";
import type { Card } from "@/projects/card_games/lib/cards";

const c = (rank: Card["rank"], suit: Card["suit"] = "H"): Card => ({
  rank,
  suit,
});

describe("resolveGuess", () => {
  it("detects higher correctly", () => {
    expect(resolveGuess(c("5"), c("K"), "higher")).toBe("correct");
    expect(resolveGuess(c("K"), c("5"), "higher")).toBe("wrong");
  });

  it("detects lower correctly", () => {
    expect(resolveGuess(c("Q"), c("3"), "lower")).toBe("correct");
    expect(resolveGuess(c("3"), c("Q"), "lower")).toBe("wrong");
  });

  it("push on same rank", () => {
    expect(resolveGuess(c("7", "H"), c("7", "C"), "higher")).toBe("push");
  });
});

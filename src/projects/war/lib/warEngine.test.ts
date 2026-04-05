import { describe, expect, it } from "vitest";
import type { Card } from "@/projects/card_games/lib/cards";
import { playWarRound } from "./warEngine";

describe("playWarRound", () => {
  it("higher rank wins the pot", () => {
    const player: Card[] = [{ rank: "K", suit: "H" }];
    const cpu: Card[] = [{ rank: "7", suit: "C" }];
    const r = playWarRound(player, cpu);
    expect(r.kind).toBe("round");
    if (r.kind === "round") {
      expect(r.winner).toBe("player");
      expect(r.player).toHaveLength(2);
      expect(r.cpu).toHaveLength(0);
    }
  });

  it("ends when one side is empty", () => {
    const player: Card[] = [];
    const cpu: Card[] = [{ rank: "2", suit: "H" }];
    const r = playWarRound(player, cpu);
    expect(r.kind).toBe("gameover");
    if (r.kind === "gameover") expect(r.winner).toBe("cpu");
  });
});

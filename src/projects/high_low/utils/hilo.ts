import { warRankValue, type Card, type Rank } from "@/projects/card_games/lib/cards";

export type HiLoGuess = "higher" | "lower";

export function compareRanks(a: Rank, b: Rank): number {
  return warRankValue(a) - warRankValue(b);
}

/** Outcome of revealing `next` after `current` for a guess. Ties are a push. */
export function resolveGuess(
  current: Card,
  next: Card,
  guess: HiLoGuess,
): "correct" | "wrong" | "push" {
  const cmp = compareRanks(next.rank, current.rank);
  if (cmp === 0) return "push";
  if (guess === "higher") return cmp > 0 ? "correct" : "wrong";
  return cmp < 0 ? "correct" : "wrong";
}

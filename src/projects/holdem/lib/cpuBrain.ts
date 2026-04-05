import type { Card } from "@/projects/card_games/lib/cards";
import { bestHand7, pokerRankHigh } from "./handEvaluator";

export type CpuChoice = "fold" | "check" | "call" | "raise";

function preflopStrength(hole: Card[]): number {
  const [a, b] = [pokerRankHigh(hole[0]!.rank), pokerRankHigh(hole[1]!.rank)];
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  const pair = a === b ? 0.22 + hi / 200 : 0;
  const suited = hole[0]!.suit === hole[1]!.suit ? 0.06 : 0;
  return Math.min(0.92, 0.28 + pair + suited + (hi + lo) / 90);
}

function boardStrength(hole: Card[], board: Card[]): number {
  const h = bestHand7([...hole, ...board]);
  const cat = h.score[0]!;
  const k = h.score[1] ?? 0;
  return Math.min(0.97, cat / 9 + k / 200);
}

function strength(hole: Card[], board: Card[]): number {
  if (board.length === 0) return preflopStrength(hole);
  return boardStrength(hole, board);
}

export function cpuPickAction(input: {
  hole: Card[];
  board: Card[];
  toCall: number;
  pot: number;
  stack: number;
  minRaiseTotal: number;
  currentMaxStreet: number;
  myStreet: number;
}): CpuChoice {
  const { hole, board, toCall, pot, stack, minRaiseTotal, currentMaxStreet, myStreet } =
    input;
  const str = strength(hole, board);
  const r = Math.random();

  if (toCall === 0) {
    if (str > 0.58 && r < 0.22 && stack >= minRaiseTotal - myStreet) {
      return "raise";
    }
    return "check";
  }

  const callCost = toCall;
  if (callCost > stack) {
    return stack > 0 ? "call" : "fold";
  }

  if (str < 0.36 && r < 0.62) return "fold";
  if (
    str > 0.64 &&
    r < 0.32 &&
    stack >= minRaiseTotal - myStreet &&
    minRaiseTotal > currentMaxStreet
  ) {
    return "raise";
  }
  if (str < 0.42 && callCost > pot * 0.45 && r < 0.4) return "fold";
  return "call";
}

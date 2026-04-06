import { deal, shuffleWall, createWall } from "./tileSet";
import { isStandardWin, isWinWithTile } from "./winningHand";

export const SEAT_NAMES = ["East", "South", "West", "North"] as const;

export type GameResult =
  | null
  | { type: "tsumo"; winner: number }
  | { type: "ron"; winner: number; discarder: number }
  | { type: "exhaustive" };

export type Phase =
  | { type: "must_discard"; player: number }
  | { type: "ready_to_draw"; player: number }
  | { type: "finished" };

export type GameState = {
  hands: number[][];
  wall: number[];
  discards: { player: number; tile: number }[];
  lastDiscard: { player: number; tile: number } | null;
  phase: Phase;
  result: GameResult;
};

function findRonWinner(
  hands: number[][],
  discard: number,
  discarder: number,
): number | null {
  const order = [1, 2, 3].map((k) => (discarder + k) % 4);
  for (const p of order) {
    if (isWinWithTile(hands[p]!, discard)) return p;
  }
  return null;
}

export function initialState(): GameState {
  const wall = shuffleWall(createWall());
  const { hands, wall: remainder } = deal(wall);
  return {
    hands,
    wall: remainder,
    discards: [],
    lastDiscard: null,
    phase: { type: "must_discard", player: 0 },
    result: null,
  };
}

/**
 * Remove tile at `handIndex` from current player's hand (sorted order).
 */
export function discardTile(state: GameState, handIndex: number): GameState {
  if (state.phase.type !== "must_discard") return state;
  const p = state.phase.player;
  const hand = [...state.hands[p]!];
  if (handIndex < 0 || handIndex >= hand.length) return state;
  const tile = hand.splice(handIndex, 1)[0]!;
  hand.sort((a, b) => a - b);
  const hands = state.hands.map((h, i) => (i === p ? hand : h));
  const discards = [...state.discards, { player: p, tile }];
  const lastDiscard = { player: p, tile };

  const ronWinner = findRonWinner(hands, tile, p);
  if (ronWinner !== null) {
    return {
      ...state,
      hands,
      discards,
      lastDiscard,
      phase: { type: "finished" },
      result: { type: "ron", winner: ronWinner, discarder: p },
    };
  }

  const next = (p + 1) % 4;
  if (state.wall.length === 0) {
    return {
      ...state,
      hands,
      discards,
      lastDiscard,
      phase: { type: "finished" },
      result: { type: "exhaustive" },
    };
  }

  return {
    ...state,
    hands,
    discards,
    lastDiscard,
    phase: { type: "ready_to_draw", player: next },
    result: null,
  };
}

/** Draw one tile from wall tail for `ready_to_draw` player. */
export function drawFromWall(state: GameState): GameState {
  if (state.phase.type !== "ready_to_draw") return state;
  const p = state.phase.player;
  if (state.wall.length === 0) {
    return {
      ...state,
      phase: { type: "finished" },
      result: { type: "exhaustive" },
    };
  }
  const tile = state.wall[state.wall.length - 1]!;
  const wall = state.wall.slice(0, -1);
  const hand = [...state.hands[p]!, tile].sort((a, b) => a - b);
  const hands = state.hands.map((h, i) => (i === p ? hand : h));

  if (isStandardWin(hand)) {
    return {
      ...state,
      hands,
      wall,
      phase: { type: "finished" },
      result: { type: "tsumo", winner: p },
    };
  }

  return {
    ...state,
    hands,
    wall,
    phase: { type: "must_discard", player: p },
    result: null,
  };
}

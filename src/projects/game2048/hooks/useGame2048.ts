import { useCallback, useEffect, useReducer, useState } from "react";
import {
  addRandomTile,
  canMove,
  initialBoard,
  maxTile,
  move,
  type Board,
  type Direction,
  WIN_VALUE,
} from "../utils/game2048";

const BEST_KEY = "portfolio-2048-best";

function loadBest(): number {
  try {
    const v = localStorage.getItem(BEST_KEY);
    if (!v) return 0;
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function saveBest(n: number) {
  localStorage.setItem(BEST_KEY, String(n));
}

type GameState = {
  board: Board;
  score: number;
  gameOver: boolean;
  wonOverlay: boolean;
  continueAfterWin: boolean;
};

function freshGame(): GameState {
  return {
    board: initialBoard(),
    score: 0,
    gameOver: false,
    wonOverlay: false,
    continueAfterWin: false,
  };
}

type Action =
  | { type: "move"; dir: Direction }
  | { type: "new" }
  | { type: "dismissWin" };

function reducer(state: GameState, action: Action): GameState {
  if (action.type === "new") {
    return freshGame();
  }
  if (action.type === "dismissWin") {
    return { ...state, wonOverlay: false, continueAfterWin: true };
  }
  if (action.type === "move") {
    if (state.gameOver) return state;
    const { board: next, gained, moved } = move(state.board, action.dir);
    if (!moved) return state;
    const withTile = addRandomTile(next);
    const score = state.score + gained;
    const gameOver = !canMove(withTile);
    let { wonOverlay, continueAfterWin } = state;
    if (
      !continueAfterWin &&
      maxTile(withTile) >= WIN_VALUE &&
      !wonOverlay
    ) {
      wonOverlay = true;
    }
    return {
      board: withTile,
      score,
      gameOver,
      wonOverlay,
      continueAfterWin,
    };
  }
  return state;
}

export function useGame2048() {
  const [best, setBest] = useState(loadBest);
  const [state, dispatch] = useReducer(reducer, undefined, freshGame);

  useEffect(() => {
    setBest((b) => {
      if (state.score > b) {
        saveBest(state.score);
        return state.score;
      }
      return b;
    });
  }, [state.score]);

  const tryMove = useCallback((dir: Direction) => {
    dispatch({ type: "move", dir });
  }, []);

  const newGame = useCallback(() => {
    dispatch({ type: "new" });
  }, []);

  const dismissWin = useCallback(() => {
    dispatch({ type: "dismissWin" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toLowerCase();
      const map: Record<string, Direction> = {
        arrowup: "up",
        arrowdown: "down",
        arrowleft: "left",
        arrowright: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const dir = map[key];
      if (!dir) return;
      e.preventDefault();
      dispatch({ type: "move", dir });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return {
    board: state.board,
    score: state.score,
    best,
    gameOver: state.gameOver,
    won: state.wonOverlay,
    tryMove,
    newGame,
    dismissWin,
    keepPlaying: state.continueAfterWin,
  };
}

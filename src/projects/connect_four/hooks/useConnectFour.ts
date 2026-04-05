import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  dropPiece,
  emptyBoard,
  isBoardFull,
  pickAiColumn,
  type Board,
  winnerOf,
} from "../utils/connectFour";

export type ConnectMode = "pvp" | "ai";

type State = {
  board: Board;
  current: 1 | 2;
  winner: 0 | 1 | 2;
  draw: boolean;
  mode: ConnectMode;
};

function fresh(mode: ConnectMode): State {
  return {
    board: emptyBoard(),
    current: 1,
    winner: 0,
    draw: false,
    mode,
  };
}

type Action =
  | { type: "play"; col: number }
  | { type: "reset" }
  | { type: "setMode"; mode: ConnectMode };

function reducer(state: State, action: Action): State {
  if (action.type === "setMode") {
    return fresh(action.mode);
  }
  if (action.type === "reset") {
    return fresh(state.mode);
  }
  if (action.type === "play") {
    if (state.winner !== 0 || state.draw) return state;
    const next = dropPiece(state.board, action.col, state.current);
    if (!next) return state;
    const w = winnerOf(next);
    if (w !== 0) {
      return { ...state, board: next, winner: w };
    }
    if (isBoardFull(next)) {
      return { ...state, board: next, draw: true };
    }
    return {
      ...state,
      board: next,
      current: state.current === 1 ? 2 : 1,
    };
  }
  return state;
}

export function useConnectFour() {
  const [state, dispatch] = useReducer(reducer, undefined, () => fresh("pvp"));
  const stateRef = useRef(state);
  stateRef.current = state;

  const play = useCallback((col: number) => {
    dispatch({ type: "play", col });
  }, []);

  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const setMode = useCallback((mode: ConnectMode) => {
    dispatch({ type: "setMode", mode });
  }, []);

  useEffect(() => {
    if (state.mode !== "ai") return;
    if (state.current !== 2) return;
    if (state.winner !== 0 || state.draw) return;

    const id = window.setTimeout(() => {
      const s = stateRef.current;
      if (s.mode !== "ai" || s.current !== 2 || s.winner !== 0 || s.draw) {
        return;
      }
      const col = pickAiColumn(s.board);
      dispatch({ type: "play", col });
    }, 420);

    return () => clearTimeout(id);
  }, [state.board, state.current, state.draw, state.mode, state.winner]);

  const aiThinking =
    state.mode === "ai" &&
    state.current === 2 &&
    state.winner === 0 &&
    !state.draw;

  return {
    board: state.board,
    current: state.current,
    winner: state.winner,
    draw: state.draw,
    mode: state.mode,
    setMode,
    play,
    reset,
    aiThinking,
  };
}

import { useCallback, useReducer } from "react";
import {
  checkWin,
  chordCell,
  type DifficultyId,
  DIFFICULTIES,
  emptyBoard,
  minesToBoard,
  placeMines,
  revealAllMines,
  revealCell,
  type Board,
  type GameStatus,
  toggleFlag,
} from "../utils/minesweeper";

type State = {
  difficulty: DifficultyId;
  board: Board;
  started: boolean;
  status: GameStatus;
};

function init(difficulty: DifficultyId): State {
  const { rows, cols } = DIFFICULTIES[difficulty];
  return {
    difficulty,
    board: emptyBoard(rows, cols),
    started: false,
    status: "playing",
  };
}

type Action =
  | { type: "newGame" }
  | { type: "setDifficulty"; difficulty: DifficultyId }
  | { type: "reveal"; r: number; c: number }
  | { type: "flag"; r: number; c: number }
  | { type: "chord"; r: number; c: number };

function reducer(state: State, action: Action): State {
  if (action.type === "setDifficulty") {
    return init(action.difficulty);
  }
  if (action.type === "newGame") {
    return init(state.difficulty);
  }

  if (state.status !== "playing") return state;

  const { rows, cols, mines } = DIFFICULTIES[state.difficulty];

  if (action.type === "flag") {
    if (!state.started) return state;
    const { r, c } = action;
    if (state.board[r][c].state === "revealed") return state;
    return { ...state, board: toggleFlag(state.board, r, c) };
  }

  if (action.type === "reveal") {
    const { r, c } = action;
    if (state.board[r][c].state === "flagged") return state;

    let board = state.board;
    let started = state.started;
    if (!started) {
      board = minesToBoard(placeMines(rows, cols, mines, r, c));
      started = true;
    }

    const { board: after, hitMine } = revealCell(board, r, c);
    if (hitMine) {
      return {
        ...state,
        board: revealAllMines(after),
        status: "lost",
        started,
      };
    }
    const status = checkWin(after) ? "won" : state.status;
    return { ...state, board: after, started, status };
  }

  if (action.type === "chord") {
    if (!state.started) return state;
    const { r, c } = action;
    const { board: after, hitMine } = chordCell(state.board, r, c);
    if (after === state.board) return state;
    if (hitMine) {
      return {
        ...state,
        board: revealAllMines(after),
        status: "lost",
      };
    }
    const status = checkWin(after) ? "won" : state.status;
    return { ...state, board: after, status };
  }

  return state;
}

export function useMinesweeper(initialDifficulty: DifficultyId = "beginner") {
  const [state, dispatch] = useReducer(reducer, initialDifficulty, init);

  const { rows, cols, mines: mineTotal } = DIFFICULTIES[state.difficulty];
  const flags = state.board.flat().filter((c) => c.state === "flagged").length;
  const minesRemaining = mineTotal - flags;

  const newGame = useCallback(() => dispatch({ type: "newGame" }), []);
  const setDifficulty = useCallback(
    (d: DifficultyId) => dispatch({ type: "setDifficulty", difficulty: d }),
    [],
  );
  const reveal = useCallback(
    (r: number, c: number) => dispatch({ type: "reveal", r, c }),
    [],
  );
  const flag = useCallback(
    (r: number, c: number) => dispatch({ type: "flag", r, c }),
    [],
  );
  const chord = useCallback(
    (r: number, c: number) => dispatch({ type: "chord", r, c }),
    [],
  );

  return {
    difficulty: state.difficulty,
    setDifficulty,
    board: state.board,
    status: state.status,
    started: state.started,
    mineTotal,
    minesRemaining,
    newGame,
    reveal,
    flag,
    chord,
    rows,
    cols,
  };
}

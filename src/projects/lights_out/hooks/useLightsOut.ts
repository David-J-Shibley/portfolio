import { useCallback, useState } from "react";
import { isSolved, randomPuzzle, toggleAt, type Board } from "../utils/lightsOut";

export function useLightsOut() {
  const [board, setBoard] = useState<Board>(() => randomPuzzle());
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const press = useCallback((r: number, c: number) => {
    if (won) return;
    setBoard((b) => {
      const next = toggleAt(b, r, c);
      if (isSolved(next)) {
        queueMicrotask(() => setWon(true));
      }
      return next;
    });
    setMoves((m) => m + 1);
  }, [won]);

  const newGame = useCallback(() => {
    setBoard(randomPuzzle());
    setMoves(0);
    setWon(false);
  }, []);

  const dismissWin = useCallback(() => {
    setWon(false);
    newGame();
  }, [newGame]);

  return { board, moves, won, press, newGame, dismissWin };
}

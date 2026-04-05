export const SIZE = 5;

export type Board = number[][];

export function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

export function cloneBoard(b: Board): Board {
  return b.map((row) => [...row]);
}

const DR = [-1, 1, 0, 0];
const DC = [0, 0, -1, 1];

/** Toggle cell (r,c) and four orthogonal neighbors. */
export function toggleAt(board: Board, r: number, c: number): Board {
  const next = cloneBoard(board);
  const flip = (y: number, x: number) => {
    if (y >= 0 && y < SIZE && x >= 0 && x < SIZE) {
      next[y][x] ^= 1;
    }
  };
  flip(r, c);
  for (let i = 0; i < 4; i++) {
    flip(r + DR[i], c + DC[i]);
  }
  return next;
}

export function isSolved(board: Board): boolean {
  return board.every((row) => row.every((v) => v === 0));
}

/** Scramble from solved state with random presses (always solvable). */
export function randomPuzzle(minPresses = 18, maxPresses = 35): Board {
  let b = emptyBoard();
  const n =
    minPresses +
    Math.floor(Math.random() * (maxPresses - minPresses + 1));
  for (let i = 0; i < n; i++) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    b = toggleAt(b, r, c);
  }
  if (isSolved(b)) {
    b = toggleAt(b, 0, 0);
  }
  return b;
}

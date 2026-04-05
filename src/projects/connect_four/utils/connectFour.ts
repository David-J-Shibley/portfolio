export const ROWS = 6;
export const COLS = 7;

/** 0 empty, 1 red (first player), 2 yellow (second). */
export type Cell = 0 | 1 | 2;
export type Board = Cell[][];

export function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function dropPiece(
  board: Board,
  col: number,
  player: 1 | 2,
): Board | null {
  if (col < 0 || col >= COLS) return null;
  const next = cloneBoard(board);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (next[r][col] === 0) {
      next[r][col] = player;
      return next;
    }
  }
  return null;
}

function lineLength(
  board: Board,
  r: number,
  c: number,
  dr: number,
  dc: number,
): number {
  const p = board[r][c];
  if (p === 0) return 0;
  let n = 1;
  for (let k = 1; k < COLS; k++) {
    const nr = r + dr * k;
    const nc = c + dc * k;
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break;
    if (board[nr][nc] !== p) break;
    n++;
  }
  for (let k = 1; k < COLS; k++) {
    const nr = r - dr * k;
    const nc = c - dc * k;
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break;
    if (board[nr][nc] !== p) break;
    n++;
  }
  return n;
}

const DIRS: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

/** Returns winning player 1 | 2, or 0 if none yet. */
export function winnerOf(board: Board): 0 | 1 | 2 {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === 0) continue;
      for (const [dr, dc] of DIRS) {
        if (lineLength(board, r, c, dr, dc) >= 4) {
          return board[r][c] as 1 | 2;
        }
      }
    }
  }
  return 0;
}

export function isBoardFull(board: Board): boolean {
  return board[0].every((cell) => cell !== 0);
}

/** Valid columns (0–6) that can accept a piece. */
export function validColumns(board: Board): number[] {
  const out: number[] = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === 0) out.push(c);
  }
  return out;
}

/** Pick a winning move if any, else block opponent win, else center bias + random. */
export function pickAiColumn(board: Board): number {
  const valid = validColumns(board);
  if (valid.length === 0) return 0;

  for (const col of valid) {
    const b = dropPiece(board, col, 2);
    if (b && winnerOf(b) === 2) return col;
  }
  for (const col of valid) {
    const b = dropPiece(board, col, 1);
    if (b && winnerOf(b) === 1) return col;
  }

  const prefs = [3, 2, 4, 1, 5, 0, 6];
  for (const c of prefs) {
    if (valid.includes(c)) return c;
  }
  return valid[0];
}

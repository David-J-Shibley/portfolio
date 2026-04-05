export type CellState = "hidden" | "revealed" | "flagged";

export type Cell = {
  isMine: boolean;
  adjacent: number;
  state: CellState;
};

export type Board = Cell[][];

export type GameStatus = "playing" | "won" | "lost";

export type DifficultyId = "beginner" | "intermediate" | "expert";

export const DIFFICULTIES: Record<
  DifficultyId,
  { rows: number; cols: number; mines: number; label: string }
> = {
  beginner: { rows: 9, cols: 9, mines: 10, label: "Beginner" },
  intermediate: { rows: 16, cols: 16, mines: 40, label: "Intermediate" },
  expert: { rows: 16, cols: 30, mines: 99, label: "Expert" },
};

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/** All cells in the 3×3 around (r,c) must stay mine-free (classic first-click rule). */
function isInSafeZone(
  r: number,
  c: number,
  safeR: number,
  safeC: number,
): boolean {
  return Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1;
}

function countAdjacentMines(
  mines: boolean[][],
  r: number,
  c: number,
  rows: number,
  cols: number,
): number {
  let n = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && mines[nr][nc]) {
        n++;
      }
    }
  }
  return n;
}

export function placeMines(
  rows: number,
  cols: number,
  mineCount: number,
  safeR: number,
  safeC: number,
): boolean[][] {
  const candidates: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!isInSafeZone(r, c, safeR, safeC)) {
        candidates.push([r, c]);
      }
    }
  }
  shuffleInPlace(candidates);
  const mines = Array.from({ length: rows }, () => Array(cols).fill(false));
  const n = Math.min(mineCount, candidates.length);
  for (let i = 0; i < n; i++) {
    const [r, c] = candidates[i];
    mines[r][c] = true;
  }
  return mines;
}

export function minesToBoard(mines: boolean[][]): Board {
  const rows = mines.length;
  const cols = mines[0].length;
  return mines.map((row, r) =>
    row.map((isMine, c) => ({
      isMine,
      adjacent: isMine ? 0 : countAdjacentMines(mines, r, c, rows, cols),
      state: "hidden" as CellState,
    })),
  );
}

/** Initial empty board before first click (mines unknown). */
export function emptyBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      adjacent: 0,
      state: "hidden" as CellState,
    })),
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

export function revealCell(
  board: Board,
  r: number,
  c: number,
): { board: Board; hitMine: boolean } {
  const rows = board.length;
  const cols = board[0].length;
  const next = cloneBoard(board);
  const cell = next[r][c];
  if (cell.state !== "hidden") {
    return { board: next, hitMine: false };
  }
  if (cell.isMine) {
    cell.state = "revealed";
    return { board: next, hitMine: true };
  }

  const stack: [number, number][] = [[r, c]];
  const seen = new Set<string>();

  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    const key = `${cr},${cc}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const cur = next[cr][cc];
    if (cur.state === "flagged") continue;
    if (cur.isMine) continue;
    cur.state = "revealed";
    if (cur.adjacent === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = cr + dr;
          const nc = cc + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const neighbor = next[nr][nc];
            if (neighbor.state === "hidden" && !neighbor.isMine) {
              stack.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  return { board: next, hitMine: false };
}

export function toggleFlag(board: Board, r: number, c: number): Board {
  const next = cloneBoard(board);
  const cell = next[r][c];
  if (cell.state === "revealed") return next;
  cell.state = cell.state === "flagged" ? "hidden" : "flagged";
  return next;
}

/** Chord: reveal hidden neighbors if flagged count matches adjacent mine count. */
export function chordCell(
  board: Board,
  r: number,
  c: number,
): { board: Board; hitMine: boolean } {
  const rows = board.length;
  const cols = board[0].length;
  const cell = board[r][c];
  if (cell.state !== "revealed" || cell.isMine) {
    return { board, hitMine: false };
  }
  let flags = 0;
  const hiddenNeighbors: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const n = board[nr][nc];
      if (n.state === "flagged") flags++;
      else if (n.state === "hidden") hiddenNeighbors.push([nr, nc]);
    }
  }
  if (flags !== cell.adjacent || hiddenNeighbors.length === 0) {
    return { board, hitMine: false };
  }

  let next = cloneBoard(board);
  let hitMine = false;
  for (const [hr, hc] of hiddenNeighbors) {
    const res = revealCell(next, hr, hc);
    next = res.board;
    if (res.hitMine) hitMine = true;
  }
  return { board: next, hitMine };
}

export function countFlags(board: Board): number {
  let n = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === "flagged") n++;
    }
  }
  return n;
}

export function checkWin(board: Board): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && cell.state !== "revealed") return false;
    }
  }
  return true;
}

/** Reveal all mines (on loss). */
export function revealAllMines(board: Board): Board {
  const next = cloneBoard(board);
  for (const row of next) {
    for (const cell of row) {
      if (cell.isMine) cell.state = "revealed";
    }
  }
  return next;
}

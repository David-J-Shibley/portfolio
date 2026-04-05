export const GRID_SIZE = 4;
export const WIN_VALUE = 2048;

export type Board = number[][];

export function emptyBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0),
  );
}

function rowEqual(a: number[], b: number[]): boolean {
  return a.every((v, i) => v === b[i]);
}

/** Merge one row toward index 0 (classic 2048 rules: one merge per pair per move). */
export function mergeLine(line: number[]): { next: number[]; gained: number } {
  const nums = line.filter((x) => x !== 0);
  const next: number[] = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const v = nums[i] * 2;
      next.push(v);
      gained += v;
      i += 1;
    } else {
      next.push(nums[i]);
    }
  }
  while (next.length < GRID_SIZE) next.push(0);
  return { next, gained };
}

export function moveLeft(board: Board): {
  board: Board;
  gained: number;
  moved: boolean;
} {
  const next = board.map((row) => [...row]);
  let gained = 0;
  let moved = false;
  for (let r = 0; r < GRID_SIZE; r++) {
    const { next: merged, gained: g } = mergeLine(next[r]);
    gained += g;
    if (!rowEqual(merged, next[r])) moved = true;
    next[r] = merged;
  }
  return { board: next, gained, moved };
}

function reverseRow(row: number[]): number[] {
  return [...row].reverse();
}

export function moveRight(board: Board): {
  board: Board;
  gained: number;
  moved: boolean;
} {
  const flipped = board.map((row) => reverseRow(row));
  const { board: after, gained, moved } = moveLeft(flipped);
  const restored = after.map((row) => reverseRow(row));
  return { board: restored, gained, moved };
}

export function transpose(board: Board): Board {
  const out = emptyBoard();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      out[c][r] = board[r][c];
    }
  }
  return out;
}

export function moveUp(board: Board): {
  board: Board;
  gained: number;
  moved: boolean;
} {
  const t = transpose(board);
  const { board: after, gained, moved } = moveLeft(t);
  return { board: transpose(after), gained, moved };
}

export function moveDown(board: Board): {
  board: Board;
  gained: number;
  moved: boolean;
} {
  const t = transpose(board);
  const { board: after, gained, moved } = moveRight(t);
  return { board: transpose(after), gained, moved };
}

export type Direction = "up" | "down" | "left" | "right";

export function move(board: Board, dir: Direction): {
  board: Board;
  gained: number;
  moved: boolean;
} {
  switch (dir) {
    case "left":
      return moveLeft(board);
    case "right":
      return moveRight(board);
    case "up":
      return moveUp(board);
    case "down":
      return moveDown(board);
  }
}

export function addRandomTile(board: Board): Board {
  const empties: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c] === 0) empties.push([r, c]);
    }
  }
  if (empties.length === 0) return board;
  const pick = empties[Math.floor(Math.random() * empties.length)];
  const next = board.map((row) => [...row]);
  next[pick[0]][pick[1]] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

export function canMove(board: Board): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c] === 0) return true;
      const v = board[r][c];
      if (c < GRID_SIZE - 1 && board[r][c + 1] === v) return true;
      if (r < GRID_SIZE - 1 && board[r + 1][c] === v) return true;
    }
  }
  return false;
}

export function maxTile(board: Board): number {
  let m = 0;
  for (const row of board) {
    for (const v of row) {
      if (v > m) m = v;
    }
  }
  return m;
}

/** Start position: two random tiles. */
export function initialBoard(): Board {
  let b = emptyBoard();
  b = addRandomTile(b);
  b = addRandomTile(b);
  return b;
}

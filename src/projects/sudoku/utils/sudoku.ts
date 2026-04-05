export type Grid = number[][];

export function parsePuzzle(line: string): Grid {
  const s = line.replace(/\D/g, "");
  if (s.length !== 81) {
    throw new Error(`Expected 81 digits, got ${s.length}`);
  }
  const g: Grid = [];
  for (let r = 0; r < 9; r++) {
    const row: number[] = [];
    for (let c = 0; c < 9; c++) {
      row.push(Number.parseInt(s[r * 9 + c], 10));
    }
    g.push(row);
  }
  return g;
}

export function cloneGrid(g: Grid): Grid {
  return g.map((row) => [...row]);
}

export function isGivenMask(given: Grid): boolean[][] {
  return given.map((row) => row.map((v) => v !== 0));
}

/** No conflicts excluding (r,c) when checking placement. */
export function canPlace(
  grid: Grid,
  r: number,
  c: number,
  val: number,
): boolean {
  if (val < 1 || val > 9) return false;
  for (let i = 0; i < 9; i++) {
    if (i !== c && grid[r][i] === val) return false;
    if (i !== r && grid[i][c] === val) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const rr = br + i;
      const cc = bc + j;
      if (rr === r && cc === c) continue;
      if (grid[rr][cc] === val) return false;
    }
  }
  return true;
}

/** Keys "r,c" for cells that conflict with another filled cell. */
export function conflictKeys(grid: Grid): Set<string> {
  const bad = new Set<string>();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c];
      if (v === 0) continue;
      for (let i = 0; i < 9; i++) {
        if (i !== c && grid[r][i] === v) {
          bad.add(`${r},${c}`);
          bad.add(`${r},${i}`);
        }
        if (i !== r && grid[i][c] === v) {
          bad.add(`${r},${c}`);
          bad.add(`${i},${c}`);
        }
      }
      const br = Math.floor(r / 3) * 3;
      const bc = Math.floor(c / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const rr = br + i;
          const cc = bc + j;
          if (rr === r && cc === c) continue;
          if (grid[rr][cc] === v) {
            bad.add(`${r},${c}`);
            bad.add(`${rr},${cc}`);
          }
        }
      }
    }
  }
  return bad;
}

export function isComplete(grid: Grid): boolean {
  return grid.every((row) => row.every((v) => v !== 0));
}

export function isSolved(grid: Grid): boolean {
  if (!isComplete(grid)) return false;
  return conflictKeys(grid).size === 0;
}

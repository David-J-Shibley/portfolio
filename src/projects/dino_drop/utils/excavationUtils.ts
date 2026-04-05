import { GridCell, Tool } from "../types/gameTypes";

/**
 * Handles digging a cell with a given tool.
 * Returns a new cell object and a boolean indicating if the cell was revealed.
 */
export function digCell(cell: GridCell, tool: Tool): { updatedCell: GridCell; revealed: boolean } {
  if (cell.isRevealed) {
    return { updatedCell: cell, revealed: false };
  }
  const newProgress = Math.min(100, cell.excavationProgress + tool.precision * 10);
  const shouldReveal = newProgress >= 100;
  return {
    updatedCell: {
      ...cell,
      excavationProgress: newProgress,
      isRevealed: shouldReveal ? true : cell.isRevealed,
    },
    revealed: shouldReveal && !cell.isRevealed,
  };
}

// TODO: Add excavation mechanics here 
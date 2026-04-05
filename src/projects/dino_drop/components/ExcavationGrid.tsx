import React from "react";
import { GridCell } from "../types/gameTypes";

interface Props {
  grid: GridCell[][];
  onCellClick: (x: number, y: number) => void;
}

const ExcavationGrid: React.FC<Props> = ({ grid, onCellClick }) => {
  return (
    <div
      className="dino-drop-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${grid.length}, 32px)`,
        gridTemplateRows: `repeat(${grid.length > 0 ? grid[0].length : 0}, 32px)`,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "4px",
        justifyContent: "center",
      }}
    >
      {grid.flat().map((cell) => (
        <div
          key={`${cell.x},${cell.y}`}
          className="dino-drop-cell"
          style={{
            background: cell.isRevealed ? "#b5e7a0" : "#f5e9da",
            cursor: cell.isRevealed ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8em",
            position: "relative",
            border: "1px solid #ccc",
          }}
          onClick={() => !cell.isRevealed && onCellClick(cell.x, cell.y)}
        >
          {!cell.isRevealed && cell.excavationProgress > 0 && (
            <span style={{ color: "#888", fontSize: "0.7em" }}>{Math.floor(cell.excavationProgress)}%</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExcavationGrid; 
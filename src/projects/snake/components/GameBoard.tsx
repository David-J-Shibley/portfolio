import React, { useEffect, useRef } from "react";
import { Position } from "../utils/gameUtils";

interface GameBoardProps {
  gridSize: number;
  snake: Position[];
  food: Position | null;
  isPaused: boolean;
  gameOver: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  gridSize, 
  snake, 
  food, 
  isPaused, 
  gameOver 
}) => {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set CSS variable for the grid size
    if (boardRef.current) {
      boardRef.current.style.setProperty("--grid-size", String(gridSize));
    }
  }, [gridSize]);

  // Generate the cells for the game board
  const renderCells = () => {
    const cells = [];
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Check if this cell is part of the snake
        const isSnakeHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
        // Check if this cell is the food
        const isFood = food && food.x === x && food.y === y;
        
        let cellClass = "snake-cell ";
        
        if (isSnakeHead) {
          cellClass += "bg-snake-head";
        } else if (isSnakeBody) {
          cellClass += "bg-snake-body";
        } else if (isFood) {
          cellClass += "bg-snake-food animate-pulse-slow";
        }
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{ gridColumn: x + 1, gridRow: y + 1 }}
          />
        );
      }
    }
    
    return cells;
  };

  return (
    <div 
      ref={boardRef} 
      className="snake-game-grid aspect-square w-full max-w-[500px] relative"
    >
      {renderCells()}
      
      {isPaused && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-4">PAUSED</h2>
            <p className="text-lg">Press the Play button to continue</p>
          </div>
        </div>
      )}
      
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-4">GAME OVER</h2>
            <p className="text-lg">Press the Restart button to play again</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
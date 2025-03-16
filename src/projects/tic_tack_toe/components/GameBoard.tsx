import React from 'react';
import { GameBoardProps } from '../types/game';
import { cn } from '@/lib/utils';
import { X, Circle } from 'lucide-react';

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  winningLine,
  onCellClick,
  currentPlayer,
  gameStatus
}) => {
  // Determine if a cell is part of the winning line
  const isWinningCell = (index: number): boolean => {
    return !!winningLine && winningLine.includes(index);
  };

  // Determine cell color based on its value and winning state
  const getCellStyles = (index: number) => {
    return cn(
      'game-cell w-24 h-24 md:w-28 md:h-28 text-4xl md:text-5xl',
      // First row
      index < 3 && 'border-t-0',
      // Last row
      index > 5 && 'border-b-0',
      // First column
      index % 3 === 0 && 'border-l-0',
      // Last column
      index % 3 === 2 && 'border-r-0',
      // Winning cell highlight
      isWinningCell(index) && 'winning-cell'
    );
  };

  return (
    <div className="game-board-container">
      <div className="relative overflow-hidden glass-panel rounded-2xl p-4 shadow-lg">
        <div className="game-status-indicator mb-4 text-center">
          {gameStatus === 'playing' ? (
            <span className="text-lg font-medium">
              Current Player: 
              <span 
                className={cn(
                  "ml-2 font-bold",
                  currentPlayer === 'X' ? 'text-game-x' : 'text-game-o'
                )}
              >
                {currentPlayer}
              </span>
            </span>
          ) : gameStatus === 'won' ? (
            <span className="text-lg font-bold text-primary animate-pulse-soft">
              Player {board[winningLine?.[0] || 0]} wins!
            </span>
          ) : (
            <span className="text-lg font-bold text-muted-foreground animate-pulse-soft">
              It's a draw!
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-1 bg-game-board-border rounded-xl overflow-hidden">
          {board.map((cell, index) => (
            <button
              key={index}
              className={getCellStyles(index)}
              onClick={() => onCellClick(index)}
              disabled={cell !== null || gameStatus !== 'playing'}
              aria-label={`Cell ${index}`}
            >
              {cell === 'X' ? (
                <X 
                  className="x-mark" 
                  size={36} 
                  strokeWidth={3} 
                />
              ) : cell === 'O' ? (
                <Circle 
                  className="o-mark" 
                  size={32} 
                  strokeWidth={3} 
                />
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
import React, { useEffect, useState, useRef } from 'react';
import { GameTile, Position } from '../types/game';
import CheckerPiece from './CheckerPiece';

interface GameBoardProps {
  board: GameTile[][];
  onTileClick: (position: Position) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onTileClick }) => {
  const [tileSize, setTileSize] = useState(60);
  const boardRef = useRef<HTMLDivElement>(null);

  // Responsive board sizing
  useEffect(() => {
    const handleResize = () => {
      if (boardRef.current) {
        const minDimension = Math.min(
          window.innerWidth * 0.8,
          window.innerHeight * 0.7
        );
        const newSize = Math.floor(minDimension / 8);
        setTileSize(newSize);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={boardRef}
      className="checker-board relative grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border-4 border-amber-800 shadow-2xl animate-scale-in"
      style={{ width: tileSize * 8, height: tileSize * 8 }}
    >
      {board.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`
              relative transition-all duration-200 
              ${tile.isPlayable ? 'bg-amber-900' : 'bg-amber-200'}
              ${tile.isHighlighted ? 'ring-4 ring-yellow-400 z-10 shadow-lg' : ''}
              ${tile.isPossibleMove ? 'bg-amber-600/50' : ''}
              hover:brightness-110 cursor-pointer
            `}
            style={{ width: tileSize, height: tileSize }}
            onClick={() => onTileClick(tile.position)}
          >
            {/* Coordinate labels */}
            {rowIndex === 7 && (
              <div className="absolute bottom-0 right-0 p-1 text-xs font-mono text-amber-600 opacity-70">
                {String.fromCharCode(97 + colIndex)}
              </div>
            )}
            {colIndex === 0 && (
              <div className="absolute top-0 left-0 p-1 text-xs font-mono text-amber-600 opacity-70">
                {8 - rowIndex}
              </div>
            )}
            
            {/* Checkers piece */}
            {tile.piece && (
              <CheckerPiece type={tile.piece} size={tileSize} />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;

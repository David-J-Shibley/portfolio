import React from 'react';
import { PieceState } from '../types/game';
import { Crown } from 'lucide-react';

interface CheckerPieceProps {
  type: PieceState;
  size: number;
}

const CheckerPiece: React.FC<CheckerPieceProps> = ({ type, size }) => {
  if (!type) return null;

  const isRed = type === 'red' || type === 'redKing';
  const isKing = type === 'redKing' || type === 'blackKing';
  const pieceSize = size * 0.8;

  return (
    <div
      className={`
        checker-piece absolute 
        ${isRed ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-gray-800 to-black'}
        ${isKing ? 'checker-piece-crowned' : ''}
      `}
      style={{
        width: pieceSize,
        height: pieceSize,
        borderRadius: '50%',
        boxShadow: `0 4px 10px rgba(0, 0, 0, 0.3), inset 0 2px 3px ${isRed ? 'rgba(255, 200, 200, 0.5)' : 'rgba(100, 100, 100, 0.5)'}`,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      {isKing && (
        <div className="absolute inset-0 flex items-center justify-center text-yellow-300 animate-pulse-light">
          <Crown size={pieceSize * 0.5} />
        </div>
      )}
    </div>
  );
};

export default CheckerPiece;

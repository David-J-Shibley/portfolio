import React, { useState, useEffect } from 'react';
import { 
  GameState, 
  Move, 
  Square, 
  Piece, 
  getLegalMoves, 
  getAllSquares,
  getSquareColor,
  getPieceSymbol
} from '../utils/chessEngine';
import { toast } from 'sonner';

interface ChessBoardProps {
  gameState: GameState;
  playerColor: 'spectator' | 'w' | 'b';
  onMove: (move: Move) => void;
  lastMove: Move | null;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  gameState, 
  playerColor, 
  onMove,
  lastMove 
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [boardOrientation, setBoardOrientation] = useState<'w' | 'b'>(playerColor === 'spectator' ? 'w' : playerColor);

  useEffect(() => {
    if (playerColor !== 'spectator') {
      setBoardOrientation(playerColor);
    }
  }, [playerColor]);

  useEffect(() => {
    if (selectedSquare) {
      const moves = getLegalMoves(gameState, selectedSquare);
      setLegalMoves(moves);
    } else {
      setLegalMoves([]);
    }
  }, [selectedSquare, gameState]);

  const handleSquareClick = (square: Square) => {
    const piece = gameState.board[square];
    
    // If we already have a selected square
    if (selectedSquare) {
      // Check if the clicked square is a valid move
      const move = legalMoves.find(m => m.to === square);
      
      if (move) {
        // Make the move
        onMove(move);
        setSelectedSquare(null);
        return;
      }
      
      // If the same square is clicked again, deselect it
      if (square === selectedSquare) {
        setSelectedSquare(null);
        return;
      }
      
      // If another of player's pieces is clicked, select it instead
      if (piece && piece[0] === gameState.turn && 
         (playerColor === 'spectator' || piece[0] === playerColor)) {
        setSelectedSquare(square);
        return;
      }
      
      // Otherwise, just deselect
      setSelectedSquare(null);
    } else {
      // Select the square if it contains a piece of the current turn
      if (piece && piece[0] === gameState.turn && 
         (playerColor === 'spectator' || piece[0] === playerColor)) {
        setSelectedSquare(square);
      }
    }
  };

  const isLastMove = (square: Square): boolean => {
    if (!lastMove) return false;
    return square === lastMove.from || square === lastMove.to;
  };

  const isPossibleMove = (square: Square): boolean => {
    return legalMoves.some(move => move.to === square);
  };

  const flipBoard = () => {
    setBoardOrientation(prev => prev === 'w' ? 'b' : 'w');
    toast.info(`Board flipped - ${boardOrientation === 'w' ? 'Black' : 'White'} perspective`);
  };

  const renderSquare = (square: Square) => {
    const piece = gameState.board[square];
    const isSelected = square === selectedSquare;
    const isLastMoveSquare = isLastMove(square);
    const isPossible = isPossibleMove(square);
    const squareColor = getSquareColor(square);
    
    const { file, rank } = { file: square[0], rank: square[1] };
    
    // Determine classes for the square
    let squareClasses = `chess-square ${squareColor}`;
    if (isSelected) squareClasses += ' selected';
    if (isLastMoveSquare) squareClasses += ' last-move';
    if (isPossible) squareClasses += ' possible-move';
    
    // Show coordinates only on the edges
    const showFileCoord = rank === (boardOrientation === 'w' ? '1' : '8');
    const showRankCoord = file === (boardOrientation === 'w' ? 'a' : 'h');
    
    return (
      <div 
        key={square} 
        className={squareClasses}
        onClick={() => handleSquareClick(square)}
      >
        {piece && (
          <div className="chess-piece">
            {getPieceSymbol(piece as Piece)}
          </div>
        )}
        {showFileCoord && (
          <span className="coordinate file">{file}</span>
        )}
        {showRankCoord && (
          <span className="coordinate rank">{rank}</span>
        )}
      </div>
    );
  };

  // Get all squares in the correct order based on orientation
  const orderedSquares = (() => {
    const squares = getAllSquares();
    return boardOrientation === 'w' ? squares : [...squares].reverse();
  })();

  const canMove = playerColor === 'spectator' || playerColor === gameState.turn;
  const playerTurn = playerColor === gameState.turn;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="chessboard">
        {orderedSquares.map(square => renderSquare(square))}
      </div>
      
      <div className="flex justify-center gap-4 mt-2">
        {playerColor === 'spectator' && (
          <button 
            onClick={flipBoard}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            Flip Board
          </button>
        )}
        
        {!canMove && (playerColor === 'b' || playerColor === 'w') && (
          <div className="text-sm text-muted-foreground">
            Waiting for opponent's move...
          </div>
        )}
        
        {playerTurn && (playerColor === 'b' || playerColor === 'w') && (
          <div className="text-sm font-medium">
            Your turn
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessBoard;

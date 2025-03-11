import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ChessPiece } from '../../../components/ui/chess';
import { cn } from '@/lib/utils';

const ChessBoard = () => {
  const { gameState, makeMove, currentPlayer, isKingInCheck } = useGame();
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([]);

  if (!gameState) {
    return <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">Loading game...</div>;
  }

  // Create the board coordinates
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const getSquareColor = (file: string, rank: string) => {
    const fileIndex = files.indexOf(file);
    const rankIndex = ranks.indexOf(rank);
    return (fileIndex + rankIndex) % 2 === 0 ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';
  };

  const handleSquareClick = (square: string) => {
    // If no square is selected yet
    if (!selectedSquare) {
      const piece = gameState.board[square];
      // Only allow selecting pieces of the current player's color
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare(square);
        // Calculate valid moves
        const potentialMoves: string[] = [];
        files.forEach(file => {
          ranks.forEach(rank => {
            const targetSquare = `${file}${rank}`;
            if (targetSquare !== square) {
              const targetPiece = gameState.board[targetSquare];
              if (!targetPiece || targetPiece.color !== piece.color) {
                potentialMoves.push(targetSquare);
              }
            }
          });
        });
        setHighlightedSquares(potentialMoves);
      }
    } 
    // If a square is already selected, try to move
    else {
      if (square === selectedSquare) {
        // Deselect if clicking on the same square
        setSelectedSquare(null);
        setHighlightedSquares([]);
      } else if (highlightedSquares.includes(square)) {
        // Try to make the move
        const success = makeMove(selectedSquare, square);
        if (success) {
          // Reset selection after successful move
          setSelectedSquare(null);
          setHighlightedSquares([]);
        }
      } else {
        // Clicking on an invalid square - deselect
        setSelectedSquare(null);
        setHighlightedSquares([]);
      }
    }
  };

  const renderPiece = (piece: ChessPiece | null) => {
    if (!piece) return null;
    
    // Map of piece types to their Unicode chess symbols
    const pieceSymbols: Record<string, Record<string, string>> = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙',
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟',
      },
    };
    
    return (
      <div className={cn(
        "flex items-center justify-center w-full h-full",
        piece.color === 'white' ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-black',
        "text-4xl font-bold"
      )}>
        {pieceSymbols[piece.color][piece.type]}
      </div>
    );
  };

  // Highlight the king if in check
  const checkSquare = isKingInCheck ? Object.entries(gameState.board).find(
    ([_, piece]) => piece?.type === 'king' && piece?.color === currentPlayer
  )?.[0] : null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="aspect-square border-2 border-gray-800 rounded-md overflow-hidden shadow-lg">
        <div className="grid grid-cols-8 grid-rows-8 h-full">
          {ranks.map((rank) => (
            files.map((file) => {
              const square = `${file}${rank}`;
              const piece = gameState.board[square];
              const isSelected = selectedSquare === square;
              const isHighlighted = highlightedSquares.includes(square);
              const isCheck = checkSquare === square;
              
              return (
                <div
                  key={square}
                  className={cn(
                    "relative w-full aspect-square",
                    getSquareColor(file, rank),
                    isSelected && "ring-2 ring-inset ring-blue-500",
                    isHighlighted && "ring-2 ring-inset ring-green-500",
                    isCheck && "bg-red-400"
                  )}
                  onClick={() => handleSquareClick(square)}
                >
                  {/* Coordinates in corners */}
                  {file === 'a' && (
                    <div className="absolute top-0 left-0 text-xs m-0.5 opacity-60">
                      {rank}
                    </div>
                  )}
                  {rank === '1' && (
                    <div className="absolute bottom-0 right-0 text-xs m-0.5 opacity-60">
                      {file}
                    </div>
                  )}
                  
                  {/* Chess piece */}
                  {renderPiece(piece)}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
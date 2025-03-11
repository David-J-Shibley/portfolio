export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export type Piece = `${PieceColor}${PieceType}`;
export type Square = string; // e.g., 'a1', 'e4'
export type Move = { from: Square; to: Square; promotion?: PieceType };

export interface ChessBoard {
  [square: string]: Piece | null;
}

export interface GameState {
  board: ChessBoard;
  turn: PieceColor;
  castling: {
    w: { kingSide: boolean; queenSide: boolean };
    b: { kingSide: boolean; queenSide: boolean };
  };
  enPassant: Square | null;
  halfMoveClock: number;
  fullMoveNumber: number;
  checks: { inCheck: boolean; checkmate: boolean };
  lastMove: Move | null;
  gameOver: boolean;
  result: string | null;
}

// Initial position in FEN: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
export const initialGameState: GameState = {
  board: {
    a8: 'br', b8: 'bn', c8: 'bb', d8: 'bq', e8: 'bk', f8: 'bb', g8: 'bn', h8: 'br',
    a7: 'bp', b7: 'bp', c7: 'bp', d7: 'bp', e7: 'bp', f7: 'bp', g7: 'bp', h7: 'bp',
    a6: null, b6: null, c6: null, d6: null, e6: null, f6: null, g6: null, h6: null,
    a5: null, b5: null, c5: null, d5: null, e5: null, f5: null, g5: null, h5: null,
    a4: null, b4: null, c4: null, d4: null, e4: null, f4: null, g4: null, h4: null,
    a3: null, b3: null, c3: null, d3: null, e3: null, f3: null, g3: null, h3: null,
    a2: 'wp', b2: 'wp', c2: 'wp', d2: 'wp', e2: 'wp', f2: 'wp', g2: 'wp', h2: 'wp',
    a1: 'wr', b1: 'wn', c1: 'wb', d1: 'wq', e1: 'wk', f1: 'wb', g1: 'wn', h1: 'wr',
  },
  turn: 'w',
  castling: {
    w: { kingSide: true, queenSide: true },
    b: { kingSide: true, queenSide: true },
  },
  enPassant: null,
  halfMoveClock: 0,
  fullMoveNumber: 1,
  checks: { inCheck: false, checkmate: false },
  lastMove: null,
  gameOver: false,
  result: null,
};

export function isValidMove(gameState: GameState, move: Move): boolean {
  const possibleMoves = getLegalMoves(gameState, move.from);
  return possibleMoves.some(m => m.from === move.from && m.to === move.to);
}

export function makeMove(gameState: GameState, move: Move): GameState {
  if (!isValidMove(gameState, move)) {
    return gameState;
  }

  const newState = { ...gameState };
  newState.board = { ...gameState.board };
  
  // Handle the move
  const piece = newState.board[move.from];
  newState.board[move.to] = piece;
  newState.board[move.from] = null;
  newState.lastMove = move;

  // Handle promotion
  if (move.promotion && piece && piece[1] === 'p') {
    if ((piece[0] === 'w' && move.to[1] === '8') || (piece[0] === 'b' && move.to[1] === '1')) {
      newState.board[move.to] = `${piece[0]}${move.promotion}` as Piece;
    }
  }

  // Handle castling
  if (piece && piece[1] === 'k') {
    if (move.from === 'e1' && piece === 'wk') {
      if (move.to === 'g1') { // King-side castling
        newState.board.h1 = null;
        newState.board.f1 = 'wr';
      } else if (move.to === 'c1') { // Queen-side castling
        newState.board.a1 = null;
        newState.board.d1 = 'wr';
      }
      newState.castling.w = { kingSide: false, queenSide: false };
    } else if (move.from === 'e8' && piece === 'bk') {
      if (move.to === 'g8') { // King-side castling
        newState.board.h8 = null;
        newState.board.f8 = 'br';
      } else if (move.to === 'c8') { // Queen-side castling
        newState.board.a8 = null;
        newState.board.d8 = 'br';
      }
      newState.castling.b = { kingSide: false, queenSide: false };
    }
  }

  // Update castling rights for rooks
  if (piece && piece[1] === 'r') {
    if (move.from === 'a1') newState.castling.w.queenSide = false;
    if (move.from === 'h1') newState.castling.w.kingSide = false;
    if (move.from === 'a8') newState.castling.b.queenSide = false;
    if (move.from === 'h8') newState.castling.b.kingSide = false;
  }

  // Handle en passant capture
  if (piece && piece[1] === 'p' && newState.enPassant && move.to === newState.enPassant) {
    const captureSquare = move.to[0] + move.from[1];
    newState.board[captureSquare] = null;
  }

  // Set en passant target square
  newState.enPassant = null;
  if (piece && piece[1] === 'p') {
    const fromRank = parseInt(move.from[1]);
    const toRank = parseInt(move.to[1]);
    // Check if pawn moved two squares
    if (Math.abs(fromRank - toRank) === 2) {
      const file = move.from[0];
      const enPassantRank = piece[0] === 'w' ? '3' : '6';
      newState.enPassant = file + enPassantRank;
    }
  }

  // Update move counters
  if (piece && piece[1] === 'p' || newState.board[move.to] !== null) {
    newState.halfMoveClock = 0;
  } else {
    newState.halfMoveClock++;
  }

  if (newState.turn === 'b') {
    newState.fullMoveNumber++;
  }

  // Switch turn
  newState.turn = newState.turn === 'w' ? 'b' : 'w';

  // Update check status
  newState.checks = { inCheck: false, checkmate: false };
  // For a simple version, we'll just flag checkmate or draw situations manually
  // In a complete chess engine, we'd check for checkmate, stalemate, etc.

  return newState;
}

export function getLegalMoves(gameState: GameState, square: Square): Move[] {
  const piece = gameState.board[square];
  if (!piece) return [];
  
  // For this simplified version, we'll return basic moves without full chess rules
  // A complete chess engine would need proper move generation and validation
  
  const [color, type] = piece.split('') as [PieceColor, PieceType];
  const moves: Move[] = [];
  
  // Only allow moves for the current player's turn
  if (color !== gameState.turn) return [];

  const [file, rank] = square.split('');
  const fileIdx = file.charCodeAt(0) - 'a'.charCodeAt(0);
  const rankIdx = parseInt(rank) - 1;

  // Define directions for different piece types
  const dirs = {
    p: color === 'w' ? [[0, 1], [0, 2], [1, 1], [-1, 1]] : [[0, -1], [0, -2], [1, -1], [-1, -1]],
    r: [[0, 1], [1, 0], [0, -1], [-1, 0]],
    n: [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]],
    b: [[1, 1], [1, -1], [-1, -1], [-1, 1]],
    q: [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]],
    k: [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]]
  };

  // Get directions for the current piece
  const directions = dirs[type];
  
  // For non-sliding pieces (pawn, knight, king)
  if (type === 'p' || type === 'n' || type === 'k') {
    for (const [dx, dy] of directions) {
      const newFileIdx = fileIdx + dx;
      const newRankIdx = rankIdx + dy;
      
      // Check if new position is within the board
      if (newFileIdx >= 0 && newFileIdx < 8 && newRankIdx >= 0 && newRankIdx < 8) {
        const newFile = String.fromCharCode('a'.charCodeAt(0) + newFileIdx);
        const newRank = (newRankIdx + 1).toString();
        const newSquare = newFile + newRank;
        const targetPiece = gameState.board[newSquare];
        
        // Pawn movement logic
        if (type === 'p') {
          // Forward move (can't capture)
          if (dx === 0) {
            // Can't move forward if piece is in the way
            if (targetPiece) continue;
            
            // Can move two squares only from starting position
            if (Math.abs(dy) === 2) {
              if ((color === 'w' && rankIdx !== 1) || (color === 'b' && rankIdx !== 6)) continue;
              
              // Check if the square in between is empty
              const middleRank = color === 'w' ? '3' : '6';
              const middleSquare = file + middleRank;
              if (gameState.board[middleSquare]) continue;
            }
          } 
          // Diagonal move (capture only)
          else {
            if (!targetPiece) {
              // Check for en passant
              if (newSquare === gameState.enPassant) {
                // Valid en passant capture
              } else {
                continue;
              }
            } else if (targetPiece[0] === color) {
              // Can't capture own pieces
              continue;
            }
          }
        }
        // Knight movement
        else if (type === 'n') {
          // Can't move to a square with own piece
          if (targetPiece && targetPiece[0] === color) continue;
        }
        // King movement
        else if (type === 'k') {
          // Can't move to a square with own piece
          if (targetPiece && targetPiece[0] === color) continue;
          
          // Castling logic
          if (square === 'e1' && color === 'w') {
            if (newSquare === 'g1' && gameState.castling.w.kingSide) {
              // Check if squares are empty and not in check
              if (gameState.board.f1 || gameState.board.g1) continue;
              // Add castling move
            }
            if (newSquare === 'c1' && gameState.castling.w.queenSide) {
              // Check if squares are empty and not in check
              if (gameState.board.b1 || gameState.board.c1 || gameState.board.d1) continue;
              // Add castling move
            }
          }
          if (square === 'e8' && color === 'b') {
            if (newSquare === 'g8' && gameState.castling.b.kingSide) {
              // Check if squares are empty and not in check
              if (gameState.board.f8 || gameState.board.g8) continue;
              // Add castling move
            }
            if (newSquare === 'c8' && gameState.castling.b.queenSide) {
              // Check if squares are empty and not in check
              if (gameState.board.b8 || gameState.board.c8 || gameState.board.d8) continue;
              // Add castling move
            }
          }
        }

        // Add promotion options for pawns reaching the last rank
        if (type === 'p' && ((color === 'w' && newRank === '8') || (color === 'b' && newRank === '1'))) {
          for (const promotionPiece of ['q', 'r', 'b', 'n'] as PieceType[]) {
            moves.push({ from: square, to: newSquare, promotion: promotionPiece });
          }
        } else {
          moves.push({ from: square, to: newSquare });
        }
      }
    }
  }
  // For sliding pieces (rook, bishop, queen)
  else {
    for (const [dx, dy] of directions) {
      for (let i = 1; i < 8; i++) {
        const newFileIdx = fileIdx + i * dx;
        const newRankIdx = rankIdx + i * dy;
        
        // Check if new position is within the board
        if (newFileIdx >= 0 && newFileIdx < 8 && newRankIdx >= 0 && newRankIdx < 8) {
          const newFile = String.fromCharCode('a'.charCodeAt(0) + newFileIdx);
          const newRank = (newRankIdx + 1).toString();
          const newSquare = newFile + newRank;
          const targetPiece = gameState.board[newSquare];
          
          if (!targetPiece) {
            // Empty square, can move here
            moves.push({ from: square, to: newSquare });
          } else {
            // Square has a piece
            if (targetPiece[0] !== color) {
              // Can capture opponent's piece
              moves.push({ from: square, to: newSquare });
            }
            // Can't move further in this direction
            break;
          }
        } else {
          // Out of board
          break;
        }
      }
    }
  }
  
  return moves;
}

export function parseSquare(square: string): { file: string; rank: string } {
  if (square.length !== 2) {
    throw new Error(`Invalid square: ${square}`);
  }
  const file = square[0].toLowerCase();
  const rank = square[1];
  if (file < 'a' || file > 'h' || rank < '1' || rank > '8') {
    throw new Error(`Invalid square: ${square}`);
  }
  return { file, rank };
}

export function getSquareColor(square: string): 'light' | 'dark' {
  const { file, rank } = parseSquare(square);
  const fileIdx = file.charCodeAt(0) - 'a'.charCodeAt(0);
  const rankIdx = parseInt(rank) - 1;
  return (fileIdx + rankIdx) % 2 === 0 ? 'light' : 'dark';
}

export function getAllSquares(): Square[] {
  const squares: Square[] = [];
  for (let r = 8; r >= 1; r--) {
    for (let f = 0; f < 8; f++) {
      const file = String.fromCharCode('a'.charCodeAt(0) + f);
      squares.push(`${file}${r}`);
    }
  }
  return squares;
}

export function getPieceSymbol(piece: Piece): string {
  const symbols: Record<Piece, string> = {
    wp: '♙', wr: '♖', wn: '♘', wb: '♗', wq: '♕', wk: '♔',
    bp: '♟', br: '♜', bn: '♞', bb: '♝', bq: '♛', bk: '♚'
  };
  return symbols[piece];
}

export function getGameStatus(gameState: GameState): string {
  if (gameState.checks.checkmate) {
    return `Checkmate! ${gameState.turn === 'w' ? 'Black' : 'White'} wins.`;
  }
  if (gameState.gameOver) {
    return gameState.result || 'Game over.';
  }
  if (gameState.checks.inCheck) {
    return `${gameState.turn === 'w' ? 'White' : 'Black'} is in check!`;
  }
  return `${gameState.turn === 'w' ? 'White' : 'Black'} to move`;
}
export type ChessPiece = {
    type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
    color: 'white' | 'black';
    position: string; // e.g., "e4"
  };
  
  export type GameState = {
    board: Record<string, ChessPiece | null>;
    currentTurn: 'white' | 'black';
    gameId: string;
    whitePlayerId: string | null;
    blackPlayerId: string | null;
    status: 'waiting' | 'active' | 'check' | 'checkmate' | 'draw';
    moves: Move[];
  };
  
  export type Move = {
    from: string;
    to: string;
    piece: ChessPiece;
    capturedPiece?: ChessPiece;
    isCheck?: boolean;
    isCheckmate?: boolean;
  };
  
  export const INITIAL_BOARD_SETUP: Record<string, ChessPiece | null> = {
    // White pieces
    a1: { type: 'rook', color: 'white', position: 'a1' },
    b1: { type: 'knight', color: 'white', position: 'b1' },
    c1: { type: 'bishop', color: 'white', position: 'c1' },
    d1: { type: 'queen', color: 'white', position: 'd1' },
    e1: { type: 'king', color: 'white', position: 'e1' },
    f1: { type: 'bishop', color: 'white', position: 'f1' },
    g1: { type: 'knight', color: 'white', position: 'g1' },
    h1: { type: 'rook', color: 'white', position: 'h1' },
    a2: { type: 'pawn', color: 'white', position: 'a2' },
    b2: { type: 'pawn', color: 'white', position: 'b2' },
    c2: { type: 'pawn', color: 'white', position: 'c2' },
    d2: { type: 'pawn', color: 'white', position: 'd2' },
    e2: { type: 'pawn', color: 'white', position: 'e2' },
    f2: { type: 'pawn', color: 'white', position: 'f2' },
    g2: { type: 'pawn', color: 'white', position: 'g2' },
    h2: { type: 'pawn', color: 'white', position: 'h2' },
    
    // Black pieces
    a8: { type: 'rook', color: 'black', position: 'a8' },
    b8: { type: 'knight', color: 'black', position: 'b8' },
    c8: { type: 'bishop', color: 'black', position: 'c8' },
    d8: { type: 'queen', color: 'black', position: 'd8' },
    e8: { type: 'king', color: 'black', position: 'e8' },
    f8: { type: 'bishop', color: 'black', position: 'f8' },
    g8: { type: 'knight', color: 'black', position: 'g8' },
    h8: { type: 'rook', color: 'black', position: 'h8' },
    a7: { type: 'pawn', color: 'black', position: 'a7' },
    b7: { type: 'pawn', color: 'black', position: 'b7' },
    c7: { type: 'pawn', color: 'black', position: 'c7' },
    d7: { type: 'pawn', color: 'black', position: 'd7' },
    e7: { type: 'pawn', color: 'black', position: 'e7' },
    f7: { type: 'pawn', color: 'black', position: 'f7' },
    g7: { type: 'pawn', color: 'black', position: 'g7' },
    h7: { type: 'pawn', color: 'black', position: 'h7' },
  };
  
  export const createNewGame = (gameId: string): GameState => ({
    board: { ...INITIAL_BOARD_SETUP },
    currentTurn: 'white',
    gameId,
    whitePlayerId: null,
    blackPlayerId: null,
    status: 'waiting',
    moves: [],
  });
  
  // Calculate file and rank indices
  const fileToIndex = (file: string): number => file.charCodeAt(0) - 'a'.charCodeAt(0);
  const rankToIndex = (rank: string): number => parseInt(rank) - 1;
  const indexToFile = (index: number): string => String.fromCharCode(index + 'a'.charCodeAt(0));
  const indexToRank = (index: number): string => (index + 1).toString();
  
  // This function checks if a move is valid according to chess rules
  export const isValidMove = (
    from: string, 
    to: string, 
    piece: ChessPiece, 
    board: Record<string, ChessPiece | null>
  ): boolean => {
    // Cannot move to a square occupied by own piece
    if (board[to] && board[to]?.color === piece.color) {
      return false;
    }
  
    // Get file and rank indices
    const fromFile = fileToIndex(from[0]);
    const fromRank = rankToIndex(from[1]);
    const toFile = fileToIndex(to[0]);
    const toRank = rankToIndex(to[1]);
  
    // Calculate differences for movement
    const fileDiff = Math.abs(toFile - fromFile);
    const rankDiff = Math.abs(toRank - fromRank);
  
    // Different logic based on piece type
    switch (piece.type) {
      case 'pawn':
        // Different rules for white and black pawns
        if (piece.color === 'white') {
          // Forward movement (no capture)
          if (fromFile === toFile && !board[to]) {
            // Single square forward
            if (toRank - fromRank === 1) return true;
            // Double square forward from starting position
            if (fromRank === 1 && toRank - fromRank === 2 && !board[`${from[0]}${parseInt(from[1]) + 1}`]) {
              return true;
            }
          }
          // Diagonal capture
          if (Math.abs(toFile - fromFile) === 1 && toRank - fromRank === 1 && board[to]) {
            return true;
          }
        } else { // Black pawn
          // Forward movement (no capture)
          if (fromFile === toFile && !board[to]) {
            // Single square forward
            if (fromRank - toRank === 1) return true;
            // Double square forward from starting position
            if (fromRank === 6 && fromRank - toRank === 2 && !board[`${from[0]}${parseInt(from[1]) - 1}`]) {
              return true;
            }
          }
          // Diagonal capture
          if (Math.abs(toFile - fromFile) === 1 && fromRank - toRank === 1 && board[to]) {
            return true;
          }
        }
        return false;
  
      case 'rook':
        // Rooks move horizontally or vertically
        if (fromFile !== toFile && fromRank !== toRank) return false;
        
        // Check for pieces in the way
        if (fromFile === toFile) {
          // Moving vertically
          const step = fromRank < toRank ? 1 : -1;
          for (let rank = fromRank + step; rank !== toRank; rank += step) {
            if (board[`${from[0]}${indexToRank(rank)}`]) return false;
          }
        } else {
          // Moving horizontally
          const step = fromFile < toFile ? 1 : -1;
          for (let file = fromFile + step; file !== toFile; file += step) {
            if (board[`${indexToFile(file)}${from[1]}`]) return false;
          }
        }
        return true;
  
      case 'knight':
        // Knights move in an L-shape
        return (fileDiff === 1 && rankDiff === 2) || (fileDiff === 2 && rankDiff === 1);
  
      case 'bishop':
        // Bishops move diagonally
        if (fileDiff !== rankDiff) return false;
        
        // Check for pieces in the way
        const fileStep = fromFile < toFile ? 1 : -1;
        const rankStep = fromRank < toRank ? 1 : -1;
        let file = fromFile + fileStep;
        let rank = fromRank + rankStep;
        
        while (file !== toFile && rank !== toRank) {
          if (board[`${indexToFile(file)}${indexToRank(rank)}`]) return false;
          file += fileStep;
          rank += rankStep;
        }
        return true;
  
      case 'queen':
        // Queens move like rooks or bishops
        // Check if moving like a rook (horizontally or vertically)
        if (fromFile === toFile || fromRank === toRank) {
          // Check for pieces in the way, same as rook logic
          if (fromFile === toFile) {
            // Moving vertically
            const step = fromRank < toRank ? 1 : -1;
            for (let rank = fromRank + step; rank !== toRank; rank += step) {
              if (board[`${from[0]}${indexToRank(rank)}`]) return false;
            }
          } else {
            // Moving horizontally
            const step = fromFile < toFile ? 1 : -1;
            for (let file = fromFile + step; file !== toFile; file += step) {
              if (board[`${indexToFile(file)}${from[1]}`]) return false;
            }
          }
          return true;
        } 
        // Check if moving like a bishop (diagonally)
        else if (fileDiff === rankDiff) {
          // Check for pieces in the way, same as bishop logic
          const fileStep = fromFile < toFile ? 1 : -1;
          const rankStep = fromRank < toRank ? 1 : -1;
          let file = fromFile + fileStep;
          let rank = fromRank + rankStep;
          
          while (file !== toFile && rank !== toRank) {
            if (board[`${indexToFile(file)}${indexToRank(rank)}`]) return false;
            file += fileStep;
            rank += rankStep;
          }
          return true;
        }
        return false;
  
      case 'king':
        // Kings move one square in any direction
        return fileDiff <= 1 && rankDiff <= 1;
  
      default:
        return false;
    }
  };
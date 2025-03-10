import { useState, useCallback, useEffect } from 'react';
import { GameState, GameTile, Position, Move, PieceType, PieceState } from '../types/game';
import { toast } from 'sonner';

// Helper to create the initial board state
const createInitialBoard = (): GameTile[][] => {
  const board: GameTile[][] = [];
  
  for (let row = 0; row < 8; row++) {
    board[row] = [];
    for (let col = 0; col < 8; col++) {
      const isPlayable = (row + col) % 2 === 1;
      let piece: PieceState = null;
      
      if (isPlayable) {
        if (row < 3) {
          piece = 'black';
        } else if (row > 4) {
          piece = 'red';
        }
      }
      
      board[row][col] = {
        position: { row, col },
        piece,
        isPlayable,
        isHighlighted: false,
        isPossibleMove: false
      };
    }
  }
  
  return board;
};

// Initial game state
const initialGameState: GameState = {
  board: createInitialBoard(),
  currentTurn: 'red', // Red goes first
  selectedTile: null,
  possibleMoves: [],
  capturedPieces: {
    red: 0,
    black: 0
  },
  gameOver: false,
  winner: null,
  isJumpAvailable: false
};

export const useCheckersGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  
  // Helper to check if a position is valid (within the board)
  const isValidPosition = useCallback((pos: Position): boolean => {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
  }, []);

  // Helper to get a tile at a specific position
  const getTile = useCallback((board: GameTile[][], pos: Position): GameTile | null => {
    if (!isValidPosition(pos)) return null;
    return board[pos.row][pos.col];
  }, [isValidPosition]);

  // Helper to check if a move is a valid jump
  const isValidJump = useCallback((from: Position, to: Position, board: GameTile[][]): Move | null => {
    if (!isValidPosition(to)) return null;
    
    const fromTile = getTile(board, from);
    const toTile = getTile(board, to);
    
    if (!fromTile || !toTile || !fromTile.piece || toTile.piece) return null;
    if (!toTile.isPlayable) return null;
    
    // Calculate row and column differences
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    
    // Check if it's a valid 2-square diagonal move
    if (Math.abs(rowDiff) !== 2 || Math.abs(colDiff) !== 2) return null;
    
    // Determine if the piece can move in that direction based on its type
    const isKing = fromTile.piece === 'redKing' || fromTile.piece === 'blackKing';
    const isRed = fromTile.piece === 'red' || fromTile.piece === 'redKing';
    
    // Regular pieces can only move forward (red moves up, black moves down)
    if (!isKing) {
      if (isRed && rowDiff > 0) return null; // Red can only move up (decreasing row)
      if (!isRed && rowDiff < 0) return null; // Black can only move down (increasing row)
    }
    
    // Check the tile being jumped over
    const jumpedRow = from.row + rowDiff / 2;
    const jumpedCol = from.col + colDiff / 2;
    const jumpedPosition = { row: jumpedRow, col: jumpedCol };
    const jumpedTile = getTile(board, jumpedPosition);
    
    if (!jumpedTile || !jumpedTile.piece) return null;
    
    // Can't jump over your own pieces
    const jumpedIsRed = jumpedTile.piece === 'red' || jumpedTile.piece === 'redKing';
    if (isRed === jumpedIsRed) return null;
    
    return { from, to, captured: jumpedPosition };
  }, [getTile, isValidPosition]);

  // Helper to check if a move is a valid simple move
  const isValidSimpleMove = useCallback((from: Position, to: Position, board: GameTile[][]): Move | null => {
    if (!isValidPosition(to)) return null;
    
    const fromTile = getTile(board, from);
    const toTile = getTile(board, to);
    
    if (!fromTile || !toTile || !fromTile.piece || toTile.piece) return null;
    if (!toTile.isPlayable) return null;
    
    // Calculate row and column differences
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    
    // Check if it's a valid 1-square diagonal move
    if (Math.abs(rowDiff) !== 1 || Math.abs(colDiff) !== 1) return null;
    
    // Determine if the piece can move in that direction based on its type
    const isKing = fromTile.piece === 'redKing' || fromTile.piece === 'blackKing';
    const isRed = fromTile.piece === 'red' || fromTile.piece === 'redKing';
    
    // Regular pieces can only move forward (red moves up, black moves down)
    if (!isKing) {
      if (isRed && rowDiff > 0) return null; // Red can only move up (decreasing row)
      if (!isRed && rowDiff < 0) return null; // Black can only move down (increasing row)
    }
    
    return { from, to };
  }, [getTile, isValidPosition]);

  // Get all possible jumps for a given piece
  const getPossibleJumps = useCallback((pos: Position, board: GameTile[][]): Move[] => {
    const jumps: Move[] = [];
    const directions = [
      { row: -2, col: -2 }, // up-left
      { row: -2, col: +2 }, // up-right
      { row: +2, col: -2 }, // down-left
      { row: +2, col: +2 }  // down-right
    ];
    
    for (const dir of directions) {
      const toPos = { row: pos.row + dir.row, col: pos.col + dir.col };
      const jump = isValidJump(pos, toPos, board);
      if (jump) jumps.push(jump);
    }
    
    return jumps;
  }, [isValidJump]);

  // Get all possible simple moves for a given piece
  const getPossibleSimpleMoves = useCallback((pos: Position, board: GameTile[][]): Move[] => {
    const moves: Move[] = [];
    const directions = [
      { row: -1, col: -1 }, // up-left
      { row: -1, col: +1 }, // up-right
      { row: +1, col: -1 }, // down-left
      { row: +1, col: +1 }  // down-right
    ];
    
    for (const dir of directions) {
      const toPos = { row: pos.row + dir.row, col: pos.col + dir.col };
      const move = isValidSimpleMove(pos, toPos, board);
      if (move) moves.push(move);
    }
    
    return moves;
  }, [isValidSimpleMove]);

  // Get all possible moves for the current player
  const getAllPossibleMoves = useCallback((board: GameTile[][], turn: PieceType): { moves: Move[], hasJump: boolean } => {
    const allMoves: Move[] = [];
    const jumps: Move[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const tile = board[row][col];
        if (!tile.piece) continue;
        
        const isPieceTurn = (
          (turn === 'red' && (tile.piece === 'red' || tile.piece === 'redKing')) ||
          (turn === 'black' && (tile.piece === 'black' || tile.piece === 'blackKing'))
        );
        
        if (!isPieceTurn) continue;
        
        const possibleJumps = getPossibleJumps({ row, col }, board);
        jumps.push(...possibleJumps);
        
        if (possibleJumps.length === 0) {
          const possibleSimpleMoves = getPossibleSimpleMoves({ row, col }, board);
          allMoves.push(...possibleSimpleMoves);
        }
      }
    }
    
    // If jumps are available, they are mandatory
    return {
      moves: jumps.length > 0 ? jumps : allMoves,
      hasJump: jumps.length > 0
    };
  }, [getPossibleJumps, getPossibleSimpleMoves]);

  // Check if a piece should be crowned
  const shouldCrownPiece = useCallback((position: Position, pieceType: PieceType): boolean => {
    if (pieceType === 'red' && position.row === 0) return true;
    if (pieceType === 'black' && position.row === 7) return true;
    return false;
  }, []);

  // Select a tile on the board
  const selectTile = useCallback((position: Position) => {
    setGameState(prevState => {
      if (prevState.gameOver) return prevState;
      
      const newBoard = [...prevState.board.map(row => [...row])];
      const clickedTile = getTile(newBoard, position);
      
      if (!clickedTile) return prevState;
      
      // If we're clicking on a tile with a piece of the current player's color
      const isPieceTurn = clickedTile.piece && (
        (prevState.currentTurn === 'red' && (clickedTile.piece === 'red' || clickedTile.piece === 'redKing')) ||
        (prevState.currentTurn === 'black' && (clickedTile.piece === 'black' || clickedTile.piece === 'blackKing'))
      );
      
      // Clear previous highlights
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          newBoard[row][col].isHighlighted = false;
          newBoard[row][col].isPossibleMove = false;
        }
      }
      
      // If selecting a piece of the current player
      if (isPieceTurn) {
        clickedTile.isHighlighted = true;
        
        // Get possible moves for this piece
        let possibleMoves: Move[] = [];
        const possibleJumps = getPossibleJumps(position, newBoard);
        
        // If jumps are available, they are mandatory
        if (possibleJumps.length > 0 || prevState.isJumpAvailable) {
          possibleMoves = possibleJumps;
        } else {
          possibleMoves = getPossibleSimpleMoves(position, newBoard);
        }
        
        // Highlight possible destinations
        possibleMoves.forEach(move => {
          const destinationTile = getTile(newBoard, move.to);
          if (destinationTile) {
            destinationTile.isPossibleMove = true;
          }
        });
        
        return {
          ...prevState,
          board: newBoard,
          selectedTile: position,
          possibleMoves
        };
      }
      
      // If no piece is currently selected, do nothing more
      if (!prevState.selectedTile) return { ...prevState, board: newBoard };
      
      // If a piece is selected and we're clicking on a possible move destination
      const move = prevState.possibleMoves.find(m => 
        m.to.row === position.row && m.to.col === position.col
      );
      
      if (move) {
        // Execute the move
        const fromTile = getTile(newBoard, move.from);
        const toTile = getTile(newBoard, move.to);
        
        if (!fromTile || !toTile) return prevState;
        
        // Move the piece
        toTile.piece = fromTile.piece;
        fromTile.piece = null;
        
        // Handle capturing
        let capturedPieces = { ...prevState.capturedPieces };
        let moreJumpsAvailable = false;
        
        if (move.captured) {
          const capturedTile = getTile(newBoard, move.captured);
          if (capturedTile && capturedTile.piece) {
            const capturedColor = capturedTile.piece.startsWith('red') ? 'red' : 'black';
            capturedPieces[capturedColor === 'red' ? 'red' : 'black']++;
            capturedTile.piece = null;
            
            // Check if the piece can make more jumps
            const furtherJumps = getPossibleJumps(move.to, newBoard);
            if (furtherJumps.length > 0) {
              moreJumpsAvailable = true;
              toTile.isHighlighted = true;
              
              // Highlight possible destinations
              furtherJumps.forEach(jump => {
                const destinationTile = getTile(newBoard, jump.to);
                if (destinationTile) {
                  destinationTile.isPossibleMove = true;
                }
              });
              
              return {
                ...prevState,
                board: newBoard,
                selectedTile: move.to,
                possibleMoves: furtherJumps,
                capturedPieces,
                isJumpAvailable: false  // We're handling the jump sequence here
              };
            }
          }
        }
        
        // Check if piece should be crowned
        if (toTile.piece === 'red' && move.to.row === 0) {
          toTile.piece = 'redKing';
          toast("Red piece crowned!");
        } else if (toTile.piece === 'black' && move.to.row === 7) {
          toTile.piece = 'blackKing';
          toast("Black piece crowned!");
        }
        
        // Check for game over condition
        const { moves: nextMoves, hasJump: nextHasJump } = getAllPossibleMoves(
          newBoard, 
          prevState.currentTurn === 'red' ? 'black' : 'red'
        );
        
        if (nextMoves.length === 0) {
          return {
            ...prevState,
            board: newBoard,
            selectedTile: null,
            possibleMoves: [],
            capturedPieces,
            gameOver: true,
            winner: prevState.currentTurn,
            isJumpAvailable: false
          };
        }
        
        // Change turns if not in the middle of a multiple jump sequence
        if (!moreJumpsAvailable) {
          return {
            ...prevState,
            board: newBoard,
            currentTurn: prevState.currentTurn === 'red' ? 'black' : 'red',
            selectedTile: null,
            possibleMoves: [],
            capturedPieces,
            isJumpAvailable: nextHasJump
          };
        }
      }
      
      return { ...prevState, board: newBoard };
    });
  }, [getTile, getPossibleJumps, getPossibleSimpleMoves, getAllPossibleMoves, shouldCrownPiece]);

  // Reset the game to initial state
  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    toast("Game reset. Red's turn to move!");
  }, []);

  // Check for available moves when turn changes
  useEffect(() => {
    if (gameState.gameOver) return;
    
    const { moves, hasJump } = getAllPossibleMoves(gameState.board, gameState.currentTurn);
    
    if (moves.length === 0) {
      // Current player has no legal moves, game over
      setGameState(prevState => ({
        ...prevState,
        gameOver: true,
        winner: prevState.currentTurn === 'red' ? 'black' : 'red'
      }));
      
      toast(`Game over! ${gameState.currentTurn === 'red' ? 'Black' : 'Red'} wins!`);
    } else if (hasJump && !gameState.selectedTile) {
      // Notify player that jumps are available
      toast(`${gameState.currentTurn === 'red' ? 'Red' : 'Black'} has mandatory jumps available!`);
      
      setGameState(prevState => ({
        ...prevState,
        isJumpAvailable: true
      }));
    }
  }, [gameState.currentTurn, gameState.board, gameState.gameOver, gameState.selectedTile, getAllPossibleMoves]);

  return {
    gameState,
    selectTile,
    resetGame
  };
};

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { GameState, Move, ChessPiece, createNewGame, isValidMove } from '../../../components/ui/chess';
import { useToast } from '@/components/ui/use-toast';

type GameContextType = {
  gameState: GameState | null;
  currentPlayer: 'white' | 'black';
  makeMove: (from: string, to: string) => boolean;
  resetGame: () => void;
  isKingInCheck: boolean;
  isGameOver: boolean;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const { toast } = useToast();

  // Initialize the game when the component mounts
  React.useEffect(() => {
    if (!gameState) {
      resetGame();
    }
  }, []);

  // Find a king's position on the board
  const findKing = useCallback((color: 'white' | 'black', board: Record<string, ChessPiece | null>) => {
    const kingSquare = Object.entries(board).find(
      ([_, piece]) => piece?.type === 'king' && piece?.color === color
    );
    return kingSquare ? kingSquare[0] : null;
  }, []);

  // Check if a king is in check
  const isKingInCheckFn = useCallback((kingColor: 'white' | 'black', board: Record<string, ChessPiece | null>) => {
    const kingSquare = findKing(kingColor, board);
    if (!kingSquare) return false;

    // Check if any opponent's piece can attack the king
    const opponentColor = kingColor === 'white' ? 'black' : 'white';
    
    return Object.entries(board).some(([square, piece]) => {
      if (!piece || piece.color !== opponentColor) return false;
      
      // Check if the opponent's piece can move to the king's square
      return isValidMove(square, kingSquare, piece, board);
    });
  }, [findKing]);

  // Check if a move would leave the player's king in check
  const wouldMoveLeadToCheck = useCallback((from: string, to: string, playerColor: 'white' | 'black') => {
    if (!gameState) return true;
    
    // Simulate the move on a temporary board
    const tempBoard = { ...gameState.board };
    const piece = tempBoard[from];
    const capturedPiece = tempBoard[to];
    
    // Apply move to temporary board
    tempBoard[to] = piece ? { ...piece, position: to } : null;
    tempBoard[from] = null;
    
    // Check if the player's king would be in check after this move
    const inCheck = isKingInCheckFn(playerColor, tempBoard);
    
    return inCheck;
  }, [gameState, isKingInCheckFn]);

  // Check if a player is in checkmate
  const isCheckmateFunc = useCallback((playerColor: 'white' | 'black') => {
    if (!gameState) return false;
    
    // If the king is not in check, it's not checkmate
    if (!isKingInCheckFn(playerColor, gameState.board)) return false;
    
    // Check if any move by any piece of the player can get out of check
    const playerPieces = Object.entries(gameState.board)
      .filter(([_, piece]) => piece?.color === playerColor);
    
    // For each piece, check all possible moves
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    for (const [from, piece] of playerPieces) {
      if (!piece) continue;
      
      for (const file of files) {
        for (const rank of ranks) {
          const to = `${file}${rank}`;
          // Skip if it's the same square
          if (from === to) continue;
          
          // Check if the move is valid by chess rules
          if (!isValidMove(from, to, piece, gameState.board)) continue;
          
          // Check if the move would still leave the king in check
          if (!wouldMoveLeadToCheck(from, to, playerColor)) {
            // Found at least one move that can get out of check
            return false;
          }
        }
      }
    }
    
    // If no valid moves were found to get out of check, it's checkmate
    return true;
  }, [gameState, isKingInCheckFn, wouldMoveLeadToCheck]);

  // Memoized values for check and game over status
  const isKingInCheck = useMemo(() => {
    if (!gameState) return false;
    return isKingInCheckFn(currentPlayer, gameState.board);
  }, [gameState, currentPlayer, isKingInCheckFn]);

  const isGameOver = useMemo(() => {
    if (!gameState) return false;
    return gameState.status === 'checkmate' || gameState.status === 'draw';
  }, [gameState]);

  // Reset the game to its initial state
  const resetGame = useCallback(() => {
    const gameId = `local_${Math.random().toString(36).substr(2, 9)}`;
    const newGame = createNewGame(gameId);
    newGame.status = 'active';
    newGame.whitePlayerId = 'player1';
    newGame.blackPlayerId = 'player2';
    setGameState(newGame);
    setCurrentPlayer('white');
  }, []);

  // Make a move on the board
  const makeMove = useCallback((from: string, to: string): boolean => {
    if (!gameState) return false;
    
    // If game is over, prevent moves
    if (gameState.status === 'checkmate' || gameState.status === 'draw') {
      toast({
        title: "Game over",
        description: "This game has ended. Start a new game to continue playing.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if it's the current player's turn
    if (gameState.currentTurn !== currentPlayer) {
      toast({
        title: "Not your turn",
        description: `It's ${gameState.currentTurn}'s turn to play`,
        variant: "destructive",
      });
      return false;
    }
    
    // Get the piece at the 'from' position
    const piece = gameState.board[from];
    if (!piece || piece.color !== currentPlayer) {
      toast({
        title: "Invalid move",
        description: "You can only move your own pieces",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if the move is valid
    if (!isValidMove(from, to, piece, gameState.board)) {
      toast({
        title: "Invalid move",
        description: "That move is not allowed",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if the move would leave the king in check
    if (wouldMoveLeadToCheck(from, to, currentPlayer)) {
      toast({
        title: "Invalid move",
        description: "That move would leave your king in check",
        variant: "destructive",
      });
      return false;
    }
    
    // Capture piece if there is one at the destination
    const capturedPiece = gameState.board[to];
    
    // Create a new board state with the move applied
    const newBoard = { ...gameState.board };
    newBoard[to] = { ...piece, position: to };
    newBoard[from] = null;
    
    // Check if opponent's king is captured (game over)
    if (capturedPiece?.type === 'king') {
      const newGameState: GameState = {
        ...gameState,
        board: newBoard,
        currentTurn: currentPlayer,
        status: 'checkmate',
        moves: [...gameState.moves, { 
          from, 
          to, 
          piece,
          capturedPiece: capturedPiece || undefined,
          isCheckmate: true
        }],
      };
      
      setGameState(newGameState);
      toast({
        title: "Checkmate!",
        description: `${currentPlayer === 'white' ? 'White' : 'Black'} wins the game!`,
      });
      return true;
    }
    
    // Check if the move puts the opponent's king in check
    const nextTurn = currentPlayer === 'white' ? 'black' : 'white';
    const isCheck = isKingInCheckFn(nextTurn, newBoard);
    
    // Check if the opponent is in checkmate
    let isCheckmateResult = false;
    let newStatus = gameState.status;
    
    if (isCheck) {
      // Update status to check
      newStatus = 'check';
      
      // Check if this is checkmate
      isCheckmateResult = isCheckmateFunc(nextTurn);
      if (isCheckmateResult) {
        newStatus = 'checkmate' as any;
      }
    } else {
      newStatus = 'active';
    }
    
    // Create a move record
    const move: Move = {
      from,
      to,
      piece,
      capturedPiece: capturedPiece || undefined,
      isCheck,
      isCheckmate: isCheckmateResult,
    };
    
    // Update the game state
    const newGameState: GameState = {
      ...gameState,
      board: newBoard,
      currentTurn: nextTurn,
      status: newStatus,
      moves: [...gameState.moves, move],
    };
    
    setGameState(newGameState);
    setCurrentPlayer(nextTurn);
    
    // Show toast for check or checkmate
    if (isCheckmateResult) {
      toast({
        title: "Checkmate!",
        description: `${currentPlayer === 'white' ? 'White' : 'Black'} wins the game!`,
      });
    } else if (isCheck) {
      toast({
        title: "Check!",
        description: `${nextTurn === 'white' ? 'White' : 'Black'} king is in check!`,
      });
    }
    
    return true;
  }, [gameState, currentPlayer, toast, isKingInCheckFn, wouldMoveLeadToCheck, isCheckmateFunc]);

  const value = {
    gameState,
    currentPlayer,
    makeMove,
    resetGame,
    isKingInCheck,
    isGameOver,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
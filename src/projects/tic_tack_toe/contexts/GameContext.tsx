import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Difficulty, 
  GameContextType, 
  GameMode, 
  GameState, 
  GameStats, 
  GameStatus, 
  Player
} from '../types/game';
import { 
  checkWinner, 
  createEmptyBoard, 
  getNextPlayer, 
  isBoardFull, 
  isValidMove, 
  makeMove
} from '../utils/gameLogic';
import { makeAIMove } from '../utils/aiPlayer';
import { useToast } from "@/components/ui/use-toast";

// Initial game state
const initialGameState: GameState = {
  board: createEmptyBoard(),
  currentPlayer: 'X',
  status: 'playing',
  winningLine: null,
  mode: 'ai',
  difficulty: 'medium',
  moveHistory: []
};

// Initial game stats
const initialGameStats: GameStats = {
  xWins: 0,
  oWins: 0,
  draws: 0,
  totalGames: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastWinner: null
};

// Create game context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Load game stats from localStorage
const loadGameStats = (): GameStats => {
  const storedStats = localStorage.getItem('ticTacToeStats');
  return storedStats ? JSON.parse(storedStats) : initialGameStats;
};

// Save game stats to localStorage
const saveGameStats = (stats: GameStats) => {
  localStorage.setItem('ticTacToeStats', JSON.stringify(stats));
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [gameStats, setGameStats] = useState<GameStats>(loadGameStats);
  const { toast } = useToast();

  // Save stats to localStorage when they change
  useEffect(() => {
    saveGameStats(gameStats);
  }, [gameStats]);

  // AI Move logic
  useEffect(() => {
    // Only make AI move if:
    // 1. Game mode is 'ai'
    // 2. Current player is 'O' (AI is always 'O')
    // 3. Game status is 'playing'
    if (gameState.mode === 'ai' && gameState.currentPlayer === 'O' && gameState.status === 'playing') {
      // Add a small delay for a more natural feel
      const timer = setTimeout(() => {
        const aiMovePosition = makeAIMove(
          gameState.board, 
          gameState.difficulty, 
          'O'
        );
        
        if (aiMovePosition !== -1) {
          makePlayerMove(aiMovePosition);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.mode, gameState.status]);

  // Make a move for the current player
  const makePlayerMove = (position: number) => {
    if (
      gameState.status !== 'playing' || 
      !isValidMove(gameState.board, position)
    ) {
      return;
    }

    // Make the move
    const newBoard = makeMove(gameState.board, position, gameState.currentPlayer);
    
    // Check for win or draw
    const { winner, line } = checkWinner(newBoard);
    
    // Create new history entry
    const newMoveHistory = [
      ...gameState.moveHistory,
      {
        board: [...gameState.board],
        player: gameState.currentPlayer,
        position
      }
    ];

    // Update game status
    let newStatus: GameStatus = gameState.status;
    if (winner) {
      newStatus = 'won';
      // Show win toast
      toast({
        title: `Player ${winner} wins!`,
        description: "Congratulations!",
        duration: 3000,
      });
    } else if (isBoardFull(newBoard)) {
      newStatus = 'draw';
      // Show draw toast
      toast({
        title: "It's a draw!",
        description: "Good game!",
        duration: 3000,
      });
    }

    // Update game state
    setGameState({
      ...gameState,
      board: newBoard,
      currentPlayer: getNextPlayer(gameState.currentPlayer),
      status: newStatus,
      winningLine: line,
      moveHistory: newMoveHistory
    });

    // Update game stats if game is over
    if (winner || isBoardFull(newBoard)) {
      updateGameStats(winner);
    }
  };

  // Update game stats after a game
  const updateGameStats = (winner: Player | null) => {
    setGameStats(prevStats => {
      const newStats = { ...prevStats };
      
      // Update win/draw counts
      if (winner === 'X') {
        newStats.xWins += 1;
        newStats.lastWinner = 'X';
        newStats.currentStreak += 1;
      } else if (winner === 'O') {
        newStats.oWins += 1;
        newStats.lastWinner = 'O';
        newStats.currentStreak = 0; // Reset streak if AI/Player 2 wins
      } else {
        newStats.draws += 1;
        newStats.lastWinner = null;
        newStats.currentStreak = 0; // Reset streak on draw
      }
      
      // Update total games
      newStats.totalGames += 1;
      
      // Update longest streak
      if (newStats.currentStreak > newStats.longestStreak) {
        newStats.longestStreak = newStats.currentStreak;
      }
      
      return newStats;
    });
  };

  // Reset the current game
  const resetGame = () => {
    setGameState({
      ...gameState,
      board: createEmptyBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winningLine: null,
      moveHistory: []
    });
  };

  // Change game mode
  const changeMode = (mode: GameMode) => {
    setGameState({
      ...gameState,
      mode,
      board: createEmptyBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winningLine: null,
      moveHistory: []
    });
    
    toast({
      title: `Mode changed to ${mode === 'ai' ? 'Single Player' : 'Two Player'}`,
      duration: 2000,
    });
  };

  // Change AI difficulty
  const changeDifficulty = (difficulty: Difficulty) => {
    setGameState({
      ...gameState,
      difficulty,
      board: createEmptyBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winningLine: null,
      moveHistory: []
    });
    
    toast({
      title: `Difficulty set to ${difficulty}`,
      duration: 2000,
    });
  };

  // Undo the last move
  const undoMove = () => {
    if (gameState.moveHistory.length === 0) {
      return;
    }
    
    // If playing against AI, undo both AI and player move
    if (gameState.mode === 'ai') {
      // Need to go back 2 moves (player and AI)
      const newHistory = [...gameState.moveHistory];
      const lastMove = newHistory.pop(); // AI move
      const playerMove = newHistory.pop(); // Player move
      
      if (playerMove) {
        setGameState({
          ...gameState,
          board: playerMove.board,
          currentPlayer: playerMove.player,
          status: 'playing',
          winningLine: null,
          moveHistory: newHistory
        });
      }
    } else {
      // Just undo the last move in two player mode
      const newHistory = [...gameState.moveHistory];
      const lastMove = newHistory.pop();
      
      if (lastMove) {
        setGameState({
          ...gameState,
          board: lastMove.board,
          currentPlayer: lastMove.player,
          status: 'playing',
          winningLine: null,
          moveHistory: newHistory
        });
      }
    }
  };

  // Reset all game stats
  const resetStats = () => {
    setGameStats(initialGameStats);
    toast({
      title: "Game statistics reset",
      duration: 2000,
    });
  };

  // Public interface
  const contextValue: GameContextType = {
    gameState,
    gameStats,
    makeMove: makePlayerMove,
    resetGame,
    changeMode,
    changeDifficulty,
    undoMove,
    resetStats
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
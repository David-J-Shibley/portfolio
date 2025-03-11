import React, { createContext, useState, useContext, useEffect } from 'react';
import { Choice, GameResult, GameRound, GameState, GameContextType } from '../types/game';
import { toast } from '@/components/ui/sonner';

// Initial game state
const initialGameState: GameState = {
  playerChoice: null,
  computerChoice: null,
  result: null,
  score: {
    player: 0,
    computer: 0,
  },
  isPlaying: false,
  history: [],
  stats: {
    wins: 0,
    losses: 0,
    draws: 0,
    totalGames: 0,
    winPercentage: 0,
  },
};

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Generate a random choice for the computer
const getRandomChoice = (): Choice => {
  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
};

// Determine the winner of a round
const determineWinner = (playerChoice: Choice, computerChoice: Choice): GameResult => {
  if (playerChoice === computerChoice) {
    return 'draw';
  }

  if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'paper' && computerChoice === 'rock') ||
    (playerChoice === 'scissors' && computerChoice === 'paper')
  ) {
    return 'win';
  }

  return 'lose';
};

// Game provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage if available
  const loadedState = localStorage.getItem('rpsGameState');
  const parsedState = loadedState ? JSON.parse(loadedState) : initialGameState;
  
  // Convert string dates back to Date objects in history
  if (parsedState.history) {
    parsedState.history = parsedState.history.map((round: any) => ({
      ...round,
      timestamp: new Date(round.timestamp),
    }));
  }
  
  const [gameState, setGameState] = useState<GameState>(parsedState);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rpsGameState', JSON.stringify(gameState));
  }, [gameState]);

  // Set the player's choice
  const setPlayerChoice = (choice: Choice) => {
    setGameState((prev: GameState) => ({
      ...prev,
      playerChoice: choice,
    }));
  };

  // Play a round of the game
  const playRound = () => {
    if (!gameState.playerChoice) {
      toast.error('Please select rock, paper, or scissors first');
      return;
    }

    setGameState((prev: GameState) => ({
      ...prev,
      isPlaying: true,
    }));

    // Simulate a delay for the "shake" animation
    setTimeout(() => {
      const computerChoice = getRandomChoice();
      const result = determineWinner(gameState.playerChoice!, computerChoice);

      // Update score
      const newScore = { ...gameState.score };
      if (result === 'win') {
        newScore.player += 1;
      } else if (result === 'lose') {
        newScore.computer += 1;
      }

      // Create a new round object for history
      const newRound: GameRound = {
        id: Date.now().toString(),
        playerChoice: gameState.playerChoice!,
        computerChoice,
        result,
        timestamp: new Date(),
      };

      // Update stats
      const newStats = { ...gameState.stats };
      newStats.totalGames += 1;
      if (result === 'win') {
        newStats.wins += 1;
      } else if (result === 'lose') {
        newStats.losses += 1;
      } else {
        newStats.draws += 1;
      }
      newStats.winPercentage = newStats.totalGames > 0 
        ? Math.round((newStats.wins / newStats.totalGames) * 100) 
        : 0;

      toast(`You ${result}`, {
        description: `${gameState.playerChoice} vs ${computerChoice}`,
      });

      // Update game state
      setGameState((prev: GameState) => ({
        ...prev,
        computerChoice,
        result,
        score: newScore,
        isPlaying: false,
        history: [newRound, ...prev.history].slice(0, 50), // Keep only last 50 rounds
        stats: newStats,
      }));
    }, 1000);
  };

  // Reset the current game
  const resetGame = () => {
    setGameState((prev: GameState) => ({
      ...prev,
      playerChoice: null,
      computerChoice: null,
      result: null,
      isPlaying: false,
    }));
  };

  // Reset the score
  const resetScore = () => {
    toast.success('Score has been reset');
    setGameState((prev: GameState) => ({
      ...prev,
      score: {
        player: 0,
        computer: 0,
      },
    }));
  };

  // Reset the history
  const resetHistory = () => {
    toast.success('History has been cleared');
    setGameState((prev: GameState) => ({
      ...prev,
      history: [],
      stats: {
        wins: 0,
        losses: 0,
        draws: 0,
        totalGames: 0,
        winPercentage: 0,
      },
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setPlayerChoice,
        playRound,
        resetGame,
        resetScore,
        resetHistory,
      }}
    >
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
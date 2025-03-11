export type Choice = 'rock' | 'paper' | 'scissors';

export type GameResult = 'win' | 'lose' | 'draw';

export interface GameRound {
  id: string;
  playerChoice: Choice;
  computerChoice: Choice;
  result: GameResult;
  timestamp: Date;
}

export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
  winPercentage: number;
}

export interface GameState {
  playerChoice: Choice | null;
  computerChoice: Choice | null;
  result: GameResult | null;
  score: {
    player: number;
    computer: number;
  };
  isPlaying: boolean;
  history: GameRound[];
  stats: GameStats;
}

export interface GameContextType {
  gameState: GameState;
  setPlayerChoice: (choice: Choice) => void;
  playRound: () => void;
  resetGame: () => void;
  resetScore: () => void;
  resetHistory: () => void;
}
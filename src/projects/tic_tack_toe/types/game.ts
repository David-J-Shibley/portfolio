
export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];
export type GameMode = 'ai' | 'local';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'playing' | 'won' | 'draw';
export type WinningLine = number[] | null;

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winningLine: WinningLine;
  mode: GameMode;
  difficulty: Difficulty;
  moveHistory: {
    board: Board;
    player: Player;
    position: number;
  }[];
}

export interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  totalGames: number;
  currentStreak: number;
  longestStreak: number;
  lastWinner: Player | null;
}

export interface GameContextType {
  gameState: GameState;
  gameStats: GameStats;
  makeMove: (position: number) => void;
  resetGame: () => void;
  changeMode: (mode: GameMode) => void;
  changeDifficulty: (difficulty: Difficulty) => void;
  undoMove: () => void;
  resetStats: () => void;
}

export interface GameControlsProps {
  onResetGame: () => void;
  onChangeMode: (mode: GameMode) => void;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onUndoMove: () => void;
  onResetStats: () => void;
  currentMode: GameMode;
  currentDifficulty: Difficulty;
  canUndo: boolean;
}

export interface GameBoardProps {
  board: Board;
  winningLine: WinningLine;
  onCellClick: (position: number) => void;
  currentPlayer: Player;
  gameStatus: GameStatus;
}

export interface GameStatsProps {
  stats: GameStats;
  currentPlayer: Player;
  gameStatus: GameStatus;
}

export interface GameHistoryProps {
  history: GameState['moveHistory'];
  currentPlayer: Player;
}

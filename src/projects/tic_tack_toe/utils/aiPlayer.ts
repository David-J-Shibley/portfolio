import { Board, Difficulty, Player } from '../types/game';
import { 
  checkWinner, 
  getAvailableMoves, 
  makeMove, 
  cloneBoard 
} from './gameLogic';

// Get a random move from available positions
const getRandomMove = (board: Board): number => {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;
  
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};

// Minimax algorithm for AI player with alpha-beta pruning
const minimax = (
  board: Board, 
  depth: number, 
  isMaximizing: boolean, 
  player: Player, 
  opponent: Player,
  alpha: number = -Infinity,
  beta: number = Infinity
): { score: number; position?: number } => {
  // Check for terminal states
  const { winner } = checkWinner(board);
  
  if (winner === player) return { score: 10 - depth };
  if (winner === opponent) return { score: depth - 10 };
  if (getAvailableMoves(board).length === 0) return { score: 0 };
  
  // Set a depth limit to make different difficulty levels
  if (depth >= 9) return { score: 0 };
  
  const availableMoves = getAvailableMoves(board);
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove;
    
    for (const move of availableMoves) {
      const newBoard = makeMove(cloneBoard(board), move, player);
      const result = minimax(newBoard, depth + 1, false, player, opponent, alpha, beta);
      
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: bestScore, position: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove;
    
    for (const move of availableMoves) {
      const newBoard = makeMove(cloneBoard(board), move, opponent);
      const result = minimax(newBoard, depth + 1, true, player, opponent, alpha, beta);
      
      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: bestScore, position: bestMove };
  }
};

// Function to make AI move based on difficulty
export const makeAIMove = (board: Board, difficulty: Difficulty, aiPlayer: Player): number => {
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  
  // If board is empty and AI is 'X', choose a strategic first move
  if (getAvailableMoves(board).length === 9 && aiPlayer === 'X') {
    // Take center or corner as first move
    return 4; // Center position
  }

  switch (difficulty) {
    case 'easy':
      // 20% chance of making the best move, 80% random
      if (Math.random() < 0.2) {
        const { position } = minimax(board, 0, true, aiPlayer, humanPlayer);
        return position !== undefined ? position : getRandomMove(board);
      }
      return getRandomMove(board);
      
    case 'medium':
      // 60% chance of making the best move, 40% random
      if (Math.random() < 0.6) {
        const { position } = minimax(board, 0, true, aiPlayer, humanPlayer);
        return position !== undefined ? position : getRandomMove(board);
      }
      return getRandomMove(board);
      
    case 'hard':
      // Always make the best move
      const { position } = minimax(board, 0, true, aiPlayer, humanPlayer);
      return position !== undefined ? position : getRandomMove(board);
      
    default:
      return getRandomMove(board);
  }
};
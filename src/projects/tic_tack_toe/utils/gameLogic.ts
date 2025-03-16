import { Board, CellValue, Player, WinningLine } from '../types/game';

// Winning combinations (rows, columns, diagonals)
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Create an empty board
export const createEmptyBoard = (): Board => Array(9).fill(null);

// Check if a move is valid (cell is empty)
export const isValidMove = (board: Board, position: number): boolean => {
  return position >= 0 && position < 9 && board[position] === null;
};

// Make a move on the board
export const makeMove = (board: Board, position: number, player: Player): Board => {
  if (!isValidMove(board, position)) {
    return board;
  }
  
  const newBoard = [...board];
  newBoard[position] = player;
  return newBoard;
};

// Check for a winner
export const checkWinner = (board: Board): { winner: CellValue; line: WinningLine } => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combination };
    }
  }
  
  return { winner: null, line: null };
};

// Check if the board is full (draw)
export const isBoardFull = (board: Board): boolean => {
  return board.every(cell => cell !== null);
};

// Get the next player
export const getNextPlayer = (currentPlayer: Player): Player => {
  return currentPlayer === 'X' ? 'O' : 'X';
};

// Get available moves from the board
export const getAvailableMoves = (board: Board): number[] => {
  return board.reduce<number[]>((moves, cell, index) => {
    if (cell === null) moves.push(index);
    return moves;
  }, []);
};

// Deep clone the board
export const cloneBoard = (board: Board): Board => [...board];

// Check if the game is over
export const isGameOver = (board: Board): boolean => {
  return checkWinner(board).winner !== null || isBoardFull(board);
};
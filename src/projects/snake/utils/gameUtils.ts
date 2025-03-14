export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Position = { x: number; y: number };

export interface GameState {
  grid: number;
  snake: Position[];
  food: Position | null;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  gameOver: boolean;
  isPaused: boolean;
  speed: number;
}

export interface GameMetrics {
  gamesPlayed: number;
  totalScore: number;
  averageScore: number;
  longestSnake: number;
  foodEaten: number;
  timeElapsed: number;
}

// Returns a random position within the grid that doesn't collide with the snake
export const generateFood = (grid: number, snake: Position[]): Position => {
  let position: Position;
  do {
    position = {
      x: Math.floor(Math.random() * grid),
      y: Math.floor(Math.random() * grid),
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
  
  return position;
};

// Check if a position is outside the grid boundaries
export const isOutOfBounds = (position: Position, grid: number): boolean => {
  return position.x < 0 || position.x >= grid || position.y < 0 || position.y >= grid;
};

// Check if the snake has collided with itself
export const hasCollidedWithSelf = (snake: Position[]): boolean => {
  const head = snake[0];
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
};

// Calculate the speed based on the score - SLOWER VERSION
export const calculateSpeed = (score: number): number => {
  const baseSpeed = 200; // Slower starting speed (was 150)
  const speedReduction = Math.min(70, Math.floor(score / 8) * 5); // Less frequent speed increases
  return Math.max(100, baseSpeed - speedReduction); // Higher minimum speed (more time between moves)
};

// Save high score to local storage
export const saveHighScore = (score: number): void => {
  const currentHighScore = localStorage.getItem('snakeHighScore');
  if (!currentHighScore || parseInt(currentHighScore) < score) {
    localStorage.setItem('snakeHighScore', String(score));
  }
};

// Get high score from local storage
export const getHighScore = (): number => {
  const highScore = localStorage.getItem('snakeHighScore');
  return highScore ? parseInt(highScore) : 0;
};

// Handle key presses for snake direction
export const handleKeyPress = (
  e: KeyboardEvent, 
  currentDirection: Direction, 
  setNextDirection: (dir: Direction) => void
): void => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      if (currentDirection !== "DOWN") setNextDirection("UP");
      break;
    case "ArrowDown":
    case "s":
    case "S":
      if (currentDirection !== "UP") setNextDirection("DOWN");
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      if (currentDirection !== "RIGHT") setNextDirection("LEFT");
      break;
    case "ArrowRight":
    case "d":
    case "D":
      if (currentDirection !== "LEFT") setNextDirection("RIGHT");
      break;
  }
};

// Game metrics utilities
export const saveGameMetrics = (metrics: Partial<GameMetrics>): void => {
  const currentMetrics = getGameMetrics();
  
  const updatedMetrics: GameMetrics = {
    gamesPlayed: metrics.gamesPlayed !== undefined 
      ? currentMetrics.gamesPlayed + metrics.gamesPlayed 
      : currentMetrics.gamesPlayed,
    totalScore: metrics.totalScore !== undefined 
      ? currentMetrics.totalScore + metrics.totalScore 
      : currentMetrics.totalScore,
    averageScore: 0, // Will calculate below
    longestSnake: metrics.longestSnake !== undefined 
      ? Math.max(currentMetrics.longestSnake, metrics.longestSnake)
      : currentMetrics.longestSnake,
    foodEaten: metrics.foodEaten !== undefined 
      ? currentMetrics.foodEaten + metrics.foodEaten 
      : currentMetrics.foodEaten,
    timeElapsed: metrics.timeElapsed !== undefined 
      ? currentMetrics.timeElapsed + metrics.timeElapsed 
      : currentMetrics.timeElapsed,
  };
  
  // Calculate average score
  if (updatedMetrics.gamesPlayed > 0) {
    updatedMetrics.averageScore = Math.round(updatedMetrics.totalScore / updatedMetrics.gamesPlayed);
  }
  
  localStorage.setItem('snakeGameMetrics', JSON.stringify(updatedMetrics));
};

export const getGameMetrics = (): GameMetrics => {
  const metrics = localStorage.getItem('snakeGameMetrics');
  if (!metrics) {
    return {
      gamesPlayed: 0,
      totalScore: 0,
      averageScore: 0,
      longestSnake: 0,
      foodEaten: 0,
      timeElapsed: 0
    };
  }
  return JSON.parse(metrics);
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import GameBoard from "./GameBoard";
import GameControls from "./GameControls";
import GameMetrics from "./GameMetrics";
import { 
  Direction, 
  Position, 
  GameState,
  GameMetrics as GameMetricsType,
  generateFood,
  isOutOfBounds,
  hasCollidedWithSelf,
  calculateSpeed,
  saveHighScore,
  getHighScore,
  handleKeyPress,
  saveGameMetrics,
  getGameMetrics
} from "../utils/gameUtils";
import { BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 }, // Head
  { x: 9, y: 10 },  // Body
  { x: 8, y: 10 }   // Tail
];
const INITIAL_DIRECTION: Direction = "RIGHT";

const SnakeGame: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    grid: GRID_SIZE,
    snake: [...INITIAL_SNAKE],
    food: generateFood(GRID_SIZE, INITIAL_SNAKE),
    direction: INITIAL_DIRECTION,
    nextDirection: INITIAL_DIRECTION,
    score: 0,
    highScore: getHighScore(),
    gameOver: false,
    isPaused: false,
    speed: 200 // Start with slower speed
  });
  
  const [showMetrics, setShowMetrics] = useState(false);
  const [gameMetrics, setGameMetrics] = useState<GameMetricsType>(getGameMetrics());
  const gameLoopRef = useRef<number | null>(null);
  
  // Track game time
  const startTimeRef = useRef<number>(Date.now());
  const foodEatenRef = useRef<number>(0);
  const maxSnakeLengthRef = useRef<number>(INITIAL_SNAKE.length);

  // Handle game over
  const handleGameOver = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    saveHighScore(gameState.score);
    
    // Calculate elapsed time in seconds
    const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    // Update game metrics
    saveGameMetrics({
      gamesPlayed: 1,
      totalScore: gameState.score,
      longestSnake: maxSnakeLengthRef.current,
      foodEaten: foodEatenRef.current,
      timeElapsed: elapsedSeconds
    });
    
    // Update metrics state
    setGameMetrics(getGameMetrics());
    
    setGameState(prev => ({
      ...prev,
      gameOver: true,
      highScore: Math.max(prev.score, prev.highScore)
    }));
    
    toast({
      title: "Game Over!",
      description: `Your score: ${gameState.score}`,
    });
  }, [gameState.score, toast]);

  // Game loop to update snake position
  const gameLoop = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver || prevState.isPaused) return prevState;
      
      // Use the nextDirection state to update the current direction
      const direction = prevState.nextDirection;
      
      // Calculate the new head position based on the current direction
      const head = { ...prevState.snake[0] };
      
      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }
      
      // Check if the snake has hit the wall or itself
      if (
        isOutOfBounds(head, prevState.grid) ||
        hasCollidedWithSelf([head, ...prevState.snake])
      ) {
        handleGameOver();
        return { ...prevState, gameOver: true };
      }
      
      // Create the new snake by adding the new head
      const newSnake = [head];
      
      // Check if the snake has eaten food
      let newFood = prevState.food;
      let newScore = prevState.score;
      let newSpeed = prevState.speed;
      
      const hasEatenFood = newFood && head.x === newFood.x && head.y === newFood.y;
      
      if (hasEatenFood) {
        // Snake has eaten food, don't remove the tail
        newSnake.push(...prevState.snake);
        newFood = generateFood(prevState.grid, newSnake);
        newScore = prevState.score + 1;
        newSpeed = calculateSpeed(newScore);
        
        // Update metrics references
        foodEatenRef.current += 1;
        maxSnakeLengthRef.current = Math.max(maxSnakeLengthRef.current, newSnake.length);
      } else {
        // Snake hasn't eaten food, remove the tail
        newSnake.push(...prevState.snake.slice(0, -1));
      }
      
      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        direction,
        score: newScore,
        speed: newSpeed
      };
    });
    
    // Schedule the next update
    gameLoopRef.current = requestAnimationFrame(() => {
      setTimeout(gameLoop, gameState.speed);
    });
  }, [gameState.speed, handleGameOver]);

  // Start the game loop
  useEffect(() => {
    if (!gameState.gameOver && !gameState.isPaused && !gameLoopRef.current) {
      gameLoop();
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.gameOver, gameState.isPaused, gameLoop]);

  // Keyboard event listeners
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      // Toggle pause on Spacebar
      if (e.code === "Space") {
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
        return;
      }
      
      // Handle arrow keys and WASD
      handleKeyPress(e, gameState.direction, (nextDirection) => {
        setGameState(prev => ({ ...prev, nextDirection }));
      });
    };
    
    window.addEventListener("keydown", keyHandler);
    
    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, [gameState.direction]);

  // Update the direction
  const handleDirectionChange = (nextDirection: Direction) => {
    const currentDirection = gameState.direction;
    
    // Prevent 180-degree turns (e.g. can't go RIGHT when currently going LEFT)
    if (
      (nextDirection === "UP" && currentDirection === "DOWN") ||
      (nextDirection === "DOWN" && currentDirection === "UP") ||
      (nextDirection === "LEFT" && currentDirection === "RIGHT") ||
      (nextDirection === "RIGHT" && currentDirection === "LEFT")
    ) {
      return;
    }
    
    setGameState(prev => ({ ...prev, nextDirection }));
  };

  // Toggle pause
  const handlePauseToggle = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    
    // Restart the game loop if unpausing
    if (gameState.isPaused && !gameLoopRef.current) {
      gameLoop();
    }
  };

  // Reset the game
  const handleRestart = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    // Reset metrics tracking
    startTimeRef.current = Date.now();
    foodEatenRef.current = 0;
    maxSnakeLengthRef.current = INITIAL_SNAKE.length;
    
    setGameState({
      grid: GRID_SIZE,
      snake: [...INITIAL_SNAKE],
      food: generateFood(GRID_SIZE, INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      nextDirection: INITIAL_DIRECTION,
      score: 0,
      highScore: Math.max(gameState.score, gameState.highScore),
      gameOver: false,
      isPaused: false,
      speed: 200 // Start with slower speed
    });
  };

  return (
    <div className="flex flex-col items-center">
      {showMetrics ? (
        <GameMetrics 
          metrics={gameMetrics} 
          onClose={() => setShowMetrics(false)} 
        />
      ) : (
        <>
          <div className="flex justify-end w-full mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetrics(true)}
              className="flex items-center gap-1 text-white hover:bg-gray-700"
            >
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Stats</span>
            </Button>
          </div>
          
          <GameBoard
            gridSize={gameState.grid}
            snake={gameState.snake}
            food={gameState.food}
            isPaused={gameState.isPaused}
            gameOver={gameState.gameOver}
          />
          
          <GameControls
            onDirectionChange={handleDirectionChange}
            onPauseToggle={handlePauseToggle}
            onRestart={handleRestart}
            isPaused={gameState.isPaused}
            gameOver={gameState.gameOver}
            score={gameState.score}
            highScore={gameState.highScore}
          />
        </>
      )}
    </div>
  );
};

export default SnakeGame;
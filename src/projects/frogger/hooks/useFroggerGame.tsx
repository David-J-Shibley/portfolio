import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  GRID_SIZE, 
  COLS, 
  ROWS, 
  Position, 
  Direction, 
  MOVE_DIRECTIONS, 
  Obstacle,
  Level,
  levels
} from '../utils/gameConstants';

// Define game states
type GameState = 'playing' | 'paused' | 'gameOver' | 'levelComplete' | 'gameComplete';

interface GameStatus {
  level: number;
  lives: number;
  score: number;
  gameState: GameState;
}

export const useFroggerGame = () => {
  const { toast } = useToast();
  
  // Game status
  const [status, setStatus] = useState<GameStatus>({
    level: 1,
    lives: 3,
    score: 0,
    gameState: 'playing'
  });
  
  // Current level data
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  
  // Frog position
  const [frogPosition, setFrogPosition] = useState<Position>({ x: Math.floor(COLS / 2), y: ROWS - 1 });
  const [frogDirection, setFrogDirection] = useState<Direction>(MOVE_DIRECTIONS.UP);
  
  // Track completed homes
  const [completedHomes, setCompletedHomes] = useState<boolean[]>(Array(5).fill(false));
  
  // Obstacles
  const [obstacles, setObstacles] = useState<Obstacle[]>(currentLevel.obstacles);
  
  // Animation frame
  const animationFrameId = useRef<number>(0);
  const lastUpdateTime = useRef<number>(0);

  // Load level
  const loadLevel = useCallback((levelNumber: number) => {
    const level = levels.find(l => l.id === levelNumber);
    if (level) {
      setCurrentLevel(level);
      setObstacles(level.obstacles);
      setFrogPosition({ x: Math.floor(COLS / 2), y: ROWS - 1 });
      setCompletedHomes(Array(5).fill(false));
      toast({
        title: level.name,
        description: "Get ready!",
        duration: 2000,
      });
    } else {
      // If no more levels, game is complete
      setStatus(prev => ({ ...prev, gameState: 'gameComplete' }));
      toast({
        title: "Congratulations!",
        description: "You completed all levels!",
        duration: 5000,
      });
    }
  }, [toast]);

  // Initialize the game
  useEffect(() => {
    loadLevel(status.level);
  }, [status.level, loadLevel]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status.gameState !== 'playing') {
        // Handle game restart or unpause
        if (e.key === 'r' || e.key === 'R') {
          resetGame();
          return;
        }
        
        if (e.key === 'Escape' && status.gameState === 'paused') {
          setStatus(prev => ({ ...prev, gameState: 'playing' }));
          return;
        }
        
        return;
      }
      
      switch (e.key) {
        case 'ArrowUp':
          moveFrog(MOVE_DIRECTIONS.UP);
          break;
        case 'ArrowDown':
          moveFrog(MOVE_DIRECTIONS.DOWN);
          break;
        case 'ArrowLeft':
          moveFrog(MOVE_DIRECTIONS.LEFT);
          break;
        case 'ArrowRight':
          moveFrog(MOVE_DIRECTIONS.RIGHT);
          break;
        case 'Escape':
          setStatus(prev => ({ ...prev, gameState: 'paused' }));
          break;
        case 'r':
        case 'R':
          resetGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status.gameState, frogPosition]);

  // Move the frog
  const moveFrog = useCallback((direction: Direction) => {
    setFrogDirection(direction);
    
    setFrogPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch (direction) {
        case MOVE_DIRECTIONS.UP:
          newY = Math.max(0, prev.y - 1);
          break;
        case MOVE_DIRECTIONS.DOWN:
          newY = Math.min(ROWS - 1, prev.y + 1);
          break;
        case MOVE_DIRECTIONS.LEFT:
          newX = Math.max(0, prev.x - 1);
          break;
        case MOVE_DIRECTIONS.RIGHT:
          newX = Math.min(COLS - 1, prev.x + 1);
          break;
      }
      
      return { x: newX, y: newY };
    });
    
    // Add points for forward progress
    if (direction === MOVE_DIRECTIONS.UP) {
      setStatus(prev => ({ ...prev, score: prev.score + 10 }));
    }
  }, []);

  // Check if frog has reached a home
  const checkHomeReached = useCallback(() => {
    const { y, x } = frogPosition;
    
    if (currentLevel.homeRows.includes(y)) {
      // Check if this is a valid home position (we'll consider homes at x=1,3,5,7,9)
      const homePositions = [1, 3, 5, 7, 9];
      const homeIndex = homePositions.indexOf(x);
      
      if (homeIndex >= 0 && !completedHomes[homeIndex]) {
        // Mark this home as completed
        const newCompletedHomes = [...completedHomes];
        newCompletedHomes[homeIndex] = true;
        setCompletedHomes(newCompletedHomes);
        
        // Add points
        setStatus(prev => ({ ...prev, score: prev.score + 50 }));
        
        // Reset frog position
        setFrogPosition({ x: Math.floor(COLS / 2), y: ROWS - 1 });
        
        // Check if level is complete (all homes filled)
        if (newCompletedHomes.every(home => home)) {
          levelComplete();
        }
      } else {
        // Invalid home position, treat as drowning
        frogDeath("Missed the lily pad!");
      }
    }
  }, [frogPosition, completedHomes, currentLevel.homeRows]);

  // Check if frog is on a log or turtle
  const isFrogOnFloatingObject = useCallback((): boolean => {
    const { x, y } = frogPosition;
    
    // Only check if frog is in river
    if (!currentLevel.riverRows.includes(y)) {
      return false;
    }
    
    // Check if frog is on any floating object
    return obstacles.some(obstacle => {
      if (obstacle.position.y === y) {
        const obstacleStart = obstacle.position.x;
        const obstacleEnd = obstacleStart + obstacle.width;
        return x >= obstacleStart && x < obstacleEnd;
      }
      return false;
    });
  }, [frogPosition, obstacles, currentLevel.riverRows]);

  // Check collisions with cars
  const checkCollisions = useCallback(() => {
    const { x, y } = frogPosition;
    
    // Check for car collisions on road
    if (currentLevel.roadRows.includes(y)) {
      const collision = obstacles.some(obstacle => {
        if (obstacle.position.y === y && obstacle.type.startsWith('car')) {
          const obstacleStart = Math.floor(obstacle.position.x);
          const obstacleEnd = obstacleStart + obstacle.width;
          return x >= obstacleStart && x < obstacleEnd;
        }
        return false;
      });
      
      if (collision) {
        frogDeath("Hit by a vehicle!");
        return true;
      }
    }
    
    // Check if frog is in water without being on a log or turtle
    if (currentLevel.riverRows.includes(y) && !isFrogOnFloatingObject()) {
      frogDeath("Fell in the water!");
      return true;
    }
    
    return false;
  }, [frogPosition, obstacles, currentLevel.roadRows, currentLevel.riverRows, isFrogOnFloatingObject]);

  // Frog dies
  const frogDeath = useCallback((reason: string) => {
    const newLives = status.lives - 1;
    
    toast({
      title: reason,
      description: newLives > 0 ? `${newLives} lives remaining` : "Game Over!",
      variant: "destructive",
      duration: 2000,
    });
    
    if (newLives <= 0) {
      setStatus(prev => ({ ...prev, lives: 0, gameState: 'gameOver' }));
    } else {
      setStatus(prev => ({ ...prev, lives: newLives }));
      setFrogPosition({ x: Math.floor(COLS / 2), y: ROWS - 1 });
    }
  }, [status.lives, toast]);

  // Level complete
  const levelComplete = useCallback(() => {
    const nextLevel = status.level + 1;
    
    setStatus(prev => ({ 
      ...prev, 
      gameState: 'levelComplete',
      score: prev.score + 1000,
    }));
    
    toast({
      title: "Level Complete!",
      description: `Bonus: 1000 points! Get ready for level ${nextLevel}`,
      duration: 3000,
    });
    
    // Proceed to next level after delay
    setTimeout(() => {
      if (nextLevel <= levels.length) {
        setStatus(prev => ({ ...prev, level: nextLevel, gameState: 'playing' }));
        loadLevel(nextLevel);
      } else {
        setStatus(prev => ({ ...prev, gameState: 'gameComplete' }));
      }
    }, 3000);
  }, [status.level, loadLevel, toast]);

  // Game loop for updating obstacle positions
  useEffect(() => {
    if (status.gameState !== 'playing') return;

    const updateGame = (timestamp: number) => {
      if (!lastUpdateTime.current) {
        lastUpdateTime.current = timestamp;
      }
      
      const deltaTime = timestamp - lastUpdateTime.current;
      
      if (deltaTime > 16) { // ~60fps
        lastUpdateTime.current = timestamp;
        
        // Update obstacle positions
        setObstacles(prevObstacles => {
          return prevObstacles.map(obstacle => {
            // Calculate new position
            let newX = obstacle.position.x + (obstacle.speed * obstacle.direction * currentLevel.speedMultiplier * deltaTime / 100);
            
            // Wrap around when out of bounds
            if (obstacle.direction > 0 && newX > COLS) {
              newX = -obstacle.width;
            } else if (obstacle.direction < 0 && newX + obstacle.width < 0) {
              newX = COLS;
            }
            
            return {
              ...obstacle,
              position: { ...obstacle.position, x: newX }
            };
          });
        });
        
        // Move frog with logs/turtles if in river
        if (currentLevel.riverRows.includes(frogPosition.y) && isFrogOnFloatingObject()) {
          setFrogPosition(prev => {
            // Find the object frog is on
            const floatingObject = obstacles.find(obstacle => {
              if (obstacle.position.y === prev.y) {
                const obstacleStart = obstacle.position.x;
                const obstacleEnd = obstacleStart + obstacle.width;
                return prev.x >= obstacleStart && prev.x < obstacleEnd;
              }
              return false;
            });
            
            if (floatingObject) {
              // Move frog with the object
              let newX = prev.x + (floatingObject.speed * floatingObject.direction * currentLevel.speedMultiplier * deltaTime / 100);
              
              // Check if frog moved out of bounds
              if (newX < 0 || newX >= COLS) {
                frogDeath("Fell off the edge!");
                return prev;
              }
              
              return { ...prev, x: newX };
            }
            
            return prev;
          });
        }
        
        // Check for collisions and home reached
        checkCollisions();
        checkHomeReached();
      }
      
      animationFrameId.current = requestAnimationFrame(updateGame);
    };
    
    animationFrameId.current = requestAnimationFrame(updateGame);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [
    status.gameState, 
    checkCollisions, 
    checkHomeReached, 
    isFrogOnFloatingObject, 
    currentLevel.riverRows, 
    currentLevel.speedMultiplier,
    frogPosition.y
  ]);

  // Reset game
  const resetGame = useCallback(() => {
    setStatus({
      level: 1,
      lives: 3,
      score: 0,
      gameState: 'playing'
    });
    loadLevel(1);
  }, [loadLevel]);

  // Proceed to next level (for UI controls)
  const nextLevel = useCallback(() => {
    const nextLevelNum = status.level + 1;
    if (nextLevelNum <= levels.length) {
      setStatus(prev => ({ ...prev, level: nextLevelNum, gameState: 'playing' }));
      loadLevel(nextLevelNum);
    }
  }, [status.level, loadLevel]);

  return {
    frogPosition,
    frogDirection,
    obstacles,
    completedHomes,
    status,
    resetGame,
    nextLevel,
    gridSize: GRID_SIZE,
    gameWidth: COLS * GRID_SIZE,
    gameHeight: ROWS * GRID_SIZE,
    currentLevel,
  };
};
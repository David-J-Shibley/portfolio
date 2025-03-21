import React, { useEffect, useReducer, useRef, useState } from 'react';
import { gameReducer, createInitialGameState } from './gameReducer';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import { useToast } from '@/hooks/use-toast';

const AsteroidsGame: React.FC = () => {
  const [gameState, dispatch] = useReducer(gameReducer, null, createInitialGameState);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const { toast } = useToast();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default actions for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'p', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }
      
      if (!keys[e.key]) {
        setKeys(prevKeys => ({ ...prevKeys, [e.key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prevKeys => ({ ...prevKeys, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys]);

  // Game loop
  useEffect(() => {
    if (gameState.gameOver) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    // Handle key inputs for game controls
    if (!gameState.paused && !gameState.isStartScreen) {
      // Set thrust
      if (keys['ArrowUp'] || keys['w']) {
        dispatch({ type: 'SET_THRUST', payload: true });
      } else {
        dispatch({ type: 'SET_THRUST', payload: false });
      }

      // Rotation
      if (keys['ArrowLeft'] || keys['a']) {
        dispatch({ 
          type: 'SET_ROTATION', 
          payload: gameState.spaceship.rotation - 0.1 
        });
      }
      
      if (keys['ArrowRight'] || keys['d']) {
        dispatch({ 
          type: 'SET_ROTATION', 
          payload: gameState.spaceship.rotation + 0.1 
        });
      }

      // Fire bullet
      if (keys[' '] || keys['f']) {
        const bulletDelay = gameState.spaceship.rapidFire ? 5 : 15;
        if (animationRef.current % bulletDelay === 0) {
          dispatch({ type: 'FIRE_BULLET' });
        }
      }
    }

    // Pause/Unpause
    if (keys['p'] || keys['Escape']) {
      if (gameState.paused) {
        dispatch({ type: 'RESUME_GAME' });
      } else if (!gameState.isStartScreen) {
        dispatch({ type: 'PAUSE_GAME' });
      }
      // Clear the key to prevent repeated pausing
      setKeys(prevKeys => ({ ...prevKeys, p: false, Escape: false }));
    }

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update game state
      if (!gameState.paused && !gameState.isStartScreen && !gameState.gameOver) {
        dispatch({ type: 'UPDATE_GAME', payload: deltaTime });
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, keys]);

  // Handle power-up notifications
  useEffect(() => {
    if (gameState.spaceship.shieldActive && !gameState.prevShieldActive) {
      toast({
        title: "Shield Activated!",
        description: "You're protected from asteroids temporarily",
        className: "bg-game-accent1 text-black font-bold"
      });
    }
    
    if (gameState.spaceship.rapidFire && !gameState.prevRapidFire) {
      toast({
        title: "Rapid Fire Activated!",
        description: "Fire bullets faster for a limited time",
        className: "bg-game-accent3 text-black font-bold"
      });
    }
    
    // Store previous state for comparing
    gameState.prevShieldActive = gameState.spaceship.shieldActive;
    gameState.prevRapidFire = gameState.spaceship.rapidFire;
  }, [gameState.spaceship.shieldActive, gameState.spaceship.rapidFire, toast]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      // Force a re-render when window size changes
      setKeys({...keys});
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [keys]);

  // Handle start game
  const handleStartGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  // Handle restart game
  const handleRestartGame = () => {
    dispatch({ type: 'RESET_GAME' });
    dispatch({ type: 'START_GAME' });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-game-bg">
      <GameCanvas gameState={gameState} />
      
      {gameState.isStartScreen ? (
        <StartScreen onStart={handleStartGame} highScore={gameState.highScore} />
      ) : gameState.gameOver ? (
        <GameOverScreen 
          score={gameState.score} 
          highScore={gameState.highScore} 
          onRestart={handleRestartGame} 
        />
      ) : (
        <GameUI 
          score={gameState.score}
          lives={gameState.lives}
          level={gameState.level}
          paused={gameState.paused}
          onResume={() => dispatch({ type: 'RESUME_GAME' })}
        />
      )}
    </div>
  );
};

export default AsteroidsGame;
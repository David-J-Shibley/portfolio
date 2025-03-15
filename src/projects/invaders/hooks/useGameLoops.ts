import { useCallback, useEffect, useRef, useState } from 'react';
import { Entity, GameState, GameControls, Position } from '../types/game';
import { useToast } from '@/components/ui/use-toast';

// Constants
const PLAYER_SPEED = 300;
const PROJECTILE_SPEED = 400;
const ENEMY_PROJECTILE_SPEED = 300;
const FIRE_DELAY = 300;
const ENEMY_ROWS = 5;
const ENEMY_COLS = 11;
const ENEMY_PADDING = 15;
const INITIAL_LIVES = 3;
const SHIELD_SECTIONS = 4;
const SHIELD_COUNT = 4;

const createId = () => Math.random().toString(36).substr(2, 9);

const getInitialState = (width: number, height: number): GameState => {
  const playerWidth = 60;
  const playerHeight = 40;
  const player: Entity = {
    id: 'player',
    position: {
      x: width / 2 - playerWidth / 2,
      y: height - playerHeight - 20,
    },
    size: { width: playerWidth, height: playerHeight },
    speed: PLAYER_SPEED,
    type: 'player',
  };

  // Create enemies
  const enemies: Entity[] = [];
  const enemyWidth = 40;
  const enemyHeight = 30;
  const startX = width / 2 - ((enemyWidth + ENEMY_PADDING) * ENEMY_COLS) / 2;
  const startY = 100;

  for (let row = 0; row < ENEMY_ROWS; row++) {
    for (let col = 0; col < ENEMY_COLS; col++) {
      const points = (ENEMY_ROWS - row) * 10;
      enemies.push({
        id: `enemy-${row}-${col}`,
        position: {
          x: startX + col * (enemyWidth + ENEMY_PADDING),
          y: startY + row * (enemyHeight + ENEMY_PADDING),
        },
        size: { width: enemyWidth, height: enemyHeight },
        speed: 30,
        type: 'enemy',
        points,
      });
    }
  }

  // Create shields
  const shields: Entity[] = [];
  const shieldWidth = 20;
  const shieldHeight = 15;
  const shieldY = height - playerHeight - 80;
  const shieldSpacing = width / (SHIELD_COUNT + 1);

  for (let s = 0; s < SHIELD_COUNT; s++) {
    const baseX = shieldSpacing * (s + 1) - ((shieldWidth * SHIELD_SECTIONS) / 2);
    for (let i = 0; i < SHIELD_SECTIONS; i++) {
      for (let j = 0; j < 2; j++) {
        shields.push({
          id: `shield-${s}-${i}-${j}`,
          position: {
            x: baseX + i * shieldWidth,
            y: shieldY + j * shieldHeight,
          },
          size: { width: shieldWidth, height: shieldHeight },
          speed: 0,
          type: 'shield',
          health: 3,
        });
      }
    }
  }

  return {
    status: 'idle',
    score: 0,
    highScore: parseInt(localStorage.getItem('spaceInvaders_highScore') || '0', 10),
    level: 1,
    lives: INITIAL_LIVES,
    player,
    enemies,
    projectiles: [],
    shields,
    lastFired: 0,
    enemyDirection: 1,
    enemySpeed: 30,
    enemyFireRate: 0.005, // Probability of enemy firing per enemy per frame
    lastTime: 0,
  };
};

export const useGameLoop = (width: number, height: number) => {
  const [gameState, setGameState] = useState<GameState>(getInitialState(width, height));
  const [controls, setControls] = useState<GameControls>({ left: false, right: false, fire: false });
  const animationFrameRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Sound handler function
  const playSound = (sound: string) => {
    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.volume = 0.4;
    audio.play().catch(err => console.error("Error playing sound:", err));
  };

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(getInitialState(width, height));
  }, [width, height]);

  // Start game
  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'playing', lastTime: performance.now() }));
  }, []);

  // Pause game
  const togglePause = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      status: prev.status === 'playing' ? 'paused' : 'playing',
      lastTime: performance.now()
    }));
  }, []);

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setControls(prev => ({ ...prev, left: true }));
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setControls(prev => ({ ...prev, right: true }));
      }
      if (e.key === ' ' || e.key === 'ArrowUp') {
        setControls(prev => ({ ...prev, fire: true }));
      }
      if (e.key === 'p') {
        togglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setControls(prev => ({ ...prev, left: false }));
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setControls(prev => ({ ...prev, right: false }));
      }
      if (e.key === ' ' || e.key === 'ArrowUp') {
        setControls(prev => ({ ...prev, fire: false }));
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && gameState.status === 'playing') {
        setGameState(prev => ({ ...prev, status: 'paused' }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameState.status, togglePause]);

  // Check collision
  const checkCollision = (entity1: Entity, entity2: Entity): boolean => {
    return (
      entity1.position.x < entity2.position.x + entity2.size.width &&
      entity1.position.x + entity1.size.width > entity2.position.x &&
      entity1.position.y < entity2.position.y + entity2.size.height &&
      entity1.position.y + entity1.size.height > entity2.position.y
    );
  };

  // Create a new projectile
  const createProjectile = (position: Position, isEnemy: boolean): Entity => {
    return {
      id: createId(),
      position: { ...position },
      size: { width: isEnemy ? 6 : 8, height: isEnemy ? 12 : 15 },
      speed: isEnemy ? ENEMY_PROJECTILE_SPEED : PROJECTILE_SPEED,
      type: 'projectile',
    };
  };

  // Game loop
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const gameLoop = (timestamp: number) => {
      if (gameState.status !== 'playing') return;

      const deltaTime = (timestamp - gameState.lastTime) / 1000;

      setGameState(prevState => {
        if (prevState.status !== 'playing') return prevState;

        // Update player position
        let newPlayerX = prevState.player.position.x;
        if (controls.left) {
          newPlayerX -= prevState.player.speed * deltaTime;
        }
        if (controls.right) {
          newPlayerX += prevState.player.speed * deltaTime;
        }

        // Keep player in bounds
        newPlayerX = Math.max(0, Math.min(width - prevState.player.size.width, newPlayerX));

        const updatedPlayer = {
          ...prevState.player,
          position: { ...prevState.player.position, x: newPlayerX },
        };

        // Handle player firing
        const now = timestamp;
        let updatedProjectiles = [...prevState.projectiles];
        let lastFired = prevState.lastFired;

        if (controls.fire && now - prevState.lastFired > FIRE_DELAY) {
          const projectilePosition = {
            x: updatedPlayer.position.x + updatedPlayer.size.width / 2 - 4,
            y: updatedPlayer.position.y - 15,
          };
          updatedProjectiles.push(createProjectile(projectilePosition, false));
          lastFired = now;
          playSound('laser');
        }

        // Update enemy positions
        const updatedEnemies = [...prevState.enemies];
        let newEnemyDirection = prevState.enemyDirection;
        let hitEdge = false;

        // Check if any enemy has hit the edge
        updatedEnemies.forEach(enemy => {
          const newX = enemy.position.x + prevState.enemySpeed * deltaTime * prevState.enemyDirection;
          if (newX <= 0 || newX + enemy.size.width >= width) {
            hitEdge = true;
          }
        });

        // Update enemy positions
        if (hitEdge) {
          newEnemyDirection = -prevState.enemyDirection;
          updatedEnemies.forEach(enemy => {
            enemy.position.y += 20;
          });
        } else {
          updatedEnemies.forEach(enemy => {
            enemy.position.x += prevState.enemySpeed * deltaTime * prevState.enemyDirection;
          });
        }

        // Enemy firing
        updatedEnemies.forEach(enemy => {
          if (Math.random() < prevState.enemyFireRate * deltaTime) {
            const projectilePosition = {
              x: enemy.position.x + enemy.size.width / 2 - 3,
              y: enemy.position.y + enemy.size.height,
            };
            updatedProjectiles.push(createProjectile(projectilePosition, true));
            playSound('enemyFire');
          }
        });

        // Update projectiles
        updatedProjectiles = updatedProjectiles.filter(projectile => {
          const isPlayerProjectile = projectile.position.y < 0;
          const isEnemyProjectile = projectile.position.y > height;
          
          // Move projectile
          if (projectile.position.y < 0) {
            // Player projectile moving up
            projectile.position.y -= projectile.speed * deltaTime;
          } else {
            // Enemy projectile moving down
            projectile.position.y += projectile.speed * deltaTime;
          }
          
          return !isPlayerProjectile && !isEnemyProjectile;
        });

        // Check for collisions
        let updatedScore = prevState.score;
        let updatedLives = prevState.lives;
        let gameOver = false;
        const updatedShields = [...prevState.shields];

        // Projectile collision with enemies
        updatedProjectiles = updatedProjectiles.filter(projectile => {
          // Skip enemy projectiles
          if (projectile.position.y > 0) return true;

          let hit = false;
          updatedEnemies.forEach((enemy, idx) => {
            if (hit) return;
            if (checkCollision(projectile, enemy)) {
              updatedEnemies.splice(idx, 1);
              updatedScore += enemy.points || 10;
              hit = true;
              playSound('explosion');
            }
          });
          return !hit;
        });

        // Projectile collision with player
        updatedProjectiles = updatedProjectiles.filter(projectile => {
          // Skip player projectiles
          if (projectile.position.y < 0) return true;

          if (checkCollision(projectile, updatedPlayer)) {
            updatedLives--;
            playSound('playerHit');
            if (updatedLives <= 0) {
              gameOver = true;
              playSound('gameOver');
            }
            return false;
          }
          return true;
        });

        // Projectile collision with shields
        updatedProjectiles = updatedProjectiles.filter(projectile => {
          let hit = false;
          updatedShields.forEach((shield, idx) => {
            if (hit) return;
            if (checkCollision(projectile, shield)) {
              shield.health = (shield.health || 0) - 1;
              if ((shield.health || 0) <= 0) {
                updatedShields.splice(idx, 1);
              }
              hit = true;
            }
          });
          return !hit;
        });

        // Check if enemies reached the bottom
        updatedEnemies.forEach(enemy => {
          if (enemy.position.y + enemy.size.height >= updatedPlayer.position.y) {
            gameOver = true;
            playSound('gameOver');
          }
        });

        // Next level if all enemies defeated
        if (updatedEnemies.length === 0) {
          const newLevel = prevState.level + 1;
          playSound('levelUp');
          
          toast({
            title: "Level Up!",
            description: `Level ${newLevel}`,
          });

          // Create new enemies for next level
          const enemyWidth = 40;
          const enemyHeight = 30;
          const startX = width / 2 - ((enemyWidth + ENEMY_PADDING) * ENEMY_COLS) / 2;
          const startY = 100;

          for (let row = 0; row < ENEMY_ROWS; row++) {
            for (let col = 0; col < ENEMY_COLS; col++) {
              const points = (ENEMY_ROWS - row) * 10 * newLevel;
              updatedEnemies.push({
                id: `enemy-${row}-${col}`,
                position: {
                  x: startX + col * (enemyWidth + ENEMY_PADDING),
                  y: startY + row * (enemyHeight + ENEMY_PADDING),
                },
                size: { width: enemyWidth, height: enemyHeight },
                speed: 30,
                type: 'enemy',
                points,
              });
            }
          }

          return {
            ...prevState,
            enemies: updatedEnemies,
            level: newLevel,
            enemySpeed: prevState.enemySpeed + 10,
            enemyFireRate: prevState.enemyFireRate * 1.2,
            score: updatedScore,
            lastTime: timestamp,
          };
        }

        // Update game state
        if (gameOver) {
          const newHighScore = updatedScore > prevState.highScore ? updatedScore : prevState.highScore;
          localStorage.setItem('spaceInvaders_highScore', newHighScore.toString());
          
          return {
            ...prevState,
            status: 'gameover',
            score: updatedScore,
            highScore: newHighScore,
            lastTime: timestamp,
          };
        }

        return {
          ...prevState,
          player: updatedPlayer,
          enemies: updatedEnemies,
          projectiles: updatedProjectiles,
          shields: updatedShields,
          score: updatedScore,
          lives: updatedLives,
          lastFired,
          enemyDirection: newEnemyDirection,
          lastTime: timestamp,
        };
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [controls, gameState.status, gameState.lastTime, width, height, toast]);

  return {
    gameState,
    startGame,
    resetGame,
    togglePause,
    setControls,
  };
};
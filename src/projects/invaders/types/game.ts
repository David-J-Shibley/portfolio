export type Position = {
    x: number;
    y: number;
  };
  
  export type Size = {
    width: number;
    height: number;
  };
  
  export type Entity = {
    id: string;
    position: Position;
    size: Size;
    speed: number;
    type: 'player' | 'enemy' | 'projectile' | 'shield';
    health?: number;
    points?: number;
    direction?: number;
  };
  
  export type GameState = {
    status: 'idle' | 'playing' | 'paused' | 'gameover';
    score: number;
    highScore: number;
    level: number;
    lives: number;
    player: Entity;
    enemies: Entity[];
    projectiles: Entity[];
    shields: Entity[];
    lastFired: number;
    enemyDirection: number;
    enemySpeed: number;
    enemyFireRate: number;
    lastTime: number;
  };
  
  export type GameControls = {
    left: boolean;
    right: boolean;
    fire: boolean;
  };
  
  export type Sound = 'laser' | 'explosion' | 'enemyFire' | 'playerHit' | 'gameOver' | 'levelUp';
  
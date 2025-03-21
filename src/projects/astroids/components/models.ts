export interface Point {
    x: number;
    y: number;
  }
  
  export interface Vector {
    x: number;
    y: number;
  }
  
  export interface GameObject {
    position: Point;
    velocity: Vector;
    rotation: number;
    scale: number;
    active: boolean;
  }
  
  export interface Spaceship extends GameObject {
    thrusting: boolean;
    shieldActive: boolean;
    invincible: boolean;
    invincibilityTimer: number;
    rapidFire: boolean;
    rapidFireTimer: number;
  }
  
  export interface Asteroid extends GameObject {
    size: 'large' | 'medium' | 'small';
    vertices: Point[];
    rotationSpeed: number;
  }
  
  export interface Bullet extends GameObject {
    lifespan: number;
  }
  
  export interface Particle extends GameObject {
    color: string;
    lifespan: number;
    size: number;
  }
  
  export type PowerUpType = 'shield' | 'rapidFire' | 'extraLife';
  
  export interface PowerUp extends GameObject {
    type: PowerUpType;
    lifespan: number;
  }
  
  export interface GameState {
    score: number;
    lives: number;
    level: number;
    gameOver: boolean;
    paused: boolean;
    spaceship: Spaceship;
    asteroids: Asteroid[];
    bullets: Bullet[];
    particles: Particle[];
    powerUps: PowerUp[];
    isStartScreen: boolean;
    highScore: number;
    prevShieldActive: boolean;
    prevRapidFire: boolean;
  }
  
  export type GameAction = 
    | { type: 'START_GAME' }
    | { type: 'PAUSE_GAME' }
    | { type: 'RESUME_GAME' }
    | { type: 'GAME_OVER' }
    | { type: 'NEW_LEVEL' }
    | { type: 'ADD_SCORE'; payload: number }
    | { type: 'LOSE_LIFE' }
    | { type: 'ADD_LIFE' }
    | { type: 'SET_THRUST'; payload: boolean }
    | { type: 'SET_ROTATION'; payload: number }
    | { type: 'FIRE_BULLET' }
    | { type: 'ACTIVATE_SHIELD' }
    | { type: 'ACTIVATE_RAPID_FIRE' }
    | { type: 'UPDATE_GAME'; payload: number }
    | { type: 'RESET_GAME' };
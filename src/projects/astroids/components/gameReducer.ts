import { GameState, GameAction, Asteroid, Point, Bullet, Spaceship, PowerUp, Particle, PowerUpType } from './models';

const SHIP_SIZE = 20;
const ASTEROID_POINTS = { large: 20, medium: 50, small: 100 };
const INVINCIBILITY_DURATION = 3000; // 3 seconds
const POWERUP_DURATION = 5000; // 5 seconds
const BULLET_LIFESPAN = 60; // frames
const POWERUP_LIFESPAN = 300; // frames
const PARTICLE_LIFESPAN = 60; // frames

const createInitialState = (): GameState => ({
  score: 0,
  lives: 3,
  level: 0,
  gameOver: false,
  paused: false,
  isStartScreen: true,
  highScore: parseInt(localStorage.getItem('asteroids-highscore') || '0'),
  spaceship: {
    position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    velocity: { x: 0, y: 0 },
    rotation: 0,
    scale: 1,
    active: true,
    thrusting: false,
    shieldActive: false,
    invincible: false,
    invincibilityTimer: 0,
    rapidFire: false,
    rapidFireTimer: 0
  },
  asteroids: [],
  bullets: [],
  particles: [],
  powerUps: [],
  prevShieldActive: false,
  prevRapidFire: false,
});

// Helper to create random asteroids at the edges of the screen
const createAsteroids = (count: number, level: number): Asteroid[] => {
  const asteroids: Asteroid[] = [];
  
  for (let i = 0; i < count; i++) {
    // Position asteroids around the edges of the screen
    let x, y;
    const side = Math.floor(Math.random() * 4);
    
    switch (side) {
      case 0: // top
        x = Math.random() * window.innerWidth;
        y = -50;
        break;
      case 1: // right
        x = window.innerWidth + 50;
        y = Math.random() * window.innerHeight;
        break;
      case 2: // bottom
        x = Math.random() * window.innerWidth;
        y = window.innerHeight + 50;
        break;
      default: // left
        x = -50;
        y = Math.random() * window.innerHeight;
        break;
    }
    
    // Random velocity towards the center with increasing speed based on level
    const speedMultiplier = 1 + level * 0.1; // Increase speed by 10% per level
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const angle = Math.atan2(centerY - y, centerX - x);
    
    // Create random polygon shape for the asteroid
    const vertices: Point[] = [];
    const size = 'large';
    const numVertices = Math.floor(Math.random() * 3) + 8; // 8-10 vertices
    const radius = 40; // For large asteroids
    
    for (let j = 0; j < numVertices; j++) {
      const vertexAngle = (j / numVertices) * Math.PI * 2;
      const distance = radius * (0.8 + Math.random() * 0.4); // 80-120% of radius
      vertices.push({
        x: Math.cos(vertexAngle) * distance,
        y: Math.sin(vertexAngle) * distance
      });
    }
    
    asteroids.push({
      position: { x, y },
      velocity: { 
        x: Math.cos(angle) * speedMultiplier * (Math.random() + 0.5), 
        y: Math.sin(angle) * speedMultiplier * (Math.random() + 0.5) 
      },
      rotation: 0,
      scale: 1,
      active: true,
      size,
      vertices,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    });
  }
  
  return asteroids;
};

// Helper to create bullet
const createBullet = (spaceship: Spaceship): Bullet => {
  const angle = spaceship.rotation;
  const speed = 8;
  return {
    position: { ...spaceship.position },
    velocity: {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    },
    rotation: angle,
    scale: 1,
    active: true,
    lifespan: BULLET_LIFESPAN
  };
};

// Helper to create a power-up at a random position
const createPowerUp = (position: Point): PowerUp => {
  const types: PowerUpType[] = ['shield', 'rapidFire', 'extraLife'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    position: { ...position },
    velocity: { 
      x: (Math.random() - 0.5) * 0.5, 
      y: (Math.random() - 0.5) * 0.5 
    },
    rotation: 0,
    scale: 1,
    active: true,
    type,
    lifespan: POWERUP_LIFESPAN
  };
};

// Helper to create explosion particles
const createExplosionParticles = (position: Point, count: number, color: string): Particle[] => {
  const particles: Particle[] = [];
  
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;
    
    particles.push({
      position: { ...position },
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      },
      rotation: Math.random() * Math.PI * 2,
      scale: 1,
      active: true,
      color,
      lifespan: PARTICLE_LIFESPAN * (0.5 + Math.random() * 0.5), // Randomize lifespan
      size: Math.random() * 3 + 1 // Random size between 1-4
    });
  }
  
  return particles;
};

// Game physics and collision detection helpers
const updateSpaceship = (spaceship: Spaceship, deltaTime: number): Spaceship => {
  if (!spaceship.active) return spaceship;
  
  // Update invincibility timer
  let invincible = spaceship.invincible;
  let invincibilityTimer = spaceship.invincibilityTimer;
  if (spaceship.invincible) {
    invincibilityTimer -= deltaTime;
    if (invincibilityTimer <= 0) {
      invincible = false;
      invincibilityTimer = 0;
    }
  }
  
  // Update rapid fire timer
  let rapidFire = spaceship.rapidFire;
  let rapidFireTimer = spaceship.rapidFireTimer;
  if (spaceship.rapidFire) {
    rapidFireTimer -= deltaTime;
    if (rapidFireTimer <= 0) {
      rapidFire = false;
      rapidFireTimer = 0;
    }
  }
  
  // Apply thrust
  let velocity = { ...spaceship.velocity };
  if (spaceship.thrusting) {
    const thrust = 0.05;
    velocity.x += Math.cos(spaceship.rotation) * thrust * deltaTime;
    velocity.y += Math.sin(spaceship.rotation) * thrust * deltaTime;
  }
  
  // Apply drag
  const drag = 0.99;
  velocity.x *= drag;
  velocity.y *= drag;
  
  // Update position
  let position = {
    x: spaceship.position.x + velocity.x * deltaTime,
    y: spaceship.position.y + velocity.y * deltaTime
  };
  
  // Wrap around screen
  if (position.x < -SHIP_SIZE) position.x = window.innerWidth + SHIP_SIZE;
  if (position.x > window.innerWidth + SHIP_SIZE) position.x = -SHIP_SIZE;
  if (position.y < -SHIP_SIZE) position.y = window.innerHeight + SHIP_SIZE;
  if (position.y > window.innerHeight + SHIP_SIZE) position.y = -SHIP_SIZE;
  
  return {
    ...spaceship,
    position,
    velocity,
    invincible,
    invincibilityTimer,
    rapidFire,
    rapidFireTimer
  };
};

const updateAsteroid = (asteroid: Asteroid, deltaTime: number): Asteroid => {
  // Update position
  const position = {
    x: asteroid.position.x + asteroid.velocity.x * deltaTime,
    y: asteroid.position.y + asteroid.velocity.y * deltaTime
  };
  
  // Update rotation
  const rotation = asteroid.rotation + asteroid.rotationSpeed * deltaTime;
  
  // Wrap around screen
  const radius = asteroid.size === 'large' ? 40 : asteroid.size === 'medium' ? 20 : 10;
  if (position.x < -radius) position.x = window.innerWidth + radius;
  if (position.x > window.innerWidth + radius) position.x = -radius;
  if (position.y < -radius) position.y = window.innerHeight + radius;
  if (position.y > window.innerHeight + radius) position.y = -radius;
  
  return {
    ...asteroid,
    position,
    rotation
  };
};

const updateBullet = (bullet: Bullet, deltaTime: number): Bullet => {
  // Update position
  const position = {
    x: bullet.position.x + bullet.velocity.x * deltaTime,
    y: bullet.position.y + bullet.velocity.y * deltaTime
  };
  
  // Update lifespan
  const lifespan = bullet.lifespan - 1;
  const active = lifespan > 0;
  
  // Check if bullet is off-screen
  const isOffScreen = 
    position.x < 0 || 
    position.x > window.innerWidth || 
    position.y < 0 || 
    position.y > window.innerHeight;
  
  return {
    ...bullet,
    position,
    lifespan,
    active: active && !isOffScreen
  };
};

const updateParticle = (particle: Particle): Particle => {
  // Update position
  const position = {
    x: particle.position.x + particle.velocity.x,
    y: particle.position.y + particle.velocity.y
  };
  
  // Update lifespan
  const lifespan = particle.lifespan - 1;
  const active = lifespan > 0;
  
  return {
    ...particle,
    position,
    lifespan,
    active
  };
};

const updatePowerUp = (powerUp: PowerUp): PowerUp => {
  // Update position
  const position = {
    x: powerUp.position.x + powerUp.velocity.x,
    y: powerUp.position.y + powerUp.velocity.y
  };
  
  // Wrap around screen
  const size = 15;
  if (position.x < -size) position.x = window.innerWidth + size;
  if (position.x > window.innerWidth + size) position.x = -size;
  if (position.y < -size) position.y = window.innerHeight + size;
  if (position.y > window.innerHeight + size) position.y = -size;
  
  // Update lifespan
  const lifespan = powerUp.lifespan - 1;
  const active = lifespan > 0;
  
  return {
    ...powerUp,
    position,
    lifespan,
    active
  };
};

// Collision detection
const distance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const checkCollisions = (state: GameState): GameState => {
  let { spaceship, asteroids, bullets, powerUps, score, lives, particles } = state;
  
  // Check for bullet-asteroid collisions
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    if (!bullet.active) continue;
    
    for (let j = 0; j < asteroids.length; j++) {
      const asteroid = asteroids[j];
      if (!asteroid.active) continue;
      
      const radius = asteroid.size === 'large' ? 40 : asteroid.size === 'medium' ? 20 : 10;
      if (distance(bullet.position, asteroid.position) < radius) {
        // Mark bullet as inactive
        bullets[i] = { ...bullet, active: false };
        
        // Mark asteroid as inactive
        asteroids[j] = { ...asteroid, active: false };
        
        // Add to score
        score += ASTEROID_POINTS[asteroid.size];
        
        // Create explosion particles
        particles = [
          ...particles,
          ...createExplosionParticles(
            asteroid.position, 
            asteroid.size === 'large' ? 15 : asteroid.size === 'medium' ? 10 : 5,
            asteroid.size === 'large' ? '#FF00FF' : asteroid.size === 'medium' ? '#00FFFF' : '#FFFF00'
          )
        ];
        
        // Break asteroid into smaller pieces or spawn a power-up
        if (asteroid.size === 'large' || asteroid.size === 'medium') {
          const newSize = asteroid.size === 'large' ? 'medium' : 'small';
          const newRadius = newSize === 'medium' ? 20 : 10;
          
          // Create smaller asteroids
          for (let k = 0; k < 2; k++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1 + 1;
            
            // Create random polygon shape for new asteroid
            const numVertices = Math.floor(Math.random() * 3) + 7; // 7-9 vertices
            const vertices: Point[] = [];
            
            for (let v = 0; v < numVertices; v++) {
              const vertexAngle = (v / numVertices) * Math.PI * 2;
              const distance = newRadius * (0.7 + Math.random() * 0.6); // 70-130% of radius
              vertices.push({
                x: Math.cos(vertexAngle) * distance,
                y: Math.sin(vertexAngle) * distance
              });
            }
            
            asteroids.push({
              position: { ...asteroid.position },
              velocity: {
                x: asteroid.velocity.x * 0.8 + Math.cos(angle) * speed,
                y: asteroid.velocity.y * 0.8 + Math.sin(angle) * speed
              },
              rotation: Math.random() * Math.PI * 2,
              scale: 1,
              active: true,
              size: newSize,
              vertices,
              rotationSpeed: (Math.random() - 0.5) * 0.04,
            });
          }
          
          // 15% chance to spawn a power-up from medium asteroids
          if (newSize === 'small' && Math.random() < 0.15) {
            powerUps.push(createPowerUp(asteroid.position));
          }
        }
        
        break; // Break out of the asteroid loop since this bullet hit something
      }
    }
  }
  
  // Check for ship-asteroid collisions (only if not invincible)
  if (spaceship.active && !spaceship.invincible && !spaceship.shieldActive) {
    for (let i = 0; i < asteroids.length; i++) {
      const asteroid = asteroids[i];
      if (!asteroid.active) continue;
      
      const radius = asteroid.size === 'large' ? 35 : asteroid.size === 'medium' ? 20 : 10;
      if (distance(spaceship.position, asteroid.position) < radius + 15) {
        // Create explosion particles
        particles = [
          ...particles,
          ...createExplosionParticles(spaceship.position, 30, '#FFFFFF')
        ];
        
        // Lose a life
        lives -= 1;
        
        if (lives <= 0) {
          // Game over
          return {
            ...state,
            asteroids,
            bullets,
            powerUps,
            particles,
            score,
            lives: 0,
            spaceship: { ...spaceship, active: false },
            gameOver: true
          };
        } else {
          // Reset spaceship position
          return {
            ...state,
            asteroids,
            bullets,
            powerUps,
            particles,
            score,
            lives,
            spaceship: {
              ...spaceship,
              position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
              velocity: { x: 0, y: 0 },
              rotation: 0,
              invincible: true,
              invincibilityTimer: INVINCIBILITY_DURATION
            }
          };
        }
      }
    }
  }
  
  // Check for ship-powerup collisions
  for (let i = 0; i < powerUps.length; i++) {
    const powerUp = powerUps[i];
    if (!powerUp.active) continue;
    
    if (distance(spaceship.position, powerUp.position) < 25) {
      // Mark power-up as inactive
      powerUps[i] = { ...powerUp, active: false };
      
      // Apply power-up effect
      switch (powerUp.type) {
        case 'shield':
          spaceship = { ...spaceship, shieldActive: true };
          break;
        case 'rapidFire':
          spaceship = { 
            ...spaceship, 
            rapidFire: true, 
            rapidFireTimer: POWERUP_DURATION 
          };
          break;
        case 'extraLife':
          lives += 1;
          break;
      }
      
      // Create particles for power-up collection
      const powerUpColor = 
        powerUp.type === 'shield' ? '#00FFFF' : 
        powerUp.type === 'rapidFire' ? '#FFFF00' : 
        '#00FF00';
      
      particles = [
        ...particles,
        ...createExplosionParticles(powerUp.position, 15, powerUpColor)
      ];
    }
  }
  
  return {
    ...state,
    spaceship,
    asteroids,
    bullets,
    powerUps,
    particles,
    score,
    lives
  };
};

// Main reducer function
export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      const initialState = createInitialState();
      return {
        ...initialState,
        isStartScreen: false,
        level: 1,
        asteroids: createAsteroids(4, 1) // Start with 4 asteroids
      };
      
    case 'PAUSE_GAME':
      return { ...state, paused: true };
      
    case 'RESUME_GAME':
      return { ...state, paused: false };
      
    case 'GAME_OVER':
      // Save high score if better than current
      if (state.score > state.highScore) {
        localStorage.setItem('asteroids-highscore', state.score.toString());
      }
      
      return { 
        ...state, 
        gameOver: true, 
        highScore: Math.max(state.score, state.highScore)
      };
      
    case 'RESET_GAME':
      return createInitialState();
      
    case 'NEW_LEVEL':
      const newLevel = state.level + 1;
      return {
        ...state,
        level: newLevel,
        asteroids: [
          ...state.asteroids,
          ...createAsteroids(2 + Math.min(newLevel, 5), newLevel) // Add more asteroids each level, up to a max
        ]
      };
      
    case 'ADD_SCORE':
      return { ...state, score: state.score + action.payload };
      
    case 'LOSE_LIFE':
      const lives = state.lives - 1;
      if (lives <= 0) {
        // Save high score if better than current
        if (state.score > state.highScore) {
          localStorage.setItem('asteroids-highscore', state.score.toString());
        }
        
        return { 
          ...state, 
          lives: 0, 
          gameOver: true,
          highScore: Math.max(state.score, state.highScore)
        };
      }
      
      return {
        ...state,
        lives,
        spaceship: {
          ...state.spaceship,
          position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
          velocity: { x: 0, y: 0 },
          rotation: 0,
          invincible: true,
          invincibilityTimer: INVINCIBILITY_DURATION
        }
      };
      
    case 'ADD_LIFE':
      return { ...state, lives: state.lives + 1 };
      
    case 'SET_THRUST':
      return {
        ...state,
        spaceship: { ...state.spaceship, thrusting: action.payload }
      };
      
    case 'SET_ROTATION':
      return {
        ...state,
        spaceship: { ...state.spaceship, rotation: action.payload }
      };
      
    case 'FIRE_BULLET':
      if (!state.spaceship.active) return state;
      
      const newBullet = createBullet(state.spaceship);
      return {
        ...state,
        bullets: [...state.bullets, newBullet]
      };
      
    case 'ACTIVATE_SHIELD':
      return {
        ...state,
        spaceship: { ...state.spaceship, shieldActive: true }
      };
      
    case 'ACTIVATE_RAPID_FIRE':
      return {
        ...state,
        spaceship: { 
          ...state.spaceship, 
          rapidFire: true, 
          rapidFireTimer: POWERUP_DURATION 
        }
      };
      
    case 'UPDATE_GAME': {
      if (state.paused || state.gameOver || state.isStartScreen) {
        return state;
      }
      
      const deltaTime = action.payload;
      
      // Update spaceship
      const spaceship = updateSpaceship(state.spaceship, deltaTime);
      
      // Update all game objects
      let asteroids = state.asteroids
        .map(asteroid => updateAsteroid(asteroid, deltaTime))
        .filter(asteroid => asteroid.active);
      
      let bullets = state.bullets
        .map(bullet => updateBullet(bullet, deltaTime))
        .filter(bullet => bullet.active);
      
      let particles = state.particles
        .map(updateParticle)
        .filter(particle => particle.active);
      
      let powerUps = state.powerUps
        .map(updatePowerUp)
        .filter(powerUp => powerUp.active);
      
      // Check for collisions
      const collisionState = checkCollisions({
        ...state,
        spaceship,
        asteroids,
        bullets,
        particles,
        powerUps
      });
      
      // Check if all asteroids are destroyed to progress to next level
      if (collisionState.asteroids.length === 0) {
        return gameReducer(collisionState, { type: 'NEW_LEVEL' });
      }
      
      return collisionState;
    }
    
    default:
      return state;
  }
};

export const createInitialGameState = createInitialState;
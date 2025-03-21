import React, { useRef, useEffect } from 'react';
import { GameState, Asteroid, Bullet, Particle, PowerUp } from './models';

interface GameCanvasProps {
  gameState: GameState;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw starfield background
    drawStarfield(ctx, canvas.width, canvas.height);

    // Draw game objects if not on start screen
    if (!gameState.isStartScreen) {
      // Draw bullets
      gameState.bullets.forEach(bullet => {
        if (bullet.active) {
          drawBullet(ctx, bullet);
        }
      });

      // Draw spaceship
      if (gameState.spaceship.active) {
        drawSpaceship(ctx, gameState.spaceship);
      }

      // Draw asteroids
      gameState.asteroids.forEach(asteroid => {
        if (asteroid.active) {
          drawAsteroid(ctx, asteroid);
        }
      });

      // Draw particles
      gameState.particles.forEach(particle => {
        if (particle.active) {
          drawParticle(ctx, particle);
        }
      });

      // Draw power-ups
      gameState.powerUps.forEach(powerUp => {
        if (powerUp.active) {
          drawPowerUp(ctx, powerUp);
        }
      });
    }
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
    />
  );
};

// Drawing functions
const drawStarfield = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Use cached starfield for performance if available
  if (!(globalThis as any).starfield) {
    const starCount = 150;
    (globalThis as any).starfield = [];
    
    for (let i = 0; i < starCount; i++) {
      (globalThis as any).starfield.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.5 + 0.5
      });
    }
  }
  
  // Draw stars
  (globalThis as any).starfield.forEach((star: any) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
};

const drawSpaceship = (ctx: CanvasRenderingContext2D, spaceship: any) => {
  ctx.save();
  ctx.translate(spaceship.position.x, spaceship.position.y);
  ctx.rotate(spaceship.rotation);
  
  // Flashing effect when invincible
  const visible = spaceship.invincible ? 
    Math.floor(Date.now() / 100) % 2 === 0 : 
    true;
  
  if (visible) {
    // Draw ship body
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-10, -10);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    
    // Change ship color if rapid fire is active
    if (spaceship.rapidFire) {
      ctx.fillStyle = '#FFFF00';
      ctx.strokeStyle = '#FFFFFF';
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#00FFFF';
    }
    
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    
    // Draw thrust flame if thrusting
    if (spaceship.thrusting) {
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(-15, -5);
      ctx.lineTo(-20 - (Math.random() * 5), 0);
      ctx.lineTo(-15, 5);
      ctx.closePath();
      ctx.fillStyle = '#FF6600';
      ctx.fill();
      
      // Inner flame
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(-12, -3);
      ctx.lineTo(-15 - (Math.random() * 3), 0);
      ctx.lineTo(-12, 3);
      ctx.closePath();
      ctx.fillStyle = '#FFFF00';
      ctx.fill();
    }
    
    // Draw shield if active
    if (spaceship.shieldActive) {
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Shield effect
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }
  
  ctx.restore();
};

const drawAsteroid = (ctx: CanvasRenderingContext2D, asteroid: Asteroid) => {
  ctx.save();
  ctx.translate(asteroid.position.x, asteroid.position.y);
  ctx.rotate(asteroid.rotation);
  
  // Different colors for different asteroid sizes
  if (asteroid.size === 'large') {
    ctx.strokeStyle = '#FF00FF'; // Magenta
    ctx.fillStyle = 'rgba(255, 0, 255, 0.15)';
  } else if (asteroid.size === 'medium') {
    ctx.strokeStyle = '#00FFFF'; // Cyan
    ctx.fillStyle = 'rgba(0, 255, 255, 0.15)';
  } else {
    ctx.strokeStyle = '#FFFF00'; // Yellow
    ctx.fillStyle = 'rgba(255, 255, 0, 0.15)';
  }
  
  ctx.lineWidth = 2;
  
  // Draw asteroid using vertices
  ctx.beginPath();
  ctx.moveTo(asteroid.vertices[0].x, asteroid.vertices[0].y);
  
  for (let i = 1; i < asteroid.vertices.length; i++) {
    ctx.lineTo(asteroid.vertices[i].x, asteroid.vertices[i].y);
  }
  
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
};

const drawBullet = (ctx: CanvasRenderingContext2D, bullet: Bullet) => {
  ctx.save();
  ctx.translate(bullet.position.x, bullet.position.y);
  
  // Glowing effect
  const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, 5);
  gradient.addColorStop(0, 'white');
  gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
};

const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
  ctx.save();
  ctx.translate(particle.position.x, particle.position.y);
  
  // Fade out as lifespan decreases
  const alpha = particle.lifespan / 60;
  ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
  
  ctx.beginPath();
  ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
};

const drawPowerUp = (ctx: CanvasRenderingContext2D, powerUp: PowerUp) => {
  ctx.save();
  ctx.translate(powerUp.position.x, powerUp.position.y);
  ctx.rotate(Date.now() * 0.001);
  
  // Different colors for different power-up types
  let color;
  switch (powerUp.type) {
    case 'shield':
      color = '#00FFFF'; // Cyan
      break;
    case 'rapidFire':
      color = '#FFFF00'; // Yellow
      break;
    case 'extraLife':
      color = '#00FF00'; // Green
      break;
    default:
      color = '#FFFFFF';
  }
  
  // Pulse effect
  const pulseSize = 1 + Math.sin(Date.now() * 0.005) * 0.2;
  const size = 10 * pulseSize;
  
  // Draw power-up
  ctx.strokeStyle = color;
  ctx.fillStyle = `${color}33`;
  ctx.lineWidth = 2;
  
  if (powerUp.type === 'shield') {
    // Shield icon
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
    ctx.stroke();
  } else if (powerUp.type === 'rapidFire') {
    // Rapid fire icon
    ctx.beginPath();
    ctx.moveTo(-size, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(-size, size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    // Extra life icon (heart)
    const heartSize = size * 0.8;
    
    ctx.beginPath();
    ctx.moveTo(0, heartSize);
    ctx.bezierCurveTo(
      heartSize, 0, 
      heartSize * 2, heartSize * 0.5, 
      0, heartSize * 2
    );
    ctx.bezierCurveTo(
      -heartSize * 2, heartSize * 0.5, 
      -heartSize, 0, 
      0, heartSize
    );
    ctx.fill();
    ctx.stroke();
  }
  
  // Glow effect
  ctx.beginPath();
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
  gradient.addColorStop(0, `${color}33`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
};

export default GameCanvas;
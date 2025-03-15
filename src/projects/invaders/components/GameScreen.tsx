import { useEffect, useRef, useState } from 'react';
import { useGameLoop } from '../hooks/useGameLoops';
import GameEntity from './GameEntity';
import StarBackground from './StarBackground';
import HUD from './HUD';
import ControlsOverlay from './ControlsOverlay';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Trophy, 
  Pause, 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  KeySquare, 
  Info
} from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const GameScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        // The game container is 95vh (minus some padding)
        const height = Math.min(window.innerHeight * 0.9, 800);
        // Width is constrained by height
        const width = Math.min(window.innerWidth * 0.95, height * 1.33);
        
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { gameState, startGame, resetGame, togglePause, setControls } = useGameLoop(
    dimensions.width,
    dimensions.height
  );

  const handleClickStart = () => {
    if (gameState.status === 'gameover') {
      resetGame();
    }
    startGame();
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <StarBackground />
      
      <div 
        ref={containerRef}
        className="relative game-container border-2 border-space-accent rounded-lg overflow-hidden shadow-2xl shadow-space-accent/20 w-full max-w-5xl"
        style={{ 
          width: `${dimensions.width}px`, 
          height: `${dimensions.height}px` 
        }}
      >
        {/* Game title and start screen */}
        {gameState.status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <h1 className="text-4xl md:text-6xl font-pixel text-white mb-4 animate-pulse-glow glow">
              SPACE INVADERS
            </h1>
            <p className="text-space-ui font-pixel mb-8 text-sm md:text-base">
              DEFEND EARTH FROM ALIEN INVASION
            </p>
            <div className="flex flex-col gap-4 items-center">
              <Button 
                onClick={handleClickStart}
                className="game-btn group"
              >
                <Rocket className="mr-2 h-4 w-4 transition group-hover:translate-y-[-3px]" /> START GAME
              </Button>
              
              <div className="mt-8 max-w-xs md:max-w-sm text-xs md:text-sm text-space-ui/80 text-center">
                <h3 className="mb-2 font-pixel text-space-accent">HOW TO PLAY:</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                  <div className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2 text-space-accent" /> 
                    <span>Move Left</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2 text-space-accent" /> 
                    <span>Move Right</span>
                  </div>
                  <div className="flex items-center">
                    <KeySquare className="h-4 w-4 mr-2 text-space-accent" /> 
                    <span>Space to Fire</span>
                  </div>
                  <div className="flex items-center">
                    <Pause className="h-4 w-4 mr-2 text-space-accent" /> 
                    <span>P to Pause</span>
                  </div>
                </div>
                
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="mt-4 text-space-accent border-space-accent/30 hover:bg-space-accent/10">
                      <Info className="h-4 w-4 mr-2" /> Game Instructions
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="bg-black border-t border-space-accent text-white p-4">
                    <DrawerHeader>
                      <DrawerTitle className="text-space-accent text-center text-xl">How to Play Space Invaders</DrawerTitle>
                      <DrawerDescription className="text-white/70 text-center">
                        Defend Earth from the alien invasion!
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-8 space-y-4">
                      <div>
                        <h4 className="text-space-ui font-pixel mb-2">OBJECTIVE:</h4>
                        <p>Destroy all enemy invaders before they reach your position at the bottom of the screen. Score as many points as possible!</p>
                      </div>
                      
                      <div>
                        <h4 className="text-space-ui font-pixel mb-2">CONTROLS:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <ArrowLeft className="h-4 w-4 mr-2 text-space-accent" /> 
                            <span>Left Arrow or A key: Move your ship left</span>
                          </li>
                          <li className="flex items-center">
                            <ArrowRight className="h-4 w-4 mr-2 text-space-accent" /> 
                            <span>Right Arrow or D key: Move your ship right</span>
                          </li>
                          <li className="flex items-center">
                            <KeySquare className="h-4 w-4 mr-2 text-space-accent" /> 
                            <span>Spacebar or Up Arrow: Fire projectiles</span>
                          </li>
                          <li className="flex items-center">
                            <Pause className="h-4 w-4 mr-2 text-space-accent" /> 
                            <span>P key: Pause/resume game</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-space-ui font-pixel mb-2">MOBILE CONTROLS:</h4>
                        <p>On mobile devices, use the on-screen buttons to move and fire.</p>
                      </div>
                      
                      <div>
                        <h4 className="text-space-ui font-pixel mb-2">GAMEPLAY TIPS:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Use shields for protection from enemy fire</li>
                          <li>Shields can be destroyed by both enemy and player projectiles</li>
                          <li>Enemies move faster and fire more often as levels progress</li>
                          <li>Each enemy has a different point value - higher enemies are worth more</li>
                          <li>You have 3 lives - game over when all lives are lost</li>
                        </ul>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
        )}

        {/* Game over screen */}
        {gameState.status === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-pixel text-white mb-4 animate-pulse-glow glow">
              GAME OVER
            </h2>
            <div className="text-space-ui font-pixel mb-8">
              <p className="mb-2">FINAL SCORE: <span className="text-space-accent">{gameState.score}</span></p>
              <p>HIGH SCORE: <span className="text-space-accent">{gameState.highScore}</span></p>
            </div>
            <Button 
              onClick={handleClickStart}
              className="game-btn"
            >
              <Rocket className="mr-2 h-4 w-4" /> PLAY AGAIN
            </Button>
          </div>
        )}

        {/* Pause screen */}
        {gameState.status === 'paused' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/50 backdrop-blur-sm animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-pixel text-white mb-4">
              GAME PAUSED
            </h2>
            <Button 
              onClick={togglePause}
              className="game-btn"
            >
              <Play className="mr-2 h-4 w-4" /> RESUME
            </Button>
          </div>
        )}

        {/* Render game entities */}
        {gameState.player && <GameEntity entity={gameState.player} />}
        {gameState.enemies.map(enemy => (
          <GameEntity key={enemy.id} entity={enemy} />
        ))}
        {gameState.projectiles.map(projectile => (
          <GameEntity key={projectile.id} entity={projectile} />
        ))}
        {gameState.shields.map(shield => (
          <GameEntity key={shield.id} entity={shield} />
        ))}

        {/* HUD overlay */}
        <HUD gameState={gameState} />

        {/* Controls overlay for mobile */}
        <ControlsOverlay 
          setControls={setControls} 
          isPlaying={gameState.status === 'playing'} 
        />

        {/* Pause button */}
        {gameState.status === 'playing' && (
          <button 
            onClick={togglePause}
            className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all"
          >
            <Pause size={20} />
          </button>
        )}
      </div>

      {/* Help button below game area */}
      <div className="mt-4 flex justify-center items-center gap-4">
        {gameState.highScore > 0 && (
          <div className="text-space-ui/80 flex items-center font-pixel text-sm">
            <Trophy size={14} className="mr-2 text-yellow-400" />
            HIGH SCORE: {gameState.highScore}
          </div>
        )}
        
        {gameState.status !== 'idle' && (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" className="text-space-accent border-space-accent/30 hover:bg-space-accent/10">
                <Info className="h-4 w-4 mr-2" /> Controls
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-black border-t border-space-accent text-white p-4">
              <DrawerHeader>
                <DrawerTitle className="text-space-accent text-center">Game Controls</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2 text-space-accent" /> 
                    <span>Move Left (← or A)</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2 text-space-accent" /> 
                    <span>Move Right (→ or D)</span>
                  </div>
                  <div className="flex items-center">
                    <KeySquare className="h-4 w-4 mr-2 text-space-accent" /> 
                    <span>Fire (Space or ↑)</span>
                  </div>
                  <div className="flex items-center">
                    <Pause className="h-4 w-4 mr-2 text-space-accent" /> 
                    <span>Pause (P key)</span>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
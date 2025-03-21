import React from 'react';
import { Button } from '@/components/ui/button';
import { RocketIcon, Trophy, HelpCircle } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-game-bg z-10">
      <div className="text-center">
        <div className="flex flex-col items-center mb-8">
          <RocketIcon className="w-20 h-20 text-game-accent1 animate-float" />
          <h1 className="text-6xl font-bold my-4 tracking-wider neon-text" style={{color: '#00FFFF'}}>
            ASTEROIDS
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Pilot your ship through space, destroy asteroids, and collect power-ups to survive!
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex flex-col items-center">
            <Trophy className="w-6 h-6 text-game-accent3 mb-1" />
            <div className="text-sm text-white/70">HIGH SCORE</div>
            <div className="text-xl font-bold neon-text" style={{color: '#FFFF00'}}>{highScore}</div>
          </div>
        </div>
        
        <Button
          onClick={onStart}
          className="bg-game-accent1 hover:bg-game-accent1/80 text-black font-bold px-8 py-6 text-xl animate-pulse-neon"
          style={{'--pulse-color': '#00FFFF'} as React.CSSProperties}
        >
          START GAME
        </Button>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-game-accent1/30">
            <div className="text-game-accent1 font-bold mb-2">CONTROLS</div>
            <ul className="text-white/70 text-sm space-y-1 text-left">
              <li>Arrow keys / WASD to move</li>
              <li>Space / F to shoot</li>
              <li>P / ESC to pause</li>
            </ul>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-game-accent2/30">
            <div className="text-game-accent2 font-bold mb-2">POWER-UPS</div>
            <ul className="text-white/70 text-sm space-y-1 text-left">
              <li>Shield - Temporary invincibility</li>
              <li>Rapid Fire - Shoot faster</li>
              <li>Extra Life - Additional ship</li>
            </ul>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-game-accent3/30">
            <div className="text-game-accent3 font-bold mb-2">SCORING</div>
            <ul className="text-white/70 text-sm space-y-1 text-left">
              <li>Small Asteroid: 100 pts</li>
              <li>Medium Asteroid: 50 pts</li>
              <li>Large Asteroid: 20 pts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
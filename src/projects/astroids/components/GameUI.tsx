import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Trophy, Pause, Play } from 'lucide-react';

interface GameUIProps {
  score: number;
  lives: number;
  level: number;
  paused: boolean;
  onResume: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ score, lives, level, paused, onResume }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* HUD */}
      <div className="flex justify-between items-start p-4">
        {/* Score */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-black/40 rounded-md px-3 py-2 backdrop-blur-sm">
            <Trophy className="w-4 h-4 text-game-accent3" />
            <span className="text-white font-bold neon-text text-lg" style={{color: '#FFFF00'}}>
              {score.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-black/40 rounded-md px-3 py-2 backdrop-blur-sm">
            <Activity className="w-4 h-4 text-game-accent2" />
            <span className="text-white font-bold neon-text text-lg" style={{color: '#FF00FF'}}>
              Level {level}
            </span>
          </div>
        </div>
        
        {/* Lives */}
        <div className="flex items-center gap-1 bg-black/40 rounded-md px-3 py-2 backdrop-blur-sm">
          {[...Array(lives)].map((_, i) => (
            <Heart 
              key={i} 
              className="w-5 h-5 text-red-500 animate-pulse-neon" 
              style={{'--pulse-color': '#ff0000'} as React.CSSProperties} 
              fill="#ff0000" 
            />
          ))}
        </div>
      </div>
      
      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-xs bg-black/40 backdrop-blur-sm rounded-md p-2 text-gray-300">
        <p>Controls: Arrow keys to move, Space to shoot, P to pause</p>
      </div>
      
      {/* Pause screen */}
      {paused && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold mb-8 neon-text" style={{color: '#00FFFF'}}>PAUSED</div>
          
          <Button 
            onClick={onResume}
            className="pointer-events-auto flex items-center gap-2 bg-game-accent1 hover:bg-game-accent1/80 text-black font-bold neon-border"
            style={{borderColor: '#00FFFF'}}
          >
            <Play className="w-5 h-5" />
            Resume Game
          </Button>
          
          <div className="mt-8 text-white/70 text-center max-w-md">
            <h3 className="text-lg font-bold mb-2">Controls</h3>
            <ul className="text-sm space-y-1">
              <li>Arrow keys or WASD to move</li>
              <li>Space or F to shoot</li>
              <li>P or ESC to pause/unpause</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
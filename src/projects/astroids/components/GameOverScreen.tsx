import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trophy, RotateCcw } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  const isNewHighScore = score >= highScore;
  
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
      <div className="text-center">
        <div className="flex flex-col items-center mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse-neon" style={{'--pulse-color': '#ff0000'} as React.CSSProperties} />
          <h1 className="text-5xl font-bold mt-4 neon-text" style={{color: '#FF0000'}}>GAME OVER</h1>
        </div>
        
        <div className="bg-black/50 p-6 rounded-lg mb-8 backdrop-blur-sm border border-white/10">
          <div className="text-2xl mb-2 text-white/90">YOUR SCORE</div>
          <div className="text-4xl font-bold mb-6 neon-text" style={{color: '#00FFFF'}}>{score}</div>
          
          <div className="flex items-center justify-center space-x-8">
            <div className="flex flex-col items-center">
              <Trophy className="w-6 h-6 text-game-accent3 mb-1" />
              <div className="text-sm text-white/70">HIGH SCORE</div>
              <div className="text-xl font-bold neon-text" style={{color: '#FFFF00'}}>{highScore}</div>
            </div>
          </div>
          
          {isNewHighScore && (
            <div className="mt-4 text-lg text-game-accent3 font-bold animate-pulse-neon">
              New High Score!
            </div>
          )}
        </div>
        
        <Button
          onClick={onRestart}
          className="bg-game-accent1 hover:bg-game-accent1/80 text-black font-bold px-8 py-6 text-xl flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          PLAY AGAIN
        </Button>
      </div>
    </div>
  );
};

export default GameOverScreen;
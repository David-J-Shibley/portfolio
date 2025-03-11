import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const ScoreBoard: React.FC = () => {
  const { gameState, resetScore } = useGame();
  const { score } = gameState;

  return (
    <div className="relative glass-morphism p-6 rounded-xl">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          SCORE
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-center px-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">YOU</h3>
          <p className="stat-number">{score.player}</p>
        </div>
        
        <div className="h-16 w-px bg-border mx-4"></div>
        
        <div className="text-center px-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">COMPUTER</h3>
          <p className="stat-number">{score.computer}</p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetScore}
          className="text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Reset Score
        </Button>
      </div>
    </div>
  );
};

export default ScoreBoard;
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { Choice, GameResult, GameRound } from '../types/game';
import { HandMetal, Copy, Scissors } from 'lucide-react';

const GameHistory: React.FC = () => {
  const { gameState, resetHistory } = useGame();
  const { history } = gameState;
  const [expanded, setExpanded] = useState(false);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }).format(date);
  };

  const getChoiceIcon = (choice: Choice) => {
    const iconProps = { size: 16, className: 'inline-block' };
    
    switch (choice) {
      case 'rock':
        return <HandMetal {...iconProps} />;
      case 'paper':
        return <Copy {...iconProps} />;
      case 'scissors':
        return <Scissors {...iconProps} />;
    }
  };

  const getResultBadge = (result: GameResult) => {
    const baseClasses = "text-xs px-2 py-0.5 rounded-full font-medium";
    
    switch (result) {
      case 'win':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Win</span>;
      case 'lose':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Loss</span>;
      case 'draw':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Draw</span>;
    }
  };

  const displayedHistory = expanded ? history : history.slice(0, 5);

  return (
    <div className="glass-morphism rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Game History
        </h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetHistory}
          className="text-xs"
        >
          <Trash2 className="h-3 w-3 mr-2" />
          Clear
        </Button>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No games played yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayedHistory.map((round: GameRound) => (
              <div key={round.id} className="bg-card p-3 rounded-lg shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <span className="mr-1">{getChoiceIcon(round.playerChoice)}</span>
                    <span className="mx-1 text-sm text-muted-foreground">vs</span>
                    <span className="ml-1">{getChoiceIcon(round.computerChoice)}</span>
                  </div>
                  <div className="ml-2">
                    {getResultBadge(round.result)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(round.timestamp)}
                </div>
              </div>
            ))}
          </div>
          
          {history.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="mt-4 w-full text-xs"
            >
              {expanded ? 'Show Less' : `Show More (${history.length - 5} more)`}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default GameHistory;
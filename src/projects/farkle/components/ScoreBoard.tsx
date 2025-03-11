import React from 'react';
import { cn } from "@/lib/utils";

interface Player {
  id: number;
  name: string;
  score: number;
  isCurrentPlayer: boolean;
}

interface ScoreBoardProps {
  players: Player[];
  turnScore: number;
  gameWinningScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  players, 
  turnScore,
  gameWinningScore
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-2 animate-slide-up">
        {/* Current Turn Score */}
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Current Turn
          </div>
          <div className={cn(
            "text-4xl font-bold mt-1 transition-all",
            turnScore > 0 ? "text-primary" : "text-muted-foreground"
          )}>
            {turnScore.toLocaleString()}
          </div>
        </div>
        
        {/* Player Scores */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
          <div className="p-4">
            <div className="flex justify-between mb-2">
              <div className="text-sm font-medium">Player</div>
              <div className="text-sm font-medium">Score</div>
            </div>
            
            <div className="divide-y divide-border">
              {players.map((player) => (
                <div 
                  key={player.id} 
                  className={cn(
                    "flex justify-between py-3 transition-all",
                    player.isCurrentPlayer ? "bg-primary/5 -mx-4 px-4 rounded" : ""
                  )}
                >
                  <div className="flex items-center">
                    <div className={cn(
                      "w-2 h-2 rounded-full mr-2",
                      player.isCurrentPlayer ? "bg-primary animate-pulse-soft" : "bg-muted"
                    )}></div>
                    <span className={cn(
                      "font-medium",
                      player.isCurrentPlayer ? "text-primary" : "text-foreground"
                    )}>
                      {player.name}
                    </span>
                  </div>
                  <div className="font-medium">
                    {player.score.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-2 border-t border-border text-xs text-muted-foreground">
              First to {gameWinningScore.toLocaleString()} points wins
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
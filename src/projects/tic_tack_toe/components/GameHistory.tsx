import React from 'react';
import { GameHistoryProps } from '../types/game';
import { cn } from '@/lib/utils';
import { X, Circle, History } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const GameHistory: React.FC<GameHistoryProps> = ({ 
  history, 
}) => {
  // Reverse the history to show most recent moves first
  const reversedHistory = [...history].reverse();
  
  return (
    <div className="glass-panel rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-center gap-2 mb-4">
        <History size={18} />
        <h2 className="text-xl font-semibold">Move History</h2>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No moves yet. Start playing!
        </div>
      ) : (
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-2">
            {reversedHistory.map((move, index) => {
              const reverseIndex = history.length - 1 - index;
              return (
                <div 
                  key={reverseIndex}
                  className={cn(
                    "flex items-center p-2 rounded-lg border border-border",
                    "transition-colors hover:bg-muted/50",
                    index === 0 && "bg-muted/30"
                  )}
                >
                  <div className="w-8 h-8 flex items-center justify-center mr-3">
                    {move.player === 'X' ? (
                      <X size={20} className="text-game-x" />
                    ) : (
                      <Circle size={20} className="text-game-o" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Player {move.player}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Played at position {move.position + 1}
                    </p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    #{reverseIndex + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default GameHistory;
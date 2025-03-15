import React from 'react';
import { cn } from '@/lib/utils';

interface DeckProps {
  count: number;
  type: 'deck' | 'discard';
}

const Deck = ({ count, type }: DeckProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="text-xs font-medium text-foreground/70 mb-1">
        {type === 'deck' ? 'Deck' : 'Discard'}
      </div>
      
      {count > 0 ? (
        <div className="relative">
          {/* Card stack effect */}
          {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
            <div
              key={`card-stack-${i}`}
              className={cn(
                "absolute rounded-lg border border-border",
                "bg-card shadow-sm w-16 h-24",
                type === 'deck' ? "bg-primary-lighter/20" : "bg-secondary/40",
                i === 0 ? "-translate-x-1 -translate-y-1" : "",
                i === 1 ? "translate-x-0 translate-y-0" : "",
                i === 2 ? "translate-x-1 translate-y-1" : "",
              )}
            />
          ))}
          
          {/* Top card */}
          <div 
            className={cn(
              "rounded-lg border-2 border-border",
              "shadow-card w-16 h-24 flex items-center justify-center",
              type === 'deck' ? "bg-primary-lighter/60" : "bg-secondary/80",
              "backdrop-blur-sm z-10"
            )}
          >
            <span className="font-bold text-foreground/90">{count}</span>
          </div>
        </div>
      ) : (
        <div className={cn(
          "rounded-lg border-2 border-dashed border-border",
          "w-16 h-24 flex items-center justify-center",
          "bg-muted/20"
        )}>
          <span className="text-muted-foreground text-xs">Empty</span>
        </div>
      )}
    </div>
  );
};

export default Deck;
import React from 'react';
import { HandMetal, Copy, Scissors } from 'lucide-react';
import { Choice } from '../types/game';
import { cn } from '@/lib/utils';

interface GameCardProps {
  choice: Choice;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ 
  choice, 
  selected, 
  onClick,
  disabled = false
}) => {
  const getIcon = () => {
    const iconSize = 36;
    const iconProps = {
      size: iconSize,
      className: "transition-all duration-300",
    };

    switch (choice) {
      case 'rock':
        return <HandMetal {...iconProps} />;
      case 'paper':
        return <Copy {...iconProps} />;
      case 'scissors':
        return <Scissors {...iconProps} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    return choice.charAt(0).toUpperCase() + choice.slice(1);
  };

  const getDescription = () => {
    switch (choice) {
      case 'rock':
        return 'Crushes scissors';
      case 'paper':
        return 'Covers rock';
      case 'scissors':
        return 'Cuts paper';
      default:
        return '';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full h-32 p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 overflow-hidden",
        selected ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md hover:-translate-y-1",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-secondary opacity-50 transition-opacity duration-300" />
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-1">
        <div className="p-2 rounded-full bg-white/50 shadow-sm mb-2">
          {getIcon()}
        </div>
        <h3 className="font-medium text-lg">{getTitle()}</h3>
        <p className="text-xs text-muted-foreground">{getDescription()}</p>
      </div>
    </button>
  );
};

export default GameCard;
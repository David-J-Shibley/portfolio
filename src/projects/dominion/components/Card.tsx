import React, { useState } from 'react';
import { Card as CardType, getCardColorClass } from '../utils/cards';
import { cn } from '@/lib/utils';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isPlayable?: boolean;
  isBuyable?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isSelected?: boolean;
  showCount?: boolean;
  count?: number;
  animationDelay?: number;
  isInPlay?: boolean;
  url?: string;
}

const Card = ({
  card,
  onClick,
  isPlayable = false,
  isBuyable = false,
  size = 'md',
  isSelected = false,
  showCount = false,
  count = 0,
  animationDelay = 0,
  isInPlay = false,
  url,
}: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size classes
  const sizeClasses = {
    xs: 'w-16 h-24 text-xs',
    sm: 'w-24 h-36 text-sm',
    md: 'w-28 h-40 text-sm',
    lg: 'w-32 h-48 text-base',
  };

  // Card type color classes
  return (
    <div 
      className={cn(
        "card-container relative select-none",
        sizeClasses[size],
        {
          "cursor-pointer transform transition-all duration-300 animate-card-draw": !!onClick,
          "cursor-not-allowed opacity-70": !isPlayable && !isBuyable && !!onClick,
          "animate-card-float": isHovered && (isPlayable || isBuyable),
          "transform -translate-y-4": isInPlay,
        }
      )}
      style={{
        animationDelay: `${animationDelay}ms`,
        backgroundColor: 'beige',
        backgroundImage: `url(${card.url})`,
        backgroundSize: 'cover', // Ensures the image covers the container
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
      }}
      onClick={() => {
        if (onClick && (isPlayable || isBuyable || !card)) {
          onClick();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        // className={cn(
        //   "card-front rounded-lg p-2 flex flex-col justify-between",
        //   "shadow-card hover:shadow-card-hover transition-shadow duration-300",
        //   "border-2",
        //   colorClass,
        //   {
        //     "ring-2 ring-offset-2 ring-primary": isSelected,
        //     "bg-card/60 backdrop-blur-sm": true,
        //   }
        // )}
      >
        {/* Card header */}
        {/* <div className="flex justify-between items-start">
          <span className="font-semibold text-foreground/90">{card.name}</span>
          <span className="font-bold text-foreground/90">{card.cost > 0 ? `${card.cost}` : ''}</span>
        </div> */}
        
        {/* Card type */}
        {/* <div className="text-xs text-foreground/70 -mt-1">
          {card.type}
        </div> */}
        
        {/* Card description */}
        {/* <div className="text-foreground/80 text-xs mt-auto overflow-hidden">
          {card.description}
        </div> */}
        
        {/* Card count (for supply piles) */}
        {showCount && (
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
            {count}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
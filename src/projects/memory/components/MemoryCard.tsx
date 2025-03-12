import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardType {
  id: number;
  value: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryCardProps {
  card: CardType;
  isDisabled: boolean;
  onCardClick: (card: CardType) => void;
}

const MemoryCard = ({ card, isDisabled, onCardClick }: MemoryCardProps) => {
  const [isFlipping, setIsFlipping] = useState(false);
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isFlipping) {
      timer = setTimeout(() => {
        setIsFlipping(false);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isFlipping]);

  const handleClick = () => {
    if (!isDisabled && !card.isFlipped && !card.isMatched && !isFlipping) {
      setIsFlipping(true);
      onCardClick(card);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="perspective relative p-1 w-full aspect-square cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={cn(
          "card-inner relative w-full h-full transition-transform duration-500",
          (card.isFlipped || card.isMatched) ? "rotate-y-180" : ""
        )}
      >
        {/* Card Back */}
        <div className="card-back absolute w-full h-full rounded-xl flex items-center justify-center bg-game-card-back border border-slate-200 shadow-sm">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm">
            <span className="text-lg font-semibold text-game-accent">?</span>
          </div>
        </div>
        
        {/* Card Front */}
        <div 
          className={cn(
            "card-front absolute w-full h-full rounded-xl flex items-center justify-center transition-colors duration-300 border shadow-sm",
            card.isMatched ? "bg-game-card-matched border-green-200" : "bg-game-card-selected border-slate-200"
          )}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-4xl" aria-hidden="true">
              {card.icon}
            </div>
            <div className="text-xs font-medium text-slate-600">
              {card.value}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemoryCard;
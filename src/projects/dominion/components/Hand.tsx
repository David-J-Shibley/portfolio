import CardComponent from './Card';
import { Card as CardType } from '../utils/cards';
import { useGame } from '../context/GameContext';
import { isCardPlayable } from '../utils/gameLogic';
import { cn } from '@/lib/utils';

interface HandProps {
  cards: CardType[];
}

const Hand = ({ cards }: HandProps) => {
  const { state, playCardFromHand } = useGame();

  if (!state) return null;

  return (
    <div className="w-full relative p-4">
      <div className="text-sm font-semibold mb-2 text-foreground/80">Your Hand</div>
      <div 
        className={cn(
          "flex justify-center flex-wrap gap-2",
          cards.length > 5 ? "overflow-x-auto pb-2" : "",
        )}
      >
        {cards.map((card, index) => (
          <div 
            key={`hand-card-${index}`} 
            className={`card-draw-${index % 5 + 1} animate-card-draw`}
          >
            <CardComponent
              card={card}
              onClick={() => playCardFromHand(index)}
              isPlayable={isCardPlayable(state, card)}
              size="md"
              animationDelay={index * 100}
            />
          </div>
        ))}
        {cards.length === 0 && (
          <div className="text-muted-foreground italic">No cards in hand</div>
        )}
      </div>
    </div>
  );
};

export default Hand;

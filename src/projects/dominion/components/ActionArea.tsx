import CardComponent from './Card';
import { Card } from '../utils/cards';

interface ActionAreaProps {
  cards: Card[];
}

const ActionArea = ({ cards }: ActionAreaProps) => {
  return (
    <div className="w-full p-4">
      <div className="text-sm font-semibold mb-2 text-foreground/80">In Play</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {cards.map((card, index) => (
          <CardComponent 
            key={`play-card-${index}`} 
            card={card} 
            size="sm"
            isInPlay={true}
          />
        ))}
        {cards.length === 0 && (
          <div className="text-muted-foreground italic">No cards in play</div>
        )}
      </div>
    </div>
  );
};

export default ActionArea;
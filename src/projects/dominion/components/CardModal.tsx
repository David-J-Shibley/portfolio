import { Card as CardType, getCardColorClass } from '../utils/cards';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CardModalProps {
  card: CardType | null;
  isOpen: boolean;
  onClose: () => void;
}

const CardModal = ({ card, isOpen, onClose }: CardModalProps) => {
  if (!card) return null;

  const colorClass = getCardColorClass(card.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass p-0 overflow-hidden">
        <div className={cn(
          "w-full p-6",
          "border-b-2",
          colorClass
        )}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{card.name}</h2>
            <div className="bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full font-bold">
              Cost: {card.cost}
            </div>
          </div>
          <div className="mt-1 text-sm italic text-foreground/90">
            {card.type}
          </div>
        </div>

        <div className="p-6">
          <div className="text-lg mb-4">{card.description}</div>
          
          {/* Card properties */}
          <div className="grid grid-cols-2 gap-4">
            {card.value !== undefined && (
              <div className="bg-card/60 backdrop-blur-sm p-3 rounded-lg flex flex-col">
                <span className="text-xs text-muted-foreground">Value</span>
                <span className="font-semibold">{card.value}</span>
              </div>
            )}
            
            {card.actions !== undefined && (
              <div className="bg-card/60 backdrop-blur-sm p-3 rounded-lg flex flex-col">
                <span className="text-xs text-muted-foreground">Actions</span>
                <span className="font-semibold">+{card.actions}</span>
              </div>
            )}
            
            {card.cards !== undefined && (
              <div className="bg-card/60 backdrop-blur-sm p-3 rounded-lg flex flex-col">
                <span className="text-xs text-muted-foreground">Cards</span>
                <span className="font-semibold">+{card.cards}</span>
              </div>
            )}
            
            {card.buys !== undefined && (
              <div className="bg-card/60 backdrop-blur-sm p-3 rounded-lg flex flex-col">
                <span className="text-xs text-muted-foreground">Buys</span>
                <span className="font-semibold">+{card.buys}</span>
              </div>
            )}
            
            {card.coins !== undefined && (
              <div className="bg-card/60 backdrop-blur-sm p-3 rounded-lg flex flex-col">
                <span className="text-xs text-muted-foreground">Coins</span>
                <span className="font-semibold">+{card.coins}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
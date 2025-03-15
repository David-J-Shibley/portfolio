import CardComponent from './Card';
import { SupplyPile } from '../utils/cards';
import { useGame } from '../context/GameContext';
import { isCardBuyable } from '../utils/gameLogic';

interface CardPileProps {
  pile: SupplyPile;
  index: number;
}

const CardPile = ({ pile, index }: CardPileProps) => {
  const { state, buyCardFromSupply, selectPile } = useGame();

  if (!state) return null;

  const handleClick = () => {
    // If in buying phase and card is buyable, purchase it
    if (state.phase === 'buy' && isCardBuyable(state, pile)) {
      buyCardFromSupply(index);
    } else {
      // Otherwise just select it for viewing
      selectPile(pile);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <CardComponent
        card={pile.card}
        onClick={handleClick}
        isBuyable={state.phase === 'buy' && isCardBuyable(state, pile)}
        size="sm"
        showCount={true}
        count={pile.count}
      />
    </div>
  );
};

export default CardPile;
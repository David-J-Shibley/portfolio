import React, { useState } from "react";
import { drawCards, Player } from "../utils/gameLogic";
import { Card } from "../utils/cards";
import { useGame } from "../context/GameContext";

interface DiscardPromptProps {
  player: Player;
  onDiscard: (selectedCards: Card[]) => void;
}

const DiscardPrompt: React.FC<DiscardPromptProps> = ({ player }) => {
    console.log('player...', player)
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const { updatePlayer, state } = useGame()

  const onDiscardComplete = (selectedCards: Card[]) => {
    const discardedCards = selectedCards.map((card) => player.hand.find(c => c.id === card.id));
  
    // Remove discarded cards from hand
    player.hand = player.hand.filter((card) => !selectedCards.find((c) => c.id === card.id))
  
    // Draw the same number of new cards
    if (state === null) return
    drawCards(state, player.id, discardedCards.length, updatePlayer);
  
    // Close the discard prompt
    player.pendingDiscardForCellar = false
    player.pendingDiscards = 0
    updatePlayer(player)
  };

  const toggleCardSelection = (card: Card) => {
    const cards = (prev: Card[]) =>
        prev.includes(card)
          ? prev.filter((c: Card) => c !== card) // Remove if already selected
          : [...prev, card]
          console.log(cards(selectedCards))
    setSelectedCards(cards);
  };

  return (
    <div className="discard-prompt">
      <h2>Choose card(s) to discard</h2>
      <div className="hand">
        {player.hand.map((card, index) => (
          <div
            key={index}
            className={`card ${
              selectedCards.find((c) => c.id === card.id) ? "selected" : ""
            }`}
            onClick={() => toggleCardSelection(card)}
          >
            {card.name}
          </div>
        ))}
      </div>
      <button
        onClick={() => onDiscardComplete(selectedCards)}
        disabled={selectedCards.length === 0}
      >
        Discard Selected
      </button>
    </div>
  );
};

export default DiscardPrompt;

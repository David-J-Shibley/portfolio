import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useGame } from "../context/GameContext";
import { Property } from "../types/game";

const PropertyPurchaseModal: React.FC = () => {
  const { state, dispatch } = useGame();
  const { players, properties, boardSpaces, currentPlayerId, gamePhase } = state;
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const currentSpace = boardSpaces.find(space => space.position === currentPlayer?.position);

  let property: Property | undefined;
  if (
    currentSpace &&
    (currentSpace.type === "property" || currentSpace.type === "railroad" || currentSpace.type === "utility") &&
    currentSpace.propertyId !== undefined
  ) {
    property = properties.find(p => p.id === currentSpace.propertyId && p.status === "unowned");
  }

  // Show modal only if it's the human player's turn, on an unowned property, and in 'action' phase
  const show =
    property &&
    currentPlayer &&
    !currentPlayer.isAI &&
    gamePhase === "action";

  if (!show || !property) return null;

  return (
    <Dialog open={show}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Property?</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <div className="font-bold text-lg mb-1">{property.name}</div>
          <div>Price: <span className="font-mono">${property.price}</span></div>
          <div>Rent: {property.rent.join(' / ')}</div>
          <div>Color: <span className="capitalize">{property.color}</span></div>
          {property.houseCost > 0 && <div>House Cost: ${property.houseCost}</div>}
          {property.mortgageValue > 0 && <div>Mortgage Value: ${property.mortgageValue}</div>}
        </div>
        <DialogFooter>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
            onClick={() => dispatch({ type: "BUY_PROPERTY", payload: { propertyId: property!.id } })}
          >
            Buy
          </button>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={() => dispatch({ type: "DECLINE_PROPERTY" })}
          >
            Decline
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyPurchaseModal; 
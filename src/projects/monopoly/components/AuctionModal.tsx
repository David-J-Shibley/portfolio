import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useGame } from "../context/GameContext";
import { Property } from "../types/game";

const AuctionModal: React.FC = () => {
  const { state, dispatch } = useGame();
  const {
    auctionActive,
    auctionPropertyId,
    auctionBids = [],
    auctionCurrentBid = 0,
    auctionCurrentBidder,
    players,
    properties,
    gamePhase,
  } = state;

  const property: Property | undefined = properties.find(p => p.id === auctionPropertyId);
  const currentBidder = players.find(p => p.id === auctionCurrentBidder);
  const [bid, setBid] = useState(auctionCurrentBid + 1);

  const show = auctionActive && gamePhase === "auction" && property && currentBidder;
  if (!show) return null;

  const handleBid = () => {
    // Placeholder: dispatch AUCTION_BID action
    dispatch({ type: "AUCTION_BID", payload: { bid } });
  };
  const handlePass = () => {
    // Placeholder: dispatch AUCTION_PASS action
    dispatch({ type: "AUCTION_PASS" });
  };

  return (
    <Dialog open={show}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Auction: {property.name}</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <div className="font-bold text-lg mb-1">{property.name}</div>
          <div>Price: <span className="font-mono">${property.price}</span></div>
          <div>Current Bid: <span className="font-mono">${auctionCurrentBid}</span></div>
          <div>Current Bidder: <span className="font-semibold">{currentBidder.name}</span></div>
          <div className="mt-2">Bidders:</div>
          <ul className="ml-4 list-disc">
            {auctionBids.map(bidder => {
              const player = players.find(p => p.id === bidder.playerId);
              return (
                <li key={bidder.playerId}>
                  {player?.name} {bidder.active ? "(Active)" : "(Passed)"} - Bid: ${bidder.bid}
                </li>
              );
            })}
          </ul>
        </div>
        <DialogFooter>
          <input
            type="number"
            min={auctionCurrentBid + 1}
            max={currentBidder!.money}
            value={bid}
            onChange={e => setBid(Number(e.target.value))}
            className="border rounded px-2 py-1 mr-2 w-24"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
            onClick={handleBid}
            disabled={bid <= auctionCurrentBid || bid > currentBidder!.money}
          >
            Bid
          </button>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={handlePass}
          >
            Pass
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuctionModal; 
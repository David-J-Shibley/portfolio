import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useGame } from "../context/GameContext";

const CardDrawModal: React.FC = () => {
  const { state } = useGame();
  const { players, currentPlayerId, logs, gamePhase } = state;
  const currentPlayer = players.find(p => p.id === currentPlayerId);

  // Only show if the most recent log is a card draw
  const cardLog = logs.length > 0 && (
    logs[logs.length - 1].includes("drew a Chance card:") ||
    logs[logs.length - 1].includes("drew a Community Chest card:")
  ) ? logs[logs.length - 1] : null;

  // Extract card text from the log
  let cardText = "";
  if (cardLog) {
    const match = cardLog.match(/: (.+)$/);
    if (match) cardText = match[1];
  }

  // Show modal if the last log is a card draw, it's the human player's turn, and in 'end-turn' phase
  const show = !!cardText && currentPlayer && !currentPlayer.isAI && gamePhase === 'end-turn';
  const [open, setOpen] = useState(show);

  useEffect(() => {
    setOpen(show);
  }, [show, cardText]);

  if (!show) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Card Drawn</DialogTitle>
        </DialogHeader>
        <div className="mb-4 text-lg text-center">{cardText}</div>
        <DialogFooter>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setOpen(false)}
          >
            OK
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CardDrawModal; 
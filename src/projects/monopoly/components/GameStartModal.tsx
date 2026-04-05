import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useGame } from "../context/GameContext";

const tokens = [
  "car",
  "shoe",
  "hat",
  "dog",
  "ship",
  "iron",
  "thimble",
  "wheelbarrow",
];

const GameStartModal: React.FC = () => {
  const { state, dispatch } = useGame();
  const show = state.players.length === 0;
  const [playerName, setPlayerName] = useState("");
  const [playerToken, setPlayerToken] = useState(tokens[0]);
  const [numAiPlayers, setNumAiPlayers] = useState(1);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName) return;
    dispatch({
      type: "INITIALIZE_GAME",
      payload: { playerName, playerToken, numAiPlayers },
    });
  };

  return (
    <Dialog open={show}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Game</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleStart} className="flex flex-col gap-4">
          <label>
            Name:
            <input
              className="border rounded px-2 py-1 w-full"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              required
            />
          </label>
          <label>
            Token:
            <select
              className="border rounded px-2 py-1 w-full"
              value={playerToken}
              onChange={e => setPlayerToken(e.target.value)}
            >
              {tokens.map(token => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </label>
          <label>
            Number of AI Players:
            <input
              type="number"
              min={1}
              max={7}
              className="border rounded px-2 py-1 w-full"
              value={numAiPlayers}
              onChange={e => setNumAiPlayers(Number(e.target.value))}
              required
            />
          </label>
          <DialogFooter>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={!playerName}
            >
              Start Game
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GameStartModal; 
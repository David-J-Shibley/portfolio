import React from "react";
import { useGame } from "../context/GameContext";
import { Player } from "../types/game";

const PlayerDashboard: React.FC = () => {
  const { state, dispatch } = useGame();
  const { players, properties, currentPlayerId, gamePhase } = state;

  const getPlayerProperties = (player: Player) =>
    properties.filter((p) => p.owner === player.id);

  const isCurrent = (player: Player) => player.id === currentPlayerId;

  const renderActions = () => {
    if (gamePhase === "roll") {
      return (
        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => dispatch({ type: "ROLL_DICE" })}
        >
          Roll Dice
        </button>
      );
    }
    if (gamePhase === "move") {
      return (
        <p className="text-sm text-muted-foreground">
          Moving to your new space…
        </p>
      );
    }
    if (gamePhase === "action") {
      return (
        <button
          type="button"
          className="rounded bg-green-600 px-4 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => dispatch({ type: "HANDLE_SPACE_ACTION" })}
        >
          Take Action
        </button>
      );
    }
    if (gamePhase === "end-turn") {
      return (
        <button
          type="button"
          className="rounded bg-gray-600 px-4 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-gray-700"
          onClick={() => dispatch({ type: "END_TURN" })}
        >
          End Turn
        </button>
      );
    }
    return null;
  };

  return (
    <div className="mb-4 w-full rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-2">Players</h2>
      <div className="flex flex-wrap gap-4">
        {players.map((player) => (
          <div
            key={player.id}
            className={`p-4 rounded border-2 w-64`}
            style={{ borderColor: player.color, background: isCurrent(player) ? `${player.color}22` : "#fff" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-4 h-4 rounded-full border border-gray-300" style={{ background: player.color }}></span>
              <span className="font-bold text-lg">{player.name}</span>
              <span className="text-xs px-2 py-1 rounded bg-gray-200">{player.token}</span>
              {isCurrent(player) && <span className="ml-2 text-blue-600 font-semibold">(Current)</span>}
            </div>
            <div className="mb-1">💵 <span className="font-mono">${player.money}</span></div>
            <div className="mb-1">🏠 Properties: {getPlayerProperties(player).length}</div>
            <div className="mb-1">🎫 Get Out of Jail: {player.getOutOfJailCards}</div>
            <div className="mb-1">Status: <span className="capitalize">{player.status}</span></div>
            <div className="mb-1">
              <span className="font-semibold">Properties:</span>
              <ul className="ml-4 list-disc">
                {getPlayerProperties(player).map((prop) => (
                  <li key={prop.id}>
                    {prop.name}
                    {prop.status === "mortgaged" && <span className="ml-1 text-xs text-red-500">(Mortgaged)</span>}
                    {prop.houses > 0 && <span className="ml-1 text-xs text-green-600">({prop.houses} houses)</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {state.lastRoll && (
          <div className="mb-2 text-lg font-mono text-center">
            🎲 You rolled <span className="font-bold">{state.lastRoll[0]}</span> + <span className="font-bold">{state.lastRoll[1]}</span> = <span className="font-bold">{state.lastRoll[0] + state.lastRoll[1]}</span>
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">Current Player Actions</h3>
        {renderActions()}
      </div>
    </div>
  );
};

export default PlayerDashboard; 
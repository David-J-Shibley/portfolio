import React from 'react';
import { GameState, getGameStatus, Move } from '../utils/chessEngine';

interface GameInfoProps {
  gameState: GameState;
  gameId: string;
  playerColor: 'w' | 'b' | 'spectator';
  movesHistory: Move[];
}

const GameInfo: React.FC<GameInfoProps> = ({ 
  gameState, 
  gameId, 
  playerColor,
  movesHistory
}) => {
  // Convert player color to string
  const playerColorText = playerColor === 'w' 
    ? 'White' 
    : playerColor === 'b' 
      ? 'Black' 
      : 'Spectator';

  // Get game status
  const status = getGameStatus(gameState);

  // Format move notation
  const formatMove = (move: Move, index: number): string => {
    const from = move.from;
    const to = move.to;
    const promotion = move.promotion ? `=${move.promotion.toUpperCase()}` : '';
    return `${from}-${to}${promotion}`;
  };

  // Group moves by pairs (white and black)
  const movesByPair: { white: string; black?: string }[] = [];
  
  for (let i = 0; i < movesHistory.length; i += 2) {
    const whiteMoveIdx = i;
    const blackMoveIdx = i + 1;
    
    const whiteMove = whiteMoveIdx < movesHistory.length 
      ? formatMove(movesHistory[whiteMoveIdx], whiteMoveIdx)
      : null;
      
    const blackMove = blackMoveIdx < movesHistory.length 
      ? formatMove(movesHistory[blackMoveIdx], blackMoveIdx)
      : null;
    
    if (whiteMove) {
      movesByPair.push({
        white: whiteMove,
        black: blackMove || undefined
      });
    }
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-md w-full max-w-md">
      <div className="text-lg font-medium mb-2">Game Information</div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-muted p-2 rounded text-sm">
          <span className="text-muted-foreground">Game ID:</span>
          <div className="font-mono text-xs mt-1 break-all">{gameId}</div>
        </div>
        
        <div className="bg-muted p-2 rounded text-sm">
          <span className="text-muted-foreground">Playing as:</span>
          <div className="mt-1">{playerColorText}</div>
        </div>
        
        <div className="bg-muted p-2 rounded text-sm col-span-2">
          <span className="text-muted-foreground">Status:</span>
          <div className="mt-1">{status}</div>
        </div>
      </div>
      
      <div>
        <div className="text-sm font-medium mb-2">Move History</div>
        <div className="bg-muted p-2 rounded max-h-40 overflow-y-auto">
          {movesByPair.length === 0 ? (
            <div className="text-muted-foreground text-sm p-1">No moves yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="w-10 p-1">#</th>
                  <th className="p-1">White</th>
                  <th className="p-1">Black</th>
                </tr>
              </thead>
              <tbody>
                {movesByPair.map((pair, idx) => (
                  <tr key={idx} className="border-t border-border/30">
                    <td className="p-1 text-muted-foreground">{idx + 1}.</td>
                    <td className="p-1 font-mono">{pair.white}</td>
                    <td className="p-1 font-mono">{pair.black || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        {playerColor === 'spectator' 
          ? 'You are spectating this game'
          : `You are playing as ${playerColorText}`
        }
      </div>
    </div>
  );
};

export default GameInfo;
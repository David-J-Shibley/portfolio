import { GameState } from '../types/game';
import { Heart } from 'lucide-react';

type HUDProps = {
  gameState: GameState;
};

const HUD = ({ gameState }: HUDProps) => {
  if (gameState.status === 'idle') return null;

  return (
    <div className="absolute top-0 left-0 w-full py-2 px-4 flex justify-between items-center z-10 bg-black/30 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="font-pixel text-space-ui text-sm md:text-base">
          <span className="text-space-accent">SCORE:</span> {gameState.score.toString().padStart(5, '0')}
        </div>
        <div className="font-pixel text-space-ui text-sm md:text-base">
          <span className="text-space-accent">LEVEL:</span> {gameState.level}
        </div>
      </div>
      <div className="flex items-center">
        <div className="font-pixel text-space-ui mr-2 text-sm md:text-base">LIVES:</div>
        <div className="flex">
          {Array.from({ length: gameState.lives }).map((_, i) => (
            <Heart
              key={i}
              size={16}
              className="text-space-player fill-space-player mr-1 glow-player"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HUD;
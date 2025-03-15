import { useEffect, useState } from 'react';
import { GameControls } from '../types/game';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

type ControlsOverlayProps = {
  setControls: (controls: GameControls) => void;
  isPlaying: boolean;
};

const ControlsOverlay = ({ setControls, isPlaying }: ControlsOverlayProps) => {
  const [touchControls, setTouchControls] = useState<GameControls>({
    left: false,
    right: false,
    fire: false,
  });

  // Handle touch controls
  useEffect(() => {
    if (!isPlaying) {
      setTouchControls({ left: false, right: false, fire: false });
      setControls({ left: false, right: false, fire: false });
      return;
    }

    setControls(touchControls);
  }, [touchControls, isPlaying, setControls]);

  const handleTouchStart = (control: keyof GameControls) => {
    setTouchControls(prev => ({ ...prev, [control]: true }));
  };

  const handleTouchEnd = (control: keyof GameControls) => {
    setTouchControls(prev => ({ ...prev, [control]: false }));
  };

  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-4 left-0 w-full z-10 flex justify-center gap-12 sm:gap-20 md:hidden">
      <div className="flex gap-4">
        <button
          className="w-16 h-16 rounded-full bg-space-accent/60 flex items-center justify-center text-white backdrop-blur-sm active:bg-space-accent/80 focus:outline-none"
          onTouchStart={() => handleTouchStart('left')}
          onTouchEnd={() => handleTouchEnd('left')}
        >
          <ChevronLeft size={30} />
        </button>
        <button
          className="w-16 h-16 rounded-full bg-space-accent/60 flex items-center justify-center text-white backdrop-blur-sm active:bg-space-accent/80 focus:outline-none"
          onTouchStart={() => handleTouchStart('right')}
          onTouchEnd={() => handleTouchEnd('right')}
        >
          <ChevronRight size={30} />
        </button>
      </div>
      <button
        className="w-16 h-16 rounded-full bg-space-laser/60 flex items-center justify-center text-white backdrop-blur-sm active:bg-space-laser/80 focus:outline-none glow-laser"
        onTouchStart={() => handleTouchStart('fire')}
        onTouchEnd={() => handleTouchEnd('fire')}
      >
        <Zap size={24} />
      </button>
    </div>
  );
};

export default ControlsOverlay;

import React, { useEffect, useState } from 'react';
import { HandMetal, Copy, Scissors } from 'lucide-react';
import { Choice } from '../types/game';

interface AnimatedHandProps {
  choice: Choice | null;
  isComputer?: boolean;
  isPlaying?: boolean;
  animationDelay?: number;
}

const AnimatedHand: React.FC<AnimatedHandProps> = ({ 
  choice, 
  isComputer = false, 
  isPlaying = false,
  animationDelay = 0
}) => {
  const [shake, setShake] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    let shakeTimer: ReturnType<typeof setTimeout>;
    let revealTimer: ReturnType<typeof setTimeout>;

    if (isPlaying) {
      setShake(true);
      setReveal(false);
      
      // Stop shaking and reveal after 1 second
      shakeTimer = setTimeout(() => {
        setShake(false);
        revealTimer = setTimeout(() => {
          setReveal(true);
        }, 100);
      }, 1000 + animationDelay);
    } else {
      setShake(false);
      setReveal(!!choice);
    }

    return () => {
      clearTimeout(shakeTimer);
      clearTimeout(revealTimer);
    };
  }, [isPlaying, choice, animationDelay]);

  const renderIcon = (choice: Choice | null) => {
    const iconSize = 56;
    const iconProps = {
      size: iconSize,
      className: 'transition-all duration-300',
      strokeWidth: 1.5,
    };

    switch (choice) {
      case 'rock':
        return <HandMetal {...iconProps} />;
      case 'paper':
        return <Copy {...iconProps} />;
      case 'scissors':
        return <Scissors {...iconProps} />;
      default:
        return isComputer ? (
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">?</span>
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">?</span>
          </div>
        );
    }
  };

  return (
    <div
      className={`
        relative flex items-center justify-center
        transition-all duration-300 transform
        ${isComputer ? 'scale-x-[-1]' : ''}
        ${shake ? 'animate-rotate-hand' : ''}
        ${reveal ? 'opacity-100' : 'opacity-80'}
      `}
    >
      <div 
        className={`
          p-6 rounded-full bg-white shadow-md transition-all duration-300
          ${isComputer ? 'bg-muted/50' : 'bg-white'}
        `}
      >
        {renderIcon(choice)}
      </div>
    </div>
  );
};

export default AnimatedHand;
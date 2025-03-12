import React from 'react';

interface HangmanProps {
  mistakes: number;
}

const Hangman: React.FC<HangmanProps> = ({ mistakes }) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full"
        data-testid="hangman-drawing"
      >
        {/* Gallows */}
        <line x1="40" y1="180" x2="160" y2="180" strokeWidth="4" stroke="#6E59A5" />
        <line x1="60" y1="20" x2="60" y2="180" strokeWidth="4" stroke="#6E59A5" />
        <line x1="60" y1="20" x2="120" y2="20" strokeWidth="4" stroke="#6E59A5" />
        <line x1="120" y1="20" x2="120" y2="40" strokeWidth="4" stroke="#6E59A5" />
        
        {/* Head */}
        {mistakes >= 1 && (
          <circle 
            cx="120" 
            cy="60" 
            r="20" 
            fill="none" 
            strokeWidth="4" 
            stroke="#8B5CF6" 
            className={`${mistakes === 1 ? 'animate-bounce-in' : ''}`}
          />
        )}
        
        {/* Body */}
        {mistakes >= 2 && (
          <line 
            x1="120" 
            y1="80" 
            x2="120" 
            y2="120" 
            strokeWidth="4" 
            stroke="#8B5CF6" 
            className={`${mistakes === 2 ? 'animate-bounce-in' : ''}`}
          />
        )}
        
        {/* Left arm */}
        {mistakes >= 3 && (
          <line 
            x1="120" 
            y1="90" 
            x2="100" 
            y2="110" 
            strokeWidth="4" 
            stroke="#8B5CF6" 
            className={`${mistakes === 3 ? 'animate-bounce-in' : ''}`}
          />
        )}
        
        {/* Right arm */}
        {mistakes >= 4 && (
          <line 
            x1="120" 
            y1="90" 
            x2="140" 
            y2="110" 
            strokeWidth="4" 
            stroke="#8B5CF6" 
            className={`${mistakes === 4 ? 'animate-bounce-in' : ''}`}
          />
        )}
        
        {/* Left leg */}
        {mistakes >= 5 && (
          <line 
            x1="120" 
            y1="120" 
            x2="100" 
            y2="150" 
            strokeWidth="4" 
            stroke="#8B5CF6" 
            className={`${mistakes === 5 ? 'animate-bounce-in' : ''}`}
          />
        )}
        
        {/* Right leg */}
        {mistakes >= 6 && (
          <line 
            x1="120" 
            y1="120" 
            x2="140" 
            y2="150" 
            strokeWidth="4" 
            stroke="#8B5CF6" 
            className={`${mistakes === 6 ? 'animate-bounce-in' : ''}`}
          />
        )}
        
        {/* Face (only shown on game over) */}
        {mistakes >= 6 && (
          <>
            {/* X eyes */}
            <line x1="112" y1="55" x2="118" y2="61" strokeWidth="2" stroke="#F97316" />
            <line x1="118" y1="55" x2="112" y2="61" strokeWidth="2" stroke="#F97316" />
            <line x1="122" y1="55" x2="128" y2="61" strokeWidth="2" stroke="#F97316" />
            <line x1="128" y1="55" x2="122" y2="61" strokeWidth="2" stroke="#F97316" />
            
            {/* Sad mouth */}
            <path d="M110,70 Q120,60 130,70" fill="none" strokeWidth="2" stroke="#F97316" />
          </>
        )}
      </svg>
    </div>
  );
};

export default Hangman;

import React from 'react';

interface KeyboardProps {
  onLetterClick: (letter: string) => void;
  usedLetters: Set<string>;
  correctLetters: Set<string>;
  gameStatus: 'playing' | 'won' | 'lost';
}

const Keyboard: React.FC<KeyboardProps> = ({ 
  onLetterClick, 
  usedLetters, 
  correctLetters,
  gameStatus
}) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleClick = (letter: string) => {
    if (gameStatus === 'playing' && !usedLetters.has(letter)) {
      onLetterClick(letter);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key) && gameStatus === 'playing' && !usedLetters.has(key)) {
        onLetterClick(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStatus, onLetterClick, usedLetters]);

  return (
    <div className="w-full max-w-xl mx-auto mt-6" data-testid="keyboard">
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center mb-2 gap-1 md:gap-2"
          style={{
            paddingLeft: rowIndex * 15,
            paddingRight: rowIndex * 15
          }}
        >
          {row.map(letter => {
            const isUsed = usedLetters.has(letter);
            const isCorrect = correctLetters.has(letter);
            
            return (
              <button
                key={letter}
                onClick={() => handleClick(letter)}
                disabled={isUsed || gameStatus !== 'playing'}
                className={`
                  w-8 h-10 md:w-10 md:h-12 
                  rounded 
                  font-semibold
                  transition-all duration-200
                  ${isUsed 
                    ? isCorrect 
                      ? 'bg-hangman-correct text-white' 
                      : 'bg-hangman-wrong text-white' 
                    : 'bg-white text-hangman-primary hover:bg-hangman-primary hover:text-white'}
                  ${isUsed ? 'opacity-80' : 'shadow hover:shadow-md'}
                  ${!isUsed && gameStatus === 'playing' ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
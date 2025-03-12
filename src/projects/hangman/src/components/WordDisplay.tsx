import React from 'react';

interface WordDisplayProps {
  wordState: string[];
  gameStatus: 'playing' | 'won' | 'lost';
  word: string;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ wordState, gameStatus, word }) => {
  // If game is lost, show the full word
  const displayWord = gameStatus === 'lost' ? word.split('') : wordState;
  
  return (
    <div className="flex justify-center my-8 gap-2" data-testid="word-display">
      {displayWord.map((letter, index) => (
        <div 
          key={index} 
          className={`
            w-10 h-12 md:w-12 md:h-14 
            border-b-4 
            flex items-center justify-center 
            text-2xl md:text-3xl font-bold 
            ${gameStatus === 'lost' && !wordState[index] ? 'text-hangman-wrong border-hangman-wrong' : 
              gameStatus === 'won' ? 'text-hangman-primary border-hangman-primary' : 
              'text-hangman-primary border-hangman-neutral'}
            ${wordState[index] && 'animate-bounce-in'}
            ${gameStatus === 'lost' && !wordState[index] && 'animate-shake'}
          `}
        >
          {gameStatus === 'lost' && !wordState[index] ? 
            <span className="uppercase">{letter}</span> : 
            letter && <span className="uppercase">{letter}</span>}
        </div>
      ))}
    </div>
  );
};

export default WordDisplay;
import React from 'react';
import { cn } from "@/lib/utils";

interface DiceProps {
  value: number;
  isSelected: boolean;
  isRolling: boolean;
  isScoreable: boolean;
  onClick: () => void;
  index: number;
}

// Component for a single die
const Dice: React.FC<DiceProps> = ({ 
  value, 
  isSelected, 
  isRolling, 
  isScoreable,
  onClick, 
  index 
}) => {
  // Animation delay based on index for cascading effect
  const animationDelay = `${index * 0.05}s`;
  
  // Generate dots based on dice value
  const renderDots = () => {
    switch (value) {
      case 1:
        return <div className="dice-dot dot-center"></div>;
      case 2:
        return (
          <>
            <div className="dice-dot dot-top-left"></div>
            <div className="dice-dot dot-bottom-right"></div>
          </>
        );
      case 3:
        return (
          <>
            <div className="dice-dot dot-top-left"></div>
            <div className="dice-dot dot-center"></div>
            <div className="dice-dot dot-bottom-right"></div>
          </>
        );
      case 4:
        return (
          <>
            <div className="dice-dot dot-top-left"></div>
            <div className="dice-dot dot-top-right"></div>
            <div className="dice-dot dot-bottom-left"></div>
            <div className="dice-dot dot-bottom-right"></div>
          </>
        );
      case 5:
        return (
          <>
            <div className="dice-dot dot-top-left"></div>
            <div className="dice-dot dot-top-right"></div>
            <div className="dice-dot dot-center"></div>
            <div className="dice-dot dot-bottom-left"></div>
            <div className="dice-dot dot-bottom-right"></div>
          </>
        );
      case 6:
        return (
          <>
            <div className="dice-dot dot-top-left"></div>
            <div className="dice-dot dot-top-right"></div>
            <div className="dice-dot dot-middle-left"></div>
            <div className="dice-dot dot-middle-right"></div>
            <div className="dice-dot dot-bottom-left"></div>
            <div className="dice-dot dot-bottom-right"></div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "relative w-16 h-16 md:w-20 md:h-20 cursor-pointer perspective-500 transform transition-all-300",
        isRolling ? "animate-dice-roll" : "hover:scale-105",
        isSelected ? "ring-2 ring-primary ring-offset-2 scale-110" : "",
        !isScoreable && !isSelected ? "opacity-60" : "",
      )}
      onClick={onClick}
      style={{ 
        animationDelay, 
        transformStyle: 'preserve-3d' 
      }}
    >
      <div 
        className={cn(
          "dice-face glassmorphism",
          isSelected ? "bg-primary/10" : "bg-white/90",
          isRolling ? "" : "animate-fade-in"
        )}
      >
        {renderDots()}
      </div>
    </div>
  );
};

// Component for the dice container
interface DiceContainerProps {
  dice: number[];
  selectedDice: number[];
  toggleDiceSelection: (index: number) => void;
  isRolling: boolean;
  scoreableDice: boolean[];
}

export const DiceContainer: React.FC<DiceContainerProps> = ({
  dice,
  selectedDice,
  toggleDiceSelection,
  isRolling,
  scoreableDice
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6 my-8 perspective">
      {dice.map((value, index) => (
        <Dice
          key={index}
          value={value}
          isSelected={selectedDice.includes(index)}
          isRolling={isRolling}
          isScoreable={scoreableDice[index]}
          onClick={() => toggleDiceSelection(index)}
          index={index}
        />
      ))}
    </div>
  );
};

export default DiceContainer;
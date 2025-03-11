import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { calculateScore, hasScoreableDice, isHotDice } from '../utils/scoreCalculator';

export interface Player {
  id: number;
  name: string;
  score: number;
  isCurrentPlayer: boolean;
}

// Custom hook for Farkle game logic
const useFarkleGame = (playerCount: number = 2, winningScore: number = 10000) => {
  const { toast } = useToast();
  
  // Game state
  const [dice, setDice] = useState<number[]>(Array(6).fill(1));
  const [selectedDice, setSelectedDice] = useState<number[]>([]);
  const [selectedDiceValues, setSelectedDiceValues] = useState<number[]>([]);
  const [turnScore, setTurnScore] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [availableDice, setAvailableDice] = useState<number>(6);
  const [scoreableDice, setScoreableDice] = useState<boolean[]>(Array(6).fill(false));
  const [farkled, setFarkled] = useState<boolean>(false);
  const [hotDice, setHotDice] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [finalRound, setFinalRound] = useState<boolean>(false);
  const [finalRoundInitiator, setFinalRoundInitiator] = useState<number>(-1);
  const [currentRollScore, setCurrentRollScore] = useState<number>(0);
  
  // Initialize players
  const [players, setPlayers] = useState<Player[]>(() => 
    Array(playerCount).fill(null).map((_, index) => ({
      id: index,
      name: `Player ${index + 1}`,
      score: 0,
      isCurrentPlayer: index === 0
    }))
  );
  
  // Current player tracking
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  
  // Roll the dice
  const rollDice = useCallback(() => {
    if (gameEnded) return;
    if (farkled) {
      // If player farkled, reset for next player
      nextPlayer();
      return;
    }
    
    setIsRolling(true);
    
    // Check if this is a hot dice roll (all 6 dice scored)
    if (hotDice) {
      // Reset the selected dice but keep the turn score
      setSelectedDice([]);
      setSelectedDiceValues([]);
      setHotDice(false);
      
      // Roll all 6 dice
      const newDice = Array(6).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
      animateDiceRoll(newDice);
      return;
    }
    
    // Determine which dice to roll
    const diceToRoll = [...dice];
    
    // Keep selected dice, roll the rest
    const rollableDiceIndices = [];
    for (let i = 0; i < dice.length; i++) {
      // If the die wasn't selected in this turn, roll it
      if (!selectedDice.includes(i)) {
        rollableDiceIndices.push(i);
      }
    }
    
    // Create an animation for the dice roll
    const newDice = [...diceToRoll];
    animateDiceRoll(newDice, rollableDiceIndices);
    
  }, [dice, selectedDice, farkled, gameEnded, hotDice]);
  
  // Helper function to animate dice roll
  const animateDiceRoll = (currentDice: number[], rollableDiceIndices?: number[]) => {
    // If rollableDiceIndices is not provided, roll all dice
    const dicesToRoll = rollableDiceIndices || Array.from({length: 6}, (_, i) => i);
    
    // Animate dice rolling
    const rollInterval = setInterval(() => {
      const newDice = [...currentDice];
      dicesToRoll.forEach(index => {
        newDice[index] = Math.floor(Math.random() * 6) + 1;
      });
      setDice(newDice);
    }, 50);
    
    // Stop rolling after animation
    setTimeout(() => {
      clearInterval(rollInterval);
      
      // Final roll values
      const finalDice = [...currentDice];
      dicesToRoll.forEach(index => {
        finalDice[index] = Math.floor(Math.random() * 6) + 1;
      });
      setDice(finalDice);
      setIsRolling(false);
      
      // Check for farkle (no scoreable dice)
      const unselectedDiceValues = dicesToRoll.map(index => finalDice[index]);
      const hasScoringDice = hasScoreableDice(unselectedDiceValues);
      
      if (!hasScoringDice) {
        handleFarkle();
      } else {
        // Update scoreable dice indicators
        updateScoreableDice(finalDice);
      }
    }, 800);
  };
  
  // Update scoreable dice after roll
  const updateScoreableDice = (currentDice: number[]) => {
    // This is simplified - in a real game you'd evaluate each die individually
    // to see if it could contribute to a score
    const newScoreableDice = Array(6).fill(false);
    
    // Mark dice as scoreable if they're 1s or 5s (simplified)
    for (let i = 0; i < currentDice.length; i++) {
      // Skip already selected dice
      if (selectedDice.includes(i)) continue;
      
      const value = currentDice[i];
      if (value === 1 || value === 5) {
        newScoreableDice[i] = true;
      }
    }
    
    // Check for three-of-a-kind and other combinations
    const unselectedIndices = Array.from({length: 6}, (_, i) => i)
      .filter(i => !selectedDice.includes(i));
    
    const unselectedValues = unselectedIndices.map(i => currentDice[i]);
    
    // Count occurrences of each die value
    const counts = Array(7).fill(0);
    unselectedValues.forEach((die) => counts[die]++);
    
    // Mark three-of-a-kind and other combinations
    for (let value = 1; value <= 6; value++) {
      if (counts[value] >= 3) {
        // Mark all dice with this value as scoreable
        unselectedIndices.forEach(index => {
          if (currentDice[index] === value) {
            newScoreableDice[index] = true;
          }
        });
      }
    }
    
    setScoreableDice(newScoreableDice);
  };
  
  // Toggle dice selection
  const toggleDiceSelection = (index: number) => {
    if (isRolling || farkled || gameEnded) return;
    
    // Can only select scoreable dice
    if (!selectedDice.includes(index) && !scoreableDice[index]) return;
    
    setSelectedDice(prev => {
      if (prev.includes(index)) {
        // Deselect
        const newSelection = prev.filter(i => i !== index);
        updateSelectedValues(newSelection);
        return newSelection;
      } else {
        // Select
        const newSelection = [...prev, index];
        updateSelectedValues(newSelection);
        return newSelection;
      }
    });
  };
  
  // Update selected dice values
  const updateSelectedValues = (selectedIndices: number[]) => {
    const values = selectedIndices.map(index => dice[index]);
    setSelectedDiceValues(values);
    
    // Calculate potential score for this selection only
    const potentialScore = calculateScore(values);
    setCurrentRollScore(potentialScore);
  };
  
  // Calculate the total score for the turn (currentRollScore + previous banked scores)
  useEffect(() => {
    setTurnScore(prev => {
      // If we had hot dice, we keep the previous score
      if (hotDice) {
        return prev;
      }
      return currentRollScore;
    });
  }, [currentRollScore, hotDice]);
  
  // Handle player scoring
  const bankScore = () => {
    if (isRolling || farkled || gameEnded || selectedDice.length === 0) return;
    
    // Update player's score
    setPlayers(prev => {
      const newPlayers = [...prev];
      newPlayers[currentPlayerIndex].score += turnScore;
      
      // Check if player has reached winning score
      if (newPlayers[currentPlayerIndex].score >= winningScore && !finalRound) {
        startFinalRound(currentPlayerIndex);
      }
      
      return newPlayers;
    });
    
    // Check if this was the final player in final round
    if (finalRound && 
        ((currentPlayerIndex + 1) % players.length === finalRoundInitiator)) {
      endGame();
    } else {
      // Move to next player
      nextPlayer();
    }
  };
  
  // Move to next player
  const nextPlayer = () => {
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    resetTurn();
  };
  
  // Reset turn state
  const resetTurn = () => {
    setDice(Array(6).fill(1));
    setSelectedDice([]);
    setSelectedDiceValues([]);
    setTurnScore(0);
    setCurrentRollScore(0);
    setAvailableDice(6);
    setScoreableDice(Array(6).fill(false));
    setFarkled(false);
    setHotDice(false);
  };
  
  // Handle farkle (no scoring dice)
  const handleFarkle = () => {
    setFarkled(true);
    setTurnScore(0);
    setCurrentRollScore(0);
    
    toast({
      title: "Farkle!",
      description: "No scoring dice. You lose all points for this turn.",
      variant: "destructive"
    });
  };
  
  // Start final round when a player reaches winning score
  const startFinalRound = (initiatorIndex: number) => {
    setFinalRound(true);
    setFinalRoundInitiator(initiatorIndex);
    
    toast({
      title: "Final Round!",
      description: `${players[initiatorIndex].name} has reached ${winningScore} points! Everyone gets one more turn.`
    });
  };
  
  // End the game
  const endGame = () => {
    setGameEnded(true);
    
    // Find winner (highest score)
    const winner = [...players].sort((a, b) => b.score - a.score)[0];
    
    toast({
      title: "Game Over!",
      description: `${winner.name} wins with ${winner.score} points!`
    });
  };
  
  // Check for hot dice (all 6 dice selected)
  useEffect(() => {
    if (selectedDice.length === 6 && !hotDice && hasScoreableDice(selectedDiceValues)) {
      // Save current turn score before resetting
      setTurnScore(prev => prev + currentRollScore);
      setHotDice(true);
      setAvailableDice(6);
      
      toast({
        title: "Hot Dice!",
        description: "All dice are scoring! Roll again with all 6 dice."
      });
    }
  }, [selectedDice, hotDice, selectedDiceValues, currentRollScore]);
  
  // Update current player in players array
  useEffect(() => {
    setPlayers(prev => {
      return prev.map((player, index) => ({
        ...player,
        isCurrentPlayer: index === currentPlayerIndex
      }));
    });
  }, [currentPlayerIndex]);
  
  // Update available dice count
  useEffect(() => {
    setAvailableDice(6 - selectedDice.length);
  }, [selectedDice]);
  
  // Reset the game
  const resetGame = () => {
    setPlayers(
      Array(playerCount).fill(null).map((_, index) => ({
        id: index,
        name: `Player ${index + 1}`,
        score: 0,
        isCurrentPlayer: index === 0
      }))
    );
    setCurrentPlayerIndex(0);
    setGameEnded(false);
    setFinalRound(false);
    setFinalRoundInitiator(-1);
    resetTurn();
  };
  
  return {
    dice,
    selectedDice,
    turnScore,
    isRolling,
    scoreableDice,
    farkled,
    hotDice,
    gameEnded,
    finalRound,
    players,
    currentPlayerIndex,
    availableDice,
    winningScore,
    rollDice,
    toggleDiceSelection,
    bankScore,
    resetGame
  };
};

export default useFarkleGame;
// Scoring logic for Farkle game

type DiceArray = number[];

// Calculate scores from dice combinations
export const calculateScore = (selectedDice: DiceArray): number => {
  if (selectedDice.length === 0) return 0;

  // Count occurrences of each die value
  const counts = Array(7).fill(0);
  selectedDice.forEach((die) => counts[die]++);

  let score = 0;

  // Check for special combinations
  if (isStraight(counts)) {
    return 1500;
  }
  
  if (isThreePairs(counts)) {
    return 1500;
  }

  // Check for multiple-of-a-kind
  for (let i = 1; i <= 6; i++) {
    if (counts[i] >= 3) {
      // Handle three or more of a kind
      if (counts[i] === 3) {
        score += (i === 1) ? 1000 : i * 100;
      } else if (counts[i] === 4) {
        score += 2 * ((i === 1) ? 1000 : i * 100);
      } else if (counts[i] === 5) {
        score += 4 * ((i === 1) ? 1000 : i * 100);
      } else if (counts[i] === 6) {
        score += 3000;
      }
      
      // Remove the counted dice
      counts[i] -= Math.min(counts[i], 6);
    }
  }

  // Add remaining 1s and 5s
  score += counts[1] * 100;
  score += counts[5] * 50;

  return score;
};

// Check for a straight (1-2-3-4-5-6)
const isStraight = (counts: number[]): boolean => {
  return counts.slice(1).every(count => count === 1);
};

// Check for three pairs
const isThreePairs = (counts: number[]): boolean => {
  const pairs = counts.filter(count => count === 2).length;
  return pairs === 3;
};

// Check if the dice selection has at least one scoring combination
export const hasScoreableDice = (dice: DiceArray): boolean => {
  // Count occurrences of each die value
  const counts = Array(7).fill(0);
  dice.forEach((die) => counts[die]++);

  // Check for triples or better
  for (let i = 1; i <= 6; i++) {
    if (counts[i] >= 3) return true;
  }

  // Check for individual 1s and 5s
  if (counts[1] > 0 || counts[5] > 0) return true;

  // Check for straight
  if (isStraight(counts)) return true;

  // Check for three pairs
  if (isThreePairs(counts)) return true;

  return false;
};

// Get potential score for dice
export const getPotentialScore = (dice: DiceArray): number => {
  return calculateScore(dice);
};

// Check if all dice are scoring (hot dice)
export const isHotDice = (selectedDice: DiceArray): boolean => {
  return selectedDice.length === 6 && calculateScore(selectedDice) > 0;
};

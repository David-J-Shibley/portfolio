export const MAX_MISTAKES = 6;

export const generateInitialWordState = (word: string): string[] => {
  return word.split('').map(() => '');
};

export const checkGameStatus = (
  wordState: string[],
  word: string,
  mistakes: number
): 'playing' | 'won' | 'lost' => {
  if (mistakes >= MAX_MISTAKES) return 'lost';
  if (wordState.join('') === word) return 'won';
  return 'playing';
};

export const generateHint = (word: string): string => {
  const hints: Record<string, string> = {
    // Animals
    "elephant": "A large mammal with a trunk",
    "giraffe": "Tallest living animal with a long neck",
    "zebra": "African equid with distinctive black and white stripes",
    "rhinoceros": "Large mammal with a horn on its nose",
    "kangaroo": "Australian marsupial that hops and has a pouch",
    "dolphin": "Intelligent marine mammal known for its playful behavior",
    "penguin": "Flightless bird that swims and lives in cold regions",
    "octopus": "Marine animal with eight arms",
    "leopard": "Large cat with spotted coat",
    "buffalo": "Large bovine with horns",
    // Countries
    "australia": "Country and continent in the southern hemisphere",
    "brazil": "Largest country in South America",
    "canada": "Second largest country by land area",
    "denmark": "Nordic country with many islands",
    "egypt": "Home to the ancient pyramids",
    "france": "European country known for the Eiffel Tower",
    "germany": "Central European country known for engineering",
    "hungary": "Central European country with a unique language",
    "iceland": "Island nation in the North Atlantic",
    "japan": "Island nation in East Asia",
    // Fruits
    "apple": "Common fruit that keeps the doctor away",
    "banana": "Yellow curved fruit",
    "cherry": "Small red fruit with a pit",
    "dragonfruit": "Exotic fruit with a spiky exterior",
    "elderberry": "Small dark purple berry used in medicine",
    "fig": "Sweet fruit with many tiny seeds",
    "grape": "Small fruit that grows in clusters",
    "honeydew": "Pale green type of melon",
    "kiwi": "Brown fuzzy fruit with green flesh",
    "lemon": "Sour yellow citrus fruit",
    // Default hint for others
  };

  return hints[word.toLowerCase()] || "No specific hint available";
};

export const calculateScore = (
  word: string,
  mistakes: number,
  timeSpent: number,
  difficulty: 'easy' | 'medium' | 'hard'
): number => {
  const baseScore = word.length * 10;
  const mistakePenalty = mistakes * 5;
  const timeFactor = Math.max(1, 60 - Math.floor(timeSpent / 1000));
  
  let difficultyMultiplier = 1;
  if (difficulty === 'medium') difficultyMultiplier = 1.5;
  if (difficulty === 'hard') difficultyMultiplier = 2;
  
  return Math.max(0, Math.floor((baseScore - mistakePenalty) * timeFactor * difficultyMultiplier / 10));
};

export const getDifficultySettings = (difficulty: 'easy' | 'medium' | 'hard') => {
  switch (difficulty) {
    case 'easy':
      return { hintsAllowed: 3, minWordLength: 4, maxWordLength: 6 };
    case 'medium':
      return { hintsAllowed: 2, minWordLength: 6, maxWordLength: 8 };
    case 'hard':
      return { hintsAllowed: 1, minWordLength: 8, maxWordLength: 20 };
  }
};
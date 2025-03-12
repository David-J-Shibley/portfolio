import { useState, useEffect } from 'react';
import MemoryCard, { CardType } from './MemoryCard';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface GameBoardProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onGameComplete: (score: number, time: number) => void;
  onReset: () => void;
}

// Card data
const cardData = [
  { value: 'Heart', icon: '❤️' },
  { value: 'Star', icon: '⭐' },
  { value: 'Sun', icon: '☀️' },
  { value: 'Moon', icon: '🌙' },
  { value: 'Cloud', icon: '☁️' },
  { value: 'Leaf', icon: '🍃' },
  { value: 'Flower', icon: '🌸' },
  { value: 'Tree', icon: '🌲' },
  { value: 'Diamond', icon: '💎' },
  { value: 'Bell', icon: '🔔' },
  { value: 'Apple', icon: '🍎' },
  { value: 'Book', icon: '📚' },
  { value: 'Music', icon: '🎵' },
  { value: 'Camera', icon: '📷' },
  { value: 'Car', icon: '🚗' },
  { value: 'Rocket', icon: '🚀' },
  { value: 'Globe', icon: '🌍' },
  { value: 'Crown', icon: '👑' },
];

const getDifficultyConfig = (difficulty: 'easy' | 'medium' | 'hard') => {
  switch (difficulty) {
    case 'easy':
      return { pairs: 6, columns: 4 };
    case 'medium':
      return { pairs: 10, columns: 5 };
    case 'hard':
      return { pairs: 18, columns: 6 };
    default:
      return { pairs: 6, columns: 4 };
  }
};

const shuffle = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const GameBoard = ({ difficulty, onGameComplete, onReset }: GameBoardProps) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardType[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Get difficulty configuration
  const { pairs, columns } = getDifficultyConfig(difficulty);
  const totalCards = pairs * 2;

  // Initialize game
  useEffect(() => {
    initGame();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [difficulty]);

  const initGame = () => {
    // Reset game state
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setGameComplete(false);
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);

    // Create and shuffle card pairs
    const selectedCards = shuffle(cardData).slice(0, pairs);
    const cardPairs = selectedCards.flatMap((card, index) => [
      { id: index * 2, value: card.value, icon: card.icon, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, value: card.value, icon: card.icon, isFlipped: false, isMatched: false }
    ]);
    setCards(shuffle(cardPairs));
  };

  // Handle card click
  const handleCardClick = (card: CardType) => {
    // Start timer on first card click
    if (!gameStarted) {
      setGameStarted(true);
      const timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
      setIntervalId(timer);
    }

    // Check if card can be flipped
    if (flippedCards.length === 2 || card.isFlipped || card.isMatched || isDisabled) return;

    // Flip card
    setCards(prevCards => 
      prevCards.map(c => 
        c.id === card.id ? { ...c, isFlipped: true } : c
      )
    );

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, card];
    setFlippedCards(newFlippedCards);

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      setIsDisabled(true);
      
      setTimeout(() => {
        const [first, second] = newFlippedCards;
        
        if (first.value === second.value) {
          // Match found
          setCards(prevCards => 
            prevCards.map(c => 
              c.id === first.id || c.id === second.id
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatchedPairs(prevPairs => {
            const newPairs = prevPairs + 1;
            // Check if game is complete
            if (newPairs === pairs) {
              if (intervalId) clearInterval(intervalId);
              setGameComplete(true);
              onGameComplete(moves + 1, time);
              toast.success("Congratulations! You've completed the game!");
            }
            return newPairs;
          });
          
          toast.success("You found a match!", {
            duration: 1000,
            position: "bottom-center"
          });
        } else {
          // No match - flip cards back
          setCards(prevCards => 
            prevCards.map(c => 
              c.id === first.id || c.id === second.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
        }
        
        setFlippedCards([]);
        setIsDisabled(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    initGame();
    onReset();
  };

  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Game stats */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-4"
        >
          <div className="glass rounded-full px-4 py-2 text-sm font-medium">
            Moves: {moves}
          </div>
          <div className="glass rounded-full px-4 py-2 text-sm font-medium">
            Time: {formatTime(time)}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button 
            onClick={handleReset}
            className="bg-game-accent hover:bg-game-focus text-white rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200"
          >
            Restart Game
          </button>
        </motion.div>
      </div>

      {/* Game board */}
      <motion.div 
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-${columns} gap-3 md:gap-4`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.03
            }
          }
        }}
      >
        {cards.map((card) => (
          <motion.div 
            key={card.id}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 }
            }}
          >
            <MemoryCard
              card={card}
              isDisabled={isDisabled}
              onCardClick={handleCardClick}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Progress bar */}
      <motion.div 
        className="mt-8 mb-4 relative h-2 bg-slate-100 rounded-full overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div 
          className="absolute top-0 left-0 h-full bg-game-accent"
          initial={{ width: '0%' }}
          animate={{ width: `${(matchedPairs / pairs) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
      
      {/* Progress text */}
      <motion.div 
        className="text-center text-sm text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {matchedPairs} of {pairs} pairs matched
      </motion.div>
    </div>
  );
};

export default GameBoard;

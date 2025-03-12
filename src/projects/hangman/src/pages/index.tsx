import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangle, 
  Info, 
  Lightbulb, 
  RefreshCw,
  SkipForward, 
  Settings,
  HelpCircle,
  Award
} from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import Hangman from '../components/Hangman';
import Keyboard from '../components/Keyboard';
import WordDisplay from '../components/WordDisplay';
import GameStats from '../components/GameStats';
import CategorySelector from '../components/CategorySelector';
import { 
  WordCategory, 
  getRandomWord 
} from '../utils/words';
import { 
  MAX_MISTAKES, 
  generateInitialWordState, 
  checkGameStatus, 
  generateHint,
  calculateScore,
  getDifficultySettings
} from '../utils/gameUtils';

const Index = () => {
  const { toast } = useToast();
  const [category, setCategory] = useState<WordCategory>('animals');
  const [word, setWord] = useState('');
  const [wordState, setWordState] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showRules, setShowRules] = useState(false);

  const difficultySettings = getDifficultySettings(difficulty);

  const initializeGame = useCallback(() => {
    const newWord = getRandomWord(category);
    setWord(newWord);
    setWordState(generateInitialWordState(newWord));
    setUsedLetters(new Set());
    setCorrectLetters(new Set());
    setMistakes(0);
    setGameStatus('playing');
    setGameStartTime(Date.now());
    setHintsUsed(0);
    
    console.log('New game started with word:', newWord);
  }, [category]);

  // Initialize game on first load or category change
  useEffect(() => {
    initializeGame();
  }, [initializeGame, category]);

  // Update timer
  useEffect(() => {
    if (gameStatus === 'playing') {
      const timerId = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      
      return () => clearInterval(timerId);
    }
  }, [gameStatus]);

  const handleLetterGuess = useCallback((letter: string) => {
    const letterUpper = letter.toUpperCase();
    
    // If letter already used, do nothing
    if (usedLetters.has(letterUpper)) return;
    
    // Update used letters
    const newUsedLetters = new Set(usedLetters);
    newUsedLetters.add(letterUpper);
    setUsedLetters(newUsedLetters);
    
    // Check if the letter is in the word
    const letterInWord = word.toUpperCase().includes(letterUpper);
    
    if (letterInWord) {
      // Update correct letters
      const newCorrectLetters = new Set(correctLetters);
      newCorrectLetters.add(letterUpper);
      setCorrectLetters(newCorrectLetters);
      
      // Update word state
      const newWordState = [...wordState];
      word.split('').forEach((char, index) => {
        if (char.toUpperCase() === letterUpper) {
          newWordState[index] = char;
        }
      });
      setWordState(newWordState);
      
      // Check if user won
      const newGameStatus = checkGameStatus(newWordState, word, mistakes);
      
      if (newGameStatus === 'won') {
        handleGameEnd(newGameStatus, newWordState);
      }
      
      toast({
        title: "Good guess!",
        description: `You found the letter '${letterUpper}'`,
        variant: "default",
      });
    } else {
      // Increase mistakes
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      
      // Check if user lost
      const newGameStatus = checkGameStatus(wordState, word, newMistakes);
      
      if (newGameStatus === 'lost') {
        handleGameEnd(newGameStatus, wordState);
      }
      
      toast({
        title: "Wrong guess!",
        description: `The letter '${letterUpper}' is not in the word`,
        variant: "destructive",
      });
    }
  }, [
    word, 
    usedLetters, 
    correctLetters, 
    wordState, 
    mistakes, 
    toast
  ]);

  const handleGameEnd = (status: 'won' | 'lost', currentWordState: string[]) => {
    setGameStatus(status);
    
    // Calculate score
    const gameTime = Date.now() - gameStartTime;
    const gameScore = status === 'won' 
      ? calculateScore(word, mistakes, gameTime, difficulty)
      : 0;
    
    setScore(gameScore);
    
    // Update stats
    setGamesPlayed(prev => prev + 1);
    
    if (status === 'won') {
      setGamesWon(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      if (gameScore > highScore) {
        setHighScore(gameScore);
      }
      
      toast({
        title: "Congratulations!",
        description: `You guessed the word "${word}"!`,
        variant: "default",
      });
    } else {
      setStreak(0);
      
      toast({
        title: "Game Over!",
        description: `The word was "${word}". Try again!`,
        variant: "destructive",
      });
    }
  };

  const useHint = () => {
    if (hintsUsed >= difficultySettings.hintsAllowed) {
      toast({
        title: "No hints left!",
        description: `You've used all your hints for this difficulty level.`,
        variant: "destructive",
      });
      return;
    }
    
    const hint = generateHint(word);
    setHintsUsed(prev => prev + 1);
    
    toast({
      title: "Hint",
      description: hint,
      variant: "default",
    });
  };

  const skipWord = () => {
    setGamesPlayed(prev => prev + 1);
    setStreak(0);
    
    toast({
      title: "Word Skipped",
      description: `The word was "${word}". Starting a new game.`,
      variant: "default",
    });
    
    initializeGame();
  };

  const changeDifficulty = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    
    toast({
      title: "Difficulty Changed",
      description: `Difficulty set to ${newDifficulty}. Starting a new game.`,
      variant: "default",
    });
    
    initializeGame();
  };

  return (
    <div className="min-h-screen bg-hangman-background pb-8">
      {/* Header */}
      <header className="py-4 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-hangman-primary">
              Hangman
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowRules(!showRules)}
                className="p-2 rounded-full bg-hangman-primary/10 hover:bg-hangman-primary/20 text-hangman-primary"
              >
                <HelpCircle size={20} />
              </button>
              <div className="relative group">
                <button className="p-2 rounded-full bg-hangman-primary/10 hover:bg-hangman-primary/20 text-hangman-primary">
                  <Settings size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                  <div className="py-2">
                    <p className="px-4 py-2 text-sm font-semibold text-gray-700">Difficulty</p>
                    <button
                      onClick={() => changeDifficulty('easy')}
                      className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${difficulty === 'easy' ? 'bg-hangman-primary/10' : 'hover:bg-gray-100'}`}
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => changeDifficulty('medium')}
                      className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${difficulty === 'medium' ? 'bg-hangman-primary/10' : 'hover:bg-gray-100'}`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => changeDifficulty('hard')}
                      className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${difficulty === 'hard' ? 'bg-hangman-primary/10' : 'hover:bg-gray-100'}`}
                    >
                      Hard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Game rules */}
        {showRules && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-hangman-primary">How to Play</h2>
              <button 
                onClick={() => setShowRules(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <AlertTriangle size={18} />
              </button>
            </div>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Guess the hidden word one letter at a time.</li>
              <li>Each incorrect guess adds a part to the hangman.</li>
              <li>6 incorrect guesses and you lose!</li>
              <li>You can use hints for difficult words (limited by difficulty).</li>
              <li>You can skip a word, but your streak will reset.</li>
              <li>Higher difficulty gives higher scores!</li>
            </ul>
          </div>
        )}

        {/* Game info bar */}
        <div className="bg-white rounded-lg shadow-md p-3 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Info size={18} className="text-hangman-primary mr-2" />
              <span className="text-sm">
                <span className="font-semibold">Category:</span> 
                <span className="capitalize"> {category}</span>
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">
                <span className="font-semibold">Mistakes:</span> {mistakes}/{MAX_MISTAKES}
              </span>
              <span className="text-sm">
                <span className="font-semibold">Hints:</span> {hintsUsed}/{difficultySettings.hintsAllowed}
              </span>
            </div>
          </div>
        </div>

        {/* Main game area */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <Hangman mistakes={mistakes} />
            
            <WordDisplay 
              wordState={wordState} 
              gameStatus={gameStatus} 
              word={word} 
            />
            
            <div className="flex justify-center space-x-3 mb-4">
              <button
                onClick={useHint}
                disabled={gameStatus !== 'playing' || hintsUsed >= difficultySettings.hintsAllowed}
                className={`
                  flex items-center px-4 py-2 rounded-md 
                  ${gameStatus === 'playing' && hintsUsed < difficultySettings.hintsAllowed
                    ? 'bg-hangman-accent text-white hover:bg-hangman-accent/80'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                `}
              >
                <Lightbulb size={18} className="mr-1" />
                Hint
              </button>
              
              <button
                onClick={skipWord}
                disabled={gameStatus !== 'playing'}
                className={`
                  flex items-center px-4 py-2 rounded-md 
                  ${gameStatus === 'playing'
                    ? 'bg-hangman-secondary text-white hover:bg-hangman-secondary/80'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                `}
              >
                <SkipForward size={18} className="mr-1" />
                Skip
              </button>
              
              {gameStatus !== 'playing' && (
                <button
                  onClick={initializeGame}
                  className="flex items-center px-4 py-2 rounded-md bg-hangman-primary text-white hover:bg-hangman-primary/80"
                >
                  <RefreshCw size={18} className="mr-1" />
                  New Game
                </button>
              )}
            </div>

            <Keyboard
              onLetterClick={handleLetterGuess}
              usedLetters={usedLetters}
              correctLetters={correctLetters}
              gameStatus={gameStatus}
            />
          </div>
          
          <div className="space-y-6">
            {gameStatus !== 'playing' && (
              <div className={`
                bg-white rounded-lg shadow-md p-6 text-center
                ${gameStatus === 'won' ? 'border-2 border-hangman-correct' : 'border-2 border-hangman-wrong'}
              `}>
                <div className="flex justify-center mb-3">
                  {gameStatus === 'won' ? (
                    <Award size={48} className="text-hangman-correct" />
                  ) : (
                    <AlertTriangle size={48} className="text-hangman-wrong" />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {gameStatus === 'won' ? 'You Won!' : 'Game Over!'}
                </h2>
                <p className="text-gray-700 mb-4">
                  {gameStatus === 'won' 
                    ? `Congratulations! You guessed the word "${word}".` 
                    : `The word was "${word}". Better luck next time!`}
                </p>
                <p className="text-xl font-bold text-hangman-primary">
                  {gameStatus === 'won' && (
                    <>Score: {score} points</>
                  )}
                </p>
              </div>
            )}
            
            <CategorySelector
              onSelect={setCategory}
              selectedCategory={category}
            />
            
            <GameStats
              gameTime={currentTime - gameStartTime}
              score={score}
              gamesPlayed={gamesPlayed}
              gamesWon={gamesWon}
              streak={streak}
              highScore={highScore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

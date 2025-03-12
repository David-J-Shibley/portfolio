import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';
import GameStats from '../components/GameStats';
import GameResults from '../components/GameResults';
import { CircleUser, Github } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner";

import './index.css'

const Index = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [bestTime, setBestTime] = useState(Infinity);
  const [bestScore, setBestScore] = useState(Infinity);
  const [totalMatches, setTotalMatches] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBestScore, setIsBestScore] = useState(false);
  const [isBestTime, setIsBestTime] = useState(false);

  // Load stats from localStorage on initial load
  useEffect(() => {
    const savedStats = localStorage.getItem('memoryGameStats');
    if (savedStats) {
      const { gamesPlayed, bestTime, bestScore, totalMatches } = JSON.parse(savedStats);
      setGamesPlayed(gamesPlayed || 0);
      setBestTime(bestTime || Infinity);
      setBestScore(bestScore || Infinity);
      setTotalMatches(totalMatches || 0);
    }
  }, []);

  // Save stats to localStorage when they change
  useEffect(() => {
    localStorage.setItem('memoryGameStats', JSON.stringify({
      gamesPlayed,
      bestTime,
      bestScore,
      totalMatches
    }));
  }, [gamesPlayed, bestTime, bestScore, totalMatches]);

  const handleGameComplete = (score: number, time: number) => {
    // Update stats
    setGamesPlayed(prev => prev + 1);
    setTotalMatches(prev => prev + 1);
    
    // Check for best score
    const isNewBestScore = score < bestScore;
    if (isNewBestScore) {
      setBestScore(score);
    }
    
    // Check for best time
    const isNewBestTime = time < bestTime;
    if (isNewBestTime) {
      setBestTime(time);
    }
    
    // Set current game results
    setCurrentScore(score);
    setCurrentTime(time);
    setIsBestScore(isNewBestScore);
    setIsBestTime(isNewBestTime);
    
    // Show results modal after a short delay
    setTimeout(() => {
      setShowResults(true);
    }, 1000);
  };

  const handleResetGame = () => {
    setShowResults(false);
  };

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-primary to-game-secondary pb-12">
      <header className="glass sticky top-0 z-10 mb-8 border-b border-slate-200/20">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                <span className="text-xl">🧠</span>
              </div>
              <h1 className="text-xl font-semibold">Memory Match</h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center ml-2 shadow-sm">
                <CircleUser className="w-5 h-5 text-slate-700" />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="bg-white/80 text-xs font-medium text-slate-500 px-3 py-1 rounded-full">
            {difficulty === 'easy' ? 'BEGINNER' : difficulty === 'medium' ? 'INTERMEDIATE' : 'EXPERT'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-1">Memory Matching Game</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Challenge your memory by finding matching pairs of cards in the shortest time possible.
          </p>
        </motion.div>

        <GameStats 
          gamesPlayed={gamesPlayed}
          bestTime={bestTime}
          bestScore={bestScore}
          totalMatches={totalMatches}
        />
        
        <GameControls 
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
        />
        
        <GameBoard 
          difficulty={difficulty}
          onGameComplete={handleGameComplete}
          onReset={handleResetGame}
        />
        
        <GameResults 
          isVisible={showResults}
          score={currentScore}
          time={currentTime}
          isBestScore={isBestScore}
          isBestTime={isBestTime}
          onClose={() => setShowResults(false)}
          onReset={handleResetGame}
        />
      </main>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default Index;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Medal, Clock3, RotateCcw } from 'lucide-react';

interface GameResultsProps {
  isVisible: boolean;
  score: number;
  time: number;
  isBestScore: boolean;
  isBestTime: boolean;
  onClose: () => void;
  onReset: () => void;
}

const GameResults = ({ 
  isVisible, 
  score, 
  time, 
  isBestScore, 
  isBestTime, 
  onClose, 
  onReset 
}: GameResultsProps) => {
  const [isShowing, setIsShowing] = useState(isVisible);

  useEffect(() => {
    setIsShowing(isVisible);
  }, [isVisible]);

  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isShowing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm p-4"
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: 0.2 
                }}
                className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </motion.div>
              <h2 className="text-2xl font-bold">Game Complete!</h2>
              <p className="text-blue-100">Great job! You've found all the matching pairs.</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 border border-slate-100 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock3 className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-sm font-medium text-slate-600">Time</h3>
                  </div>
                  <p className="text-2xl font-bold">{formatTime(time)}</p>
                  {isBestTime && (
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      New Record!
                    </span>
                  )}
                </div>
                
                <div className="p-4 border border-slate-100 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Medal className="w-5 h-5 text-amber-500 mr-2" />
                    <h3 className="text-sm font-medium text-slate-600">Moves</h3>
                  </div>
                  <p className="text-2xl font-bold">{score}</p>
                  {isBestScore && (
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      New Record!
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={onClose}
                >
                  Continue
                </Button>
                <Button 
                  className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600"
                  onClick={onReset}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameResults;
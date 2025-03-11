import React from 'react';
import { PieceType } from '../types/game';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Button } from './ui/button';
import { Trophy, Crown, Star } from 'lucide-react';

interface GameOverProps {
  isOpen: boolean;
  winner: PieceType | null;
  onReset: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ isOpen, winner, onReset }) => {
  if (!winner) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-amber-50 to-amber-100 border-amber-200">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-3xl font-bold text-amber-900">
            <Trophy className="h-8 w-8 text-yellow-500 animate-bounce-in" />
            Game Over
          </DialogTitle>
          <DialogDescription className="text-center pt-3">
            <span className="text-xl font-bold text-amber-800">
              {winner.charAt(0).toUpperCase() + winner.slice(1)} player wins!
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-8">
          <div 
            className={`w-28 h-28 rounded-full flex items-center justify-center animate-float shadow-xl ${
              winner === 'red' ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-gray-800 to-black'
            }`}
          >
            <div className="relative">
              <Crown className="h-14 w-14 text-yellow-400" />
              <div className="absolute -top-1 -right-1">
                <Star className="h-6 w-6 text-yellow-300 animate-pulse-light" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={onReset}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-none"
          >
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameOver;
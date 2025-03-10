import React from 'react';
import { GameState } from '../types/game';
import { Button } from './ui/button';
import { RotateCcw, Shield, Crown } from 'lucide-react';

interface GameControlsProps {
  gameState: GameState;
  onReset: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ gameState, onReset }) => {
  const { currentTurn, capturedPieces } = gameState;
  
  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl shadow-lg border border-amber-200 animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-900 tracking-tight">Game Status</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="bg-white/80 hover:bg-white border-amber-200 hover:border-amber-400 text-amber-800 flex items-center gap-2 transition-all duration-300"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Game
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className={`p-4 rounded-xl transition-all duration-300 ${
          currentTurn === 'red' 
            ? 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200 shadow-md transform scale-105' 
            : 'bg-white/80 border border-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              {currentTurn === 'red' && <Crown className="h-3 w-3 text-yellow-300" />}
            </div>
            <span className="font-bold text-red-800">Red Player</span>
          </div>
          <div className="mt-3 text-sm text-amber-800 flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-600" />
            <span>Captured: <span className="font-bold">{capturedPieces.black}</span></span>
          </div>
          {currentTurn === 'red' && (
            <div className="mt-3 text-xs font-medium text-red-600 animate-pulse-light">
              Your turn
            </div>
          )}
        </div>
        
        <div className={`p-4 rounded-xl transition-all duration-300 ${
          currentTurn === 'black' 
            ? 'bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 shadow-md transform scale-105' 
            : 'bg-white/80 border border-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
              {currentTurn === 'black' && <Crown className="h-3 w-3 text-yellow-300" />}
            </div>
            <span className="font-bold text-gray-800">Black Player</span>
          </div>
          <div className="mt-3 text-sm text-amber-800 flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-700" />
            <span>Captured: <span className="font-bold">{capturedPieces.red}</span></span>
          </div>
          {currentTurn === 'black' && (
            <div className="mt-3 text-xs font-medium text-gray-800 animate-pulse-light">
              Your turn
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-amber-200 pt-4">
        <h3 className="text-sm font-bold text-amber-800 mb-2">Game Rules</h3>
        <ul className="text-xs text-amber-700 space-y-1">
          <li className="flex items-center gap-1">• Red moves first</li>
          <li className="flex items-center gap-1">• Regular pieces move diagonally forward only</li>
          <li className="flex items-center gap-1">• Kings can move diagonally in any direction</li>
          <li className="flex items-center gap-1">• Jumps are mandatory when available</li>
          <li className="flex items-center gap-1">• Multiple jumps in a single turn are allowed</li>
        </ul>
      </div>
    </div>
  );
};

export default GameControls;
import React from 'react';
import { GameControlsProps } from '../types/game';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  Users, 
  CornerDownLeft,
  BarChart, 
  Monitor, 
  Circle,
  X
} from 'lucide-react';

const GameControls: React.FC<GameControlsProps> = ({
  onResetGame,
  onChangeMode,
  onChangeDifficulty,
  onUndoMove,
  onResetStats,
  currentMode,
  currentDifficulty,
  canUndo
}) => {
  return (
    <div className="glass-panel rounded-2xl p-4 shadow-lg">
      <div className="space-y-6">
        <div className="game-actions flex flex-wrap gap-2 justify-center">
          <Button 
            onClick={onResetGame} 
            variant="outline" 
            className="btn-effect flex items-center gap-2"
          >
            <RefreshCw size={16} />
            <span>New Game</span>
          </Button>
          
          <Button 
            onClick={onUndoMove} 
            variant="outline" 
            className="btn-effect flex items-center gap-2"
            disabled={!canUndo}
          >
            <CornerDownLeft size={16} />
            <span>Undo</span>
          </Button>
          
          <Button 
            onClick={onResetStats} 
            variant="outline" 
            className="btn-effect flex items-center gap-2"
          >
            <BarChart size={16} />
            <span>Reset Stats</span>
          </Button>
        </div>
        
        <Tabs defaultValue="mode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mode">Game Mode</TabsTrigger>
            <TabsTrigger value="difficulty" disabled={currentMode !== 'ai'}>Difficulty</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mode" className="space-y-4 pt-2">
            <div className="flex justify-center gap-2">
              <Button 
                onClick={() => onChangeMode('ai')} 
                variant={currentMode === 'ai' ? 'default' : 'outline'}
                className="btn-effect flex items-center gap-2"
              >
                <Monitor size={16} />
                <span>vs Computer</span>
              </Button>
              
              <Button 
                onClick={() => onChangeMode('local')} 
                variant={currentMode === 'local' ? 'default' : 'outline'}
                className="btn-effect flex items-center gap-2"
              >
                <Users size={16} />
                <span>Two Player</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="difficulty" className="space-y-4 pt-2">
            <div className="flex justify-center gap-2">
              <Button 
                onClick={() => onChangeDifficulty('easy')} 
                variant={currentDifficulty === 'easy' ? 'default' : 'outline'}
                className="btn-effect"
              >
                Easy
              </Button>
              
              <Button 
                onClick={() => onChangeDifficulty('medium')} 
                variant={currentDifficulty === 'medium' ? 'default' : 'outline'}
                className="btn-effect"
              >
                Medium
              </Button>
              
              <Button 
                onClick={() => onChangeDifficulty('hard')} 
                variant={currentDifficulty === 'hard' ? 'default' : 'outline'}
                className="btn-effect"
              >
                Hard
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-2 border-t border-border">
          <div className="text-center text-sm text-muted-foreground">
            {currentMode === 'ai' ? (
              <div className="flex items-center justify-center gap-1">
                <span>You play as</span>
                <X size={16} className="text-game-x" />
                <span>and Computer plays as</span>
                <Circle size={16} className="text-game-o" />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <span>Player 1:</span>
                <X size={16} className="text-game-x" />
                <span className="mx-1">|</span>
                <span>Player 2:</span>
                <Circle size={16} className="text-game-o" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
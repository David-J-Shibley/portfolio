import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CircleHelp, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface GameControlsProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const GameControls = ({ difficulty, onDifficultyChange }: GameControlsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-3xl mx-auto mb-8 flex justify-center"
    >
      <div className="glass rounded-full px-6 py-3 inline-flex items-center space-x-2">
        <span className="text-sm font-medium mr-2">Difficulty:</span>
        
        <Button
          variant={difficulty === 'easy' ? 'default' : 'outline'}
          size="sm"
          className="rounded-full text-xs h-8"
          onClick={() => onDifficultyChange('easy')}
        >
          Easy
        </Button>
        
        <Button
          variant={difficulty === 'medium' ? 'default' : 'outline'}
          size="sm"
          className="rounded-full text-xs h-8"
          onClick={() => onDifficultyChange('medium')}
        >
          Medium
        </Button>
        
        <Button
          variant={difficulty === 'hard' ? 'default' : 'outline'}
          size="sm"
          className="rounded-full text-xs h-8"
          onClick={() => onDifficultyChange('hard')}
        >
          Hard
        </Button>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full h-8 w-8 ml-2">
              <CircleHelp className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Game Instructions</DialogTitle>
              <DialogDescription>
                How to play the Memory Matching Game
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="rules">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="tips">Tips</TabsTrigger>
              </TabsList>
              
              <TabsContent value="rules" className="space-y-4 pt-4">
                <div>
                  <h3 className="font-medium mb-2">Game Objective</h3>
                  <p className="text-sm text-muted-foreground">
                    Find all matching pairs of cards in the shortest time and with the fewest moves.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">How to Play</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                    <li>Click on any card to reveal its symbol</li>
                    <li>Click on another card to find its match</li>
                    <li>If the cards match, they remain face up</li>
                    <li>If they don't match, they flip back face down</li>
                    <li>Continue until all pairs are matched</li>
                  </ol>
                </div>
              </TabsContent>
              
              <TabsContent value="tips" className="space-y-4 pt-4">
                <div>
                  <h3 className="font-medium mb-2">Strategy Tips</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                    <li>Try to remember the position of each card you flip</li>
                    <li>Start with a systematic approach, working from one area to another</li>
                    <li>Focus on finding pairs rather than randomly flipping cards</li>
                    <li>For difficult levels, try to create a mental map of card positions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Difficulty Levels</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                    <li><span className="font-medium">Easy:</span> 6 pairs (12 cards)</li>
                    <li><span className="font-medium">Medium:</span> 10 pairs (20 cards)</li>
                    <li><span className="font-medium">Hard:</span> 18 pairs (36 cards)</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default GameControls;
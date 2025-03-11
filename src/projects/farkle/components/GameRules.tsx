import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Separator } from "../../../components/ui/separator";

interface GameRulesProps {
  trigger: React.ReactNode;
}

const GameRules: React.FC<GameRulesProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">How to Play Farkle</DialogTitle>
        </DialogHeader>
        <div className="py-2 space-y-4 text-sm">
          <p>
            Farkle is a dice game where players take turns rolling six dice, aiming to score points 
            based on specific dice combinations.
          </p>
          
          <h3 className="text-lg font-medium pt-2">Gameplay</h3>
          <Separator className="my-1" />
          <p>
            On each turn, roll all six dice. After rolling, you must set aside at least one 
            scoring die or combination. Then, you can either:
          </p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Bank your score, adding it to your total, and end your turn</li>
            <li>Re-roll the remaining dice to try for more points</li>
            <li>Farkle (lose your turn) if no scoring dice appear</li>
          </ol>
          
          <h3 className="text-lg font-medium pt-2">Scoring</h3>
          <Separator className="my-1" />
          <div className="grid grid-cols-2 gap-2">
            <div>Single 1</div>
            <div>100 points</div>
            <div>Single 5</div>
            <div>50 points</div>
            <div>Three 1s</div>
            <div>1,000 points</div>
            <div>Three 2s</div>
            <div>200 points</div>
            <div>Three 3s</div>
            <div>300 points</div>
            <div>Three 4s</div>
            <div>400 points</div>
            <div>Three 5s</div>
            <div>500 points</div>
            <div>Three 6s</div>
            <div>600 points</div>
            <div>Four of a kind</div>
            <div>Double three-of-a-kind</div>
            <div>Five of a kind</div>
            <div>Double four-of-a-kind</div>
            <div>Six of a kind</div>
            <div>3,000 points</div>
            <div>Straight (1-6)</div>
            <div>1,500 points</div>
            <div>Three pairs</div>
            <div>1,500 points</div>
          </div>
          
          <h3 className="text-lg font-medium pt-2">Special Rules</h3>
          <Separator className="my-1" />
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Hot Dice:</strong> If all six dice score, you can roll all six dice again while keeping your points.
            </li>
            <li>
              <strong>Farkle:</strong> If no scoring dice appear in a roll, it's a Farkle, and you lose all points for that turn.
            </li>
          </ul>
          
          <h3 className="text-lg font-medium pt-2">Winning</h3>
          <Separator className="my-1" />
          <p>
            The game ends when a player reaches at least 10,000 points. Each other player gets one final turn.
            The player with the highest score wins.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameRules;
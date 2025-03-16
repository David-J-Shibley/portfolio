import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "../components/ui/progress";
import { 
  Sword, Shield, Heart, Zap, Activity, 
  Skull, X, ArrowRight
} from 'lucide-react';

const CombatScreen: React.FC = () => {
  const { character, combatEnemy, combatLog, attackEnemy, changeScreen } = useGame();

  if (!character || !combatEnemy) {
    return null;
  }

  // Calculate health percentages
  const characterHealthPercent = (character.health / character.maxHealth) * 100;
  const enemyHealthPercent = (combatEnemy.health / combatEnemy.maxHealth) * 100;

  return (
    <div className="game-section animate-fade-in">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Sword size={20} />
              Combat
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => changeScreen('world')}
            >
              <X size={18} />
            </Button>
          </div>
          <CardDescription>Battle with {combatEnemy.name}</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Combat Arena */}
            <div className="flex-1 space-y-6">
              {/* Character */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{character.name}</div>
                  <div className="text-sm">Level {character.level} {character.class}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Heart size={14} className="text-game-red" />
                      <span>Health</span>
                    </div>
                    <span>{character.health} / {character.maxHealth}</span>
                  </div>
                  <Progress value={characterHealthPercent} className="h-2 bg-game-red" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center gap-1 text-xs">
                    <Sword size={14} className="text-game-red" />
                    <span>Strength: {character.stats.strength}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Shield size={14} className="text-game-blue" />
                    <span>Vitality: {character.stats.vitality}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <ArrowRight size={24} className="text-muted-foreground mx-2" />
              </div>
              
              {/* Enemy */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{combatEnemy.name}</div>
                  <div className="text-sm">Level {combatEnemy.level}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Heart size={14} className="text-game-red" />
                      <span>Health</span>
                    </div>
                    <span>{combatEnemy.health} / {combatEnemy.maxHealth}</span>
                  </div>
                  <Progress value={enemyHealthPercent} className="h-2 bg-game-red" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center gap-1 text-xs">
                    <Sword size={14} className="text-game-red" />
                    <span>Attack: {combatEnemy.attack}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Shield size={14} className="text-game-blue" />
                    <span>Defense: {combatEnemy.defense}</span>
                  </div>
                </div>
              </div>
              
              {/* Combat Actions */}
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={attackEnemy}
                  className="px-6 py-2 flex items-center gap-2"
                >
                  <Sword size={16} />
                  Attack
                </Button>
              </div>
            </div>
            
            {/* Combat Log */}
            <div className="flex-1">
              <div className="font-medium mb-2 flex items-center gap-2">
                <Activity size={16} />
                Combat Log
              </div>
              <div className="h-[300px] overflow-y-auto border rounded-lg p-3 bg-muted/20 space-y-1">
                {combatLog.map((log, index) => (
                  <div key={index} className="combat-log text-sm">
                    {log}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>Rewards if victorious:</p>
                <div className="flex gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Skull size={14} />
                    <span>{combatEnemy.experience} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={14} />
                    <span>{combatEnemy.gold} Gold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CombatScreen;

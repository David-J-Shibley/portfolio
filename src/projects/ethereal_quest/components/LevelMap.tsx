import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Flag, Skull, Coins, Award, Sparkles, ChevronRight,
  LockKeyhole, CheckCircle2
} from 'lucide-react';
import { getDifficultyColor } from '../data/gameData';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LevelMap: React.FC = () => {
  const { levels, startCombat, changeScreen } = useGame();
  
  return (
    <div className="game-section animate-fade-in">
      <Card className="w-full h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin size={20} />
                Adventure Map
              </CardTitle>
              <CardDescription>
                Choose a level to begin your adventure
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {levels.map((level, index) => {
              const LevelIcon = level.icon;
              const difficultyColor = getDifficultyColor(level.difficulty);
              
              // Render connecting path if not the last level
              const renderPath = index < levels.length - 1;
              const nextLevelUnlocked = index < levels.length - 1 ? levels[index + 1].unlocked : false;
              
              return (
                <div key={level.id}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card 
                          className={`
                            relative overflow-hidden transition-all duration-300 
                            ${level.unlocked ? 'cursor-pointer hover:shadow-md' : 'opacity-70'}
                            ${level.completed ? 'bg-primary/5 border-primary/20' : ''}
                          `}
                          onClick={() => {
                            if (level.unlocked) {
                              changeScreen('world');
                              // Start combat with first enemy in level
                              if (level.enemies.length > 0) {
                                startCombat(level.enemies[0]);
                              }
                            }
                          }}
                        >
                          {level.completed && (
                            <div className="absolute top-3 right-3">
                              <CheckCircle2 size={24} className="text-primary" />
                            </div>
                          )}
                          
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className={`
                                w-12 h-12 rounded-lg flex items-center justify-center
                                ${level.unlocked ? 'bg-primary/10' : 'bg-muted'}
                              `}>
                                {level.unlocked ? (
                                  <LevelIcon size={24} className="text-primary" />
                                ) : (
                                  <LockKeyhole size={24} className="text-muted-foreground" />
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-lg">{level.name}</div>
                                    <div className="text-xs text-muted-foreground mb-2">{level.description}</div>
                                  </div>
                                  
                                  {level.unlocked && (
                                    <ChevronRight size={20} className="text-muted-foreground" />
                                  )}
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                  <div className={`text-xs ${difficultyColor} px-2 py-0.5 rounded-full bg-muted flex items-center gap-1`}>
                                    <Skull size={12} />
                                    <span className="capitalize">{level.difficulty}</span>
                                  </div>
                                  
                                  <div className="text-xs bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Skull size={12} />
                                    <span>{level.enemies.length} Enemies</span>
                                  </div>
                                  
                                  <div className="text-xs bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Award size={12} />
                                    <span>{level.rewards.experience} XP</span>
                                  </div>
                                  
                                  <div className="text-xs bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Coins size={12} />
                                    <span>{level.rewards.gold} Gold</span>
                                  </div>
                                  
                                  <div className="text-xs bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Sparkles size={12} />
                                    <span>{level.rewards.items.length} Items</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div className="p-2 text-sm">
                          {level.unlocked ? (
                            <span>Click to start adventure</span>
                          ) : (
                            <span>Complete previous level to unlock</span>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Path connecting to next level */}
                  {renderPath && (
                    <div 
                      className={`
                        h-12 w-0.5 mx-auto my-1
                        ${nextLevelUnlocked ? 'bg-primary' : 'bg-muted'}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LevelMap;
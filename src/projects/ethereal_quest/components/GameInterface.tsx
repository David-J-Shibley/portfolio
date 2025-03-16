import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, Sword, Brain, Zap, Activity, Heart, GaugeCircle, 
  ShoppingBag, PiggyBank, Award 
} from 'lucide-react';

const GameInterface: React.FC = () => {
  const { character, changeScreen } = useGame();

  if (!character) {
    return null;
  }

  useEffect(() => {
    console.log('Character', character)
  }, [character])

  // Calculate experience percentage
  const experiencePercentage = (character.experience / character.experienceToNextLevel) * 100;

  return (
    <div className="game-section animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Character Info Panel */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">{character.name}</CardTitle>
                <CardDescription>Level {character.level} {character.class}</CardDescription>
              </div>
              <div className="bg-primary/10 text-primary p-2 rounded-full">
                <Award size={24} />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Health and Mana Bars */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Heart size={16} className="text-game-red" />
                  <span>Health</span>
                </div>
                <span>{character.health} / {character.maxHealth}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-value bg-game-red"
                  style={{ width: `${(character.health / character.maxHealth) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <GaugeCircle size={16} className="text-game-blue" />
                  <span>Mana</span>
                </div>
                <span>{character.mana} / {character.maxMana}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-value bg-game-blue"
                  style={{ width: `${(character.mana / character.maxMana) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Award size={16} className="text-game-purple" />
                  <span>Experience</span>
                </div>
                <span>{character.experience} / {character.experienceToNextLevel}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-value bg-game-purple"
                  style={{ width: `${experiencePercentage}%` }}
                ></div>
              </div>
            </div>
            
            <Separator />

            {/* Character Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-game-red/10">
                  <Sword size={16} className="text-game-red" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Strength</div>
                  <div className="font-medium">{character.stats.strength}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-game-blue/10">
                  <Brain size={16} className="text-game-blue" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Intelligence</div>
                  <div className="font-medium">{character.stats.intelligence}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-game-emerald/10">
                  <Zap size={16} className="text-game-emerald" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Dexterity</div>
                  <div className="font-medium">{character.stats.dexterity}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-game-amber/10">
                  <Activity size={16} className="text-game-amber" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Vitality</div>
                  <div className="font-medium">{character.stats.vitality}</div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Gold */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <PiggyBank size={20} className="text-game-amber" />
                <span className="font-medium">Gold</span>
              </div>
              <span className="font-medium">{character.gold}</span>
            </div>
          </CardContent>
          
          <CardFooter className="flex gap-2 pt-0">
            <Button 
              variant="outline" 
              className="flex-1 gap-1"
              onClick={() => changeScreen('inventory')}
            >
              <ShoppingBag size={16} />
              <span>Inventory</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 gap-1"
              onClick={() => changeScreen('shop')}
            >
              <PiggyBank size={16} />
              <span>Shop</span>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Equipment Panel */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Equipment</CardTitle>
            <CardDescription>Your currently equipped items</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {/* Weapon Slot */}
              <div className="p-3 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sword size={20} className="text-primary" />
                  </div>
                  {character.equipment.weapon ? (
                    <div>
                      <div className="font-medium">{character.equipment.weapon.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {character.equipment.weapon.stats?.attack 
                          ? `+${character.equipment.weapon.stats.attack} Attack` 
                          : 'No attack bonus'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No weapon equipped</div>
                  )}
                </div>
                
                {character.equipment.weapon && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => changeScreen('inventory')}
                  >
                    Change
                  </Button>
                )}
              </div>
              
              {/* Armor Slot */}
              <div className="p-3 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield size={20} className="text-primary" />
                  </div>
                  {character.equipment.armor ? (
                    <div>
                      <div className="font-medium">{character.equipment.armor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {character.equipment.armor.stats?.defense 
                          ? `+${character.equipment.armor.stats.defense} Defense` 
                          : 'No defense bonus'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No armor equipped</div>
                  )}
                </div>
                
                {character.equipment.armor && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => changeScreen('inventory')}
                  >
                    Change
                  </Button>
                )}
              </div>
              
              {/* Accessory Slot */}
              <div className="p-3 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award size={20} className="text-primary" />
                  </div>
                  {character.equipment.accessory ? (
                    <div>
                      <div className="font-medium">{character.equipment.accessory.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {Object.entries(character.equipment.accessory.stats || {})
                          .map(([stat, value]) => `+${value} ${stat}`)
                          .join(', ')}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No accessory equipped</div>
                  )}
                </div>
                
                {character.equipment.accessory && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => changeScreen('inventory')}
                  >
                    Change
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameInterface;
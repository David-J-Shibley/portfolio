import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CharacterClass, characterClasses } from '../data/gameData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const CharacterCreation: React.FC = () => {
  const { createCharacter } = useGame();
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);

  const handleCreateCharacter = () => {
    if (!name.trim()) {
      toast.error('Please enter a name for your character');
      return;
    }
    
    if (!selectedClass) {
      toast.error('Please select a class for your character');
      return;
    }
    
    createCharacter(name, selectedClass);
  };

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in gap-6 max-w-3xl mx-auto px-4">
      <div className="text-center space-y-2 mb-6">
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm inline-block">
          Ethereal Quest
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Create Your Character</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Choose your destiny. Select a class and name your hero to begin your adventure.
        </p>
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium mb-2">Character Name</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your character's name"
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {Object.entries(characterClasses).map(([classKey, classData]) => {
          const isSelected = selectedClass === classKey;
          const ClassIcon = classData.icon;
          
          return (
            <Card 
              key={classKey}
              className={`character-card cursor-pointer relative overflow-hidden ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : 'hover:bg-secondary/50'
              }`}
              onClick={() => setSelectedClass(classKey as CharacterClass)}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                  <ClassIcon size={30} />
                </div>
                <CardTitle>{classData.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="text-center pb-4">
                <CardDescription className="mb-4">
                  {classData.description}
                </CardDescription>
                
                <div className="space-y-2 mt-4">
                  {Object.entries(classData.baseStats).map(([stat, value]) => (
                    <div key={stat} className="character-stat">
                      <span className="capitalize">{stat}</span>
                      <div className="flex items-center">
                        <span className="text-primary font-medium">{value}</span>
                        <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${(value / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button 
        className="mt-8 px-8 py-6 text-lg animate-pulse hover:animate-none"
        disabled={!name || !selectedClass}
        onClick={handleCreateCharacter}
      >
        Begin Your Adventure
      </Button>
    </div>
  );
};

export default CharacterCreation;
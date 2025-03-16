import { createContext, useContext, useState, ReactNode } from 'react';
import { Character, Enemy, Item, Level, createNewCharacter, calculateExperienceForLevel, levels as initialLevels, shopItems as initialShopItems, calculateDamage } from '../data/gameData';
import { toast } from "sonner";

interface GameContextType {
  character: Character | null;
  currentLevel: Level | null;
  levels: Level[];
  shopItems: typeof initialShopItems;
  combatLog: string[];
  combatTurn: string;
  combatEnemy: Enemy | null;
  gameScreen: 'start' | 'character' | 'world' | 'inventory' | 'shop' | 'combat';
  createCharacter: (name: string, characterClass: Character['class']) => void;
  selectLevel: (levelId: number) => void;
  startCombat: (enemy: Enemy) => void;
  attackEnemy: () => void;
  useItem: (itemId: string) => void;
  buyItem: (itemId: string) => void;
  sellItem: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (slot: keyof Character['equipment']) => void;
  completeLevel: () => void;
  changeScreen: (screen: GameContextType['gameScreen']) => void;
  addExperience: (amount: number) => void;
  addGold: (amount: number) => void;
  addItem: (item: Item) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [levels, setLevels] = useState<Level[]>(initialLevels);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [shopItems, setShopItems] = useState(initialShopItems);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [combatTurn, setCombatTurn] = useState<string>('player');
  const [combatEnemy, setCombatEnemy] = useState<Enemy | null>(null);
  const [gameScreen, setGameScreen] = useState<GameContextType['gameScreen']>('start');

  const createCharacter = (name: string, characterClass: Character['class']) => {
    const newCharacter = createNewCharacter(name, characterClass);
    setCharacter(newCharacter);
    setGameScreen('world');
    toast.success(`Welcome, ${name} the ${characterClass}!`);
  };

  const selectLevel = (levelId: number) => {
    const level = levels.find((l) => l.id === levelId);
    if (level && level.unlocked) {
      setCurrentLevel(level);
      setGameScreen('world');
      toast(`Level selected: ${level.name}`);
    }
  };

  const startCombat = (enemy: Enemy) => {
    // Create a deep copy of the enemy to avoid modifying the original
    const enemyCopy: Enemy = JSON.parse(JSON.stringify(enemy));
    setCombatEnemy(enemyCopy);
    setCombatLog([`You encounter a ${enemy.name}!`]);
    setCombatTurn('player');
    setGameScreen('combat');
  };

  const attackEnemy = () => {
    if (!character || !combatEnemy) return;

    // Player attacks
    const playerDamage = calculateDamage(character, combatEnemy, true);
    const updatedEnemy = { ...combatEnemy, health: Math.max(0, combatEnemy.health - playerDamage) };
    setCombatEnemy(updatedEnemy);
    setCombatLog((prev) => [...prev, `You dealt ${playerDamage} damage to the ${combatEnemy.name}.`]);

    // Check if enemy is defeated
    if (updatedEnemy.health <= 0) {
      setCombatLog((prev) => [...prev, `You defeated the ${combatEnemy.name}!`]);
      addExperience(combatEnemy.experience);
      addGold(combatEnemy.gold);
      
      // Check if enemy has loot
      if (combatEnemy.loot.length > 0) {
        combatEnemy.loot.forEach(item => {
          addItem(item);
          setCombatLog((prev) => [...prev, `You found ${item.name}!`]);
        });
      }
      completeLevel()
      
      // End combat after a delay to show the victory message
      setTimeout(() => {
        setCombatEnemy(null);
        setGameScreen('world');
        toast.success(`Victory! You defeated the ${combatEnemy.name}.`);
      }, 1500);

      return;
    }

    // Enemy attacks after a short delay
    setTimeout(() => {
      if (!character) return;
      
      const enemyDamage = calculateDamage(combatEnemy, character, false);
      const updatedCharacter = { 
        ...character, 
        health: Math.max(0, character.health - enemyDamage) 
      };
      setCharacter(updatedCharacter);
      setCombatLog((prev) => [...prev, `The ${combatEnemy.name} dealt ${enemyDamage} damage to you.`]);

      // Check if player is defeated
      if (updatedCharacter.health <= 0) {
        setCombatLog((prev) => [...prev, `You were defeated!`]);
        setTimeout(() => {
          // Reset character health to 25% and return to world
          setCharacter({
            ...updatedCharacter,
            health: Math.ceil(updatedCharacter.maxHealth * 0.25)
          });
          setCombatEnemy(null);
          setGameScreen('world');
          toast.error(`Defeat! You were beaten by the ${combatEnemy.name}.`);
        }, 1500);
      }
    }, 1000);
  };

  const useItem = (itemId: string) => {
    if (!character) return;

    const itemIndex = character.inventory.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;

    const item = character.inventory[itemIndex];
    
    if (!item.usable) {
      toast.error(`${item.name} cannot be used.`);
      return;
    }

    // Handle different item effects
    switch (item.effect) {
      case 'heal':
        const updatedHealth = Math.min(character.maxHealth, character.health + 50);
        setCharacter({
          ...character,
          health: updatedHealth,
          inventory: character.inventory.filter((_, index) => index !== itemIndex)
        });
        toast.success(`Used ${item.name}. Restored health.`);
        break;
      case 'mana':
        const updatedMana = Math.min(character.maxMana, character.mana + 50);
        setCharacter({
          ...character,
          mana: updatedMana,
          inventory: character.inventory.filter((_, index) => index !== itemIndex)
        });
        toast.success(`Used ${item.name}. Restored mana.`);
        break;
      default:
        toast.error(`Unknown item effect for ${item.name}.`);
    }
  };

  const buyItem = (itemId: string) => {
    if (!character) return;

    const shopItemIndex = shopItems.findIndex((item) => item.id === itemId);
    if (shopItemIndex === -1) return;

    const item = shopItems[shopItemIndex];
    
    if (item.stock <= 0) {
      toast.error(`${item.name} is out of stock.`);
      return;
    }

    if (character.gold < item.value) {
      toast.error(`Not enough gold to buy ${item.name}.`);
      return;
    }

    // Update character gold and inventory
    setCharacter({
      ...character,
      gold: character.gold - item.value,
      inventory: [...character.inventory, { ...item }]
    });

    // Update shop stock
    const updatedShopItems = [...shopItems];
    updatedShopItems[shopItemIndex] = {
      ...item,
      stock: item.stock - 1
    };
    setShopItems(updatedShopItems);

    toast.success(`Purchased ${item.name}.`);
  };

  const sellItem = (itemId: string) => {
    if (!character) return;

    const itemIndex = character.inventory.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;

    const item = character.inventory[itemIndex];
    
    // Prevent selling equipped items
    if (character.equipment.weapon?.id === item.id || 
        character.equipment.armor?.id === item.id || 
        character.equipment.accessory?.id === item.id) {
      toast.error(`Unequip ${item.name} before selling.`);
      return;
    }

    // Calculate sell price (50% of buy value)
    const sellPrice = Math.floor(item.value / 2);

    // Update character gold and inventory
    setCharacter({
      ...character,
      gold: character.gold + sellPrice,
      inventory: character.inventory.filter((_, index) => index !== itemIndex)
    });

    toast.success(`Sold ${item.name} for ${sellPrice} gold.`);
  };

  const equipItem = (itemId: string) => {
    if (!character) return;

    const itemIndex = character.inventory.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;

    const item = character.inventory[itemIndex];
    const equipmentSlot = getEquipmentSlot(item.type);
    
    if (!equipmentSlot) {
      toast.error(`${item.name} cannot be equipped.`);
      return;
    }

    // Create a copy of the equipment
    const newEquipment = { ...character.equipment };
    
    // If there's already an item in that slot, put it back in the inventory
    if (newEquipment[equipmentSlot]) {
      const updatedInventory = [...character.inventory];
      updatedInventory[itemIndex] = newEquipment[equipmentSlot] as Item;
      newEquipment[equipmentSlot] = item;
      
      setCharacter({
        ...character,
        equipment: newEquipment,
        inventory: updatedInventory
      });
    } else {
      // No item in the slot, just equip the new item
      newEquipment[equipmentSlot] = item;
      
      setCharacter({
        ...character,
        equipment: newEquipment,
        inventory: character.inventory.filter((_, index) => index !== itemIndex)
      });
    }

    toast.success(`Equipped ${item.name}.`);
  };

  const unequipItem = (slot: keyof Character['equipment']) => {
    if (!character || !character.equipment[slot]) return;

    const item = character.equipment[slot] as Item;
    
    // Create new equipment object without the item
    const newEquipment = { ...character.equipment };
    newEquipment[slot] = undefined;
    
    // Add the item back to inventory
    setCharacter({
      ...character,
      equipment: newEquipment,
      inventory: [...character.inventory, item]
    });

    toast.success(`Unequipped ${item.name}.`);
  };

  const completeLevel = () => {
    if (!character || !currentLevel) return;

    // Mark the level as completed
    const updatedLevels = levels.map((level) => {
      if (level.id === currentLevel.id) {
        return { ...level, completed: true };
      }
      // Unlock the next level
      if (level.id === currentLevel.id + 1) {
        return { ...level, unlocked: true };
      }
      return level;
    });

    setLevels(updatedLevels);
    
    // Award rewards
    addExperience(currentLevel.rewards.experience);
    addGold(currentLevel.rewards.gold);
    
    // Award items
    currentLevel.rewards.items.forEach((item) => {
      addItem(item);
    });

    toast.success(`Level completed: ${currentLevel.name}`);
    setCurrentLevel(null);
    setGameScreen('world');
  };

  const changeScreen = (screen: GameContextType['gameScreen']) => {
    setGameScreen(screen);
  };

  const addExperience = (amount: number) => {
    if (!character) return;

    let updatedCharacter = { ...character, experience: character.experience + amount };
    
    // Check for level up
    while (updatedCharacter.experience >= updatedCharacter.experienceToNextLevel) {
      // Level up
      const newLevel = updatedCharacter.level + 1;
      updatedCharacter = {
        ...updatedCharacter,
        level: newLevel,
        experience: updatedCharacter.experience - updatedCharacter.experienceToNextLevel,
        experienceToNextLevel: calculateExperienceForLevel(newLevel + 1),
        maxHealth: Math.floor(updatedCharacter.maxHealth * 1.1),
        maxMana: Math.floor(updatedCharacter.maxMana * 1.1),
        health: Math.floor(updatedCharacter.maxHealth * 1.1), // Fully heal on level up
        mana: Math.floor(updatedCharacter.maxMana * 1.1), // Fully restore mana on level up
        stats: {
          strength: updatedCharacter.stats.strength + 1,
          intelligence: updatedCharacter.stats.intelligence + 1,
          dexterity: updatedCharacter.stats.dexterity + 1,
          vitality: updatedCharacter.stats.vitality + 1,
        },
      };
      
      toast.success(`Level up! You are now level ${newLevel}.`);
    }
    console.log('EXperience', updatedCharacter)
    
    setCharacter(updatedCharacter);
  };

  const addGold = (amount: number) => {
    if (!character) return;
    setCharacter({ ...character, gold: character.gold + amount });
  };

  const addItem = (item: Item) => {
    if (!character) return;
    setCharacter({ ...character, inventory: [...character.inventory, { ...item }] });
  };

  const getEquipmentSlot = (type: Item['type']): keyof Character['equipment'] | null => {
    switch (type) {
      case 'weapon':
        return 'weapon';
      case 'armor':
        return 'armor';
      case 'accessory':
        return 'accessory';
      default:
        return null;
    }
  };

  return (
    <GameContext.Provider
      value={{
        character,
        currentLevel,
        levels,
        shopItems,
        combatLog,
        combatTurn,
        combatEnemy,
        gameScreen,
        createCharacter,
        selectLevel,
        startCombat,
        attackEnemy,
        useItem,
        buyItem,
        sellItem,
        equipItem,
        unequipItem,
        completeLevel,
        changeScreen,
        addExperience,
        addGold,
        addItem,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

import { 
    Sword, Shield, Heart, Activity, Zap, 
    Dumbbell, Brain, Wand, Skull, Gem, Trees,
    Castle, Mountain, Flame
  } from "lucide-react";
  
  // Types
  export type CharacterClass = 'warrior' | 'mage' | 'rogue';
  
  export interface Character {
    id: string;
    name: string;
    class: CharacterClass;
    level: number;
    experience: number;
    experienceToNextLevel: number;
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    stats: {
      strength: number;
      intelligence: number;
      dexterity: number;
      vitality: number;
    };
    gold: number;
    inventory: Item[];
    equipment: Equipment;
  }
  
  export interface Equipment {
    weapon?: Item;
    armor?: Item;
    accessory?: Item;
  }
  
  export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  export type ItemType = 'weapon' | 'armor' | 'potion' | 'accessory' | 'material';
  
  export interface Item {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    value: number;
    icon: any;
    stats?: {
      [key: string]: number;
    };
    usable?: boolean;
    effect?: string;
  }
  
  export interface Enemy {
    id: string;
    name: string;
    level: number;
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
    experience: number;
    gold: number;
    loot: Item[];
    icon: any;
  }
  
  export interface Level {
    id: number;
    name: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    enemies: Enemy[];
    rewards: {
      experience: number;
      gold: number;
      items: Item[];
    };
    completed: boolean;
    unlocked: boolean;
    icon: any;
  }
  
  export interface ShopItem extends Item {
    stock: number;
    discounted?: boolean;
    originalValue?: number;
  }
  
  // Character Classes
  export const characterClasses = {
    warrior: {
      name: 'Warrior',
      description: 'A strong and resilient fighter who excels in close combat.',
      baseStats: {
        strength: 8,
        intelligence: 3,
        dexterity: 5,
        vitality: 9,
      },
      icon: Sword,
      color: 'game-red',
    },
    mage: {
      name: 'Mage',
      description: 'A master of arcane arts who can unleash powerful spells.',
      baseStats: {
        strength: 3,
        intelligence: 10,
        dexterity: 4,
        vitality: 5,
      },
      icon: Wand,
      color: 'game-blue',
    },
    rogue: {
      name: 'Rogue',
      description: 'A nimble and clever adventurer who excels at stealth and precision.',
      baseStats: {
        strength: 5,
        intelligence: 6,
        dexterity: 10,
        vitality: 4,
      },
      icon: Zap,
      color: 'game-emerald',
    },
  };
  
  // Items
  export const items: Item[] = [
    {
      id: 'iron-sword',
      name: 'Iron Sword',
      description: 'A basic but reliable sword.',
      type: 'weapon',
      rarity: 'common',
      value: 50,
      icon: Sword,
      stats: {
        attack: 5,
      },
    },
    {
      id: 'steel-sword',
      name: 'Steel Sword',
      description: 'A well-crafted sword with a sharp edge.',
      type: 'weapon',
      rarity: 'uncommon',
      value: 120,
      icon: Sword,
      stats: {
        attack: 12,
      },
    },
    {
      id: 'enchanted-blade',
      name: 'Enchanted Blade',
      description: 'A blade imbued with magical energy.',
      type: 'weapon',
      rarity: 'rare',
      value: 350,
      icon: Sword,
      stats: {
        attack: 18,
        intelligence: 5,
      },
    },
    {
      id: 'leather-armor',
      name: 'Leather Armor',
      description: 'Basic protection made from tanned hide.',
      type: 'armor',
      rarity: 'common',
      value: 40,
      icon: Shield,
      stats: {
        defense: 4,
      },
    },
    {
      id: 'chain-mail',
      name: 'Chain Mail',
      description: 'Armor made from interlocking metal rings.',
      type: 'armor',
      rarity: 'uncommon',
      value: 100,
      icon: Shield,
      stats: {
        defense: 10,
      },
    },
    {
      id: 'health-potion',
      name: 'Health Potion',
      description: 'Restores 50 health points.',
      type: 'potion',
      rarity: 'common',
      value: 25,
      icon: Heart,
      usable: true,
      effect: 'heal',
    },
    {
      id: 'mana-potion',
      name: 'Mana Potion',
      description: 'Restores 50 mana points.',
      type: 'potion',
      rarity: 'common',
      value: 25,
      icon: Wand,
      usable: true,
      effect: 'mana',
    },
    {
      id: 'strength-amulet',
      name: 'Strength Amulet',
      description: 'Increases strength by 5.',
      type: 'accessory',
      rarity: 'uncommon',
      value: 150,
      icon: Dumbbell,
      stats: {
        strength: 5,
      },
    },
    {
      id: 'intelligence-charm',
      name: 'Intelligence Charm',
      description: 'Increases intelligence by 5.',
      type: 'accessory',
      rarity: 'uncommon',
      value: 150,
      icon: Brain,
      stats: {
        intelligence: 5,
      },
    },
    {
      id: 'vitality-pendant',
      name: 'Vitality Pendant',
      description: 'Increases vitality by 5.',
      type: 'accessory',
      rarity: 'uncommon',
      value: 150,
      icon: Activity,
      stats: {
        vitality: 5,
      },
    },
    {
      id: 'dexterity-band',
      name: 'Dexterity Band',
      description: 'Increases dexterity by 5.',
      type: 'accessory',
      rarity: 'uncommon',
      value: 150,
      icon: Zap,
      stats: {
        dexterity: 5,
      },
    },
    {
      id: 'ancient-relic',
      name: 'Ancient Relic',
      description: 'A mysterious relic from a forgotten civilization.',
      type: 'material',
      rarity: 'rare',
      value: 200,
      icon: Gem,
    },
  ];
  
  // Enemies
  export const enemies: Enemy[] = [
    {
      id: 'goblin',
      name: 'Goblin',
      level: 1,
      health: 30,
      maxHealth: 30,
      attack: 5,
      defense: 2,
      experience: 10,
      gold: 5,
      loot: [],
      icon: Skull,
    },
    {
      id: 'wolf',
      name: 'Wolf',
      level: 2,
      health: 40,
      maxHealth: 40,
      attack: 6,
      defense: 3,
      experience: 15,
      gold: 7,
      loot: [],
      icon: Skull,
    },
    {
      id: 'bandit',
      name: 'Bandit',
      level: 3,
      health: 60,
      maxHealth: 60,
      attack: 8,
      defense: 4,
      experience: 20,
      gold: 15,
      loot: [],
      icon: Skull,
    },
    {
      id: 'skeleton',
      name: 'Skeleton',
      level: 4,
      health: 70,
      maxHealth: 70,
      attack: 10,
      defense: 6,
      experience: 25,
      gold: 20,
      loot: [],
      icon: Skull,
    },
    {
      id: 'orc',
      name: 'Orc',
      level: 5,
      health: 100,
      maxHealth: 100,
      attack: 12,
      defense: 8,
      experience: 35,
      gold: 30,
      loot: [],
      icon: Skull,
    },
    {
      id: 'troll',
      name: 'Troll',
      level: 7,
      health: 150,
      maxHealth: 150,
      attack: 15,
      defense: 10,
      experience: 50,
      gold: 50,
      loot: [],
      icon: Skull,
    },
    {
      id: 'dragon',
      name: 'Dragon',
      level: 10,
      health: 300,
      maxHealth: 300,
      attack: 25,
      defense: 20,
      experience: 100,
      gold: 200,
      loot: [],
      icon: Flame,
    },
  ];
  
  // Levels
  export const levels: Level[] = [
    {
      id: 1,
      name: 'Forest Path',
      description: 'A peaceful forest with occasional hostile wildlife.',
      difficulty: 'easy',
      enemies: [enemies[0], enemies[1]],
      rewards: {
        experience: 50,
        gold: 30,
        items: [items[0], items[3], items[5]],
      },
      completed: false,
      unlocked: true,
      icon: Trees,
    },
    {
      id: 2,
      name: 'Bandit Hideout',
      description: 'A hidden camp where bandits store their loot.',
      difficulty: 'easy',
      enemies: [enemies[2], enemies[0]],
      rewards: {
        experience: 80,
        gold: 60,
        items: [items[1], items[4], items[7]],
      },
      completed: false,
      unlocked: false,
      icon: Castle,
    },
    {
      id: 3,
      name: 'Ancient Ruins',
      description: 'Crumbling structures filled with undead guardians.',
      difficulty: 'medium',
      enemies: [enemies[3], enemies[2]],
      rewards: {
        experience: 120,
        gold: 90,
        items: [items[2], items[8], items[11]],
      },
      completed: false,
      unlocked: false,
      icon: Castle,
    },
    {
      id: 4,
      name: 'Orc Fortress',
      description: 'A heavily guarded stronghold of the orc tribes.',
      difficulty: 'medium',
      enemies: [enemies[4], enemies[2]],
      rewards: {
        experience: 150,
        gold: 120,
        items: [items[2], items[9], items[5]],
      },
      completed: false,
      unlocked: false,
      icon: Castle,
    },
    {
      id: 5,
      name: 'Troll Cave',
      description: 'A dark cave system home to vicious trolls.',
      difficulty: 'hard',
      enemies: [enemies[5], enemies[4]],
      rewards: {
        experience: 200,
        gold: 180,
        items: [items[2], items[10], items[11]],
      },
      completed: false,
      unlocked: false,
      icon: Mountain,
    },
    {
      id: 6,
      name: "Dragon's Lair",
      description: 'The fiery home of a legendary dragon.',
      difficulty: 'hard',
      enemies: [enemies[6]],
      rewards: {
        experience: 500,
        gold: 500,
        items: [items[2], items[8], items[10], items[11]],
      },
      completed: false,
      unlocked: false,
      icon: Mountain,
    },
  ];
  
  // Shop
  export const shopItems: ShopItem[] = [
    {
      ...items[0],
      stock: 5,
    },
    {
      ...items[1],
      stock: 3,
    },
    {
      ...items[3],
      stock: 5,
    },
    {
      ...items[4],
      stock: 3,
    },
    {
      ...items[5],
      stock: 10,
    },
    {
      ...items[6],
      stock: 10,
    },
    {
      ...items[7],
      stock: 2,
      discounted: true,
      originalValue: 180,
    },
    {
      ...items[8],
      stock: 2,
    },
  ];
  
  // Helper Functions
  export const calculateExperienceForLevel = (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  };
  
  export const createNewCharacter = (name: string, characterClass: CharacterClass): Character => {
    const classDetails = characterClasses[characterClass];
    
    return {
      id: crypto.randomUUID(),
      name,
      class: characterClass,
      level: 1,
      experience: 0,
      experienceToNextLevel: calculateExperienceForLevel(2),
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      stats: { ...classDetails.baseStats },
      gold: 100,
      inventory: [
        { ...items[0] }, // Iron Sword
        { ...items[3] }, // Leather Armor
        { ...items[5] }, // Health Potion
      ],
      equipment: {
        weapon: { ...items[0] }, // Iron Sword
        armor: { ...items[3] }, // Leather Armor
      },
    };
  };
  
  export const getItemRarityColor = (rarity: ItemRarity): string => {
    switch (rarity) {
      case 'common':
        return 'text-gray-500';
      case 'uncommon':
        return 'text-game-emerald';
      case 'rare':
        return 'text-game-blue';
      case 'epic':
        return 'text-game-purple';
      case 'legendary':
        return 'text-game-amber';
      default:
        return 'text-gray-500';
    }
  };
  
  export const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
    switch (difficulty) {
      case 'easy':
        return 'text-game-emerald';
      case 'medium':
        return 'text-game-amber';
      case 'hard':
        return 'text-game-red';
      default:
        return 'text-game-emerald';
    }
  };
  
  export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  export const calculateDamage = (
    attacker: Character | Enemy,
    defender: Character | Enemy,
    isCharacter: boolean = true
  ): number => {
    let attackPower = isCharacter
      ? (attacker as Character).stats.strength * 2
      : (attacker as Enemy).attack;
    
    if (isCharacter && (attacker as Character).equipment.weapon) {
      attackPower += (attacker as Character).equipment.weapon?.stats?.attack || 0;
    }
    
    let defensePower = (defender as Character).stats?.vitality || (defender as Enemy).defense;
    
    if (!isCharacter && (defender as Character).equipment.armor) {
      defensePower += (defender as Character).equipment.armor?.stats?.defense || 0;
    }
    
    // Base damage calculation with some randomness
    let damage = Math.max(1, attackPower - defensePower / 2);
    damage = Math.floor(damage * (0.8 + Math.random() * 0.4)); // 80% to 120% of base damage
    
    return damage;
  };
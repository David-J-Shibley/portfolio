import { Tool } from "../types/gameTypes";

export const toolData: Tool[] = [
  {
    id: "brush",
    name: "Brush",
    description: "Gentle excavation, low energy cost, high precision.",
    energyCost: 1,
    precision: 1,
    durability: 100,
    maxDurability: 100,
    icon: "🖌️"
  },
  {
    id: "chisel",
    name: "Chisel",
    description: "Medium excavation, moderate energy cost.",
    energyCost: 3,
    precision: 2,
    durability: 80,
    maxDurability: 80,
    icon: "🪓"
  },
  {
    id: "hammer",
    name: "Hammer",
    description: "Fast excavation, high energy cost, low precision.",
    energyCost: 5,
    precision: 3,
    durability: 60,
    maxDurability: 60,
    icon: "🔨"
  },
  {
    id: "sieve",
    name: "Sieve",
    description: "Filter through loose soil, find small artifacts.",
    energyCost: 2,
    precision: 1,
    durability: 50,
    maxDurability: 50,
    icon: "🧺"
  },
  {
    id: "scanner",
    name: "Scanner",
    description: "Reveal hidden fossils (limited uses).",
    energyCost: 0,
    precision: 0,
    durability: 10,
    maxDurability: 10,
    icon: "📡"
  }
];

// TODO: Add tool system logic here 
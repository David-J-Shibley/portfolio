import type { ConnectionPuzzle } from "./types";

export const CONNECTION_PUZZLES: ConnectionPuzzle[] = [
  {
    id: "tech-1",
    name: "Stacks & streams",
    groups: [
      {
        title: "Programming languages",
        words: ["PYTHON", "RUST", "SWIFT", "RUBY"],
        difficulty: 1,
      },
      {
        title: "HTTP methods",
        words: ["GET", "POST", "PUT", "PATCH"],
        difficulty: 2,
      },
      {
        title: "Version control verbs",
        words: ["COMMIT", "MERGE", "BRANCH", "CLONE"],
        difficulty: 3,
      },
      {
        title: "Common editor commands",
        words: ["COPY", "PASTE", "UNDO", "REDO"],
        difficulty: 4,
      },
    ],
  },
  {
    id: "kitchen-1",
    name: "Counter culture",
    groups: [
      {
        title: "Ways to cook eggs",
        words: ["POACHED", "SCRAMBLED", "FRIED", "SHIRRED"],
        difficulty: 1,
      },
      {
        title: "Kitchen measurements",
        words: ["CUP", "PINCH", "DASH", "QUART"],
        difficulty: 2,
      },
      {
        title: "Herbs & spices",
        words: ["THYME", "CUMIN", "BASIL", "PAPRIKA"],
        difficulty: 3,
      },
      {
        title: "Kinds of knives",
        words: ["CHEF", "PARING", "BONING", "FILLET"],
        difficulty: 4,
      },
    ],
  },
  {
    id: "nature-1",
    name: "Green world",
    groups: [
      {
        title: "Types of trees",
        words: ["OAK", "MAPLE", "BIRCH", "CEDAR"],
        difficulty: 1,
      },
      {
        title: "Weather phenomena",
        words: ["HAIL", "MIST", "SLEET", "DRIZZLE"],
        difficulty: 2,
      },
      {
        title: "Bodies of water",
        words: ["FJORD", "LAGOON", "BAYOU", "ESTUARY"],
        difficulty: 3,
      },
      {
        title: "_____ fly",
        words: ["DRAGON", "BUTTER", "HOUSE", "FRUIT"],
        difficulty: 4,
      },
    ],
  },
  {
    id: "games-1",
    name: "Player one",
    groups: [
      {
        title: "Classic arcade games",
        words: ["PACMAN", "GALAGA", "CENTIPEDE", "FROGGER"],
        difficulty: 1,
      },
      {
        title: "Board game pieces",
        words: ["PAWN", "ROOK", "BISHOP", "KNIGHT"],
        difficulty: 2,
      },
      {
        title: "Card game terms",
        words: ["TRICK", "ANTE", "BLIND", "FLOP"],
        difficulty: 3,
      },
      {
        title: "Rhythm game actions",
        words: ["TAP", "HOLD", "FLICK", "SLIDE"],
        difficulty: 4,
      },
    ],
  },
  {
    id: "space-1",
    name: "Orbit",
    groups: [
      {
        title: "Planets in our solar system",
        words: ["VENUS", "SATURN", "NEPTUNE", "URANUS"],
        difficulty: 1,
      },
      {
        title: "Moon phases",
        words: ["CRESCENT", "GIBBOUS", "QUARTER", "FULL"],
        difficulty: 2,
      },
      {
        title: "Constellations",
        words: ["ORION", "LYRA", "DRACO", "CYGNUS"],
        difficulty: 3,
      },
      {
        title: "Starts with STAR",
        words: ["STARFISH", "STARCH", "STARTLE", "STARRY"],
        difficulty: 4,
      },
    ],
  },
];

/** Deep-dive copy for a flagship portfolio build (browser Monopoly clone). */
export const deepDiveProject = {
  title: "Browser Monopoly",
  path: "/monopoly",
  tagline:
    "A React + TypeScript board game with local multiplayer flows, property economics, and a growing rules surface.",
  sections: [
    {
      heading: "State & architecture",
      body: "Game rules live in a dedicated React context so the board, modals (auctions, cards, purchases), and player dashboard stay in sync. TypeScript models for players, tiles, and cards keep invalid states harder to represent by accident.",
    },
    {
      heading: "UI composition",
      body: "The 11×11 board uses explicit CSS grid placement (not dynamic Tailwind class names, which the compiler can’t see) plus theme tokens for property colors. Route-scoped CSS avoids leaking Vite template styles into the rest of the portfolio.",
    },
    {
      heading: "Why this is a useful sample",
      body: "It’s closer to a product than a tutorial game: multiple subsystems (movement, rent, building, bankruptcy paths) have to cooperate. That’s the same kind of coupling you manage in real apps—just with dice and hotels instead of invoices.",
    },
  ],
} as const;

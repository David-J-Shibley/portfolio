import { BoardSpace, Card, PlayerStatus, Property } from "../types/game";

export const PROPERTIES: Property[] = [
  {
    id: 1,
    name: "Mediterranean Avenue",
    price: 60,
    rent: [2, 10, 30, 90, 160, 250],
    houseCost: 50,
    hotelCost: 50,
    houses: 0,
    color: "brown",
    mortgageValue: 30,
    status: "unowned",
    owner: null,
    position: 1
  },
  {
    id: 3,
    name: "Baltic Avenue",
    price: 60,
    rent: [4, 20, 60, 180, 320, 450],
    houseCost: 50,
    hotelCost: 50,
    houses: 0,
    color: "brown",
    mortgageValue: 30,
    status: "unowned",
    owner: null,
    position: 3
  },
  {
    id: 6,
    name: "Oriental Avenue",
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    hotelCost: 50,
    houses: 0,
    color: "lightBlue",
    mortgageValue: 50,
    status: "unowned",
    owner: null,
    position: 6
  },
  {
    id: 8,
    name: "Vermont Avenue",
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    hotelCost: 50,
    houses: 0,
    color: "lightBlue",
    mortgageValue: 50,
    status: "unowned",
    owner: null,
    position: 8
  },
  {
    id: 9,
    name: "Connecticut Avenue",
    price: 120,
    rent: [8, 40, 100, 300, 450, 600],
    houseCost: 50,
    hotelCost: 50,
    houses: 0,
    color: "lightBlue",
    mortgageValue: 60,
    status: "unowned",
    owner: null,
    position: 9
  },
  {
    id: 11,
    name: "St. Charles Place",
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    hotelCost: 100,
    houses: 0,
    color: "pink",
    mortgageValue: 70,
    status: "unowned",
    owner: null,
    position: 11
  },
  {
    id: 13,
    name: "States Avenue",
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    hotelCost: 100,
    houses: 0,
    color: "pink",
    mortgageValue: 70,
    status: "unowned",
    owner: null,
    position: 13
  },
  {
    id: 14,
    name: "Virginia Avenue",
    price: 160,
    rent: [12, 60, 180, 500, 700, 900],
    houseCost: 100,
    hotelCost: 100,
    houses: 0,
    color: "pink",
    mortgageValue: 80,
    status: "unowned",
    owner: null,
    position: 14
  },
  {
    id: 16,
    name: "St. James Place",
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    hotelCost: 100,
    houses: 0,
    color: "orange",
    mortgageValue: 90,
    status: "unowned",
    owner: null,
    position: 16
  },
  {
    id: 18,
    name: "Tennessee Avenue",
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    hotelCost: 100,
    houses: 0,
    color: "orange",
    mortgageValue: 90,
    status: "unowned",
    owner: null,
    position: 18
  },
  {
    id: 19,
    name: "New York Avenue",
    price: 200,
    rent: [16, 80, 220, 600, 800, 1000],
    houseCost: 100,
    hotelCost: 100,
    houses: 0,
    color: "orange",
    mortgageValue: 100,
    status: "unowned",
    owner: null,
    position: 19
  },
  {
    id: 21,
    name: "Kentucky Avenue",
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    hotelCost: 150,
    houses: 0,
    color: "red",
    mortgageValue: 110,
    status: "unowned",
    owner: null,
    position: 21
  },
  {
    id: 23,
    name: "Indiana Avenue",
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    hotelCost: 150,
    houses: 0,
    color: "red",
    mortgageValue: 110,
    status: "unowned",
    owner: null,
    position: 23
  },
  {
    id: 24,
    name: "Illinois Avenue",
    price: 240,
    rent: [20, 100, 300, 750, 925, 1100],
    houseCost: 150,
    hotelCost: 150,
    houses: 0,
    color: "red",
    mortgageValue: 120,
    status: "unowned",
    owner: null,
    position: 24
  },
  {
    id: 26,
    name: "Atlantic Avenue",
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    hotelCost: 150,
    houses: 0,
    color: "yellow",
    mortgageValue: 130,
    status: "unowned",
    owner: null,
    position: 26
  },
  {
    id: 27,
    name: "Ventnor Avenue",
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    hotelCost: 150,
    houses: 0,
    color: "yellow",
    mortgageValue: 130,
    status: "unowned",
    owner: null,
    position: 27
  },
  {
    id: 29,
    name: "Marvin Gardens",
    price: 280,
    rent: [24, 120, 360, 850, 1025, 1200],
    houseCost: 150,
    hotelCost: 150,
    houses: 0,
    color: "yellow",
    mortgageValue: 140,
    status: "unowned",
    owner: null,
    position: 29
  },
  {
    id: 31,
    name: "Pacific Avenue",
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    hotelCost: 200,
    houses: 0,
    color: "green",
    mortgageValue: 150,
    status: "unowned",
    owner: null,
    position: 31
  },
  {
    id: 32,
    name: "North Carolina Avenue",
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    hotelCost: 200,
    houses: 0,
    color: "green",
    mortgageValue: 150,
    status: "unowned",
    owner: null,
    position: 32
  },
  {
    id: 34,
    name: "Pennsylvania Avenue",
    price: 320,
    rent: [28, 150, 450, 1000, 1200, 1400],
    houseCost: 200,
    hotelCost: 200,
    houses: 0,
    color: "green",
    mortgageValue: 160,
    status: "unowned",
    owner: null,
    position: 34
  },
  {
    id: 37,
    name: "Park Place",
    price: 350,
    rent: [35, 175, 500, 1100, 1300, 1500],
    houseCost: 200,
    hotelCost: 200,
    houses: 0,
    color: "darkBlue",
    mortgageValue: 175,
    status: "unowned",
    owner: null,
    position: 37
  },
  {
    id: 39,
    name: "Boardwalk",
    price: 400,
    rent: [50, 200, 600, 1400, 1700, 2000],
    houseCost: 200,
    hotelCost: 200,
    houses: 0,
    color: "darkBlue",
    mortgageValue: 200,
    status: "unowned",
    owner: null,
    position: 39
  },
  {
    id: 5,
    name: "Reading Railroad",
    price: 200,
    rent: [25, 50, 100, 200],
    houseCost: 0,
    hotelCost: 0,
    houses: 0,
    color: "railroad",
    mortgageValue: 100,
    status: "unowned",
    owner: null,
    position: 5
  },
  {
    id: 15,
    name: "Pennsylvania Railroad",
    price: 200,
    rent: [25, 50, 100, 200],
    houseCost: 0,
    hotelCost: 0,
    houses: 0,
    color: "railroad",
    mortgageValue: 100,
    status: "unowned",
    owner: null,
    position: 15
  },
  {
    id: 25,
    name: "B. & O. Railroad",
    price: 200,
    rent: [25, 50, 100, 200],
    houseCost: 0,
    hotelCost: 0,
    houses: 0,
    color: "railroad",
    mortgageValue: 100,
    status: "unowned",
    owner: null,
    position: 25
  },
  {
    id: 35,
    name: "Short Line",
    price: 200,
    rent: [25, 50, 100, 200],
    houseCost: 0,
    hotelCost: 0,
    houses: 0,
    color: "railroad",
    mortgageValue: 100,
    status: "unowned",
    owner: null,
    position: 35
  },
  {
    id: 12,
    name: "Electric Company",
    price: 150,
    rent: [4, 10],
    houseCost: 0,
    hotelCost: 0,
    houses: 0,
    color: "utility",
    mortgageValue: 75,
    status: "unowned",
    owner: null,
    position: 12
  },
  {
    id: 28,
    name: "Water Works",
    price: 150,
    rent: [4, 10],
    houseCost: 0,
    hotelCost: 0,
    houses: 0,
    color: "utility",
    mortgageValue: 75,
    status: "unowned",
    owner: null,
    position: 28
  }
];

export const BOARD_SPACES: BoardSpace[] = [
  { id: 0, position: 0, name: "GO", type: "go" },
  { id: 1, position: 1, name: "Mediterranean Avenue", type: "property", propertyId: 1 },
  { id: 2, position: 2, name: "Community Chest", type: "community" },
  { id: 3, position: 3, name: "Baltic Avenue", type: "property", propertyId: 3 },
  { id: 4, position: 4, name: "Income Tax", type: "tax" },
  { id: 5, position: 5, name: "Reading Railroad", type: "railroad", propertyId: 5 },
  { id: 6, position: 6, name: "Oriental Avenue", type: "property", propertyId: 6 },
  { id: 7, position: 7, name: "Chance", type: "chance" },
  { id: 8, position: 8, name: "Vermont Avenue", type: "property", propertyId: 8 },
  { id: 9, position: 9, name: "Connecticut Avenue", type: "property", propertyId: 9 },
  { id: 10, position: 10, name: "Jail", type: "jail" },
  { id: 11, position: 11, name: "St. Charles Place", type: "property", propertyId: 11 },
  { id: 12, position: 12, name: "Electric Company", type: "utility", propertyId: 12 },
  { id: 13, position: 13, name: "States Avenue", type: "property", propertyId: 13 },
  { id: 14, position: 14, name: "Virginia Avenue", type: "property", propertyId: 14 },
  { id: 15, position: 15, name: "Pennsylvania Railroad", type: "railroad", propertyId: 15 },
  { id: 16, position: 16, name: "St. James Place", type: "property", propertyId: 16 },
  { id: 17, position: 17, name: "Community Chest", type: "community" },
  { id: 18, position: 18, name: "Tennessee Avenue", type: "property", propertyId: 18 },
  { id: 19, position: 19, name: "New York Avenue", type: "property", propertyId: 19 },
  { id: 20, position: 20, name: "Free Parking", type: "free-parking" },
  { id: 21, position: 21, name: "Kentucky Avenue", type: "property", propertyId: 21 },
  { id: 22, position: 22, name: "Chance", type: "chance" },
  { id: 23, position: 23, name: "Indiana Avenue", type: "property", propertyId: 23 },
  { id: 24, position: 24, name: "Illinois Avenue", type: "property", propertyId: 24 },
  { id: 25, position: 25, name: "B. & O. Railroad", type: "railroad", propertyId: 25 },
  { id: 26, position: 26, name: "Atlantic Avenue", type: "property", propertyId: 26 },
  { id: 27, position: 27, name: "Ventnor Avenue", type: "property", propertyId: 27 },
  { id: 28, position: 28, name: "Water Works", type: "utility", propertyId: 28 },
  { id: 29, position: 29, name: "Marvin Gardens", type: "property", propertyId: 29 },
  { id: 30, position: 30, name: "Go To Jail", type: "go-to-jail" },
  { id: 31, position: 31, name: "Pacific Avenue", type: "property", propertyId: 31 },
  { id: 32, position: 32, name: "North Carolina Avenue", type: "property", propertyId: 32 },
  { id: 33, position: 33, name: "Community Chest", type: "community" },
  { id: 34, position: 34, name: "Pennsylvania Avenue", type: "property", propertyId: 34 },
  { id: 35, position: 35, name: "Short Line", type: "railroad", propertyId: 35 },
  { id: 36, position: 36, name: "Chance", type: "chance" },
  { id: 37, position: 37, name: "Park Place", type: "property", propertyId: 37 },
  { id: 38, position: 38, name: "Luxury Tax", type: "tax" },
  { id: 39, position: 39, name: "Boardwalk", type: "property", propertyId: 39 }
];

export const CHANCE_CARDS: Card[] = [
  {
    id: 1,
    type: "chance",
    text: "Advance to GO, collect $200",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, position: 0, money: player.money + 200 }
        : player
      );
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} advanced to GO and collected $200`]
      };
    }
  },
  {
    id: 2,
    type: "chance",
    text: "Advance to Illinois Avenue. If you pass GO, collect $200",
    action: (playerId, gameState) => {
      const player = gameState.players.find(p => p.id === playerId)!;
      const passedGo = player.position > 24;
      
      const updatedPlayers = gameState.players.map(p => 
        p.id === playerId 
        ? { 
            ...p, 
            position: 24, 
            money: passedGo ? p.money + 200 : p.money 
          }
        : p
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} advanced to Illinois Avenue${passedGo ? " and collected $200 for passing GO" : ""}`]
      };
    }
  },
  {
    id: 3,
    type: "chance",
    text: "Advance to St. Charles Place. If you pass GO, collect $200",
    action: (playerId, gameState) => {
      const player = gameState.players.find(p => p.id === playerId)!;
      const passedGo = player.position > 11;
      
      const updatedPlayers = gameState.players.map(p => 
        p.id === playerId 
        ? { 
            ...p, 
            position: 11, 
            money: passedGo ? p.money + 200 : p.money 
          }
        : p
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} advanced to St. Charles Place${passedGo ? " and collected $200 for passing GO" : ""}`]
      };
    }
  },
  {
    id: 4,
    type: "chance",
    text: "Bank pays you dividend of $50",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, money: player.money + 50 }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} received $50 dividend from the bank`]
      };
    }
  },
  {
    id: 5,
    type: "chance",
    text: "Get out of jail free",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, getOutOfJailCards: player.getOutOfJailCards + 1 }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} received a Get Out of Jail Free card`]
      };
    }
  },
  {
    id: 6,
    type: "chance",
    text: "Go to jail. Go directly to jail, do not pass GO, do not collect $200",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, position: 10, jailTurns: 3, status: "jailed" as PlayerStatus }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} was sent to jail`]
      };
    }
  },
  {
    id: 7,
    type: "chance",
    text: "Go Back 3 Spaces",
    action: (playerId, gameState) => {
      const player = gameState.players.find(p => p.id === playerId)!;
      const newPosition = (player.position - 3 + 40) % 40;
      
      const updatedPlayers = gameState.players.map(p => 
        p.id === playerId 
        ? { ...p, position: newPosition }
        : p
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} moved back 3 spaces to ${BOARD_SPACES[newPosition].name}`]
      };
    }
  },
  {
    id: 8,
    type: "chance",
    text: "Pay poor tax of $15",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, money: player.money - 15 }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} paid $15 poor tax`]
      };
    }
  },
  {
    id: 9,
    type: "chance",
    text: "Take a trip to Reading Railroad. If you pass GO, collect $200",
    action: (playerId, gameState) => {
      const player = gameState.players.find(p => p.id === playerId)!;
      const passedGo = player.position > 5;
      
      const updatedPlayers = gameState.players.map(p => 
        p.id === playerId 
        ? { 
            ...p, 
            position: 5, 
            money: passedGo ? p.money + 200 : p.money 
          }
        : p
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} took a trip to Reading Railroad${passedGo ? " and collected $200 for passing GO" : ""}`]
      };
    }
  },
  {
    id: 10,
    type: "chance",
    text: "You have been elected chairman of the board. Pay each player $50",
    action: (playerId, gameState) => {
      const activePlayers = gameState.players.filter(p => p.status !== "bankrupt" && p.id !== playerId);
      const paymentAmount = activePlayers.length * 50;
      
      const updatedPlayers = gameState.players.map(player => {
        if (player.id === playerId) {
          return { ...player, money: player.money - paymentAmount };
        } else if (player.status !== "bankrupt") {
          return { ...player, money: player.money + 50 };
        }
        return player;
      });
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} paid $50 to each player as chairman of the board`]
      };
    }
  }
];

export const COMMUNITY_CARDS: Card[] = [
  {
    id: 1,
    type: "community",
    text: "Advance to GO, collect $200",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, position: 0, money: player.money + 200 }
        : player
      );
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} advanced to GO and collected $200`]
      };
    }
  },
  {
    id: 2,
    type: "community",
    text: "Bank error in your favor. Collect $200",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, money: player.money + 200 }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} collected $200 from bank error`]
      };
    }
  },
  {
    id: 3,
    type: "community",
    text: "Doctor's fee. Pay $50",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, money: player.money - 50 }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} paid $50 doctor's fee`]
      };
    }
  },
  {
    id: 4,
    type: "community",
    text: "From sale of stock you get $50",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, money: player.money + 50 }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} received $50 from stock sale`]
      };
    }
  },
  {
    id: 5,
    type: "community",
    text: "Get out of jail free",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, getOutOfJailCards: player.getOutOfJailCards + 1 }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} received a Get Out of Jail Free card`]
      };
    }
  },
  {
    id: 6,
    type: "community",
    text: "Go to jail. Go directly to jail, do not pass GO, do not collect $200",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, position: 10, jailTurns: 3, status: "jailed" as PlayerStatus }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} was sent to jail`]
      };
    }
  },
  {
    id: 7,
    type: "community",
    text: "Holiday fund matures. Collect $100",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, money: player.money + 100 }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} collected $100 from holiday fund`]
      };
    }
  },
  {
    id: 8,
    type: "community",
    text: "Income tax refund. Collect $20",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, money: player.money + 20 }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} collected $20 income tax refund`]
      };
    }
  },
  {
    id: 9,
    type: "community",
    text: "It's your birthday. Collect $10 from each player",
    action: (playerId, gameState) => {
      const activePlayers = gameState.players.filter(p => p.status !== "bankrupt" && p.id !== playerId);
      const collectAmount = activePlayers.length * 10;
      
      const updatedPlayers = gameState.players.map(player => {
        if (player.id === playerId) {
          return { ...player, money: player.money + collectAmount };
        } else if (player.status !== "bankrupt") {
          return { ...player, money: player.money - 10 };
        }
        return player;
      });
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} collected $10 from each player for their birthday`]
      };
    }
  },
  {
    id: 10,
    type: "community",
    text: "Pay hospital fees of $100",
    action: (playerId, gameState) => {
      const updatedPlayers = gameState.players.map(player => 
        player.id === playerId 
        ? { ...player, money: player.money - 100 }
        : player
      );
      
      return { 
        ...gameState, 
        players: updatedPlayers,
        logs: [...gameState.logs, `Player ${playerId} paid $100 in hospital fees`]
      };
    }
  }
];

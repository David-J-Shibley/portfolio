const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store active games
const games = new Map();

// Generate a unique game ID
function generateGameId() {
  return Math.random().toString(36).substring(2, 15);
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Create a new game
  socket.on('createGame', (data) => {
    console.log('createGame', data)
    const gameId = generateGameId();
    games.set(gameId, {
      players: [socket.id],
      currentBoard: getInitialBoard(),
      currentTurn: 'white'
    });
    
    socket.join(gameId);
    socket.emit('gameCreated', { gameId });
  });

  // Join an existing game
  socket.on('joinGame', ({ gameId }) => {
    const game = games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (game.players.length >= 2) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }

    game.players.push(socket.id);
    socket.join(gameId);
    
    // Notify both players that the game can start
    io.to(gameId).emit('gameStart', {
      board: game.currentBoard,
      turn: game.currentTurn
    });
  });

  // Handle chess moves
  socket.on('move', ({ gameId, from, to }) => {
    const game = games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    // Validate if it's the player's turn
    const playerIndex = game.players.indexOf(socket.id);
    const playerColor = playerIndex === 0 ? 'white' : 'black';
    
    if (game.currentTurn !== playerColor) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    // Update game state
    // Note: In a real implementation, you'd want to validate the move here
    game.currentTurn = game.currentTurn === 'white' ? 'black' : 'white';
    
    // Broadcast the move to both players
    io.to(gameId).emit('moveMade', {
      from,
      to,
      board: game.currentBoard,
      turn: game.currentTurn
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Find and clean up any games the player was in
    for (const [gameId, game] of games.entries()) {
      if (game.players.includes(socket.id)) {
        io.to(gameId).emit('playerDisconnected');
        games.delete(gameId);
      }
    }
  });
});

// Helper function to get initial chess board state
function getInitialBoard() {
  return {
    pieces: [
      // Initial chess piece positions would go here
      // This is just a placeholder - the frontend will handle the actual board state
      []
    ]
  };
}

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Chess server running on port ${PORT}`);
});
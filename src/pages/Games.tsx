import React from "react";
import { Link } from "react-router-dom"; // If you're using React Router for navigation

import "./games.css";

const games = [
  {
    id: 9,
    title: "Dominion",
    url: "/dominion",
  },
  {
    id: 1,
    title: "Farkle",
    url: "/farkle",
  },
  {
    id: 2,
    title: "Checkers",
    url: "/checkers",
  },
  {
    id: 3,
    title: "Chess",
    url: "/chess",
  },
  {
    id: 4,
    title: "Hangman",
    url: "/hangman",
  },
  {
    id: 5,
    title: "Memory Matcher",
    url: "/memory",
  },
  {
    id: 6,
    title: "Rock Paper Scissors",
    url: "/rps",
  },
  {
    id: 7,
    title: "Snake",
    url: "/snake",
  },
  {
    id: 8,
    title: "Frogger",
    url: "/frogger",
  },
];

const GamesList: React.FC = () => {
  return (
    <div className="games-list">
      <h2 className="games-list-title">Games</h2>
      <ul className="games-list-container">
        {games.map((game) => (
          <Link to={game.url}>
            <li key={game.id} className="game-item">
              <h3 className="game-title">{game.title}</h3>
              <p className="game-link">Play {game.title}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default GamesList;

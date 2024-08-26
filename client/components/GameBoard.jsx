"use client";
import { useState, useEffect } from "react";

export default function GameBoard() {
  const [gameState, setGameState] = useState({
    board: Array(25).fill(null),
    players: [
      { id: 1, team: "red", characters: [1, 2, 3, 4, 5] },
      { id: 2, team: "blue", characters: [6, 7, 8, 9, 10] },
    ],
    currentPlayer: 1,
    winner: null,
  });

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setGameState(update);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleMove = (position) => {
    const socket = new WebSocket("ws://localhost:3000");
    socket.onopen = () => {
      socket.send(JSON.stringify({ position, player: gameState.currentPlayer }));
    };
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <h1 className="text-3xl font-bold mb-8">Turn-Based Strategy Game</h1>
      <div className="grid grid-cols-5 gap-2">
        {gameState.board.map((cell, index) => (
          <div
            key={index}
            className={`w-16 h-16 bg-card rounded-md flex items-center justify-center text-2xl font-bold ${
              cell === 1 ? "text-red-500" : cell === 2 ? "text-blue-500" : ""
            }`}
            onClick={() => handleMove(index)}
          >
            {cell !== null ? cell : ""}
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center">
        <div
          className={`w-8 h-8 rounded-full mr-2 ${
            gameState.currentPlayer === 1 ? "bg-red-500" : "bg-blue-500"
          }`}
        />
        <p className="text-lg font-medium">
          {gameState.currentPlayer === 1 ? "Red" : "Blue"} player's turn
        </p>
      </div>
      {gameState.winner && (
        <div className="mt-8 bg-card p-4 rounded-md">
          <p className="text-lg font-bold">
            {gameState.winner === 1 ? "Red" : "Blue"} player wins!
          </p>
        </div>
      )}
    </div>
  );
}

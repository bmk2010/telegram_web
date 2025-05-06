import React, { useEffect, useState } from "react";
import "./App.css"; // animatsiya uchun

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [botLevel, setBotLevel] = useState("easy");

  const checkWinner = (brd) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (brd[a] && brd[a] === brd[b] && brd[a] === brd[c]) return brd[a];
    }
    if (brd.every(Boolean)) return "draw";
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsUserTurn(true);
    setWinner(null);
    setGameStarted(false);
  };

  const handleClick = (index) => {
    if (!isUserTurn || board[index] || winner || !gameStarted) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsUserTurn(false);
  };

  const botMove = (brd, level) => {
    const empty = brd.map((v, i) => (v ? null : i)).filter((v) => v !== null);
    if (empty.length === 0) return brd;

    let move;

    if (level === "easy") {
      move = empty[Math.floor(Math.random() * empty.length)];
    } else if (level === "normal") {
      move = empty[0];
    } else if (level === "hard") {
      // center > corner > side
      const center = 4;
      const corners = [0, 2, 6, 8];
      const sides = [1, 3, 5, 7];

      if (empty.includes(center)) move = center;
      else if (empty.some((i) => corners.includes(i)))
        move = empty.find((i) => corners.includes(i));
      else move = empty.find((i) => sides.includes(i));
    }

    const newBoard = [...brd];
    newBoard[move] = "O";
    return newBoard;
  };

  useEffect(() => {
    const res = checkWinner(board);
    if (res) {
      setWinner(res);
      return;
    }

    if (!isUserTurn && gameStarted) {
      const timeout = setTimeout(() => {
        const botBoard = botMove(board, botLevel);
        setBoard(botBoard);
        setIsUserTurn(true);
        const res = checkWinner(botBoard);
        if (res) setWinner(res);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [board, isUserTurn, botLevel, gameStarted]);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          Tic Tac Toe 🎮
        </h1>
        <p className="text-gray-600 mb-2">Bot kuchini tanlang:</p>
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setBotLevel("easy")}
            className={`px-4 py-2 rounded-full border ${
              botLevel === "easy"
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600"
            }`}
          >
            Oson
          </button>
          <button
            onClick={() => setBotLevel("normal")}
            className={`px-4 py-2 rounded-full border ${
              botLevel === "normal"
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600"
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setBotLevel("hard")}
            className={`px-4 py-2 rounded-full border ${
              botLevel === "hard"
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600"
            }`}
          >
            Kuchli
          </button>
        </div>
        <button
          onClick={() => setGameStarted(true)}
          className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white text-lg rounded-full shadow transition"
        >
          Boshlash
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-indigo-50 p-6">
      <h1 className="text-2xl font-bold text-indigo-800 mb-4 animate-fade-in">
        Siz: X | Bot: O
      </h1>
      <div className="grid grid-cols-3 gap-2 animate-board">
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-20 h-20 text-3xl font-bold rounded-lg shadow bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 transition"
          >
            {val}
          </button>
        ))}
      </div>
      {winner && (
        <div className="mt-6 text-xl text-center text-indigo-900 animate-fade-in">
          {winner === "draw" ? "Durang!" : `${winner} g‘olib bo‘ldi!`}
          <br />
          <button
            onClick={resetGame}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow"
          >
            Qayta o‘ynash
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

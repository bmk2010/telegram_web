import React, { useState, useEffect } from "react";

const App = () => {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState(null);

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

  const handleClick = (index) => {
    if (!isUserTurn || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsUserTurn(false);
  };

  const botMove = (brd) => {
    const emptyIndices = brd.map((v, i) => (v ? null : i)).filter((v) => v !== null);
    if (emptyIndices.length === 0) return brd;
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...brd];
    newBoard[randomIndex] = "O";
    return newBoard;
  };

  useEffect(() => {
    const res = checkWinner(board);
    if (res) {
      setWinner(res);
      return;
    }

    if (!isUserTurn) {
      const timeout = setTimeout(() => {
        const botBoard = botMove(board);
        setBoard(botBoard);
        setIsUserTurn(true);
        const res = checkWinner(botBoard);
        if (res) setWinner(res);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [board, isUserTurn]);

  const resetGame = () => {
    setBoard(initialBoard);
    setIsUserTurn(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">Tic Tac Toe 🎮</h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-20 h-20 text-3xl font-bold rounded-lg shadow bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200"
          >
            {val}
          </button>
        ))}
      </div>
      {winner && (
        <div className="mt-6 text-xl text-center text-indigo-900">
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

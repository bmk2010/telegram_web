import React, { useEffect, useState } from "react";
import "./App.css";
import { getUser, saveUser } from "./db";

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [botLevel, setBotLevel] = useState("easy");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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
      move = getBestMove(brd); // minimax ishlatiladi
    }

    const newBoard = [...brd];
    newBoard[move] = "O";
    return newBoard;
  };

  const getBestMove = (board) => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        let score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const minimax = (board, depth, isMaximizing) => {
    const result = checkWinner(board);
    if (result !== null) {
      if (result === "O") return 10 - depth;
      else if (result === "X") return depth - 10;
      else return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = "O";
          let score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = "X";
          let score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
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
        if (res) {
          setWinner(res);
        
          if (res === "X") {
            let expGain = 0;
            if (botLevel === "easy") expGain = 1;
            else if (botLevel === "normal") expGain = 5;
            else if (botLevel === "hard") expGain = 15;
        
            const currentExp = parseInt(localStorage.getItem("exp") || "0", 10);
            localStorage.setItem("exp", currentExp + expGain);
          }
        }
        
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [board, isUserTurn, botLevel, gameStarted]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tg = window.Telegram?.WebApp;
        if (!tg) {
          throw new Error("Telegram WebApp mavjud emas.");
        }

        tg.ready();

        if (!tg.initDataUnsafe?.user) {
          throw new Error("Foydalanuvchi ma'lumotlari topilmadi.");
        }

        const tgUser = tg.initDataUnsafe.user;
        setUser(tgUser);

        const existingUser = await getUser(tgUser.id);

        if (!existingUser) {
          await saveUser(tgUser).then(() =>
            alert("Siz bazada yo'q ekansiz sizni bazaga qo'shdik")
          );
        }

        tg.expand();
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-white p-6 text-center animate-fade-in">
        {user ? (
          <div className="flex flex-col items-center mb-8 p-5 bg-white shadow-lg rounded-2xl border border-indigo-200 w-full max-w-sm transition-transform hover:scale-105">
            {user.username && (
              <img
                src={`https://t.me/i/userpic/320/${user.username}.jpg`}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-300 mb-3"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <h2 className="text-xl font-semibold text-indigo-800">
              {user.first_name} {user.last_name || ""}
            </h2>
            {user.username && (
              <p className="text-indigo-500 text-sm">@{user.username}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">ID: {user.id}</p>
          </div>
        ) : (
          <>Telegramdan ochilmadi</>
        )}

        <h1 className="text-4xl font-bold text-indigo-700 mb-4 tracking-wide drop-shadow-sm">
          Tic Tac Toe 🎮
        </h1>

        <p className="text-indigo-600 font-medium mt-2">
           Local Exp: {(localStorage.getItem("exp") || 0) +  user?.exp || 0}
        </p>


        <p className="text-gray-600 text-lg mb-3 font-medium">
          Bot kuchini tanlang:
        </p>
        <div className="flex gap-3 mb-6">
          {["easy", "normal", "hard"].map((level) => (
            <button
              key={level}
              onClick={() => setBotLevel(level)}
              className={`px-5 py-2 rounded-full border-2 transition-all duration-200 font-medium ${
                botLevel === level
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              {level === "easy"
                ? "Oson"
                : level === "normal"
                ? "Normal"
                : "Kuchli"}
            </button>
          ))}
        </div>

        <button
          onClick={() => setGameStarted(true)}
          className="px-8 py-3 bg-indigo-700 hover:bg-indigo-800 text-white text-lg rounded-full shadow-xl transition-all duration-300 active:scale-95"
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
            Ok
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // xatolikni saqlash uchun

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (!tg) {
        throw new Error("Telegram WebApp mavjud emas.");
      }

      tg.ready();

      if (!tg.initDataUnsafe?.user) {
        throw new Error("Foydalanuvchi ma'lumotlari topilmadi.");
      }

      setUser(tg.initDataUnsafe.user);
      tg.expand();
    } catch (err) {
      setError(err.message);
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 px-4">
        <div className="bg-white p-6 rounded shadow text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">
            Xatolik yuz berdi
          </h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      {user.username && (
        <img
          src={`https://t.me/i/userpic/320/${user.username}.jpg`}
          alt="User Avatar"
          className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-gray-300"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      )}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Salom, {user.first_name}!
      </h1>
      {user.last_name && (
        <h2 className="text-xl text-gray-600 mb-4">{user.last_name}</h2>
      )}
      <p className="text-gray-500">ID: {user.id}</p>
      {user.username && <p className="text-gray-500">@{user.username}</p>}
    </div>
  );
};

export default App;

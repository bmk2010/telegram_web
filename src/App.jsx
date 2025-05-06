import React, { useEffect, useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [paymentRes, setPaymentRes] = useState(null);

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

  const handleSendStars = async () => {
    const link =
      "https://api.telegram.org/bot7843578328:AAHCfMhOwEAJSmR28gGy-vvujSEAzZeAP9A/sendInvoice";

    try {
      const req = await fetch(link, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: user.id,
          title: "Podderjka uchun",
          description: "Bu donat orqali siz meni qo'llab-quvvatlaysiz",
          payload: "test",
          provider_token: "371317599:TEST:1746526335630",
          currency: "UZS", // ISO 4217 code format, katta harflarda bo'lishi kerak
          prices: [{ label: "Stars", amount: 100000 }], // amount tiyinlarda (100x5 = 500 UZS -> 50000)
        }),
      });

      const response = await req.json();

      if (!req.ok || response.ok === false) {
        throw new Error(response.description || "To‘lov yuborishda xatolik.");
      }

      setPaymentRes("To‘lov yuborildi. Iltimos, Telegram’da tasdiqlang.");
    } catch (error) {
      setPaymentRes(`Xatolik: ${error.message || "Noma’lum xatolik"}`);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-3">
            Xatolik yuz berdi
          </h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-xl animate-pulse">
          Ma'lumotlar yuklanmoqda...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 p-6">
      {user.username && (
        <img
          src={`https://t.me/i/userpic/320/${user.username}.jpg`}
          alt="User Avatar"
          className="w-28 h-28 rounded-full mb-4 object-cover border-4 border-blue-300 shadow"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-1">
        Salom, {user.first_name}!
      </h1>
      {user.last_name && (
        <h2 className="text-xl text-gray-600 mb-3">{user.last_name}</h2>
      )}
      <p className="text-gray-500 mb-1">ID: {user.id}</p>
      {user.username && <p className="text-gray-500 mb-6">@{user.username}</p>}

      <button
        onClick={handleSendStars}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg text-lg transition duration-200"
      >
        ⭐ @hi_its_bmk'ga Stars yuborish
      </button>
      {paymentRes && (
        <div className="mt-4 px-4 py-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded">
          {paymentRes}
        </div>
      )}
    </div>
  );
};

export default App;

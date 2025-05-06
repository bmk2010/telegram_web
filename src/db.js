const db_url = "https://677d387a4496848554c9947a.mockapi.io/api";

export async function getUser(id) {
  try {
    const req = await fetch(`${db_url}/users`);
    const res = await req.json();

    const userData = res.find((user) => user.id == id);
    return userData;
  } catch (error) {
    window.alert(error.message);
  }
}

export async function saveUser(tgUser) {
  try {
    const res = await fetch(`${db_url}/users`);
    const usersArr = await res.json();

    // Eski massivni olish
    let existingList = usersArr[0]?.users || [];

    // Foydalanuvchi allaqachon mavjud emasligiga ishonch hosil qilish
    const alreadyExists = existingList.some((u) => u.id === tgUser.id);
    if (alreadyExists) return;

    // Yangi foydalanuvchini massivga qo‘shish
    existingList.push({
      id: tgUser.id,
      name:
        tgUser.first_name + (tgUser.last_name ? ` ${tgUser.last_name}` : ""),
      exp: 0,
      achievement: {},
    });

    // Yagona obyektni yangilash
    await fetch(`${db_url}/users/${usersArr[0].id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: existingList }),
    });
  } catch (error) {
    console.error("Foydalanuvchi saqlashda xatolik:", error.message);
  }
}

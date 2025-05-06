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

export async function saveUser(user) {
  try {
    const req = await fetch(`${db_url}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const res = await req.json();
    return res;
  } catch (error) {
    window.alert(error.message);
  }
}

const token = localStorage.getItem("token");
const userInitialEl = document.getElementById("user-initial");

async function loadUserInitial() {
  if (!userInitialEl) return;

  if (!token) {
    userInitialEl.textContent = "?";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Usuário não encontrado");

    const user = await response.json();
    const initial = user.name?.trim().charAt(0).toUpperCase() || "?";
    userInitialEl.textContent = initial;

  } catch (err) {
    console.error(err);
    userInitialEl.textContent = "?";
  }
}

loadUserInitial();

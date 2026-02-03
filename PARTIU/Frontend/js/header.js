async function loadUserInitial() {
  const userInitialEl = document.getElementById("user-initial");
  if (!userInitialEl) return;

  const token = localStorage.getItem("token");

  if (!token) {
    userInitialEl.textContent = "?";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error();

    const user = await response.json();
    userInitialEl.textContent =
      user.name?.trim().charAt(0).toUpperCase() || "?";

  } catch (err) {
    console.error("Erro no header:", err);
    userInitialEl.textContent = "?";
  }
}

document.addEventListener("DOMContentLoaded", loadUserInitial);

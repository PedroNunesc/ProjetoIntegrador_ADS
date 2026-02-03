const API_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token");

if (!token) window.location.href = "login.html";

let userId = null;

const nameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const currentPasswordInput = document.getElementById("currentPasswordInput");
const saveBtn = document.querySelector(".btn-save");
const logoutBtn = document.querySelector(".btn-logout");
const deleteBtn = document.querySelector(".btn-delete-account");
const passwordWarning = document.getElementById("passwordWarning");
const profileInitialEl = document.getElementById("profile-initial");

async function loadUser() {
  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao carregar usuário");

    const user = await res.json();
    userId = user.id;

    nameInput.value = user.name || "";
    emailInput.value = user.email || "";

    profileInitialEl.textContent =
      user.name?.trim().charAt(0).toUpperCase() || "?";

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dados do usuário");
  }
}

saveBtn.addEventListener("click", async () => {
  passwordWarning.textContent = "";

  const body = {};

  if (nameInput.value) body.name = nameInput.value;
  if (emailInput.value) body.email = emailInput.value;

  if (passwordInput.value) {
    if (!currentPasswordInput.value) {
      passwordWarning.textContent = "Informe a senha atual";
      return;
    }

    body.password = passwordInput.value;
    body.currentPassword = currentPasswordInput.value;
  }

  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      passwordWarning.textContent = data.message || "Erro ao atualizar perfil";
      return;
    }

    alert("Perfil atualizado com sucesso!");

    passwordInput.value = "";
    currentPasswordInput.value = "";

  } catch (err) {
    console.error(err);
    alert("Erro ao salvar alterações");
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});


deleteBtn.addEventListener("click", async () => {
  if (!confirm("Deseja apagar sua conta?")) return;

  try {
    await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    localStorage.clear();
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("Erro ao apagar conta");
  }
});

loadUser();

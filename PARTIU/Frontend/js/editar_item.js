const token = localStorage.getItem("token");
if (!token) {
  alert("Você precisa estar logado.");
  window.location.href = "login.html";
}

const avatarImg = document.getElementById("user-avatar");
async function loadUserAvatar() {
  if (!avatarImg) return;
  const defaultAvatar = "../assets/perfil.png";

  try {
    const response = await fetch("http://localhost:3000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Erro ao buscar usuário");

    const user = await response.json();
    avatarImg.src = user.profilePhotoUrl || defaultAvatar;

  } catch {
    avatarImg.src = defaultAvatar;
  }
}
loadUserAvatar();

const params = new URLSearchParams(window.location.search);
const itemId = params.get("itemId");
const tripId = params.get("tripId");

if (!itemId || !tripId) {
  alert("Item não encontrado.");
  window.location.href = "tela_mala.html";
}

document.getElementById("back-to-trip").href = `tela_d_viagem.html?tripId=${tripId}`;

async function loadItem() {
  try {
    const res = await fetch(`http://localhost:3000/api/item/${itemId}`, {
      headers: { Authorization: "Bearer " + token }
    });
    const item = await res.json();

    document.getElementById("item-name").value = item.name;
    document.getElementById("item-category").value = item.category;

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar item.");
    window.location.href = `tela_d_viagem.html?tripId=${tripId}`;
  }
}
loadItem();

document.getElementById("btn-save").addEventListener("click", async () => {
  const name = document.getElementById("item-name").value.trim();
  const category = document.getElementById("item-category").value;

  if (!name || !category) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    await fetch(`http://localhost:3000/api/item/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ name, category })
    });

    window.location.href = `tela_d_viagem.html?tripId=${tripId}`;
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar alterações.");
  }
});

document.getElementById("btn-delete").addEventListener("click", async () => {
  if (!confirm("Tem certeza que deseja apagar este item?")) return;

  try {
    await fetch(`http://localhost:3000/api/item/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });

    window.location.href = `tela_d_viagem.html?tripId=${tripId}`;
  } catch (err) {
    console.error(err);
    alert("Erro ao apagar item.");
  }
});
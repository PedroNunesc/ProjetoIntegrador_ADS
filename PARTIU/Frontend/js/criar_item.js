const token = localStorage.getItem("token");
if (!token) {
  alert("Você precisa estar logado.");
  window.location.href = "login.html";
}

const params = new URLSearchParams(window.location.search);
const tripId = params.get("tripId");
if (!tripId) {
  alert("Viagem não encontrada.");
  window.location.href = "tela_mala.html";
}

document.getElementById("back-to-trip").href = `tela_d_viagem.html?tripId=${tripId}`;

document.getElementById("btn-create-item").addEventListener("click", async () => {
  const name = document.getElementById("item-name").value.trim();
  const category = document.getElementById("item-category").value;

  if (!name || !category) {
    alert("Preencha o nome e a categoria.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ name, category, tripId: Number(tripId) })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Erro backend:", res.status, text);
      throw new Error("Erro ao criar item");
    }

    window.location.href = `tela_d_viagem.html?tripId=${tripId}`;
  } catch (err) {
    console.error(err);
    alert("Erro ao criar item.");
  }
});
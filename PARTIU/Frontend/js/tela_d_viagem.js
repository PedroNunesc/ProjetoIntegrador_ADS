const token = localStorage.getItem("token");
if (!token) {
  alert("Você precisa estar logado.");
  window.location.href = "login.html";
}

const urlParams = new URLSearchParams(window.location.search);
const tripId = urlParams.get("tripId");
if (!tripId) {
  alert("Viagem não encontrada.");
  window.location.href = "tela_mala.html";
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getImageForCategory(category, selected = false) {
  if (category === "outros") return null;
  const map = {
    roupas: "roupas",
    calcados: "calcados",
    eletronicos: "eletronicos",
    acessorios: "acessorios",
    higiene: "higiene",
    remedios: "remedios",
    documentos: "documentos",
  };
  const file = map[category];
  const suffix = selected ? "-blue.png" : "-white.png";
  return file ? `../assets/icons/${file}${suffix}` : null;
}

async function updateItemStatus(itemId, isPacked) {
  const res = await fetch(`http://localhost:3000/api/item/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ isPacked }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar item");
  return res.json();
}

function loadItems(items) {
  const container = document.getElementById("items-list");
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = "<p>Nenhum item encontrado.</p>";
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card";

    const left = document.createElement("div");
    left.className = "left";

    const circle = document.createElement("div");
    circle.className = "circle";
    circle.style.backgroundColor = item.isPacked ? "#1f3c88" : "#ffffff";

    const imageSrc = getImageForCategory(item.category, item.isPacked);
    if (imageSrc) {
      const img = document.createElement("img");
      img.src = imageSrc;
      img.className = "item-icon";
      circle.appendChild(img);
    }

    const name = document.createElement("span");
    name.textContent = item.name;

    left.appendChild(circle);
    left.appendChild(name);

    const dots = document.createElement("div");
    dots.className = "dots";
    dots.textContent = "⋯";
    dots.addEventListener("click", () => {
      window.location.href = `editar_item.html?itemId=${item.id}&tripId=${tripId}`;
    });

    circle.addEventListener("click", async () => {
      try {
        const updated = await updateItemStatus(item.id, !item.isPacked);
        item.isPacked = updated.isPacked;
        circle.style.backgroundColor = item.isPacked ? "#1f3c88" : "#ffffff";

        const imgInside = circle.querySelector("img");
        const newSrc = getImageForCategory(item.category, item.isPacked);

        if (newSrc) {
          if (imgInside) {
            imgInside.src = newSrc;
          } else {
            const newImg = document.createElement("img");
            newImg.src = newSrc;
            newImg.className = "item-icon";
            circle.appendChild(newImg);
          }
        } else {
          if (imgInside) imgInside.remove();
        }
      } catch {
        alert("Erro ao atualizar item.");
      }
    });

    card.appendChild(left);
    card.appendChild(dots);
    container.appendChild(card);
  });
}

async function loadTrip() {
  try {
    const itemsRes = await fetch(
      `http://localhost:3000/api/item/trip/${tripId}`,
      { headers: { Authorization: "Bearer " + token } },
    );
    const items = await itemsRes.json();

    const tripRes = await fetch(`http://localhost:3000/api/trip/${tripId}`, {
      headers: { Authorization: "Bearer " + token },
    });
    const trip = await tripRes.json();

    document.getElementById("trip-name").textContent = trip.name;
    document.getElementById("trip-dates").textContent =
      `DATA: ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;
    document.getElementById("trip-location").textContent =
      `LOCAL: ${trip.city}, ${trip.country}`;

    loadItems(items);
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar a viagem.");
  }
}

document.getElementById("btn-new-item").addEventListener("click", () => {
  window.location.href = `criar_item.html?tripId=${tripId}`;
});

loadTrip();

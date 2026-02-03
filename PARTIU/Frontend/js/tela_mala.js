const token = localStorage.getItem("token");
if (!token) {
  alert("Você precisa estar logado.");
  window.location.href = "login.html";
}

function formatDate(dateStr) {
  const options = { day: "2-digit", month: "short" };
  return new Date(dateStr).toLocaleDateString("pt-BR", options);
}

function renderTrip(trip) {
  const list = document.getElementById("trip-list");
  const card = document.createElement("article");
  card.className = "card";

  const div = document.createElement("div");

  const title = document.createElement("p");
  title.className = "trip-title";
  title.textContent = trip.name;

  const meta = document.createElement("p");
  meta.className = "trip-meta";
  meta.innerHTML = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}<br>${trip.city}, ${trip.country}`;

  div.appendChild(title);
  div.appendChild(meta);

  const editButton = document.createElement("button");
  editButton.className = "btn-primary btn-small";
  editButton.textContent = "Editar viagem";
  editButton.addEventListener("click", () => {
    window.location.href = `editar_viagem.html?tripId=${trip.id}`;
  });

  const viewButton = document.createElement("button");
  viewButton.className = "btn-primary btn-small";
  viewButton.textContent = "Ver itens";
  viewButton.addEventListener("click", () => {
    window.location.href = `tela_d_viagem.html?tripId=${trip.id}`;
  });

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.style.display = "flex";
  buttonsWrapper.style.flexDirection = "column";
  buttonsWrapper.style.gap = "8px";
  buttonsWrapper.appendChild(editButton);
  buttonsWrapper.appendChild(viewButton);

  card.appendChild(div);
  card.appendChild(buttonsWrapper);

  list.appendChild(card);
}

async function fetchTrips() {
  try {
    const userResponse = await fetch("http://localhost:3000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!userResponse.ok) throw new Error("Erro ao buscar usuário");

    const user = await userResponse.json();
    const userId = user.id;

    const response = await fetch(`http://localhost:3000/api/trip/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Erro ao buscar viagens");

    const trips = await response.json();
    const listContainer = document.getElementById("trip-list");
    listContainer.innerHTML = "";
    if (!trips || trips.length === 0) {
      listContainer.innerHTML = "<p>Nenhuma viagem encontrada.</p>";
      return;
    }
    trips.forEach(renderTrip);
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar suas viagens.");
  }
}

fetchTrips();
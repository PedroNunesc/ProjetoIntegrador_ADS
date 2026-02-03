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

const nameInput = document.getElementById("trip-name");
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");
const countryInput = document.getElementById("country");
const cityInput = document.getElementById("city");
const typeSelect = document.getElementById("trip-type");

async function loadTrip() {
  try {
    const res = await fetch(`http://localhost:3000/api/trip/${tripId}`, { headers: { Authorization: "Bearer " + token } });
    if (!res.ok) throw new Error("Erro ao carregar viagem");
    const trip = await res.json();

    nameInput.value = trip.name || "";
    startDateInput.value = trip.startDate?.split("T")[0] || "";
    endDateInput.value = trip.endDate?.split("T")[0] || "";
    countryInput.value = trip.country || "";
    cityInput.value = trip.city || "";
    typeSelect.value = trip.type && trip.type !== "outro" ? trip.type : "";

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar a viagem.");
    window.location.href = "tela_mala.html";
  }
}
loadTrip();

document.getElementById("btn-save").addEventListener("click", async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/trip/${tripId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        country: countryInput.value.trim(),
        city: cityInput.value.trim(),
        type: typeSelect.value || "outro"
      })
    });

    if (!res.ok) {
      const error = await res.json();
      console.error(error);
      throw new Error("Erro ao salvar");
    }

    alert("Viagem atualizada com sucesso!");
    window.location.href = "tela_mala.html";

  } catch (err) {
    console.error(err);
    alert("Erro ao salvar alterações.");
  }
});

document.getElementById("btn-delete").addEventListener("click", async () => {
  if (!confirm("Tem certeza que deseja apagar esta viagem?")) return;
  try {
    const res = await fetch(`http://localhost:3000/api/trip/${tripId}`, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
    if (!res.ok) throw new Error("Erro ao apagar");
    alert("Viagem apagada com sucesso!");
    window.location.href = "tela_mala.html";
  } catch (err) {
    console.error(err);
    alert("Erro ao apagar a viagem.");
  }
});
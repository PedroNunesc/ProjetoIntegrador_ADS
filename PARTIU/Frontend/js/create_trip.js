const token = localStorage.getItem("token");
if (!token) {
  alert("Você precisa estar logado.");
  window.location.href = "login.html";
}

const loadingOverlay = document.getElementById("loadingOverlay");

let lastChecked = null;
document.querySelectorAll('input[name="tripType"]').forEach((radio) => {
  radio.addEventListener("click", function () {
    if (lastChecked === this) {
      this.checked = false;
      lastChecked = null;
    } else {
      lastChecked = this;
    }
  });
});

document.querySelector(".btn-primary").addEventListener("click", async () => {
  const name = document.getElementById("tripName").value.trim();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const country = document.getElementById("country").value.trim();
  const city = document.getElementById("city").value.trim();
  const automaticList = document.getElementById("useDefaultList").checked;
  const selectedType = document.querySelector('input[name="tripType"]:checked');
  const typeValue = selectedType ? selectedType.value : "outro";

  if (!name || !startDate || !endDate || !country || !city) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  loadingOverlay.style.display = "flex";
  const startTime = Date.now();

  try {
    const res = await fetch("http://localhost:3000/api/trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        name,
        startDate,
        endDate,
        country,
        city,
        type: typeValue,
        automaticList
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erro ao criar viagem.");
    }

    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(1000 - elapsed, 0);

    setTimeout(() => {
      window.location.href = "tela_mala.html";
    }, remainingTime);

  } catch (err) {
    console.error(err);
    loadingOverlay.style.display = "none";
    alert(err.message || "Erro inesperado no front-end.");
  }
});

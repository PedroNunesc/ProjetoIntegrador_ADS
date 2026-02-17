const loginButton = document.querySelector(".login-button");
const demoButton = document.getElementById("btn-demo");
const statusMsg = document.getElementById("status-msg");

function showLoading(msg) {
  statusMsg.className = "status show loading";
  statusMsg.innerText = msg;
}

function showSuccess(msg) {
  statusMsg.className = "status show";
  statusMsg.innerText = msg;
}

function hideStatus() {
  statusMsg.className = "status";
  statusMsg.innerText = "";
}

loginButton.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Preencha email e senha");
    return;
  }

  showLoading("🔄 Conectando ao servidor");

  const slowTimer = setTimeout(() => {
    showLoading("😴 Servidor acordando, aguarde");
  }, 3000);

  try {
    const response = await fetch("https://pi-back-end-oip6.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    clearTimeout(slowTimer);

    const data = await response.json();

    if (!response.ok) {
      hideStatus();
      alert(data.message || "Erro ao fazer login");
      return;
    }

    localStorage.setItem("token", data.token);

    const meResponse = await fetch("https://pi-back-end-oip6.onrender.com/api/me", {
      headers: { Authorization: `Bearer ${data.token}` }
    });

    const user = await meResponse.json();
    localStorage.setItem("user", JSON.stringify(user));

    showSuccess("✅ Login realizado!");

    setTimeout(() => {
      window.location.href = "./html/homepage.html";
    }, 800);

  } catch (error) {
    clearTimeout(slowTimer);
    console.error(error);
    hideStatus();
    alert("Erro de conexão com o servidor");
  }
});

demoButton.addEventListener("click", async () => {
  showLoading("🔄 Conectando ao servidor");

  const slowTimer = setTimeout(() => {
    showLoading("😴 Servidor acordando, aguarde");
  }, 3000);

  try {
    const res = await fetch("https://pi-back-end-oip6.onrender.com/api/auth/demo", {
      method: "POST"
    });

    clearTimeout(slowTimer);

    if (!res.ok) throw new Error();

    const data = await res.json();
    localStorage.setItem("token", data.token);

    showSuccess("✅ Entrando como visitante!");

    setTimeout(() => {
      window.location.href = "./html/homepage.html";
    }, 800);

  } catch (err) {
    clearTimeout(slowTimer);
    console.error(err);
    hideStatus();
    alert("Não foi possível entrar como visitante.");
  }
});

fetch("https://pi-back-end-oip6.onrender.com/api/health").catch(() => {});

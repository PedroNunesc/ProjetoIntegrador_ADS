const loginButton = document.querySelector(".login-button");

loginButton.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Preencha email e senha");
    return;
  }

  try {
    const response = await fetch("https://pi-back-end-oip6.onrender.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Erro ao fazer login");
      return;
    }

    localStorage.setItem("token", data.token);

    const meResponse = await fetch("https://pi-back-end-oip6.onrender.com/api/me", {
      headers: {
        "Authorization": `Bearer ${data.token}`
      }
    });

    const user = await meResponse.json();
    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "./html/homepage.html";

  } catch (error) {
    console.error(error);
    alert("Erro de conexão com o servidor");
  }
});

document.getElementById("btn-demo").addEventListener("click", async () => {
  try {
    const res = await fetch("https://pi-back-end-oip6.onrender.com/api/auth/demo", { method: "POST" });
    if (!res.ok) throw new Error("Erro ao logar como visitante");

    const data = await res.json();
    localStorage.setItem("token", data.token);

    window.location.href = "./html/homepage.html"; 
  } catch (err) {
    console.error(err);
    alert("Não foi possível entrar como visitante.");
  }
});

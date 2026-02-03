const loginButton = document.querySelector(".login-button");

loginButton.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Preencha email e senha");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/login", {
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

    const meResponse = await fetch("http://localhost:3000/api/me", {
      headers: {
        "Authorization": `Bearer ${data.token}`
      }
    });

    const user = await meResponse.json();
    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "homepage.html";

  } catch (error) {
    console.error(error);
    alert("Erro de conexão com o servidor");
  }
});
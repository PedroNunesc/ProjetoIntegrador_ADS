document.addEventListener("DOMContentLoaded", () => {
    const signupButton = document.querySelector(".signup-button");
    const loadingOverlay = document.getElementById("loadingOverlay");

    signupButton.addEventListener("click", async () => {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!name || !email || !password) {
            alert("Preencha todos os campos!");
            return;
        }

        loadingOverlay.style.display = "flex";
        const startTime = Date.now();

        try {
            const response = await fetch("https://pi-back-end-oip6.onrender.com/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar");
            }

            const elapsed = Date.now() - startTime;
            const remaining = Math.max(1000 - elapsed, 0);

            setTimeout(() => {
                alert("Cadastro realizado com sucesso!");
                window.location.href = "/index.html";
            }, remaining);

        } catch (error) {
            console.error(error);

            loadingOverlay.style.display = "none";
            alert("Erro ao criar conta. Email já existente?");
        }
    });
});

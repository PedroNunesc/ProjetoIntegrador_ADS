document.addEventListener("DOMContentLoaded", () => {
    const signupButton = document.querySelector(".signup-button");

    signupButton.addEventListener("click", async () => {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!name || !email || !password) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar");
            }

            alert("Cadastro realizado com sucesso!");
            window.location.href = "index.html";

        } catch (error) {
            console.error(error);
            alert("Erro ao criar conta. Email já existente?");
        }
    });

});

const emailInput = document.querySelector('input[name="email"]');
const senhaInput = document.querySelector('input[name="senha"]');
const loginButton = document.querySelector('button');

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Erro no login");
            return;
        }

        sessionStorage.setItem("usuario", JSON.stringify(data));
        window.location.href = "../ui/index.html";

    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        alert("Erro de conexão. Tente novamente mais tarde.");
    }
});
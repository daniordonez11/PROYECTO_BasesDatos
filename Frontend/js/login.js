document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#login-form"); // asume que tu form tiene id="login-form"
    const errorDiv = document.querySelector("#error-message"); // div para mostrar errores

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;

        try {
            const response = await fetch("/api/tienda/v1/auth/login", {
                method: "POST",
                credentials: "include", // IMPORTANTE: incluye cookies de sesión
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (data.ok) {
                // Login exitoso: redirige a la página principal
                window.location.href = "/Frontend/pages/inicio.html";
            } else {
                // Muestra error
                errorDiv.textContent = data.error || "Error en login";
            }
        } catch (error) {
            errorDiv.textContent = "Error de conexión";
        }
    });
});
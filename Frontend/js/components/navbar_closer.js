// js/components/navbar_closer.js
(function () {
    function handleLogoutClick() {
        const confirmed = window.confirm("¿Estás seguro que deseas cerrar sesión?");
        if (!confirmed) {
            // Browsers usually only allow window.close() for windows opened via script,
            // but we attempt it as requested.
            window.close();
            return;
        }

        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) {
            console.warn("No se pudo limpiar almacenamiento local:", e);
        }

        // Redirect to login page.
        window.location.href = "/pages/login.html";
    }

    const bindLogout = () => {
        const btn = document.querySelector(".nb-btn-logout");
        if (!btn) return false;
        btn.addEventListener("click", handleLogoutClick);
        return true;
    };

    if (!bindLogout()) {
        const observer = new MutationObserver((mutations, obs) => {
            if (bindLogout()) {
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();

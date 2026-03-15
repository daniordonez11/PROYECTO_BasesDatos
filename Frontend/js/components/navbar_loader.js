// js/loadNavbar.js
document.addEventListener("DOMContentLoaded", () => {
    fetch("../components/navbar.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("navbar").innerHTML = html;

            // Load logout / navbar actions after the HTML has been injected.
            // Use a data attribute to avoid inserting duplicate script tags if this runs more than once.
            if (!document.querySelector('script[data-navbar-closer]')) {
                const script = document.createElement("script");
                script.src = "../js/components/navbar_closer.js";
                script.setAttribute("data-navbar-closer", "true");
                document.body.appendChild(script);
            }
        })
        .catch(err => console.error("Error cargando navbar:", err));
});

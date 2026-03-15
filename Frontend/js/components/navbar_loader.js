// js/loadNavbar.js
document.addEventListener("DOMContentLoaded", () => {
    fetch("../components/navbar.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("navbar").innerHTML = html;
        })
        .catch(err => console.error("Error cargando navbar:", err));
});

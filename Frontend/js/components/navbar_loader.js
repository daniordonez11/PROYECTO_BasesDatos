// js/components/navbar_loader.js
document.addEventListener("DOMContentLoaded", () => {
    console.log('navbar_loader ejecutado'); // ← agregar
  console.log('token:', localStorage.getItem('token'));
  fetch("/components/navbar.html")
  .then(res => {
    console.log('fetch status:', res.status); // ← agregar
    return res.text();
  })
  .then(html => {
    console.log('navbar HTML cargado, longitud:', html.length); // ← agregar
    document.getElementById("navbar").innerHTML = html;

    setTimeout(() => {
      try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Rol:', payload.rol); // ← agregar

        if (payload.rol !== 'Administrador') {
            // Ocultar dropdown Editar completo
  document.getElementById('nbDropdownEditar')
    ?.closest('.nav-item')?.remove();

  // Ocultar dropdown Inventario completo  
  document.getElementById('nbDropdownInventario')
    ?.closest('.nav-item')?.remove();

  // Ocultar Galería
  document.querySelectorAll('.nb-nav .nav-item').forEach(item => {
    if (item.textContent.trim().includes('Galería')) item.remove();
  });
        }
      } catch(e) {
        console.error('Error en ocultamiento:', e);
      }
    }, 100);

    if (!document.querySelector('script[data-navbar-closer]')) {
      const script = document.createElement("script");
      script.src = "/js/components/navbar_closer.js";
      script.setAttribute("data-navbar-closer", "true");
      document.body.appendChild(script);
    }
  })
  .catch(err => console.error('Error fetch navbar:', err)); // ← agregar
});
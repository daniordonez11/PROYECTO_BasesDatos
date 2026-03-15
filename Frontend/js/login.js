// js/login.js
import { API, setToken } from '/js/components/http.global.js';

document.addEventListener("DOMContentLoaded", () => {
  const form     = document.getElementById('login-form');
  const alertBox = document.getElementById('alert-container');

  console.log('login.js cargado'); // ← agregar
  console.log('API:', API);        // ← agregar
  console.log('form:', form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log('submit ejecutado'); // ← agregar

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        console.log('haciendo fetch a:', `${API}/auth/login`);
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      console.log('respuesta status:', res.status);
      const data = await res.json();
      console.log('data:', data);

      if (data.ok) {
        setToken(data.token); // guardar JWT en localStorage
        window.location.href = '/pages/inicio.html';
      } else {
        alertBox.innerHTML = `
          <div class="alert alert-danger">${data.error || 'Credenciales inválidas'}</div>`;
      }

    } catch (err) {
        console.error('Error catch:', err);
      alertBox.innerHTML = `
        <div class="alert alert-danger">Error de conexión</div>`;
    }
  });
});
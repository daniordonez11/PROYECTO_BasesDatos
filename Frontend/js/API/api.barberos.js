// js/API/api.barberos.js
import { API, getToken } from '/js/components/http.global.js';

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.replace('/pages/login.html');
    return null;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}

export const getBarberos = () =>
  request('/barberos');

export const getBarberoById = (id) =>
  request(`/barberos/${encodeURIComponent(id)}`);

export const getUsuariosDisponibles = () =>
  request('/barberos/usuarios-disponibles');

export const createBarbero = (payload) =>
  request('/barberos', { method: 'POST', body: payload });

export const updateBarbero = (id, payload) =>
  request(`/barberos/${encodeURIComponent(id)}`, { method: 'PUT', body: payload });

export const deleteBarbero = (id) =>
  request(`/barberos/${encodeURIComponent(id)}`, { method: 'DELETE' });

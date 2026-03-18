// js/API/api.citas.js
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

export const getCitas         = ()            => request('/citas');
export const getCitaById      = (id)          => request(`/citas/${id}`);
export const getFormData      = ()            => request('/citas/form-data');
export const buscarClientes   = (q)           => request(`/citas/buscar-clientes?q=${encodeURIComponent(q)}`);
export const createCita       = (payload)     => request('/citas', { method: 'POST', body: payload });
export const updateEstadoCita = (id, payload) => request(`/citas/${id}/estado`, { method: 'PUT', body: payload });
export const deleteCita       = (id)          => request(`/citas/${id}`, { method: 'DELETE' });
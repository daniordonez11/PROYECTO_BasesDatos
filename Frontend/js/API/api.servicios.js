// js/API/api.servicios.js
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

export const getServicios    = ()            => request('/servicios');
export const getServicioById = (id)          => request(`/servicios/${id}`);
export const createServicio  = (payload)     => request('/servicios', { method: 'POST', body: payload });
export const updateServicio  = (id, payload) => request(`/servicios/${id}`, { method: 'PUT', body: payload });
export const deleteServicio  = (id)          => request(`/servicios/${id}`, { method: 'DELETE' });
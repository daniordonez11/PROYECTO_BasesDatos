
import { API } from '../components/http.global.js';

// Pequeño ayudante para manejar respuestas y errores
async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export async function getSucursales() {
  return request('/sucursales', { method: 'GET' }); // -> []
}

export async function getSucursalById(id) {
  return request(`/sucursales/${encodeURIComponent(id)}`, { method: 'GET' });
}

export async function searchSucursales({ q, id } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (id) params.set('id', id);
  const qs = params.toString();
  return request(`/sucursales${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

export async function createSucursal(payload) {
  return request('/sucursales', { method: 'POST', body: payload });
}

export async function updateSucursal(id, payload) {
  return request(`/sucursales/${encodeURIComponent(id)}`, { method: 'PUT', body: payload });
}

export async function deleteSucursal(id) {
  return request(`/sucursales/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

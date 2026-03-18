// js/API/api.clientes.js
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
 
export const getClientes    = ()            => request('/clientes');
export const getClienteById = (id)          => request(`/clientes/${id}`);
export const createCliente  = (payload)     => request('/clientes', { method: 'POST', body: payload });
export const updateCliente  = (id, payload) => request(`/clientes/${id}`, { method: 'PUT', body: payload });
export const deleteCliente  = (id)          => request(`/clientes/${id}`, { method: 'DELETE' });
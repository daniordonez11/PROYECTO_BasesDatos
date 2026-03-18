// js/API/api.usuarios.js
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

export const getUsuarios         = ()           => request('/usuarios');
export const getUsuarioById      = (id)         => request(`/usuarios/${id}`);
export const getRoles            = ()           => request('/usuarios/roles');
export const createUsuario       = (payload)    => request('/usuarios', { method: 'POST', body: payload });
export const updateUsuario       = (id, payload)=> request(`/usuarios/${id}`, { method: 'PUT', body: payload });
export const deleteUsuario       = (id)         => request(`/usuarios/${id}`, { method: 'DELETE' });
// js/components/http.global.js

export const API = 'http://localhost:3000/api/tienda/v1';

// ── Token ─────────────────────────────────────
export const getToken  = ()  => localStorage.getItem('token');
export const setToken  = (t) => localStorage.setItem('token', t);
export const clearToken = () => localStorage.removeItem('token');

// ── Sesión ────────────────────────────────────
export const verificarSesion = () => {
  if (!getToken()) window.location.href = '/Frontend/pages/login.html';
};

// ── Fetch con token automático ────────────────
export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...options.headers
    }
  });

  // Token expirado o inválido
  if (res.status === 401) {
    clearToken();
    window.location.href = '/Frontend/pages/login.html';
    return null;
  }

  return res.json();
};

// ── Logout ────────────────────────────────────
export const logout = () => {
  clearToken();
  window.location.href = '/Frontend/pages/login.html';
};
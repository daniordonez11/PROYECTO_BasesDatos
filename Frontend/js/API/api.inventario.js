// js/API/api.inventario.js
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

// ── Productos ─────────────────────────────────
export const getProductos      = ()            => request('/productos');
export const getProductoById   = (id)          => request(`/productos/${id}`);
export const getProductoFormData = ()          => request('/productos/form-data');
export const createProducto    = (payload)     => request('/productos', { method: 'POST', body: payload });
export const updateProducto    = (id, payload) => request(`/productos/${id}`, { method: 'PUT', body: payload });
export const deleteProducto    = (id)          => request(`/productos/${id}`, { method: 'DELETE' });

// ── Inventario ────────────────────────────────
export const getInventarios    = ()            => request('/inventario');
export const getInventarioById = (id)          => request(`/inventario/${id}`);
export const createInventario  = (payload)     => request('/inventario', { method: 'POST', body: payload });
export const updateInventario  = (id, payload) => request(`/inventario/${id}`, { method: 'PUT', body: payload });
export const deleteInventario  = (id)          => request(`/inventario/${id}`, { method: 'DELETE' });
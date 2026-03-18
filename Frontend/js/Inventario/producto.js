// js/Inventario/productos.js
import { verificarSesion } from '/js/components/http.global.js';
import {
  getProductos,
  getProductoFormData,
  createProducto,
  updateProducto,
  deleteProducto
} from '/js/API/api.inventario.js';

verificarSesion();

let productos = [];
let productosCopia = [];
let categorias = [];
const toId = (id) => String(id ?? '');

function showAlert(msg, type = 'success') {
  const box = document.getElementById('alert-container');
  box.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

async function cargarDatos() {
  const [data, fd] = await Promise.all([getProductos(), getProductoFormData()]);
  productos = Array.isArray(data) ? data : [];
  productosCopia = [...productos];
  categorias = fd?.categorias ?? [];
  llenarSelectCategoria();
}

function llenarSelectCategoria(selectedId = null) {
  const sel = document.getElementById('categoria_id');
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Categoria --</option>';
  categorias.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nombre;
    if (selectedId && toId(c.id) === toId(selectedId)) opt.selected = true;
    sel.appendChild(opt);
  });
}

function pintarTabla() {
  const tbody = document.getElementById('tbody-productos');
  if (!tbody) return;
  if (!productos.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">Sin productos registrados</td></tr>`;
    return;
  }
  tbody.innerHTML = productos.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>
        <div style="font-weight:500;color:var(--white)">${p.nombre}</div>
        ${p.codigo_barras ? `<div style="font-size:0.72rem;color:var(--text-muted)">${p.codigo_barras}</div>` : ''}
      </td>
      <td style="font-size:0.82rem;color:var(--text-dim)">${p.categoria?.nombre ?? '—'}</td>
      <td>L. ${parseFloat(p.costo_ult_compra ?? 0).toFixed(2)}</td>
      <td>L. ${parseFloat(p.precio_venta ?? 0).toFixed(2)}</td>
      <td>
        <span style="
          display:inline-block;padding:0.2rem 0.65rem;border-radius:2px;
          font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
          background:${p.activo ? 'rgba(58,125,90,.15)' : 'rgba(204,63,63,.12)'};
          color:${p.activo ? '#7ecba0' : '#e07070'};
          border:1px solid ${p.activo ? '#3a7d5a' : '#cc3f3f'};
        ">${p.activo ? 'Activo' : 'Inactivo'}</span>
      </td>
      <td>
        <div class="acciones-celda">
          <button class="btn-accion btn-editar" data-action="edit" data-id="${p.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar
          </button>
          <button class="btn-accion btn-eliminar" data-action="delete" data-id="${p.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function resetForm() {
  document.getElementById('id').value              = '';
  document.getElementById('nombre').value          = '';
  document.getElementById('codigo_barras').value   = '';
  document.getElementById('costo_ult_compra').value = '';
  document.getElementById('precio_venta').value    = '';
  document.getElementById('activo').value          = '1';
  llenarSelectCategoria();
}

async function onSubmit(ev) {
  ev.preventDefault();
  const id              = document.getElementById('id').value.trim();
  const nombre          = document.getElementById('nombre').value.trim();
  const categoria_id    = document.getElementById('categoria_id').value;
  const codigo_barras   = document.getElementById('codigo_barras').value.trim();
  const costo_ult_compra = parseFloat(document.getElementById('costo_ult_compra').value) || null;
  const precio_venta    = parseFloat(document.getElementById('precio_venta').value) || null;
  const activo          = document.getElementById('activo').value === '1';

  if (!nombre) { showAlert('El nombre es requerido', 'warning'); return; }
  if (!categoria_id) { showAlert('Selecciona una categoria', 'warning'); return; }

  const payload = { nombre, categoria_id, codigo_barras, costo_ult_compra, precio_venta, activo };

  try {
    if (id) {
      await updateProducto(id, payload);
      const i = productos.findIndex(p => p.id === id);
      if (i >= 0) productos[i] = { ...productos[i], ...payload, categoria: categorias.find(c => toId(c.id) === toId(categoria_id)) };
      showAlert('Producto actualizado');
    } else {
      const creado = await createProducto(payload);
      productos.unshift({ id: toId(creado?.id), ...payload, categoria: categorias.find(c => toId(c.id) === toId(categoria_id)) });
      showAlert('Producto creado');
    }
    resetForm();
    pintarTabla();
  } catch (e) {
    showAlert(e.message || 'No se pudo guardar', 'danger');
  }
}

async function onClickTabla(ev) {
  const btn = ev.target.closest('button[data-action]');
  if (!btn) return;
  const action = btn.getAttribute('data-action');
  const id     = btn.getAttribute('data-id');

  if (action === 'edit') {
    const p = productos.find(x => toId(x.id) === id);
    if (!p) return;
    document.getElementById('id').value               = p.id;
    document.getElementById('nombre').value           = p.nombre;
    document.getElementById('codigo_barras').value    = p.codigo_barras ?? '';
    document.getElementById('costo_ult_compra').value = p.costo_ult_compra ?? '';
    document.getElementById('precio_venta').value     = p.precio_venta ?? '';
    document.getElementById('activo').value           = p.activo ? '1' : '0';
    llenarSelectCategoria(p.categoria_id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  if (action === 'delete') {
    if (!confirm(`Eliminar producto #${id}?`)) return;
    try {
      await deleteProducto(id);
      productos = productos.filter(p => toId(p.id) !== id);
      pintarTabla();
      showAlert('Producto eliminado');
    } catch (e) {
      showAlert(e.message || 'No se pudo eliminar', 'danger');
    }
  }
}

function wireSearch() {
  const btn = document.getElementById('buscar-producto');
  if (!btn) return;
  const form  = btn.closest('form');
  const input = form?.querySelector('input[type="search"]');
  if (!form || !input) return;
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = input.value.trim().toLowerCase();
    if (!q) { productos = [...productosCopia]; pintarTabla(); return; }
    productos = productosCopia.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      (p.codigo_barras ?? '').toLowerCase().includes(q) ||
      (p.categoria?.nombre ?? '').toLowerCase().includes(q)
    );
    pintarTabla();
  });
  input.addEventListener('input', () => {
    if (!input.value.trim()) { productos = [...productosCopia]; pintarTabla(); }
  });
}

async function init() {
  try {
    await cargarDatos();
    pintarTabla();
    document.getElementById('form-producto')?.addEventListener('submit', onSubmit);
    document.getElementById('btn-cancelar')?.addEventListener('click', resetForm);
    document.getElementById('tbody-productos')?.addEventListener('click', onClickTabla);
    wireSearch();
  } catch (e) {
    console.error(e);
    showAlert(e.message || 'Error al cargar', 'danger');
  }
}

init();
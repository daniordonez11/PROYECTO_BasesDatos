// js/Inventario/inventario.js
import { verificarSesion, API, getToken } from '/js/components/http.global.js';
import {
  getInventarios,
  createInventario,
  updateInventario,
  deleteInventario
} from '/js/API/api.inventario.js';

verificarSesion();

let inventarios = [];
let inventariosCopia = [];
let productos   = [];
let sucursales  = [];
const toId = (id) => String(id ?? '');

function showAlert(msg, type = 'success') {
  const box = document.getElementById('alert-container');
  box.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

// ── Cargar datos ──────────────────────────────
async function cargarDatos() {
  const [invData, prodData, sucData] = await Promise.all([
    getInventarios(),
    fetch(`${API}/productos`, { headers: { 'Authorization': `Bearer ${getToken()}` } }).then(r => r.json()),
    fetch(`${API}/sucursales`, { headers: { 'Authorization': `Bearer ${getToken()}` } }).then(r => r.json()),
  ]);

  inventarios = Array.isArray(invData) ? invData : [];
  inventariosCopia = [...inventarios];
  productos   = Array.isArray(prodData) ? prodData : [];
  sucursales  = Array.isArray(sucData)  ? sucData  : [];

  llenarSelects();
}

function llenarSelects() {
  const selProd = document.getElementById('producto_id');
  const selSuc  = document.getElementById('sucursal_id');
  if (!selProd || !selSuc) return;

  selProd.innerHTML = '<option value="">-- Producto --</option>';
  productos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.nombre;
    selProd.appendChild(opt);
  });

  selSuc.innerHTML = '<option value="">-- Sucursal --</option>';
  sucursales.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.nombre;
    selSuc.appendChild(opt);
  });
}

// ── Pintar tabla ──────────────────────────────
function pintarTabla() {
  const tbody = document.getElementById('tbody-inventario');
  if (!tbody) return;
  if (!inventarios.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">Sin registros de inventario</td></tr>`;
    return;
  }

  tbody.innerHTML = inventarios.map(i => {
    const bajo = parseFloat(i.stock) <= parseFloat(i.stock_min);
    return `<tr>
      <td>
        <div style="font-weight:500;color:var(--white)">${i.producto?.nombre ?? '—'}</div>
      </td>
      <td style="font-size:0.82rem;color:var(--text-dim)">${i.sucursal?.nombre ?? '—'}</td>
      <td>
        <span style="
          font-weight:600;font-size:0.95rem;
          color:${bajo ? '#e07070' : '#7ecba0'};
        ">${parseFloat(i.stock).toFixed(2)}</span>
        ${bajo ? `<span style="font-size:0.65rem;color:#e07070;margin-left:0.4rem;">BAJO</span>` : ''}
      </td>
      <td style="color:var(--text-muted);font-size:0.82rem">${parseFloat(i.stock_min).toFixed(2)}</td>
      <td style="color:var(--text-muted);font-size:0.82rem">${parseFloat(i.stock_max).toFixed(2)}</td>
      <td>
        <div class="acciones-celda">
          <button class="btn-accion btn-editar" data-action="edit" data-id="${i.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Ajustar
          </button>
          <button class="btn-accion btn-eliminar" data-action="delete" data-id="${i.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            Eliminar
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ── Reset form ────────────────────────────────
function resetForm() {
  document.getElementById('id').value        = '';
  document.getElementById('stock').value     = '';
  document.getElementById('stock_min').value = '';
  document.getElementById('stock_max').value = '';
  document.getElementById('producto_id').disabled = false;
  document.getElementById('sucursal_id').disabled = false;
  llenarSelects();
}

// ── Submit ────────────────────────────────────
async function onSubmit(ev) {
  ev.preventDefault();
  const id          = document.getElementById('id').value.trim();
  const producto_id = document.getElementById('producto_id').value;
  const sucursal_id = document.getElementById('sucursal_id').value;
  const stock       = parseFloat(document.getElementById('stock').value) || 0;
  const stock_min   = parseFloat(document.getElementById('stock_min').value) || 0;
  const stock_max   = parseFloat(document.getElementById('stock_max').value) || 0;

  if (!producto_id) { showAlert('Selecciona un producto', 'warning'); return; }
  if (!sucursal_id) { showAlert('Selecciona una sucursal', 'warning'); return; }

  const payload = { producto_id, sucursal_id, stock, stock_min, stock_max };

  try {
    if (id) {
      await updateInventario(id, { stock, stock_min, stock_max });
      const i = inventarios.findIndex(x => toId(x.id) === id);
      if (i >= 0) inventarios[i] = { ...inventarios[i], stock, stock_min, stock_max };
      showAlert('Inventario actualizado');
    } else {
      const creado = await createInventario(payload);
      inventarios.unshift({
        id:        toId(creado?.id),
        producto:  productos.find(p => toId(p.id) === toId(producto_id)),
        sucursal:  sucursales.find(s => toId(s.id) === toId(sucursal_id)),
        stock, stock_min, stock_max
      });
      showAlert('Registro de inventario creado');
    }
    resetForm();
    pintarTabla();
    await cargarMovimientos();
  } catch (e) {
    showAlert(e.message || 'No se pudo guardar', 'danger');
  }
}

// ── Click tabla ───────────────────────────────
async function onClickTabla(ev) {
  const btn = ev.target.closest('button[data-action]');
  if (!btn) return;
  const action = btn.getAttribute('data-action');
  const id     = btn.getAttribute('data-id');

  if (action === 'edit') {
    const inv = inventarios.find(x => toId(x.id) === id);
    if (!inv) return;
    document.getElementById('id').value        = inv.id;
    document.getElementById('stock').value     = inv.stock;
    document.getElementById('stock_min').value = inv.stock_min;
    document.getElementById('stock_max').value = inv.stock_max;
    // Mostrar producto y sucursal pero no editable
    const selProd = document.getElementById('producto_id');
    const selSuc  = document.getElementById('sucursal_id');
    selProd.innerHTML = `<option value="${inv.producto?.id}">${inv.producto?.nombre ?? '—'}</option>`;
    selProd.disabled = true;
    selSuc.innerHTML = `<option value="${inv.sucursal?.id}">${inv.sucursal?.nombre ?? '—'}</option>`;
    selSuc.disabled = true;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  if (action === 'delete') {
    if (!confirm(`Eliminar registro de inventario #${id}?`)) return;
    try {
      await deleteInventario(id);
      inventarios = inventarios.filter(x => toId(x.id) !== id);
      pintarTabla();
      showAlert('Registro eliminado');
    } catch (e) {
      showAlert(e.message || 'No se pudo eliminar', 'danger');
    }
  }
}

// ── Busqueda ──────────────────────────────────
function wireSearch() {
  const btn = document.getElementById('buscar-inventario');
  if (!btn) return;
  const form  = btn.closest('form');
  const input = form?.querySelector('input[type="search"]');
  if (!form || !input) return;
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = input.value.trim().toLowerCase();
    if (!q) { inventarios = [...inventariosCopia]; pintarTabla(); return; }
    inventarios = inventariosCopia.filter(i =>
      (i.producto?.nombre ?? '').toLowerCase().includes(q) ||
      (i.sucursal?.nombre ?? '').toLowerCase().includes(q)
    );
    pintarTabla();
  });
  input.addEventListener('input', () => {
    if (!input.value.trim()) { inventarios = [...inventariosCopia]; pintarTabla(); }
  });
}

async function cargarMovimientos() {
  const res = await fetch(`${API}/inventario/movimientos`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await res.json();
  const tbody = document.getElementById('tbody-movimientos');
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="color:#555">Sin movimientos registrados</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(m => `
    <tr>
      <td style="font-size:0.78rem;color:var(--text-dim)">
        ${new Date(m.fecha).toLocaleString('es-HN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
      </td>
      <td>${m.producto?.nombre ?? '—'}</td>
      <td style="font-size:0.82rem;color:var(--text-dim)">${m.sucursal?.nombre ?? '—'}</td>
      <td>
        <span style="
          display:inline-block;padding:0.2rem 0.65rem;border-radius:2px;
          font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
          background:${m.tipo?.signo > 0 ? 'rgba(58,125,90,.15)' : 'rgba(204,63,63,.12)'};
          color:${m.tipo?.signo > 0 ? '#7ecba0' : '#e07070'};
          border:1px solid ${m.tipo?.signo > 0 ? '#3a7d5a' : '#cc3f3f'};
        ">${m.tipo?.nombre ?? '—'}</span>
      </td>
      <td style="font-weight:600;color:${m.tipo?.signo > 0 ? '#7ecba0' : '#e07070'}">
        ${m.tipo?.signo > 0 ? '+' : '-'}${parseFloat(m.cantidad).toFixed(2)}
      </td>
      <td style="font-size:0.82rem;color:var(--text-dim)">${m.usuario?.nombre ?? '—'}</td>
      <td style="font-size:0.78rem;color:#555">${m.nota ?? '—'}</td>
    </tr>
  `).join('');
}

async function init() {
  try {
    await cargarDatos();
    pintarTabla();
    document.getElementById('form-inventario')?.addEventListener('submit', onSubmit);
    document.getElementById('btn-cancelar')?.addEventListener('click', resetForm);
    document.getElementById('tbody-inventario')?.addEventListener('click', onClickTabla);
    wireSearch();
    await cargarMovimientos();
  } catch (e) {
    console.error(e);
    showAlert(e.message || 'Error al cargar', 'danger');
  }
}

init();
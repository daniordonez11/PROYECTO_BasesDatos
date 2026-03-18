// js/Clientes/clientes.js
import { verificarSesion, soloAdmin } from '/js/components/http.global.js';
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente
} from '/js/API/api.clientes.js';

verificarSesion();
soloAdmin();

let clientes = [];
let clientesCopia = [];
const toId = (id) => String(id ?? '');

// ── Alertas ──────────────────────────────────
function showAlert(msg, type = 'success') {
  const box = document.getElementById('alert-container');
  box.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

// ── Formatear fecha para mostrar ──────────────
function formatFecha(fecha) {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-HN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

// ── Formatear fecha para input date ──────────
function toInputDate(fecha) {
  if (!fecha) return '';
  return new Date(fecha).toISOString().split('T')[0];
}

// ── Cargar datos ──────────────────────────────
async function cargarDatos() {
  const data = await getClientes();
  clientes = (Array.isArray(data) ? data : []).map(c => ({
    id:               toId(c.id),
    nombre:           c.nombre ?? '',
    telefono:         c.telefono ?? '',
    email:            c.email ?? '',
    fecha_nacimiento: c.fecha_nacimiento ?? null,
    notas:            c.notas ?? '',
    rtn:              c.rtn ?? '',
    activo:           c.activo ?? true
  }));
  clientesCopia = [...clientes];
}

// ── Pintar tabla ──────────────────────────────
function pintarTabla() {
  const tbody = document.getElementById('tbody-clientes');
  if (!tbody) return;

  if (!clientes.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">Sin clientes registrados</td></tr>`;
    return;
  }

  tbody.innerHTML = clientes.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>
        <div style="font-weight:500; color:var(--white);">${c.nombre}</div>
        ${c.rtn ? `<div style="font-size:0.72rem;color:var(--text-muted);">RTN: ${c.rtn}</div>` : ''}
      </td>
      <td>${c.telefono || '—'}</td>
      <td>${c.email || '—'}</td>
      <td>${formatFecha(c.fecha_nacimiento)}</td>
      <td>
        <span style="
          display:inline-block; padding:0.2rem 0.65rem; border-radius:2px;
          font-size:0.7rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
          background:${c.activo ? 'rgba(58,125,90,.15)' : 'rgba(204,63,63,.12)'};
          color:${c.activo ? '#7ecba0' : '#e07070'};
          border:1px solid ${c.activo ? '#3a7d5a' : '#cc3f3f'};
        ">${c.activo ? 'Activo' : 'Inactivo'}</span>
      </td>
      <td>
        <div class="acciones-celda">
          <button class="btn-accion btn-editar" data-action="edit" data-id="${c.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar
          </button>
          <button class="btn-accion btn-eliminar" data-action="delete" data-id="${c.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Toggle RTN ────────────────────────────────
function wireRtnToggle() {
  const toggle  = document.getElementById('rtn-toggle');
  const rtnWrap = document.getElementById('rtn-wrap');
  const rtnInput = document.getElementById('rtn');

  toggle?.addEventListener('change', () => {
    const habilitado = toggle.checked;
    rtnWrap.style.opacity  = habilitado ? '1' : '0.4';
    rtnInput.disabled      = !habilitado;
    if (!habilitado) rtnInput.value = '';
  });
}

// ── Reset form ────────────────────────────────
function resetForm() {
  document.getElementById('id').value               = '';
  document.getElementById('nombre').value           = '';
  document.getElementById('telefono').value         = '';
  document.getElementById('email').value            = '';
  document.getElementById('fecha_nacimiento').value = '';
  document.getElementById('notas').value            = '';
  document.getElementById('rtn').value              = '';
  document.getElementById('activo').value           = '1';
  document.getElementById('nota-count').textContent = '0';
  // Deshabilitar RTN por defecto
  const toggle = document.getElementById('rtn-toggle');
  const rtnWrap = document.getElementById('rtn-wrap');
  const rtnInput = document.getElementById('rtn');
  if (toggle) { toggle.checked = false; }
  if (rtnWrap) { rtnWrap.style.opacity = '0.4'; }
  if (rtnInput) { rtnInput.disabled = true; }
}

// ── Submit ────────────────────────────────────
async function onSubmit(ev) {
  ev.preventDefault();

  const id               = document.getElementById('id').value.trim();
  const nombre           = document.getElementById('nombre').value.trim();
  const telefono         = document.getElementById('telefono').value.trim();
  const email            = document.getElementById('email').value.trim();
  const fecha_nacimiento = document.getElementById('fecha_nacimiento').value || null;
  const notas            = document.getElementById('notas').value.trim();
  const rtn              = document.getElementById('rtn').disabled ? '' : document.getElementById('rtn').value.trim();
  const activo           = document.getElementById('activo').value === '1';

  if (!nombre) { showAlert('El nombre es requerido', 'warning'); return; }

  const payload = { nombre, telefono, email, fecha_nacimiento, notas, rtn, activo };

  try {
    if (id) {
      await updateCliente(id, payload);
      const i = clientes.findIndex(c => c.id === id);
      if (i >= 0) clientes[i] = { ...clientes[i], ...payload };
      showAlert('Cliente actualizado');
    } else {
      const creado = await createCliente(payload);
      clientes.unshift({
        id: toId(creado?.id),
        ...payload
      });
      showAlert('Cliente creado');
    }
    resetForm();
    pintarTabla();
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
    const c = clientes.find(x => x.id === id);
    if (!c) return;

    document.getElementById('id').value               = c.id;
    document.getElementById('nombre').value           = c.nombre;
    document.getElementById('telefono').value         = c.telefono;
    document.getElementById('email').value            = c.email;
    document.getElementById('fecha_nacimiento').value = toInputDate(c.fecha_nacimiento);
    document.getElementById('notas').value            = c.notas;
    document.getElementById('activo').value           = c.activo ? '1' : '0';
    document.getElementById('nota-count').textContent = c.notas.length;

    // RTN
    const toggle   = document.getElementById('rtn-toggle');
    const rtnWrap  = document.getElementById('rtn-wrap');
    const rtnInput = document.getElementById('rtn');
    if (c.rtn) {
      toggle.checked        = true;
      rtnWrap.style.opacity = '1';
      rtnInput.disabled     = false;
      rtnInput.value        = c.rtn;
    } else {
      toggle.checked        = false;
      rtnWrap.style.opacity = '0.4';
      rtnInput.disabled     = true;
      rtnInput.value        = '';
    }

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  if (action === 'delete') {
    if (!confirm(`¿Eliminar cliente "${id}"?`)) return;
    try {
      await deleteCliente(id);
      clientes = clientes.filter(c => c.id !== id);
      pintarTabla();
      showAlert('Cliente eliminado');
    } catch (e) {
      showAlert(e.message || 'No se pudo eliminar', 'danger');
    }
  }
}

// ── Búsqueda ──────────────────────────────────
function wireSearch() {
  const btn   = document.getElementById('buscar-cliente');
  if (!btn) return;
  const form  = btn.closest('form');
  const input = form?.querySelector('input[type="search"]');
  if (!form || !input) return;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = input.value.trim().toLowerCase();
    if (!q) { clientes = [...clientesCopia]; pintarTabla(); return; }
    clientes = clientesCopia.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      (c.telefono ?? '').includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.rtn ?? '').includes(q)
    );
    pintarTabla();
  });

  input.addEventListener('input', () => {
    if (!input.value.trim()) { clientes = [...clientesCopia]; pintarTabla(); }
  });
}

// ── Init ──────────────────────────────────────
async function init() {
  try {
    await cargarDatos();
    pintarTabla();
    wireRtnToggle();
    resetForm(); // estado inicial correcto del RTN
    document.getElementById('form-cliente')?.addEventListener('submit', onSubmit);
    document.getElementById('btn-cancelar')?.addEventListener('click', resetForm);
    document.getElementById('tbody-clientes')?.addEventListener('click', onClickTabla);
    document.getElementById('notas')?.addEventListener('input', function () {
      document.getElementById('nota-count').textContent = this.value.length;
    });
    wireSearch();
  } catch (e) {
    console.error(e);
    showAlert(e.message || 'No se pudieron cargar los clientes', 'danger');
  }
}

init();
// js/Barberos/barberos.js
import { verificarSesion, soloAdmin } from '/js/components/http.global.js';
import {
  getBarberos,
  getUsuariosDisponibles,
  createBarbero,
  updateBarbero,
  deleteBarbero
} from '/js/API/api.barberos.js';

verificarSesion();
soloAdmin();

let barberos = [];
let barberosCopia = [];
let usuariosDisponibles = [];

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

// ── Cargar usuarios disponibles en el select ──
async function cargarUsuariosSelect(selectedId = null) {
  try {
    usuariosDisponibles = await getUsuariosDisponibles() || [];
    const select = document.getElementById('usuario_id');
    if (!select) return;

    select.innerHTML = '<option value="">-- Seleccionar usuario --</option>';
    usuariosDisponibles.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = `${u.nombre} (${u.username})`;
      if (selectedId && toId(u.id) === toId(selectedId)) opt.selected = true;
      select.appendChild(opt);
    });
  } catch (e) {
    console.error('Error cargando usuarios:', e);
  }
}

// ── Cargar barberos ───────────────────────────
async function cargarDatos() {
  const data = await getBarberos();
  barberos = (Array.isArray(data) ? data : []).map(b => ({
    id:            toId(b.id),
    nombre_publico: String(b.nombre_publico ?? ''),
    estado:        b.estado ?? true,
    usuario_id:    toId(b.usuario_id),
    usuario:       b.usuario ?? null
  }));
  barberosCopia = [...barberos];
}

// ── Pintar tabla ──────────────────────────────
function pintarTabla() {
  const tbody = document.getElementById('tbody-barberos');
  if (!tbody) return;

  if (!barberos.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">Sin datos</td></tr>`;
    return;
  }

  tbody.innerHTML = barberos.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.usuario?.nombre ?? '—'}</td>
      <td>${b.nombre_publico || '—'}</td>
      <td>
        <span style="
          display:inline-block;
          padding: 0.2rem 0.65rem;
          border-radius: 2px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: ${b.estado ? 'rgba(58,125,90,.15)' : 'rgba(204,63,63,.12)'};
          color: ${b.estado ? '#7ecba0' : '#e07070'};
          border: 1px solid ${b.estado ? '#3a7d5a' : '#cc3f3f'};
        ">${b.estado ? 'Activo' : 'Inactivo'}</span>
      </td>
      <td>
        <div class="acciones-celda">
          <button class="btn-accion btn-editar" data-action="edit" data-id="${b.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar
          </button>
          <button class="btn-accion btn-eliminar" data-action="delete" data-id="${b.id}">
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

// ── Reset form ────────────────────────────────
function resetForm() {
  document.getElementById('id').value = '';
  document.getElementById('usuario_id').value = '';
  document.getElementById('nombre_publico').value = '';
  document.getElementById('estado').value = '1';
  // Rehabilitar el select de usuario
  document.getElementById('usuario_id').disabled = false;
  cargarUsuariosSelect();
}

// ── Submit ────────────────────────────────────
async function onSubmit(ev) {
  ev.preventDefault();
  const id           = document.getElementById('id').value.trim();
  const usuario_id   = document.getElementById('usuario_id').value;
  const nombre_publico = document.getElementById('nombre_publico').value.trim();
  const estado       = document.getElementById('estado').value === '1';

  if (!id && !usuario_id) {
    showAlert('Selecciona un usuario', 'warning');
    return;
  }

  try {
    if (id) {
      await updateBarbero(id, { nombre_publico, estado });
      const i = barberos.findIndex(b => b.id === id);
      if (i >= 0) barberos[i] = { ...barberos[i], nombre_publico, estado };
      showAlert('Barbero actualizado');
    } else {
      const creado = await createBarbero({ usuario_id, nombre_publico, estado });
      barberos.unshift({
        id:            toId(creado?.id),
        nombre_publico: creado?.nombre_publico ?? nombre_publico,
        estado:        creado?.estado ?? estado,
        usuario_id:    toId(usuario_id),
        usuario:       usuariosDisponibles.find(u => toId(u.id) === toId(usuario_id)) ?? null
      });
      showAlert('Barbero creado');
    }
    resetForm();
    pintarTabla();
  } catch (e) {
    console.error(e);
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
    const b = barberos.find(x => x.id === id);
    if (!b) return;
    document.getElementById('id').value             = b.id;
    document.getElementById('nombre_publico').value = b.nombre_publico;
    document.getElementById('estado').value         = b.estado ? '1' : '0';
    // Al editar, el usuario no cambia — deshabilitar select
    const select = document.getElementById('usuario_id');
    select.innerHTML = `<option value="${b.usuario_id}">${b.usuario?.nombre ?? 'Usuario #' + b.usuario_id}</option>`;
    select.disabled = true;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  if (action === 'delete') {
    if (!confirm(`¿Eliminar barbero #${id}?`)) return;
    try {
      await deleteBarbero(id);
      barberos = barberos.filter(b => b.id !== id);
      pintarTabla();
      showAlert('Barbero eliminado');
    } catch (e) {
      showAlert(e.message || 'No se pudo eliminar', 'danger');
    }
  }
}

// ── Búsqueda ──────────────────────────────────
function wireSearch() {
  const btnBuscar = document.getElementById('buscar-barbero');
  if (!btnBuscar) return;
  const form  = btnBuscar.closest('form');
  const input = form?.querySelector('input[type="search"]');
  if (!form || !input) return;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = input.value.trim().toLowerCase();
    if (!q) { barberos = [...barberosCopia]; pintarTabla(); return; }
    barberos = barberosCopia.filter(b =>
      b.nombre_publico.toLowerCase().includes(q) ||
      (b.usuario?.nombre ?? '').toLowerCase().includes(q)
    );
    pintarTabla();
  });

  input.addEventListener('input', () => {
    if (!input.value.trim()) { barberos = [...barberosCopia]; pintarTabla(); }
  });
}

// ── Init ──────────────────────────────────────
async function init() {
  try {
    await Promise.all([cargarDatos(), cargarUsuariosSelect()]);
    pintarTabla();
    document.getElementById('form-barbero')?.addEventListener('submit', onSubmit);
    document.getElementById('btn-cancelar')?.addEventListener('click', resetForm);
    document.getElementById('tbody-barberos')?.addEventListener('click', onClickTabla);
    wireSearch();
  } catch (e) {
    console.error(e);
    showAlert(e.message || 'No se pudieron cargar los barberos', 'danger');
  }
}

init();

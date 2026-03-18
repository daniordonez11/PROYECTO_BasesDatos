// js/Servicios/servicios.js
import { verificarSesion, soloAdmin } from '/js/components/http.global.js';
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio
} from '/js/API/api.servicios.js';
import { soloAdmin } from '../components/http.global';

verificarSesion();
soloAdmin();

let servicios = [];
let serviciosCopia = [];

const toId = (id) => String(id ?? '');

// Duraciones predefinidas en minutos
const DURACIONES = [
  { value: 15,  label: '15 min' },
  { value: 20,  label: '20 min' },
  { value: 30,  label: '30 min' },
  { value: 45,  label: '45 min' },
  { value: 60,  label: '1 hora' },
  { value: 75,  label: '1h 15min' },
  { value: 90,  label: '1h 30min' },
  { value: 120, label: '2 horas' },
];

// Servicios predefinidos comunes
const NOMBRES_SUGERIDOS = [
  'Corte de cabello',
  'Afeitado clásico',
  'Corte y barba',
  'Arreglo de barba',
  'Tratamiento capilar',
  'Tinte',
  'Diseño de cejas',
  'Servicio completo',
];

// ── Alertas ──────────────────────────────────
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
  const data = await getServicios();
  servicios = (Array.isArray(data) ? data : []).map(s => ({
    id:            toId(s.id),
    nombre:        s.nombre ?? '',
    descripcion:   s.descripcion ?? '',
    duracion_aprox: s.duracion_aprox ?? 30,
    precio_base:   s.precio_base ?? 0,
    estado:        s.estado ?? true
  }));
  serviciosCopia = [...servicios];
}

// ── Pintar tabla ──────────────────────────────
function pintarTabla() {
  const tbody = document.getElementById('tbody-servicios');
  if (!tbody) return;

  if (!servicios.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">Sin servicios registrados</td></tr>`;
    return;
  }

  tbody.innerHTML = servicios.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>
        <div style="font-weight:500; color: var(--white);">${s.nombre}</div>
        <div style="font-size:0.75rem; color: var(--text-muted); margin-top:2px;">${s.descripcion || '—'}</div>
      </td>
      <td>
        <span style="
          display:inline-flex; align-items:center; gap:0.3rem;
          font-size:0.78rem; color: var(--text-dim);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          ${DURACIONES.find(d => d.value === s.duracion_aprox)?.label ?? s.duracion_aprox + ' min'}
        </span>
      </td>
      <td style="font-weight:500;">L. ${parseFloat(s.precio_base).toFixed(2)}</td>
      <td>
        <span style="
          display:inline-block; padding:0.2rem 0.65rem; border-radius:2px;
          font-size:0.7rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
          background:${s.estado ? 'rgba(58,125,90,.15)' : 'rgba(204,63,63,.12)'};
          color:${s.estado ? '#7ecba0' : '#e07070'};
          border:1px solid ${s.estado ? '#3a7d5a' : '#cc3f3f'};
        ">${s.estado ? 'Activo' : 'Inactivo'}</span>
      </td>
      <td>
        <div class="acciones-celda">
          <button class="btn-accion btn-editar" data-action="edit" data-id="${s.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar
          </button>
          <button class="btn-accion btn-eliminar" data-action="delete" data-id="${s.id}">
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
  document.getElementById('id').value            = '';
  document.getElementById('nombre').value        = '';
  document.getElementById('descripcion').value   = '';
  document.getElementById('duracion_aprox').value= '30';
  document.getElementById('precio_base').value   = '';
  document.getElementById('estado').value        = '1';
  // Limpiar chips de nombres sugeridos
  document.querySelectorAll('.nombre-chip').forEach(c => c.classList.remove('active'));
}

// ── Chips de nombres sugeridos ────────────────
function wireChips() {
  const input = document.getElementById('nombre');
  document.querySelectorAll('.nombre-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-value');
      input.value = val;
      document.querySelectorAll('.nombre-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}

// ── Submit ────────────────────────────────────
async function onSubmit(ev) {
  ev.preventDefault();

  const id           = document.getElementById('id').value.trim();
  const nombre       = document.getElementById('nombre').value.trim();
  const descripcion  = document.getElementById('descripcion').value.trim();
  const duracion_aprox = parseInt(document.getElementById('duracion_aprox').value);
  const precio_base  = parseFloat(document.getElementById('precio_base').value);
  const estado       = document.getElementById('estado').value === '1';

  if (!nombre) { showAlert('El nombre es requerido', 'warning'); return; }
  if (isNaN(precio_base) || precio_base < 0) { showAlert('Precio inválido', 'warning'); return; }

  try {
    if (id) {
      await updateServicio(id, { nombre, descripcion, duracion_aprox, precio_base, estado });
      const i = servicios.findIndex(s => s.id === id);
      if (i >= 0) servicios[i] = { ...servicios[i], nombre, descripcion, duracion_aprox, precio_base, estado };
      showAlert('Servicio actualizado');
    } else {
      const creado = await createServicio({ nombre, descripcion, duracion_aprox, precio_base, estado });
      servicios.unshift({
        id:           toId(creado?.id),
        nombre:       creado?.nombre ?? nombre,
        descripcion:  creado?.descripcion ?? descripcion,
        duracion_aprox: creado?.duracion_aprox ?? duracion_aprox,
        precio_base:  creado?.precio_base ?? precio_base,
        estado:       creado?.estado ?? estado
      });
      showAlert('Servicio creado');
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
    const s = servicios.find(x => x.id === id);
    if (!s) return;
    document.getElementById('id').value             = s.id;
    document.getElementById('nombre').value         = s.nombre;
    document.getElementById('descripcion').value    = s.descripcion;
    document.getElementById('duracion_aprox').value = s.duracion_aprox;
    document.getElementById('precio_base').value    = s.precio_base;
    document.getElementById('estado').value         = s.estado ? '1' : '0';
    // Marcar chip si coincide
    document.querySelectorAll('.nombre-chip').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-value') === s.nombre);
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  if (action === 'delete') {
    if (!confirm(`¿Eliminar servicio "${id}"?`)) return;
    try {
      await deleteServicio(id);
      servicios = servicios.filter(s => s.id !== id);
      pintarTabla();
      showAlert('Servicio eliminado');
    } catch (e) {
      showAlert(e.message || 'No se pudo eliminar', 'danger');
    }
  }
}

// ── Búsqueda ──────────────────────────────────
function wireSearch() {
  const btn   = document.getElementById('buscar-servicio');
  if (!btn) return;
  const form  = btn.closest('form');
  const input = form?.querySelector('input[type="search"]');
  if (!form || !input) return;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = input.value.trim().toLowerCase();
    if (!q) { servicios = [...serviciosCopia]; pintarTabla(); return; }
    servicios = serviciosCopia.filter(s =>
      s.nombre.toLowerCase().includes(q) ||
      (s.descripcion ?? '').toLowerCase().includes(q)
    );
    pintarTabla();
  });

  input.addEventListener('input', () => {
    if (!input.value.trim()) { servicios = [...serviciosCopia]; pintarTabla(); }
  });
}

// ── Init ──────────────────────────────────────
async function init() {
  try {
    await cargarDatos();
    pintarTabla();
    wireChips();
    document.getElementById('form-servicio')?.addEventListener('submit', onSubmit);
    document.getElementById('btn-cancelar')?.addEventListener('click', resetForm);
    document.getElementById('tbody-servicios')?.addEventListener('click', onClickTabla);
    wireSearch();
  } catch (e) {
    console.error(e);
    showAlert(e.message || 'No se pudieron cargar los servicios', 'danger');
  }
}

init();
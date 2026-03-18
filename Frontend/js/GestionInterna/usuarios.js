import { verificarSesion, soloAdmin } from '/js/components/http.global.js';
import {
  getUsuarios,
  getRoles,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from '/js/API/api.usuarios.js';

verificarSesion();
soloAdmin();

let usuarios = [];
let usuariosCopia = [];
let roles = [];

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

// ── Cargar roles en select ────────────────────
async function cargarRolesSelect(selectedId = null) {
  try {
    roles = await getRoles() || [];
    const select = document.getElementById('rol_id');
    if (!select) return;

    select.innerHTML = '<option value="">-- Seleccionar rol --</option>';
    roles.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = r.nombre;
      if (selectedId && toId(r.id) === toId(selectedId)) opt.selected = true;
      select.appendChild(opt);
    });
  } catch (e) {
    console.error('Error cargando roles:', e);
  }
}

// ── Cargar usuarios ───────────────────────────
async function cargarDatos() {
  const data = await getUsuarios();
  usuarios = (Array.isArray(data) ? data : []).map(u => ({
    id:        toId(u.id),
    username:  u.username ?? '',
    nombre:    u.nombre ?? '',
    email:     u.email ?? '',
    rol_id:    toId(u.rol_id),
    rol:       u.rol ?? null,
    is_activo: u.is_activo ?? true
  }));
  usuariosCopia = [...usuarios];
}

// ── Pintar tabla ──────────────────────────────
function pintarTabla() {
  const tbody = document.getElementById('tbody-usuarios');
  if (!tbody) return;

  if (!usuarios.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">Sin datos</td></tr>`;
    return;
  }

  tbody.innerHTML = usuarios.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td>${u.nombre}</td>
      <td>${u.email || '—'}</td>
      <td>
        <span style="
          display:inline-block;
          padding: 0.2rem 0.65rem;
          border-radius: 2px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(74,144,217,.12);
          color: #7ab3e8;
          border: 1px solid rgba(74,144,217,.35);
        ">${u.rol?.nombre ?? '—'}</span>
      </td>
      <td>
        <span style="
          display:inline-block;
          padding: 0.2rem 0.65rem;
          border-radius: 2px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: ${u.is_activo ? 'rgba(58,125,90,.15)' : 'rgba(204,63,63,.12)'};
          color: ${u.is_activo ? '#7ecba0' : '#e07070'};
          border: 1px solid ${u.is_activo ? '#3a7d5a' : '#cc3f3f'};
        ">${u.is_activo ? 'Activo' : 'Inactivo'}</span>
      </td>
      <td>
        <div class="acciones-celda">
          <button class="btn-accion btn-editar" data-action="edit" data-id="${u.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar
          </button>
          <button class="btn-accion btn-eliminar" data-action="delete" data-id="${u.id}">
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
  document.getElementById('id').value        = '';
  document.getElementById('username').value  = '';
  document.getElementById('nombre').value    = '';
  document.getElementById('email').value     = '';
  document.getElementById('password').value  = '';
  document.getElementById('is_activo').value = '1';
  document.getElementById('username').disabled = false;
  document.getElementById('password').closest('.col-md-3').style.display = '';
  cargarRolesSelect();
}

// ── Submit ────────────────────────────────────
async function onSubmit(ev) {
  ev.preventDefault();

  const id       = document.getElementById('id').value.trim();
  const username = document.getElementById('username').value.trim();
  const nombre   = document.getElementById('nombre').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const rol_id   = document.getElementById('rol_id').value;
  const is_activo = document.getElementById('is_activo').value === '1';

  if (!nombre || !username || !rol_id) {
    showAlert('Username, nombre y rol son requeridos', 'warning');
    return;
  }

  if (!id && !password) {
    showAlert('La contraseña es requerida al crear un usuario', 'warning');
    return;
  }

  try {
    if (id) {
      // EDITAR — password solo si se llenó
      const payload = { nombre, email, rol_id, is_activo };
      if (password) payload.password = password;
      await updateUsuario(id, payload);

      const i = usuarios.findIndex(u => u.id === id);
      if (i >= 0) {
        usuarios[i] = {
          ...usuarios[i], nombre, email, rol_id,
          is_activo,
          rol: roles.find(r => toId(r.id) === toId(rol_id)) ?? usuarios[i].rol
        };
      }
      showAlert('Usuario actualizado');
    } else {
      // CREAR
      const creado = await createUsuario({ username, nombre, email, password, rol_id, is_activo });
      usuarios.unshift({
        id:        toId(creado?.id),
        username,
        nombre:    creado?.nombre ?? nombre,
        email:     creado?.email ?? email,
        rol_id,
        rol:       roles.find(r => toId(r.id) === toId(rol_id)) ?? null,
        is_activo
      });
      showAlert('Usuario creado');
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
    const u = usuarios.find(x => x.id === id);
    if (!u) return;

    document.getElementById('id').value        = u.id;
    document.getElementById('nombre').value    = u.nombre;
    document.getElementById('email').value     = u.email;
    document.getElementById('is_activo').value = u.is_activo ? '1' : '0';

    // Username no se puede editar
    document.getElementById('username').value    = u.username;
    document.getElementById('username').disabled = true;

    // Ocultar campo password al editar (opcional dejarlo vacío)
    const passCol = document.getElementById('password').closest('.col-md-3');
    passCol.style.display = '';

    // Cargar roles con el actual seleccionado
    await cargarRolesSelect(u.rol_id);

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  if (action === 'delete') {
    if (!confirm(`¿Eliminar usuario "${id}"?`)) return;
    try {
      await deleteUsuario(id);
      usuarios = usuarios.filter(u => u.id !== id);
      pintarTabla();
      showAlert('Usuario eliminado');
    } catch (e) {
      showAlert(e.message || 'No se pudo eliminar', 'danger');
    }
  }
}

// ── Búsqueda ──────────────────────────────────
function wireSearch() {
  const btn   = document.getElementById('buscar-usuario');
  if (!btn) return;
  const form  = btn.closest('form');
  const input = form?.querySelector('input[type="search"]');
  if (!form || !input) return;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = input.value.trim().toLowerCase();
    if (!q) { usuarios = [...usuariosCopia]; pintarTabla(); return; }
    usuarios = usuariosCopia.filter(u =>
      u.username.toLowerCase().includes(q) ||
      u.nombre.toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q)
    );
    pintarTabla();
  });

  input.addEventListener('input', () => {
    if (!input.value.trim()) { usuarios = [...usuariosCopia]; pintarTabla(); }
  });
}

// ── Init ──────────────────────────────────────
async function init() {
  try {
    await Promise.all([cargarDatos(), cargarRolesSelect()]);
    pintarTabla();
    document.getElementById('form-usuario')?.addEventListener('submit', onSubmit);
    document.getElementById('btn-cancelar')?.addEventListener('click', resetForm);
    document.getElementById('tbody-usuarios')?.addEventListener('click', onClickTabla);
    wireSearch();
  } catch (e) {
    console.error(e);
    showAlert(e.message || 'No se pudieron cargar los usuarios', 'danger');
  }
}

init();
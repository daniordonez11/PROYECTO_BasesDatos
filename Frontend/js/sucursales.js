// Frontend/js/sucursales.js
import {
  getSucursales,
  createSucursal,
  updateSucursal,
  deleteSucursal
} from './API/api.sucursales.js';

let sucursales = []; 
let sucursalesCopia = []; 

// Manejo seguro del id (por si es BIGINT, lo tratamos como string)
const toId = (id) => (typeof id === 'number' ? String(id) : String(id ?? ''));

function showAlert(msg, type = 'success') {
  const box = document.getElementById('alert-container');
  box.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}

// 1) Cargar datos desde la API y normalizar campos
async function cargarDatos() {
  const data = await getSucursales(); // <- array directo
  sucursales = (Array.isArray(data) ? data : []).map(item => ({
    id: toId(item.id ?? item.ID),
    nombre: String(item.nombre ?? item.name ?? ''),
    direccion: String(item.direccion ?? item.address ?? ''),
    telefono: String(item.telefono ?? item.phone ?? ''),
  }));

  sucursalesCopia = [...sucursales]; 
}

// 2) Pintar tabla con id, nombre, direccion, telefono
function pintarTabla() {
  const tbody = document.getElementById('tbody-sucursales');
  if (!tbody) return;

  if (!sucursales.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">Sin datos</td></tr>`;
    return;
  }

  tbody.innerHTML = sucursales.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.nombre}</td>
      <td>${s.direccion}</td>
      <td>${s.telefono}</td>
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

// 3) Helpers del form
function resetForm() {
  document.getElementById('id').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('direccion').value = '';
  document.getElementById('telefono').value = '';
}

// 4) Guardar (crear/editar)
async function onSubmit(ev) {
  ev.preventDefault();
  const id = document.getElementById('id').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();

  if (!nombre || !direccion || !telefono) {
    showAlert('Completa nombre, dirección y teléfono', 'warning');
    return;
  }

  try {
    if (id) {
      // EDITAR
      await updateSucursal(id, { nombre, direccion, telefono });
      // Actualiza en memoria
      const i = sucursales.findIndex(s => s.id === id);
      if (i >= 0) sucursales[i] = { ...sucursales[i], nombre, direccion, telefono };
      showAlert('Sucursal actualizada');
    } else {
      // CREAR
      const creada = await createSucursal({ nombre, direccion, telefono });
      const nueva = {
        id: toId(creada?.id ?? creada?.ID ?? crypto.randomUUID()),
        nombre: String(creada?.nombre ?? nombre),
        direccion: String(creada?.direccion ?? direccion),
        telefono: String(creada?.telefono ?? telefono),
      };
      sucursales.unshift(nueva);
      showAlert('Sucursal creada');
    }

    resetForm();
    pintarTabla();
  } catch (e) {
    console.error(e);
    showAlert(e.message || 'No se pudo guardar', 'danger');
  }
}

// 5) Click en la tabla (editar / eliminar)
async function onClickTabla(ev) {
  const btn = ev.target.closest('button[data-action]');
  if (!btn) return;

  const action = btn.getAttribute('data-action');
  const id = btn.getAttribute('data-id');

  if (action === 'edit') {
    const s = sucursales.find(x => x.id === id);
    if (!s) return;
    document.getElementById('id').value = s.id;
    document.getElementById('nombre').value = s.nombre;
    document.getElementById('direccion').value = s.direccion;
    document.getElementById('telefono').value = s.telefono;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  if (action === 'delete') {
    if (!confirm(`¿Eliminar sucursal #${id}?`)) return;
    try {
      await deleteSucursal(id);
      sucursales = sucursales.filter(s => s.id !== id);
      pintarTabla();
      showAlert('Sucursal eliminada');
    } catch (e) {
      console.error(e);
      showAlert(e.message || 'No se pudo eliminar', 'danger');
    }
  }
}

function wireEvents() {
  document.getElementById('form-sucursal')?.addEventListener('submit', onSubmit);
  document.getElementById('btn-cancelar')?.addEventListener('click', resetForm);
  document.getElementById('tbody-sucursales')?.addEventListener('click', onClickTabla);
}



function wireSearch() {
  // 1) Encuentra el botón y su <form> contenedor
  const btnBuscar = document.getElementById('buscar-sucursal');
  if (!btnBuscar) return;

  const form = btnBuscar.closest('form');
  if (!form) return;

  // 2) Encuentra el input de búsqueda dentro del form
  const input = form.querySelector('input[type="search"]');
  if (!input) return;

  // 3) Al enviar el form, prevenimos el submit y filtramos
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = (input.value || '').trim();

    // Si está vacío, restauramos la lista completa
    if (!q) {
      sucursales = [...sucursalesCopia]; // <- asegúrate de tener esta copia
      pintarTabla();
      return;
    }

    // Si es número => buscar por ID exacto
    const esNumero = /^\d+$/.test(q);
    if (esNumero) {
      const idBuscado = q; // como string
      const match = sucursalesCopia.find(s => s.id === idBuscado);
      sucursales = match ? [match] : [];
      pintarTabla();
      return;
    }

    // Si es texto => filtrar por nombre (contiene, sin mayúsculas)
    const qNorm = q.toLowerCase();
    sucursales = sucursalesCopia.filter(s =>
      (s.nombre || '').toLowerCase().includes(qNorm)
    );
    pintarTabla();
  });

  // (Opcional) Restaurar automáticamente al borrar el texto
  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q) {
      sucursales = [...sucursalesCopia];
      pintarTabla();
    }
  });

  // (Opcional) Limpiar con ESC
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      sucursales = [...sucursalesCopia];
      pintarTabla();
    }
  });
}




async function init() {
  try {
    await cargarDatos();   // GET
    pintarTabla();         // Render
    wireEvents();          // Listeners
    wireSearch();          // Busqueda
  } catch (e) {
    console.error(e);
    showAlert(e.message || 'No se pudieron cargar las sucursales', 'danger');
  }
}

init();



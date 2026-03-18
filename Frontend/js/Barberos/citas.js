// js/Citas/citas.js
import { verificarSesion } from '/js/components/http.global.js';
import {
  getCitas,
  getFormData,
  buscarClientes,
  createCita,
  updateEstadoCita,
  deleteCita
} from '/js/API/api.citas.js';

verificarSesion();

let citas        = [];
let citasCopia   = [];
let formData     = { barberos: [], sucursales: [], servicios: [], metodos_pago: [], impuestos: [] };
let serviciosSeleccionados = [];
let clienteSeleccionado    = null;

const toId = (id) => String(id ?? '');

const ESTADOS = {
  PENDIENTE:   { label: 'Pendiente',     color: '#e0c070', bg: 'rgba(200,150,30,.12)', border: '#c89620' },
  CONFIRMADA:  { label: 'Confirmada',    color: '#7ab3e8', bg: 'rgba(74,144,217,.12)', border: '#4a90d9' },
  EN_SERVICIO: { label: 'En servicio',   color: '#b07ae8', bg: 'rgba(150,80,217,.12)', border: '#9650d9' },
  COMPLETADA:  { label: 'Completada',    color: '#7ecba0', bg: 'rgba(58,125,90,.15)',  border: '#3a7d5a' },
  CANCELADA:   { label: 'Cancelada',     color: '#e07070', bg: 'rgba(204,63,63,.12)',  border: '#cc3f3f' },
  NO_SHOW:     { label: 'No se presentó',color: '#888',    bg: 'rgba(100,100,100,.12)',border: '#555'    },
};

// ── Alertas ───────────────────────────────────
function showAlert(msg, type = 'success') {
  const box = document.getElementById('alert-container');
  box.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

function badgeEstado(estado) {
  const e = ESTADOS[estado] ?? ESTADOS.PENDIENTE;
  return `<span style="display:inline-block;padding:0.2rem 0.65rem;border-radius:2px;
    font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
    background:${e.bg};color:${e.color};border:1px solid ${e.border};">${e.label}</span>`;
}

function formatFecha(fecha) {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleString('es-HN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ── Cargar datos del formulario ───────────────
async function cargarFormData() {
  formData = await getFormData() || formData;

  // Barberos
  const selBarbero = document.getElementById('barbero_id');
  selBarbero.innerHTML = '<option value="">-- Seleccionar barbero --</option>';
  formData.barberos.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = b.nombre_publico || b.usuario?.nombre || `Barbero #${b.id}`;
    selBarbero.appendChild(opt);
  });

  // Sucursales
  const selSucursal = document.getElementById('sucursal_id');
  selSucursal.innerHTML = '<option value="">-- Seleccionar sucursal --</option>';
  formData.sucursales.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.nombre;
    selSucursal.appendChild(opt);
  });

  // Metodos de pago
  const selPago = document.getElementById('metodo_pago_id');
  selPago.innerHTML = '<option value="">-- Sin pago aun --</option>';
  formData.metodos_pago.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.nombre;
    selPago.appendChild(opt);
  });

  // Impuestos
  llenarSelectImpuesto();

  // Servicios
  pintarServiciosDisponibles();
}

// ── Llenar select de impuesto ─────────────────
function llenarSelectImpuesto() {
  const sel = document.getElementById('impuesto_id');
  if (!sel) return;
  sel.innerHTML = '<option value="" data-tasa="0">Sin impuesto</option>';
  (formData.impuestos ?? []).forEach(imp => {
    const opt = document.createElement('option');
    opt.value = imp.id;
    opt.textContent = `${imp.nombre} (${(parseFloat(imp.tasa) * 100).toFixed(0)}%)`;
    opt.setAttribute('data-tasa', imp.tasa);
    sel.appendChild(opt);
  });
}

// ── Chips servicios ───────────────────────────
function pintarServiciosDisponibles() {
  const wrap = document.getElementById('servicios-disponibles');
  if (!wrap) return;
  wrap.innerHTML = formData.servicios.map(s => `
    <button type="button" class="servicio-chip" data-id="${s.id}"
      data-nombre="${s.nombre}" data-precio="${s.precio_base}">
      <span class="chip-nombre">${s.nombre}</span>
      <span class="chip-precio">L. ${parseFloat(s.precio_base).toFixed(2)}</span>
    </button>
  `).join('');
  wrap.querySelectorAll('.servicio-chip').forEach(chip => {
    chip.addEventListener('click', () => agregarServicio(chip));
  });
}

function agregarServicio(chip) {
  const id     = toId(chip.getAttribute('data-id'));
  const nombre = chip.getAttribute('data-nombre');
  const precio = parseFloat(chip.getAttribute('data-precio'));
  if (serviciosSeleccionados.find(s => s.servicio_id === id)) {
    showAlert('Este servicio ya fue agregado', 'warning'); return;
  }
  serviciosSeleccionados.push({ servicio_id: id, nombre, precio_aplicado: precio });
  chip.classList.add('active');
  pintarServiciosSeleccionados();
  recalcularTotales();
}

function quitarServicio(id) {
  serviciosSeleccionados = serviciosSeleccionados.filter(s => s.servicio_id !== id);
  const chip = document.querySelector(`.servicio-chip[data-id="${id}"]`);
  if (chip) chip.classList.remove('active');
  pintarServiciosSeleccionados();
  recalcularTotales();
}

function pintarServiciosSeleccionados() {
  const wrap = document.getElementById('servicios-seleccionados');
  if (!wrap) return;
  if (!serviciosSeleccionados.length) {
    wrap.innerHTML = `<span style="font-size:0.75rem;color:#555;">Ningun servicio seleccionado</span>`;
    return;
  }
  wrap.innerHTML = serviciosSeleccionados.map(s => `
    <div class="servicio-tag">
      <span>${s.nombre}</span>
      <span style="color:var(--text-dim);">L. ${parseFloat(s.precio_aplicado).toFixed(2)}</span>
      <button type="button" class="servicio-tag-remove" data-id="${s.servicio_id}">x</button>
    </div>
  `).join('');
  wrap.querySelectorAll('.servicio-tag-remove').forEach(btn => {
    btn.addEventListener('click', () => quitarServicio(btn.getAttribute('data-id')));
  });
}

// ── Recalcular totales ────────────────────────
function recalcularTotales() {
  const subtotal  = serviciosSeleccionados.reduce((acc, s) => acc + parseFloat(s.precio_aplicado), 0);
  const descuento = parseFloat(document.getElementById('descuento_monto').value) || 0;
  const propina   = parseFloat(document.getElementById('propina_monto').value)   || 0;

  // Impuesto
  const selImp = document.getElementById('impuesto_id');
  const tasa   = parseFloat(selImp?.selectedOptions[0]?.getAttribute('data-tasa') ?? 0);
  const impuesto_monto = subtotal * tasa;

  const total = subtotal - descuento + propina + impuesto_monto;

  document.getElementById('subtotal-display').textContent  = `L. ${subtotal.toFixed(2)}`;
  document.getElementById('impuesto-display').textContent  = `L. ${impuesto_monto.toFixed(2)}`;
  document.getElementById('total-display').textContent     = `L. ${total.toFixed(2)}`;
  document.getElementById('subtotal-hidden').value         = subtotal.toFixed(2);
  document.getElementById('impuesto-monto-hidden').value   = impuesto_monto.toFixed(2);
  document.getElementById('total-hidden').value            = total.toFixed(2);
}

// ── Buscador de clientes ──────────────────────
function wireBuscadorCliente() {
  const input     = document.getElementById('cliente-search');
  const resultados = document.getElementById('cliente-resultados');
  const display   = document.getElementById('cliente-display');
  const btnNuevo  = document.getElementById('btn-nuevo-cliente');
  const formNuevo = document.getElementById('form-nuevo-cliente');
  let timeout;

  input?.addEventListener('input', () => {
    clearTimeout(timeout);
    const q = input.value.trim();
    clienteSeleccionado = null;
    document.getElementById('cliente_id').value = '';
    if (!q) { resultados.innerHTML = ''; resultados.style.display = 'none'; return; }

    timeout = setTimeout(async () => {
      const data = await buscarClientes(q);
      if (!data?.length) {
        resultados.innerHTML = `<div class="cliente-result-item no-result">Sin resultados</div>`;
      } else {
        resultados.innerHTML = data.map(c => `
          <div class="cliente-result-item" data-id="${c.id}" data-nombre="${c.nombre}" data-tel="${c.telefono ?? ''}">
            <span style="color:var(--white)">${c.nombre}</span>
            ${c.telefono ? `<span style="color:var(--text-muted);font-size:0.75rem">${c.telefono}</span>` : ''}
          </div>
        `).join('');
        resultados.querySelectorAll('.cliente-result-item[data-id]').forEach(item => {
          item.addEventListener('click', () => {
            clienteSeleccionado = { id: item.getAttribute('data-id'), nombre: item.getAttribute('data-nombre'), telefono: item.getAttribute('data-tel') };
            document.getElementById('cliente_id').value = clienteSeleccionado.id;
            input.value = clienteSeleccionado.nombre;
            resultados.style.display = 'none';
            display.textContent = `Seleccionado: ${clienteSeleccionado.nombre}`;
            display.style.color = '#7ecba0';
            formNuevo.style.display = 'none';
          });
        });
      }
      resultados.style.display = 'block';
    }, 300);
  });

  btnNuevo?.addEventListener('click', () => {
    formNuevo.style.display = formNuevo.style.display === 'none' ? 'block' : 'none';
  });

  document.addEventListener('click', (e) => {
    if (!input?.closest('.cliente-search-wrap')?.contains(e.target)) resultados.style.display = 'none';
  });
}

// ── Tabla ─────────────────────────────────────
async function cargarDatos() {
  const data = await getCitas();
  citas = Array.isArray(data) ? data : [];
  citasCopia = [...citas];
}

function pintarTabla() {
  const tbody = document.getElementById('tbody-citas');
  if (!tbody) return;
  if (!citas.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center">Sin citas registradas</td></tr>`;
    return;
  }
  tbody.innerHTML = citas.map(c => {
    const nombreServicios = c.servicios?.map(s => s.servicio?.nombre).join(', ') || '—';
    const nombreCliente   = c.cliente?.nombre || '—';
    const nombreBarbero   = c.barbero?.usuario?.nombre || c.barbero?.nombre_publico || '—';
    return `<tr>
      <td>${c.id}</td>
      <td>
        <div style="font-weight:500;color:var(--white)">${nombreCliente}</div>
        <div style="font-size:0.72rem;color:var(--text-muted)">${c.sucursal?.nombre ?? '—'}</div>
      </td>
      <td>${nombreBarbero}</td>
      <td style="font-size:0.8rem">${nombreServicios}</td>
      <td style="font-size:0.8rem">${formatFecha(c.fecha_hora_inicio)}</td>
      <td>L. ${parseFloat(c.total ?? 0).toFixed(2)}</td>
      <td>${badgeEstado(c.estado)}</td>
      <td>
        <div class="acciones-celda">
          ${c.estado === 'COMPLETADA' ? `
          <button class="btn-accion btn-editar" data-action="recibo" data-id="${c.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Recibo
          </button>` : ''}
          <select class="estado-select" data-id="${c.id}" style="
            font-family:var(--font-body);font-size:0.7rem;
            background:#1c1c1c;border:1px solid #333;color:#999;
            border-radius:3px;padding:0.25rem 0.5rem;cursor:pointer;">
            <option value="">Cambiar estado</option>
            ${Object.entries(ESTADOS).map(([k,v]) =>
              `<option value="${k}" ${c.estado===k?'selected':''}>${v.label}</option>`
            ).join('')}
          </select>
          <button class="btn-accion btn-eliminar" data-action="cancel" data-id="${c.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Cancelar
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('.estado-select').forEach(sel => {
    sel.addEventListener('change', async () => {
      const id = sel.getAttribute('data-id');
      const estado = sel.value;
      if (!estado) return;
      try {
        await updateEstadoCita(id, { estado });
        const i = citas.findIndex(c => toId(c.id) === id);
        if (i >= 0) citas[i].estado = estado;
        pintarTabla();
        showAlert('Estado actualizado');
      } catch (e) { showAlert(e.message || 'Error', 'danger'); }
    });
  });
}

function wireTabla() {
  document.getElementById('tbody-citas')?.addEventListener('click', async (ev) => {
    const btnCancel = ev.target.closest('button[data-action="cancel"]');
    if (btnCancel) {
      const id = btnCancel.getAttribute('data-id');
      if (!confirm(`Cancelar cita #${id}?`)) return;
      try {
        await deleteCita(id);
        const i = citas.findIndex(c => toId(c.id) === id);
        if (i >= 0) citas[i].estado = 'CANCELADA';
        pintarTabla();
        showAlert('Cita cancelada');
      } catch (e) { showAlert(e.message || 'Error', 'danger'); }
    }

    const btnRecibo = ev.target.closest('button[data-action="recibo"]');
    if (btnRecibo) {
      const id = btnRecibo.getAttribute('data-id');
      btnRecibo.disabled = true;
      btnRecibo.textContent = 'Generado';
      btnRecibo.style.opacity = '0.4';
      btnRecibo.style.cursor = 'not-allowed';
      try {
        const res = await fetch(`/api/tienda/v1/citas/${id}/recibo`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error('Error al generar recibo');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recibo-cita-${id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        btnRecibo.disabled = false;
        btnRecibo.textContent = 'Recibo';
        btnRecibo.style.opacity = '1';
        btnRecibo.style.cursor = 'pointer';
        showAlert(e.message || 'No se pudo generar el recibo', 'danger');
      }
    }
  });
}

// ── Reset form ────────────────────────────────
function resetForm() {
  document.getElementById('form-cita').reset();
  serviciosSeleccionados = [];
  clienteSeleccionado = null;
  document.getElementById('cliente_id').value = '';
  document.getElementById('cliente-search').value = '';
  document.getElementById('cliente-display').textContent = '';
  document.getElementById('cliente-resultados').style.display = 'none';
  document.getElementById('form-nuevo-cliente').style.display = 'none';
  document.getElementById('subtotal-hidden').value = '0';
  document.getElementById('total-hidden').value = '0';
  document.getElementById('impuesto-monto-hidden').value = '0';
  document.getElementById('subtotal-display').textContent = 'L. 0.00';
  document.getElementById('impuesto-display').textContent = 'L. 0.00';
  document.getElementById('total-display').textContent = 'L. 0.00';
  pintarServiciosSeleccionados();
  pintarServiciosDisponibles();
}

// ── Submit ────────────────────────────────────
async function onSubmit(ev) {
  ev.preventDefault();
  if (!serviciosSeleccionados.length) { showAlert('Selecciona al menos un servicio', 'warning'); return; }
  const barbero_id  = document.getElementById('barbero_id').value;
  const sucursal_id = document.getElementById('sucursal_id').value;
  if (!barbero_id)  { showAlert('Selecciona un barbero', 'warning');  return; }
  if (!sucursal_id) { showAlert('Selecciona una sucursal', 'warning'); return; }
  const fecha    = document.getElementById('fecha_cita').value;
  const hora_ini = document.getElementById('hora_inicio').value;
  const hora_fin = document.getElementById('hora_fin').value;
  if (!fecha || !hora_ini) { showAlert('Ingresa fecha y hora de inicio', 'warning'); return; }

  const nombreNuevo = document.getElementById('nuevo-nombre')?.value?.trim();
  const telNuevo    = document.getElementById('nuevo-telefono')?.value?.trim();
  const nuevo_cliente = (nombreNuevo && !clienteSeleccionado) ? { nombre: nombreNuevo, telefono: telNuevo } : null;

  const payload = {
    sucursal_id,
    barbero_id,
    cliente_id:        clienteSeleccionado?.id || null,
    nuevo_cliente,
    fecha_hora_inicio: `${fecha}T${hora_ini}:00`,
    fecha_hora_fin:    hora_fin ? `${fecha}T${hora_fin}:00` : null,
    servicios:         serviciosSeleccionados.map(s => ({ servicio_id: s.servicio_id, precio_aplicado: s.precio_aplicado })),
    subtotal:          parseFloat(document.getElementById('subtotal-hidden').value),
    descuento_monto:   parseFloat(document.getElementById('descuento_monto').value) || 0,
    propina_monto:     parseFloat(document.getElementById('propina_monto').value)   || 0,
    impuesto_id:       document.getElementById('impuesto_id').value || null,
    impuesto_monto:    parseFloat(document.getElementById('impuesto-monto-hidden').value) || 0,
    total:             parseFloat(document.getElementById('total-hidden').value),
    estado:            document.getElementById('estado').value,
    notas:             document.getElementById('notas').value.trim(),
    metodo_pago_id:    document.getElementById('metodo_pago_id').value || null,
    monto_pago:        parseFloat(document.getElementById('total-hidden').value),
  };

  try {
    await createCita(payload);
    showAlert('Cita creada exitosamente');
    resetForm();
    await cargarDatos();
    pintarTabla();
  } catch (e) {
    showAlert(e.message || 'No se pudo crear la cita', 'danger');
  }
}

// ── Busqueda tabla ────────────────────────────
function wireSearch() {
  const btn = document.getElementById('buscar-cita');
  if (!btn) return;
  const form  = btn.closest('form');
  const input = form?.querySelector('input[type="search"]');
  if (!form || !input) return;
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = input.value.trim().toLowerCase();
    if (!q) { citas = [...citasCopia]; pintarTabla(); return; }
    citas = citasCopia.filter(c =>
      (c.cliente?.nombre ?? '').toLowerCase().includes(q) ||
      (c.barbero?.usuario?.nombre ?? '').toLowerCase().includes(q) ||
      (c.estado ?? '').toLowerCase().includes(q)
    );
    pintarTabla();
  });
  input.addEventListener('input', () => {
    if (!input.value.trim()) { citas = [...citasCopia]; pintarTabla(); }
  });
}

// ── Init ──────────────────────────────────────
async function init() {
  try {
    await Promise.all([cargarDatos(), cargarFormData()]);
    pintarTabla();
    pintarServiciosSeleccionados();
    wireBuscadorCliente();
    wireTabla();
    wireSearch();
    document.getElementById('form-cita')?.addEventListener('submit', onSubmit);
    document.getElementById('btn-cancelar')?.addEventListener('click', resetForm);
    document.getElementById('descuento_monto')?.addEventListener('input', recalcularTotales);
    document.getElementById('propina_monto')?.addEventListener('input', recalcularTotales);
    document.getElementById('impuesto_id')?.addEventListener('change', recalcularTotales);
  } catch (e) {
    console.error(e);
    showAlert(e.message || 'Error al cargar', 'danger');
  }
}

init();
// js/inicio.js
import { verificarSesion, getToken, API } from '/js/components/http.global.js';

verificarSesion();

async function cargarDashboard() {
  const res = await fetch(`${API}/dashboard`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Error al cargar dashboard');
  return res.json();
}

function formatCurrency(val) {
  return `L. ${parseFloat(val).toLocaleString('es-HN', { minimumFractionDigits: 2 })}`;
}

async function init() {
  try {
    const data = await cargarDashboard();

    // ── Tarjetas de resumen ───────────────────
    document.getElementById('ingresos-hoy').textContent       = formatCurrency(data.ingresos_hoy);
    document.getElementById('total-citas').textContent        = data.total_citas_hoy;
    document.getElementById('citas-completadas').textContent  = data.citas_completadas_hoy;

    // ── Servicios más solicitados ─────────────
    const tbodyServ = document.getElementById('tbody-servicios-pop');
    if (!data.servicios_populares.length) {
      tbodyServ.innerHTML = `<tr><td colspan="3" class="text-center">Sin datos aún</td></tr>`;
    } else {
      tbodyServ.innerHTML = data.servicios_populares.map((s, i) => `
        <tr>
          <td>
            <span style="
              display:inline-block;width:22px;height:22px;border-radius:50%;
              background:rgba(255,255,255,.06);border:1px solid #333;
              text-align:center;line-height:22px;font-size:0.7rem;color:#666;
              margin-right:0.5rem;">${i + 1}</span>
            ${s.nombre}
          </td>
          <td style="color:var(--text-dim)">L. ${parseFloat(s.precio_base).toFixed(2)}</td>
          <td>
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <div style="
                height:4px;border-radius:2px;background:#3a7d5a;
                width:${Math.min(100, (s.total_solicitudes / (data.servicios_populares[0]?.total_solicitudes || 1)) * 100)}%;
                min-width:8px;"></div>
              <span style="font-size:0.78rem;color:#7ecba0;">${s.total_solicitudes}</span>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // ── Inventario bajo stock ─────────────────
    const tbodyInv = document.getElementById('tbody-inventario-bajo');
    if (!data.inventario_bajo.length) {
      tbodyInv.innerHTML = `<tr><td colspan="4" class="text-center" style="color:#555">Sin productos bajo stock</td></tr>`;
    } else {
      tbodyInv.innerHTML = data.inventario_bajo.map(i => `
        <tr>
          <td>${i.producto}</td>
          <td style="color:var(--text-dim);font-size:0.82rem">${i.sucursal}</td>
          <td>
            <span style="
              color:#e07070;font-weight:600;font-size:0.88rem;
            ">${parseFloat(i.stock).toFixed(2)}</span>
          </td>
          <td style="color:var(--text-muted);font-size:0.82rem">${parseFloat(i.stock_min).toFixed(2)}</td>
        </tr>
      `).join('');
    }

  } catch (e) {
    console.error('Dashboard error:', e);
    document.getElementById('dashboard-error').textContent = e.message;
    document.getElementById('dashboard-error').style.display = 'block';
  }
}

init();
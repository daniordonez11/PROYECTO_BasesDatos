// controllers/Barberia/reciboController.js
const PDFDocument = require('pdfkit');
const sequelize = require('../../config/database');

const getModels = () => ({
  Cita:         sequelize.models.cita,
  CitaServicio: sequelize.models.cita_servicio,
  CitaPago:     sequelize.models.cita_pago,
  Servicio:     sequelize.models.servicio,
  Barbero:      sequelize.models.barbero,
  Sucursal:     sequelize.models.sucursal,
  Cliente:      sequelize.models.cliente,
  MetodoPago:   sequelize.models.metodo_pago,
  Usuario:      sequelize.models.usuario,
});

const generarRecibo = async (req, res) => {
  try {
    const { Cita, CitaServicio, CitaPago, Servicio, Barbero, Sucursal, Cliente, MetodoPago, Usuario } = getModels();

    // Obtener cita completa
    const cita = await Cita.findByPk(req.params.id, {
      include: [
        {
          model: CitaServicio, as: 'servicios',
          include: [{ model: Servicio, as: 'servicio', attributes: ['nombre', 'precio_base'] }]
        },
        {
          model: Barbero, as: 'barbero',
          include: [{ model: Usuario, as: 'usuario', attributes: ['nombre'] }]
        },
        { model: Sucursal, as: 'sucursal' },
        { model: Cliente,  as: 'cliente'  },
        {
          model: CitaPago, as: 'pagos',
          include: [{ model: MetodoPago, as: 'metodo' }]
        },
      ]
    });

    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

    // ── Crear PDF ─────────────────────────────
    const doc = new PDFDocument({
      size: [226, 600], // Tamaño ticket 80mm
      margins: { top: 20, bottom: 20, left: 20, right: 20 }
    });

    // Headers de respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=recibo-cita-${cita.id}.pdf`);
    doc.pipe(res);

    const W = 226 - 40; // ancho útil
    const cx = 20;      // margen izquierdo

    // ── Colores y fuentes ──────────────────────
    const COLOR_TITLE  = '#111111';
    const COLOR_TEXT   = '#333333';
    const COLOR_MUTED  = '#888888';
    const COLOR_LINE   = '#dddddd';
    const COLOR_TOTAL  = '#000000';

    // ── ENCABEZADO ────────────────────────────
    doc.fontSize(14).font('Helvetica-Bold')
       .fillColor(COLOR_TITLE)
       .text('PARIS BARBER SHOP', cx, 20, { width: W, align: 'center' });

    doc.fontSize(8).font('Helvetica')
       .fillColor(COLOR_MUTED)
       .text(cita.sucursal?.nombre ?? 'Sucursal', cx, doc.y + 4, { width: W, align: 'center' });

    // Línea separadora
    doc.moveTo(cx, doc.y + 10).lineTo(cx + W, doc.y + 10)
       .strokeColor(COLOR_LINE).lineWidth(0.5).stroke();

    // ── DATOS DE LA CITA ──────────────────────
    const yDatos = doc.y + 16;

    doc.fontSize(7).font('Helvetica-Bold').fillColor(COLOR_MUTED)
       .text('RECIBO DE SERVICIO', cx, yDatos, { width: W, align: 'center' });

    doc.fontSize(8).font('Helvetica').fillColor(COLOR_TEXT);

    const fecha = new Date(cita.fecha_hora_inicio);
    const fechaStr = fecha.toLocaleDateString('es-HN', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    const horaStr = fecha.toLocaleTimeString('es-HN', {
      hour: '2-digit', minute: '2-digit'
    });

    const filas = [
      ['Folio',    `#${String(cita.id).padStart(6, '0')}`],
      ['Fecha',    fechaStr],
      ['Hora',     horaStr],
      ['Barbero',  cita.barbero?.usuario?.nombre ?? cita.barbero?.nombre_publico ?? '—'],
      ['Cliente',  cita.cliente?.nombre ?? 'Cliente general'],
      ['Teléfono', cita.cliente?.telefono ?? '—'],
    ];

    let y = doc.y + 10;
    filas.forEach(([label, valor]) => {
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor(COLOR_MUTED)
         .text(label, cx, y, { width: 55, continued: false });
      doc.fontSize(7.5).font('Helvetica').fillColor(COLOR_TEXT)
         .text(valor, cx + 58, y, { width: W - 58 });
      y += 14;
    });

    // Línea
    doc.moveTo(cx, y + 4).lineTo(cx + W, y + 4)
       .strokeColor(COLOR_LINE).lineWidth(0.5).stroke();
    y += 14;

    // ── SERVICIOS ─────────────────────────────
    doc.fontSize(7).font('Helvetica-Bold').fillColor(COLOR_MUTED)
       .text('SERVICIOS', cx, y);
    y += 12;

    let subtotal = 0;
    (cita.servicios ?? []).forEach(s => {
      const nombre = s.servicio?.nombre ?? '—';
      const precio = parseFloat(s.precio_aplicado ?? 0);
      subtotal += precio;

      doc.fontSize(8).font('Helvetica').fillColor(COLOR_TEXT)
         .text(nombre, cx, y, { width: W - 60 });
      doc.fontSize(8).font('Helvetica').fillColor(COLOR_TEXT)
         .text(`L. ${precio.toFixed(2)}`, cx, y, { width: W, align: 'right' });
      y += 14;
    });

    // Línea
    doc.moveTo(cx, y + 2).lineTo(cx + W, y + 2)
       .strokeColor(COLOR_LINE).lineWidth(0.5).stroke();
    y += 12;

    // ── TOTALES ───────────────────────────────
    const descuento = parseFloat(cita.descuento_monto ?? 0);
    const propina   = parseFloat(cita.propina_monto   ?? 0);
    const total     = parseFloat(cita.total           ?? 0);

    const filasTotales = [
      ['Subtotal',  `L. ${subtotal.toFixed(2)}`],
      ...(descuento > 0 ? [['Descuento', `- L. ${descuento.toFixed(2)}`]] : []),
      ...(propina   > 0 ? [['Propina',   `+ L. ${propina.toFixed(2)}`]]   : []),
    ];

    filasTotales.forEach(([label, valor]) => {
      doc.fontSize(8).font('Helvetica').fillColor(COLOR_MUTED)
         .text(label, cx, y, { width: W - 80 });
      doc.fontSize(8).font('Helvetica').fillColor(COLOR_TEXT)
         .text(valor, cx, y, { width: W, align: 'right' });
      y += 13;
    });

    // Total final
    doc.moveTo(cx, y + 2).lineTo(cx + W, y + 2)
       .strokeColor('#aaaaaa').lineWidth(0.8).stroke();
    y += 10;

    doc.fontSize(10).font('Helvetica-Bold').fillColor(COLOR_TOTAL)
       .text('TOTAL', cx, y, { width: W - 80 });
    doc.fontSize(10).font('Helvetica-Bold').fillColor(COLOR_TOTAL)
       .text(`L. ${total.toFixed(2)}`, cx, y, { width: W, align: 'right' });
    y += 18;

    // ── MÉTODO DE PAGO ────────────────────────
    if (cita.pagos?.length) {
      const metodoPago = cita.pagos[0].metodo?.nombre ?? 'Efectivo';
      doc.fontSize(7.5).font('Helvetica').fillColor(COLOR_MUTED)
         .text(`Pago: ${metodoPago}`, cx, y, { width: W, align: 'center' });
      y += 14;
    }

    // Línea final
    doc.moveTo(cx, y + 4).lineTo(cx + W, y + 4)
       .strokeColor(COLOR_LINE).lineWidth(0.5).stroke();
    y += 14;

    // ── PIE ───────────────────────────────────
    doc.fontSize(7).font('Helvetica').fillColor(COLOR_MUTED)
       .text('¡Gracias por su visita!', cx, y, { width: W, align: 'center' });
    y += 11;
    doc.fontSize(6.5).font('Helvetica').fillColor(COLOR_MUTED)
       .text('Paris Barber Shop', cx, y, { width: W, align: 'center' });

    doc.end();

  } catch (error) {
    console.error('Error generando recibo:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = { generarRecibo };
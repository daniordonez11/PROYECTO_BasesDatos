// controllers/dashboardController.js
const sequelize = require('../../config/database');
const { Op, fn, col, literal } = require('sequelize');

const getDashboard = async (req, res) => {
  try {
    const Cita         = sequelize.models.cita;
    const CitaServicio = sequelize.models.cita_servicio;
    const Servicio     = sequelize.models.servicio;
    const Inventario   = sequelize.models.inventario;
    const Producto     = sequelize.models.producto;
    const Sucursal     = sequelize.models.sucursal;

    // Rango de hoy
    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
    const finHoy    = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);

    // ── 1. Ingresos del día ───────────────────
    const citasHoy = await Cita.findAll({
      where: {
        fecha_hora_inicio: { [Op.between]: [inicioHoy, finHoy] },
        estado: { [Op.in]: ['COMPLETADA'] }
      },
      attributes: ['total']
    });

    const ingresos_hoy = citasHoy.reduce((acc, c) => acc + parseFloat(c.total ?? 0), 0);

    // Total citas hoy (todos los estados)
    const total_citas_hoy = await Cita.count({
      where: { fecha_hora_inicio: { [Op.between]: [inicioHoy, finHoy] } }
    });

    // Citas completadas hoy
    const citas_completadas_hoy = await Cita.count({
      where: {
        fecha_hora_inicio: { [Op.between]: [inicioHoy, finHoy] },
        estado: 'COMPLETADA'
      }
    });

    // ── 2. Servicios más solicitados ──────────
    const servicios_populares = await CitaServicio.findAll({
      attributes: [
        'servicio_id',
        [fn('COUNT', col('cita_servicio.servicio_id')), 'total_solicitudes']
      ],
      include: [{
        model: Servicio,
        as: 'servicio',
        attributes: ['nombre', 'precio_base']
      }],
      group: ['cita_servicio.servicio_id', 'servicio.id', 'servicio.nombre', 'servicio.precio_base'],
      order: [[literal('total_solicitudes'), 'DESC']],
      limit: 5
    });

    // ── 3. Inventario bajo stock ──────────────
    let inventario_bajo = [];
    try {
      inventario_bajo = await Inventario.findAll({
        where: {
          stock: { [Op.lte]: sequelize.col('stock_min') }
        },
        include: [
          { model: Producto,  as: 'producto',  attributes: ['nombre'] },
          { model: Sucursal,  as: 'sucursal',  attributes: ['nombre'] },
        ],
        limit: 10
      });
    } catch (e) {
      // Si no hay inventario aún, devuelve array vacío
      inventario_bajo = [];
    }

    res.json({
      ingresos_hoy:          ingresos_hoy.toFixed(2),
      total_citas_hoy,
      citas_completadas_hoy,
      servicios_populares:   servicios_populares.map(s => ({
        nombre:           s.servicio?.nombre ?? '—',
        precio_base:      s.servicio?.precio_base ?? 0,
        total_solicitudes: parseInt(s.dataValues.total_solicitudes)
      })),
      inventario_bajo: inventario_bajo.map(i => ({
        producto:  i.producto?.nombre ?? '—',
        sucursal:  i.sucursal?.nombre ?? '—',
        stock:     parseFloat(i.stock),
        stock_min: parseFloat(i.stock_min)
      }))
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboard };
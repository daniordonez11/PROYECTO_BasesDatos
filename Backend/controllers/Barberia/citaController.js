// controllers/Barberia/citaController.js
const sequelize = require('../../config/database');

const getModels = () => ({
  Cita:         sequelize.models.cita,
  CitaServicio: sequelize.models.cita_servicio,
  CitaPago:     sequelize.models.cita_pago,
  CitaEstado:   sequelize.models.cita_estado_hist,
  Servicio:     sequelize.models.servicio,
  Barbero:      sequelize.models.barbero,
  Sucursal:     sequelize.models.sucursal,
  Cliente:      sequelize.models.cliente,
  MetodoPago:   sequelize.models.metodo_pago,
  Usuario:      sequelize.models.usuario,
});

// ── GET todas las citas ───────────────────────
const getCitas = async (req, res) => {
  try {
    const { Cita, CitaServicio, Servicio, Barbero, Sucursal, Cliente, Usuario } = getModels();

    const citas = await Cita.findAll({
      include: [
        {
          model: CitaServicio, as: 'servicios',
          include: [{ model: Servicio, as: 'servicio', attributes: ['id', 'nombre', 'precio_base'] }]
        },
        {
          model: Barbero, as: 'barbero',
          include: [{ model: Usuario, as: 'usuario', attributes: ['nombre'] }]
        },
        { model: Sucursal, as: 'sucursal', attributes: ['id', 'nombre'] },
        { model: Cliente,  as: 'cliente',  attributes: ['id', 'nombre', 'telefono'] },
      ],
      order: [['fecha_hora_inicio', 'DESC']]
    });

    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── GET cita por ID ───────────────────────────
const getCitaById = async (req, res) => {
  try {
    const { Cita, CitaServicio, Servicio, Barbero, Sucursal, Cliente, CitaPago } = getModels();

    const cita = await Cita.findByPk(req.params.id, {
      include: [
        {
          model: CitaServicio, as: 'servicios',
          include: [{ model: Servicio, as: 'servicio' }]
        },
        {
          model: Barbero, as: 'barbero',
          include: [{ model: sequelize.models.usuario, as: 'usuario', attributes: ['nombre'] }]
        },
        { model: Sucursal, as: 'sucursal' },
        { model: Cliente,  as: 'cliente'  },
        { model: CitaPago, as: 'pagos'    },
      ]
    });

    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(cita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── POST crear cita ───────────────────────────
const createCita = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { Cita, CitaServicio, CitaEstado, CitaPago, Cliente } = getModels();

    const {
      sucursal_id,
      barbero_id,
      cliente_id,
      // crear cliente al vuelo
      nuevo_cliente,     // { nombre, telefono }
      fecha_hora_inicio,
      fecha_hora_fin,
      servicios,        
      subtotal,
      descuento_monto,
      propina_monto,
      impuesto_monto,
      total,
      estado,
      notas,
      metodo_pago_id,
      monto_pago,
      referencia_pago,
      impuesto_id,
    } = req.body;

    // 1. Crear cliente si no existe
    let clienteId = cliente_id || null;
    if (!clienteId && nuevo_cliente?.nombre) {
      const cliente = await Cliente.create({
        nombre:   nuevo_cliente.nombre,
        telefono: nuevo_cliente.telefono || null,
        activo:   true
      }, { transaction: t });
      clienteId = cliente.id;
    }

    // 2. Crear la cita
    const cita = await Cita.create({
      sucursal_id,
      barbero_id,
      cliente_id:      clienteId,
      fecha_hora_inicio,
      fecha_hora_fin,
      precio_aplicado: subtotal,
      subtotal,
      descuento_monto: descuento_monto || 0,
      propina_monto:   propina_monto   || 0,
      impuesto_id:     impuesto_id     || null,
      impuesto_monto:  impuesto_monto  || 0,
      total,
      estado:          estado || 'PENDIENTE',
      notas:           notas  || null,
      created_by:      req.usuario?.id || null,
    }, { transaction: t });

    // 3. Crear servicios de la cita
    if (servicios?.length) {
      await CitaServicio.bulkCreate(
        servicios.map(s => ({
          cita_id:         cita.id,
          servicio_id:     s.servicio_id,
          precio_aplicado: s.precio_aplicado
        })),
        { transaction: t }
      );
    }

    // 4. Registrar estado inicial
    await CitaEstado.create({
      cita_id:    cita.id,
      estado:     estado || 'PENDIENTE',
      usuario_id: req.usuario?.id || null,
      fecha:      new Date(),
    }, { transaction: t });

    // 5. Registrar pago si se proporcionó
    if (metodo_pago_id && monto_pago) {
      await CitaPago.create({
        cita_id:        cita.id,
        metodo_pago_id,
        monto:          monto_pago,
        referencia:     referencia_pago || null,
        fecha:          new Date(),
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ ok: true, cita_id: cita.id });

  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

// ── PUT actualizar estado ─────────────────────
const updateEstadoCita = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { Cita, CitaEstado } = getModels();
    const { estado, motivo } = req.body;

    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

    await cita.update({ estado }, { transaction: t });

    await CitaEstado.create({
      cita_id:    cita.id,
      estado,
      motivo:     motivo || null,
      usuario_id: req.usuario?.id || null,
      fecha:      new Date(),
    }, { transaction: t });

    await t.commit();
    res.json({ ok: true, estado });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

// ── DELETE cancelar cita ──────────────────────
const deleteCita = async (req, res) => {
  try {
    const { Cita } = getModels();
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    await cita.update({ estado: 'CANCELADA' });
    res.json({ ok: true, message: 'Cita cancelada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ── GET datos para formulario ─────────────────
const getFormData = async (req, res) => {
  try {
    const { Barbero, Sucursal, Servicio, MetodoPago, Usuario } = getModels();
    const Impuesto = sequelize.models.impuesto;

    const [barberos, sucursales, servicios, metodos_pago, impuestos] = await Promise.all([
      Barbero.findAll({
        include: [{ model: Usuario, as: 'usuario', attributes: ['nombre'] }]
      }),
      Sucursal.findAll(),
      Servicio.findAll({ where: { estado: true } }),
      MetodoPago.findAll(),
      Impuesto.findAll({ where: { estado: true } }),
    ]);

    res.json({ barberos, sucursales, servicios, metodos_pago, impuestos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── GET buscar clientes ───────────────────────
const buscarClientes = async (req, res) => {
  try {
    const { Cliente } = getModels();
    const { q } = req.query;
    const { Op } = require('sequelize');

    const clientes = await Cliente.findAll({
      where: {
        activo: true,
        ...(q ? {
          nombre: { [Op.like]: `%${q}%` }
        } : {})
      },
      attributes: ['id', 'nombre', 'telefono'],
      limit: 10
    });

    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCitas,
  getCitaById,
  createCita,
  updateEstadoCita,
  deleteCita,
  getFormData,
  buscarClientes,
};
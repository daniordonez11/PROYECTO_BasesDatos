// inventarioController.js
const sequelize = require('../../config/database');

const getModel    = () => sequelize.models.inventario;
const getProducto = () => sequelize.models.producto;
const getSucursal = () => sequelize.models.sucursal;
const getMovimiento = () => sequelize.models.movimiento_inventario;
const getTipoMov  = () => sequelize.models.tipo_mov_inv;

const getInventarios = async (req, res) => {
  try {
    const inventarios = await getModel().findAll({
      include: [
        { model: getProducto(), as: 'producto', attributes: ['id', 'nombre'] },
        { model: getSucursal(), as: 'sucursal', attributes: ['id', 'nombre'] }
      ]
    });
    res.status(200).json(inventarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInventarioById = async (req, res) => {
  try {
    const inventario = await getModel().findByPk(req.params.id, {
      include: [
        { model: getProducto(), as: 'producto', attributes: ['id', 'nombre'] },
        { model: getSucursal(), as: 'sucursal', attributes: ['id', 'nombre'] }
      ]
    });
    if (!inventario) return res.status(404).json({ error: 'Inventario no encontrado' });
    res.status(200).json(inventario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInventario = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { producto_id, sucursal_id, stock, stock_min, stock_max } = req.body;

    // 1. Crear registro de inventario
    const inventario = await getModel().create(
      { producto_id, sucursal_id, stock, stock_min, stock_max },
      { transaction: t }
    );

    // 2. Registrar movimiento inicial
    const tipoEntrada = await getTipoMov().findOne({ where: { nombre: 'ENTRADA' } });
    if (tipoEntrada && stock > 0) {
      await getMovimiento().create({
        producto_id,
        sucursal_id,
        fecha:         new Date(),
        tipo_id:       tipoEntrada.id,
        cantidad:      stock,
        costo_unitario: 0,
        nota:          'Stock inicial',
        usuario_id:    req.usuario?.id || null
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(inventario);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

const updateInventario = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const inventario = await getModel().findByPk(req.params.id);
    if (!inventario) return res.status(404).json({ error: 'Inventario no encontrado' });

    const stockAnterior = parseFloat(inventario.stock);
    const stockNuevo    = parseFloat(req.body.stock ?? inventario.stock);
    const diferencia    = stockNuevo - stockAnterior;

    // 1. Actualizar inventario
    await inventario.update(req.body, { transaction: t });

    // 2. Registrar movimiento si el stock cambió
    if (diferencia !== 0) {
      const tipoNombre = diferencia > 0 ? 'ENTRADA' : 'SALIDA';
      const tipo = await getTipoMov().findOne({ where: { nombre: tipoNombre } });

      if (tipo) {
        await getMovimiento().create({
          producto_id:   inventario.producto_id,
          sucursal_id:   inventario.sucursal_id,
          fecha:         new Date(),
          tipo_id:       tipo.id,
          cantidad:      Math.abs(diferencia),
          costo_unitario: 0,
          nota:          `Ajuste manual de stock`,
          usuario_id:    req.usuario?.id || null
        }, { transaction: t });
      }
    }

    await t.commit();
    res.status(200).json(inventario);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

const deleteInventario = async (req, res) => {
  try {
    const inventario = await getModel().findByPk(req.params.id);
    if (!inventario) return res.status(404).json({ error: 'Inventario no encontrado' });
    await inventario.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ── Ver historial de movimientos ──────────────
const getMovimientos = async (req, res) => {
  try {
    const movimientos = await getMovimiento().findAll({
      include: [
        { model: getProducto(), as: 'producto', attributes: ['nombre'] },
        { model: getSucursal(), as: 'sucursal', attributes: ['nombre'] },
        { model: getTipoMov(),  as: 'tipo',     attributes: ['nombre', 'signo'] },
        { model: sequelize.models.usuario, as: 'usuario', attributes: ['nombre'] },
      ],
      order: [['fecha', 'DESC']],
      limit: 50
    });
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInventarios,
  getInventarioById,
  createInventario,
  updateInventario,
  deleteInventario,
  getMovimientos
};
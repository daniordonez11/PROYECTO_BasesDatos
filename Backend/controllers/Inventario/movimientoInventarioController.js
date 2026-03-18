const sequelize = require('../../config/database');

const getModel = () => sequelize.models.movimiento_inventario;
const getInventario = () => sequelize.models.inventario;
const getTipoMovInv = () => sequelize.models.tipo_mov_inv;

const getMovimientosInventario = async (req, res) => {
  try {
    const movimientos = await getModel().findAll({
      include: [
        { model: getInventario(), as: 'inventario' },
        { model: getTipoMovInv(), as: 'tipo_movimiento', attributes: ['id', 'descripcion'] }
      ]
    });
    res.status(200).json(movimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovimientoInventarioById = async (req, res) => {
  try {
    const movimiento = await getModel().findByPk(req.params.id, {
      include: [
        { model: getInventario(), as: 'inventario' },
        { model: getTipoMovInv(), as: 'tipo_movimiento', attributes: ['id', 'descripcion'] }
      ]
    });
    if (!movimiento) return res.status(404).json({ error: 'Movimiento de inventario no encontrado' });
    res.status(200).json(movimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMovimientoInventario = async (req, res) => {
  try {
    const movimiento = await getModel().create(req.body);
    res.status(201).json(movimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMovimientoInventario = async (req, res) => {
  try {
    const movimiento = await getModel().findByPk(req.params.id);
    if (!movimiento) return res.status(404).json({ error: 'Movimiento de inventario no encontrado' });
    await movimiento.update(req.body);
    res.status(200).json(movimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMovimientoInventario = async (req, res) => {
  try {
    const movimiento = await getModel().findByPk(req.params.id);
    if (!movimiento) return res.status(404).json({ error: 'Movimiento de inventario no encontrado' });
    await movimiento.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getMovimientosInventario,
  getMovimientoInventarioById,
  createMovimientoInventario,
  updateMovimientoInventario,
  deleteMovimientoInventario
};

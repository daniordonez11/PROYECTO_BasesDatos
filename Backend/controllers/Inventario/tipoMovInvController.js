const sequelize = require('../../config/database');

const getModel = () => sequelize.models.tipo_mov_inv;

const getTiposMovimientoInventario = async (req, res) => {
  try {
    const tipos = await getModel().findAll();
    res.status(200).json(tipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTipoMovimientoInventarioById = async (req, res) => {
  try {
    const tipo = await getModel().findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ error: 'Tipo de movimiento no encontrado' });
    res.status(200).json(tipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTipoMovimientoInventario = async (req, res) => {
  try {
    const tipo = await getModel().create(req.body);
    res.status(201).json(tipo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTipoMovimientoInventario = async (req, res) => {
  try {
    const tipo = await getModel().findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ error: 'Tipo de movimiento no encontrado' });
    await tipo.update(req.body);
    res.status(200).json(tipo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTipoMovimientoInventario = async (req, res) => {
  try {
    const tipo = await getModel().findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ error: 'Tipo de movimiento no encontrado' });
    await tipo.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getTiposMovimientoInventario,
  getTipoMovimientoInventarioById,
  createTipoMovimientoInventario,
  updateTipoMovimientoInventario,
  deleteTipoMovimientoInventario
};

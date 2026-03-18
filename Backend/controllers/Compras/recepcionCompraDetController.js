const sequelize = require('../../config/database');

const getModel = () => sequelize.models.recepcion_compra_det;
const getRecepcionCompra = () => sequelize.models.recepcion_compra;
const getProducto = () => sequelize.models.producto;

const getRecepcionesCompraDet = async (req, res) => {
  try {
    const detalles = await getModel().findAll({
      include: [
        { model: getRecepcionCompra(), as: 'recepcion_compra' },
        { model: getProducto(), as: 'producto', attributes: ['id', 'nombre'] }
      ]
    });
    res.status(200).json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecepcionCompraDetById = async (req, res) => {
  try {
    const detalle = await getModel().findByPk(req.params.id, {
      include: [
        { model: getRecepcionCompra(), as: 'recepcion_compra' },
        { model: getProducto(), as: 'producto', attributes: ['id', 'nombre'] }
      ]
    });
    if (!detalle) return res.status(404).json({ error: 'Detalle de recepción no encontrado' });
    res.status(200).json(detalle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRecepcionCompraDet = async (req, res) => {
  try {
    const detalle = await getModel().create(req.body);
    res.status(201).json(detalle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRecepcionCompraDet = async (req, res) => {
  try {
    const detalle = await getModel().findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ error: 'Detalle de recepción no encontrado' });
    await detalle.update(req.body);
    res.status(200).json(detalle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRecepcionCompraDet = async (req, res) => {
  try {
    const detalle = await getModel().findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ error: 'Detalle de recepción no encontrado' });
    await detalle.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getRecepcionesCompraDet,
  getRecepcionCompraDetById,
  createRecepcionCompraDet,
  updateRecepcionCompraDet,
  deleteRecepcionCompraDet
};

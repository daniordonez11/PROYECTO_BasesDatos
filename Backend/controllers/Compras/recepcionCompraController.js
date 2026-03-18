const sequelize = require('../../config/database');

const getModel = () => sequelize.models.recepcion_compra;
const getProveedor = () => sequelize.models.proveedor;

const getRecepcionesCompra = async (req, res) => {
  try {
    const recepciones = await getModel().findAll({
      include: [{ model: getProveedor(), as: 'proveedor', attributes: ['id', 'nombre'] }]
    });
    res.status(200).json(recepciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecepcionCompraById = async (req, res) => {
  try {
    const recepcion = await getModel().findByPk(req.params.id, {
      include: [{ model: getProveedor(), as: 'proveedor', attributes: ['id', 'nombre'] }]
    });
    if (!recepcion) return res.status(404).json({ error: 'Recepción de compra no encontrada' });
    res.status(200).json(recepcion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRecepcionCompra = async (req, res) => {
  try {
    const recepcion = await getModel().create(req.body);
    res.status(201).json(recepcion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRecepcionCompra = async (req, res) => {
  try {
    const recepcion = await getModel().findByPk(req.params.id);
    if (!recepcion) return res.status(404).json({ error: 'Recepción de compra no encontrada' });
    await recepcion.update(req.body);
    res.status(200).json(recepcion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRecepcionCompra = async (req, res) => {
  try {
    const recepcion = await getModel().findByPk(req.params.id);
    if (!recepcion) return res.status(404).json({ error: 'Recepción de compra no encontrada' });
    await recepcion.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getRecepcionesCompra,
  getRecepcionCompraById,
  createRecepcionCompra,
  updateRecepcionCompra,
  deleteRecepcionCompra
};

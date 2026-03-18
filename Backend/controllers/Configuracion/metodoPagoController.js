const sequelize = require('../../config/database');

const getModel = () => sequelize.models.metodo_pago;

const getMetodosPago = async (req, res) => {
  try {
    const metodos = await getModel().findAll();
    res.status(200).json(metodos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMetodoPagoById = async (req, res) => {
  try {
    const metodo = await getModel().findByPk(req.params.id);
    if (!metodo) return res.status(404).json({ error: 'Método de pago no encontrado' });
    res.status(200).json(metodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMetodoPago = async (req, res) => {
  try {
    const metodo = await getModel().create(req.body);
    res.status(201).json(metodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMetodoPago = async (req, res) => {
  try {
    const metodo = await getModel().findByPk(req.params.id);
    if (!metodo) return res.status(404).json({ error: 'Método de pago no encontrado' });
    await metodo.update(req.body);
    res.status(200).json(metodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMetodoPago = async (req, res) => {
  try {
    const metodo = await getModel().findByPk(req.params.id);
    if (!metodo) return res.status(404).json({ error: 'Método de pago no encontrado' });
    await metodo.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago
};

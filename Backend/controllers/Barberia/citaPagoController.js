const sequelize = require('../../config/database');

const getModel = () => sequelize.models.cita_pago;
const getCita = () => sequelize.models.cita;
const getMetodoPago = () => sequelize.models.metodo_pago;

const getCitasPagos = async (req, res) => {
  try {
    const pagos = await getModel().findAll({
      include: [
        { model: getCita(), as: 'cita' },
        { model: getMetodoPago(), as: 'metodo_pago', attributes: ['id', 'nombre'] }
      ]
    });
    res.status(200).json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCitaPagoById = async (req, res) => {
  try {
    const pago = await getModel().findByPk(req.params.id, {
      include: [
        { model: getCita(), as: 'cita' },
        { model: getMetodoPago(), as: 'metodo_pago', attributes: ['id', 'nombre'] }
      ]
    });
    if (!pago) return res.status(404).json({ error: 'Pago de cita no encontrado' });
    res.status(200).json(pago);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCitaPago = async (req, res) => {
  try {
    const pago = await getModel().create(req.body);
    res.status(201).json(pago);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCitaPago = async (req, res) => {
  try {
    const pago = await getModel().findByPk(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago de cita no encontrado' });
    await pago.update(req.body);
    res.status(200).json(pago);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCitaPago = async (req, res) => {
  try {
    const pago = await getModel().findByPk(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago de cita no encontrado' });
    await pago.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCitasPagos,
  getCitaPagoById,
  createCitaPago,
  updateCitaPago,
  deleteCitaPago
};

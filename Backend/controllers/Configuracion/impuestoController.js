const sequelize = require('../../config/database');

const getModel = () => sequelize.models.impuesto;

const getImpuestos = async (req, res) => {
  try {
    const impuestos = await getModel().findAll();
    res.status(200).json(impuestos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getImpuestoById = async (req, res) => {
  try {
    const impuesto = await getModel().findByPk(req.params.id);
    if (!impuesto) return res.status(404).json({ error: 'Impuesto no encontrado' });
    res.status(200).json(impuesto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createImpuesto = async (req, res) => {
  try {
    const impuesto = await getModel().create(req.body);
    res.status(201).json(impuesto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateImpuesto = async (req, res) => {
  try {
    const impuesto = await getModel().findByPk(req.params.id);
    if (!impuesto) return res.status(404).json({ error: 'Impuesto no encontrado' });
    await impuesto.update(req.body);
    res.status(200).json(impuesto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteImpuesto = async (req, res) => {
  try {
    const impuesto = await getModel().findByPk(req.params.id);
    if (!impuesto) return res.status(404).json({ error: 'Impuesto no encontrado' });
    await impuesto.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getImpuestos,
  getImpuestoById,
  createImpuesto,
  updateImpuesto,
  deleteImpuesto
};

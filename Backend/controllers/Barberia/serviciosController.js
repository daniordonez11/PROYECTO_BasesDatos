// serviciosController.js
const sequelize = require('../../config/database');

const getModel = () => sequelize.models.servicio; // ← 'servicio' no 'servicios'

const getServicios = async (req, res) => {
  try {
    const servicios = await getModel().findAll();
    res.status(200).json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getServicioById = async (req, res) => {
  try {
    const servicio = await getModel().findByPk(req.params.id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.status(200).json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createServicio = async (req, res) => {
  try {
    const servicio = await getModel().create(req.body);
    res.status(201).json(servicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateServicio = async (req, res) => {
  try {
    const servicio = await getModel().findByPk(req.params.id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    await servicio.update(req.body);
    res.status(200).json(servicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteServicio = async (req, res) => {
  try {
    const servicio = await getModel().findByPk(req.params.id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    await servicio.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createServicio,
  getServicios,
  getServicioById,
  updateServicio,
  deleteServicio
};
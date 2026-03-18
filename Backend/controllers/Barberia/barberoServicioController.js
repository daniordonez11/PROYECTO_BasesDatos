const sequelize = require('../../config/database');

const getModel = () => sequelize.models.barbero_servicio;
const getBarbero = () => sequelize.models.barbero;
const getServicio = () => sequelize.models.servicio;

const getBarberosServicios = async (req, res) => {
  try {
    const barberosServicios = await getModel().findAll({
      include: [
        { model: getBarbero(), as: 'barbero', attributes: ['id', 'nombre_publico'] },
        { model: getServicio(), as: 'servicio', attributes: ['id', 'nombre'] }
      ]
    });
    res.status(200).json(barberosServicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBarberoServicioById = async (req, res) => {
  try {
    const barberoServicio = await getModel().findByPk(req.params.id, {
      include: [
        { model: getBarbero(), as: 'barbero', attributes: ['id', 'nombre_publico'] },
        { model: getServicio(), as: 'servicio', attributes: ['id', 'nombre'] }
      ]
    });
    if (!barberoServicio) return res.status(404).json({ error: 'Relación barbero-servicio no encontrada' });
    res.status(200).json(barberoServicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBarberoServicio = async (req, res) => {
  try {
    const barberoServicio = await getModel().create(req.body);
    res.status(201).json(barberoServicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateBarberoServicio = async (req, res) => {
  try {
    const barberoServicio = await getModel().findByPk(req.params.id);
    if (!barberoServicio) return res.status(404).json({ error: 'Relación barbero-servicio no encontrada' });
    await barberoServicio.update(req.body);
    res.status(200).json(barberoServicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBarberoServicio = async (req, res) => {
  try {
    const barberoServicio = await getModel().findByPk(req.params.id);
    if (!barberoServicio) return res.status(404).json({ error: 'Relación barbero-servicio no encontrada' });
    await barberoServicio.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getBarberosServicios,
  getBarberoServicioById,
  createBarberoServicio,
  updateBarberoServicio,
  deleteBarberoServicio
};

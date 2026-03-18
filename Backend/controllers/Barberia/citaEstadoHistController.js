const sequelize = require('../../config/database');

const getModel = () => sequelize.models.cita_estado_hist;
const getCita = () => sequelize.models.cita;

const getCitasEstadoHist = async (req, res) => {
  try {
    const historial = await getModel().findAll({
      include: [{ model: getCita(), as: 'cita' }]
    });
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCitaEstadoHistById = async (req, res) => {
  try {
    const historial = await getModel().findByPk(req.params.id, {
      include: [{ model: getCita(), as: 'cita' }]
    });
    if (!historial) return res.status(404).json({ error: 'Historial de estado no encontrado' });
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCitaEstadoHist = async (req, res) => {
  try {
    const historial = await getModel().create(req.body);
    res.status(201).json(historial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCitaEstadoHist = async (req, res) => {
  try {
    const historial = await getModel().findByPk(req.params.id);
    if (!historial) return res.status(404).json({ error: 'Historial de estado no encontrado' });
    await historial.update(req.body);
    res.status(200).json(historial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCitaEstadoHist = async (req, res) => {
  try {
    const historial = await getModel().findByPk(req.params.id);
    if (!historial) return res.status(404).json({ error: 'Historial de estado no encontrado' });
    await historial.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCitasEstadoHist,
  getCitaEstadoHistById,
  createCitaEstadoHist,
  updateCitaEstadoHist,
  deleteCitaEstadoHist
};

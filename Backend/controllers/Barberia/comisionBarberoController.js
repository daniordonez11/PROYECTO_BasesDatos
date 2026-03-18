const sequelize = require('../../config/database');

const getModel = () => sequelize.models.comision_barbero;
const getBarbero = () => sequelize.models.barbero;

const getComisionesBarbero = async (req, res) => {
  try {
    const comisiones = await getModel().findAll({
      include: [{ model: getBarbero(), as: 'barbero', attributes: ['id', 'nombre_publico'] }]
    });
    res.status(200).json(comisiones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComisionBarberoById = async (req, res) => {
  try {
    const comision = await getModel().findByPk(req.params.id, {
      include: [{ model: getBarbero(), as: 'barbero', attributes: ['id', 'nombre_publico'] }]
    });
    if (!comision) return res.status(404).json({ error: 'Comisión no encontrada' });
    res.status(200).json(comision);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createComisionBarbero = async (req, res) => {
  try {
    const comision = await getModel().create(req.body);
    res.status(201).json(comision);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateComisionBarbero = async (req, res) => {
  try {
    const comision = await getModel().findByPk(req.params.id);
    if (!comision) return res.status(404).json({ error: 'Comisión no encontrada' });
    await comision.update(req.body);
    res.status(200).json(comision);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteComisionBarbero = async (req, res) => {
  try {
    const comision = await getModel().findByPk(req.params.id);
    if (!comision) return res.status(404).json({ error: 'Comisión no encontrada' });
    await comision.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getComisionesBarbero,
  getComisionBarberoById,
  createComisionBarbero,
  updateComisionBarbero,
  deleteComisionBarbero
};

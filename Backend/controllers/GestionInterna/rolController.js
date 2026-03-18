const sequelize = require('../../config/database');

const getModel = () => sequelize.models.rol;

const getRoles = async (req, res) => {
  try {
    const roles = await getModel().findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRolById = async (req, res) => {
  try {
    const rol = await getModel().findByPk(req.params.id);
    if (!rol) return res.status(404).json({ error: 'Rol no encontrado' });
    res.status(200).json(rol);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRol = async (req, res) => {
  try {
    const rol = await getModel().create(req.body);
    res.status(201).json(rol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRol = async (req, res) => {
  try {
    const rol = await getModel().findByPk(req.params.id);
    if (!rol) return res.status(404).json({ error: 'Rol no encontrado' });
    await rol.update(req.body);
    res.status(200).json(rol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRol = async (req, res) => {
  try {
    const rol = await getModel().findByPk(req.params.id);
    if (!rol) return res.status(404).json({ error: 'Rol no encontrado' });
    await rol.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol
};

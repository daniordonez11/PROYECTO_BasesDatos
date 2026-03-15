const sequelize = require("../../config/database");
const Cita = sequelize.models.cita;

const createCita = async (req, res) => {
  try {
    const cita = await Cita.create(req.body);
    res.status(201).json(cita || {});
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getCitas = async (req, res) => {
  const where = {};
  try {
    if (req.usuario.rol === "Barbero") {
      where.barbero_id = req.usuario.barbero_id;
    }
    const citas = await Cita.findAll({ where });
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getCitaById = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) {
      return res.status(404).json({
        error: `Cita no encontrada`,
      });
    }
    res.status(200).json(cita);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateCita = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) {
      return res.status(404).json({
        error: `Cita no encontrada`,
      });
    }
    await cita.update(req.body);
    res.status(200).json(cita);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const deleteCita = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) {
      return res.status(404).json({
        error: `Cita no encontrada`,
      });
    }
    await cita.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  createCita,
  getCitas,
  getCitaById,
  updateCita,
  deleteCita,
};

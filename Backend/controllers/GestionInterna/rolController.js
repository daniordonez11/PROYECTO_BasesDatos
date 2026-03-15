const sequelize = require('../../config/database');
const Rol = sequelize.models.rol;

const createRol = async (req, res) => {
    try {
        const rol = await Rol.create(req.body);
        res.status(201).json(rol || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getRols = async (req, res) => {
    try {
        const rols = await Rol.findAll();
        res.status(200).json(rols);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getRolById = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);
        if (!rol) {
            return res.status(404).json({
                error: `Rol no encontrado`
            });
        }
        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateRol = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);
        if (!rol) {
            return res.status(404).json({
                error: `Rol no encontrado`
            });
        }
        await rol.update(req.body);
        res.status(200).json(rol);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteRol = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);
        if (!rol) {
            return res.status(404).json({
                error: `Rol no encontrado`
            });
        }
        await rol.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createRol,
    getRols,
    getRolById,
    updateRol,
    deleteRol
};
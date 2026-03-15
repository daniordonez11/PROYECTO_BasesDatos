const sequelize = require('../../config/database');
const Inventario = sequelize.models.inventario;

const createInventario = async (req, res) => {
    try {
        const inventario = await Inventario.create(req.body);
        res.status(201).json(inventario || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getInventarios = async (req, res) => {
    try {
        const inventarios = await Inventario.findAll();
        res.status(200).json(inventarios);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getInventarioById = async (req, res) => {
    try {
        const inventario = await Inventario.findByPk(req.params.id);
        if (!inventario) {
            return res.status(404).json({
                error: `Inventario no encontrado`
            });
        }
        res.status(200).json(inventario);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateInventario = async (req, res) => {
    try {
        const inventario = await Inventario.findByPk(req.params.id);
        if (!inventario) {
            return res.status(404).json({
                error: `Inventario no encontrado`
            });
        }
        await inventario.update(req.body);
        res.status(200).json(inventario);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteInventario = async (req, res) => {
    try {
        const inventario = await Inventario.findByPk(req.params.id);
        if (!inventario) {
            return res.status(404).json({
                error: `Inventario no encontrado`
            });
        }
        await inventario.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createInventario,
    getInventarios,
    getInventarioById,
    updateInventario,
    deleteInventario
};
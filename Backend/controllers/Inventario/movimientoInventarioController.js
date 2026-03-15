const sequelize = require('../../config/database');
const MovimientoInventario = sequelize.models.movimiento_inventario;

const createMovimientoInventario = async (req, res) => {
    try {
        const movimientoInventario = await MovimientoInventario.create(req.body);
        res.status(201).json(movimientoInventario || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getMovimientoInventarios = async (req, res) => {
    try {
        const movimientoInventarios = await MovimientoInventario.findAll();
        res.status(200).json(movimientoInventarios);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getMovimientoInventarioById = async (req, res) => {
    try {
        const movimientoInventario = await MovimientoInventario.findByPk(req.params.id);
        if (!movimientoInventario) {
            return res.status(404).json({
                error: `MovimientoInventario no encontrado`
            });
        }
        res.status(200).json(movimientoInventario);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateMovimientoInventario = async (req, res) => {
    try {
        const movimientoInventario = await MovimientoInventario.findByPk(req.params.id);
        if (!movimientoInventario) {
            return res.status(404).json({
                error: `MovimientoInventario no encontrado`
            });
        }
        await movimientoInventario.update(req.body);
        res.status(200).json(movimientoInventario);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteMovimientoInventario = async (req, res) => {
    try {
        const movimientoInventario = await MovimientoInventario.findByPk(req.params.id);
        if (!movimientoInventario) {
            return res.status(404).json({
                error: `MovimientoInventario no encontrado`
            });
        }
        await movimientoInventario.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createMovimientoInventario,
    getMovimientoInventarios,
    getMovimientoInventarioById,
    updateMovimientoInventario,
    deleteMovimientoInventario
};
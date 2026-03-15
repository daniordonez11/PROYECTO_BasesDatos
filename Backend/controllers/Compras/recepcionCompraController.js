const sequelize = require('../../config/database');
const RecepcionCompra = sequelize.models.recepcion_compra;

const createRecepcionCompra = async (req, res) => {
    try {
        const recepcionCompra = await RecepcionCompra.create(req.body);
        res.status(201).json(recepcionCompra || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getRecepcionCompras = async (req, res) => {
    try {
        const recepcionCompras = await RecepcionCompra.findAll();
        res.status(200).json(recepcionCompras);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getRecepcionCompraById = async (req, res) => {
    try {
        const recepcionCompra = await RecepcionCompra.findByPk(req.params.id);
        if (!recepcionCompra) {
            return res.status(404).json({
                error: `RecepcionCompra no encontrada`
            });
        }
        res.status(200).json(recepcionCompra);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateRecepcionCompra = async (req, res) => {
    try {
        const recepcionCompra = await RecepcionCompra.findByPk(req.params.id);
        if (!recepcionCompra) {
            return res.status(404).json({
                error: `RecepcionCompra no encontrada`
            });
        }
        await recepcionCompra.update(req.body);
        res.status(200).json(recepcionCompra);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteRecepcionCompra = async (req, res) => {
    try {
        const recepcionCompra = await RecepcionCompra.findByPk(req.params.id);
        if (!recepcionCompra) {
            return res.status(404).json({
                error: `RecepcionCompra no encontrada`
            });
        }
        await recepcionCompra.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createRecepcionCompra,
    getRecepcionCompras,
    getRecepcionCompraById,
    updateRecepcionCompra,
    deleteRecepcionCompra
};
const sequelize = require('../../config/database');
const MetodoPago = sequelize.models.metodo_pago;

const createMetodoPago = async (req, res) => {
    try {
        const metodoPago = await MetodoPago.create(req.body);
        res.status(201).json(metodoPago || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getMetodoPagos = async (req, res) => {
    try {
        const metodoPagos = await MetodoPago.findAll();
        res.status(200).json(metodoPagos);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getMetodoPagoById = async (req, res) => {
    try {
        const metodoPago = await MetodoPago.findByPk(req.params.id);
        if (!metodoPago) {
            return res.status(404).json({
                error: `MetodoPago no encontrado`
            });
        }
        res.status(200).json(metodoPago);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateMetodoPago = async (req, res) => {
    try {
        const metodoPago = await MetodoPago.findByPk(req.params.id);
        if (!metodoPago) {
            return res.status(404).json({
                error: `MetodoPago no encontrado`
            });
        }
        await metodoPago.update(req.body);
        res.status(200).json(metodoPago);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteMetodoPago = async (req, res) => {
    try {
        const metodoPago = await MetodoPago.findByPk(req.params.id);
        if (!metodoPago) {
            return res.status(404).json({
                error: `MetodoPago no encontrado`
            });
        }
        await metodoPago.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createMetodoPago,
    getMetodoPagos,
    getMetodoPagoById,
    updateMetodoPago,
    deleteMetodoPago
};
const sequelize = require('../../config/database');
const CitaPago = sequelize.models.cita_pago;

const createCitaPago = async (req, res) => {
    try {
        const citaPago = await CitaPago.create(req.body);
        res.status(201).json(citaPago || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getCitaPagos = async (req, res) => {
    try {
        const citaPagos = await CitaPago.findAll();
        res.status(200).json(citaPagos);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getCitaPagoById = async (req, res) => {
    try {
        const citaPago = await CitaPago.findByPk(req.params.id);
        if (!citaPago) {
            return res.status(404).json({
                error: `CitaPago no encontrado`
            });
        }
        res.status(200).json(citaPago);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateCitaPago = async (req, res) => {
    try {
        const citaPago = await CitaPago.findByPk(req.params.id);
        if (!citaPago) {
            return res.status(404).json({
                error: `CitaPago no encontrado`
            });
        }
        await citaPago.update(req.body);
        res.status(200).json(citaPago);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteCitaPago = async (req, res) => {
    try {
        const citaPago = await CitaPago.findByPk(req.params.id);
        if (!citaPago) {
            return res.status(404).json({
                error: `CitaPago no encontrado`
            });
        }
        await citaPago.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createCitaPago,
    getCitaPagos,
    getCitaPagoById,
    updateCitaPago,
    deleteCitaPago
};
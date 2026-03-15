const sequelize = require('../../config/database');
const RecepcionCompraDet = sequelize.models.recepcion_compra_det;

const createRecepcionCompraDet = async (req, res) => {
    try {
        const recepcionCompraDet = await RecepcionCompraDet.create(req.body);
        res.status(201).json(recepcionCompraDet || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getRecepcionCompraDets = async (req, res) => {
    try {
        const recepcionCompraDets = await RecepcionCompraDet.findAll();
        res.status(200).json(recepcionCompraDets);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getRecepcionCompraDetById = async (req, res) => {
    try {
        const recepcionCompraDet = await RecepcionCompraDet.findByPk(req.params.id);
        if (!recepcionCompraDet) {
            return res.status(404).json({
                error: `RecepcionCompraDet no encontrado`
            });
        }
        res.status(200).json(recepcionCompraDet);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateRecepcionCompraDet = async (req, res) => {
    try {
        const recepcionCompraDet = await RecepcionCompraDet.findByPk(req.params.id);
        if (!recepcionCompraDet) {
            return res.status(404).json({
                error: `RecepcionCompraDet no encontrado`
            });
        }
        await recepcionCompraDet.update(req.body);
        res.status(200).json(recepcionCompraDet);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteRecepcionCompraDet = async (req, res) => {
    try {
        const recepcionCompraDet = await RecepcionCompraDet.findByPk(req.params.id);
        if (!recepcionCompraDet) {
            return res.status(404).json({
                error: `RecepcionCompraDet no encontrado`
            });
        }
        await recepcionCompraDet.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createRecepcionCompraDet,
    getRecepcionCompraDets,
    getRecepcionCompraDetById,
    updateRecepcionCompraDet,
    deleteRecepcionCompraDet
};
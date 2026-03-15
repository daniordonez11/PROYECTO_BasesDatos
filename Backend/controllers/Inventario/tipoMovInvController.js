const sequelize = require('../../config/database');
const TipoMovInv = sequelize.models.tipo_mov_inv;

const createTipoMovInv = async (req, res) => {
    try {
        const tipoMovInv = await TipoMovInv.create(req.body);
        res.status(201).json(tipoMovInv || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getTipoMovInvs = async (req, res) => {
    try {
        const tipoMovInvs = await TipoMovInv.findAll();
        res.status(200).json(tipoMovInvs);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getTipoMovInvById = async (req, res) => {
    try {
        const tipoMovInv = await TipoMovInv.findByPk(req.params.id);
        if (!tipoMovInv) {
            return res.status(404).json({
                error: `TipoMovInv no encontrado`
            });
        }
        res.status(200).json(tipoMovInv);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateTipoMovInv = async (req, res) => {
    try {
        const tipoMovInv = await TipoMovInv.findByPk(req.params.id);
        if (!tipoMovInv) {
            return res.status(404).json({
                error: `TipoMovInv no encontrado`
            });
        }
        await tipoMovInv.update(req.body);
        res.status(200).json(tipoMovInv);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteTipoMovInv = async (req, res) => {
    try {
        const tipoMovInv = await TipoMovInv.findByPk(req.params.id);
        if (!tipoMovInv) {
            return res.status(404).json({
                error: `TipoMovInv no encontrado`
            });
        }
        await tipoMovInv.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createTipoMovInv,
    getTipoMovInvs,
    getTipoMovInvById,
    updateTipoMovInv,
    deleteTipoMovInv
};
const sequelize = require('../../config/database');
const ComisionBarbero = sequelize.models.comision_barbero;

const createComisionBarbero = async (req, res) => {
    try {
        const comisionBarbero = await ComisionBarbero.create(req.body);
        res.status(201).json(comisionBarbero || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getComisionBarberos = async (req, res) => {
    try {
        const comisionBarberos = await ComisionBarbero.findAll();
        res.status(200).json(comisionBarberos);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getComisionBarberoById = async (req, res) => {
    try {
        const comisionBarbero = await ComisionBarbero.findByPk(req.params.id);
        if (!comisionBarbero) {
            return res.status(404).json({
                error: `ComisionBarbero no encontrado`
            });
        }
        res.status(200).json(comisionBarbero);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateComisionBarbero = async (req, res) => {
    try {
        const comisionBarbero = await ComisionBarbero.findByPk(req.params.id);
        if (!comisionBarbero) {
            return res.status(404).json({
                error: `ComisionBarbero no encontrado`
            });
        }
        await comisionBarbero.update(req.body);
        res.status(200).json(comisionBarbero);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteComisionBarbero = async (req, res) => {
    try {
        const comisionBarbero = await ComisionBarbero.findByPk(req.params.id);
        if (!comisionBarbero) {
            return res.status(404).json({
                error: `ComisionBarbero no encontrado`
            });
        }
        await comisionBarbero.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createComisionBarbero,
    getComisionBarberos,
    getComisionBarberoById,
    updateComisionBarbero,
    deleteComisionBarbero
};
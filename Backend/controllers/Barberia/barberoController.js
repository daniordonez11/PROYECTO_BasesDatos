const sequelize = require('../../config/database');
const Barbero = sequelize.models.barbero;

const createBarbero = async (req, res) => {
    try {
        const barbero = await Barbero.create(req.body);
        res.status(201).json(barbero || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getBarberos = async (req, res) => {
    try {
        const barberos = await Barbero.findAll();
        res.status(200).json(barberos);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getBarberoById = async (req, res) => {
    try {
        const barbero = await Barbero.findByPk(req.params.id);
        if (!barbero) {
            return res.status(404).json({
                error: `Barbero no encontrado`
            });
        }
        res.status(200).json(barbero);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateBarbero = async (req, res) => {
    try {
        const barbero = await Barbero.findByPk(req.params.id);
        if (!barbero) {
            return res.status(404).json({
                error: `Barbero no encontrado`
            });
        }
        await barbero.update(req.body);
        res.status(200).json(barbero);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteBarbero = async (req, res) => {
    try {
        const barbero = await Barbero.findByPk(req.params.id);
        if (!barbero) {
            return res.status(404).json({
                error: `Barbero no encontrado`
            });
        }
        await barbero.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createBarbero,
    getBarberos,
    getBarberoById,
    updateBarbero,
    deleteBarbero
};
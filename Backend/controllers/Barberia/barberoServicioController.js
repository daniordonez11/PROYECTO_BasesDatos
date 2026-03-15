const sequelize = require('../../config/database');
const BarberoServicio = sequelize.models.barbero_servicio;

const createBarberoServicio = async (req, res) => {
    try {
        const barberoServicio = await BarberoServicio.create(req.body);
        res.status(201).json(barberoServicio || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getBarberoServicios = async (req, res) => {
    try {
        const barberoServicios = await BarberoServicio.findAll();
        res.status(200).json(barberoServicios);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getBarberoServicioById = async (req, res) => {
    try {
        const barberoServicio = await BarberoServicio.findByPk(req.params.id);
        if (!barberoServicio) {
            return res.status(404).json({
                error: `BarberoServicio no encontrado`
            });
        }
        res.status(200).json(barberoServicio);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateBarberoServicio = async (req, res) => {
    try {
        const barberoServicio = await BarberoServicio.findByPk(req.params.id);
        if (!barberoServicio) {
            return res.status(404).json({
                error: `BarberoServicio no encontrado`
            });
        }
        await barberoServicio.update(req.body);
        res.status(200).json(barberoServicio);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteBarberoServicio = async (req, res) => {
    try {
        const barberoServicio = await BarberoServicio.findByPk(req.params.id);
        if (!barberoServicio) {
            return res.status(404).json({
                error: `BarberoServicio no encontrado`
            });
        }
        await barberoServicio.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createBarberoServicio,
    getBarberoServicios,
    getBarberoServicioById,
    updateBarberoServicio,
    deleteBarberoServicio
};
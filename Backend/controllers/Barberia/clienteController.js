const sequelize = require('../../config/database');
const Cliente = sequelize.models.cliente;

const createCliente = async (req, res) => {
    try {
        const cliente = await Cliente.create(req.body);
        res.status(201).json(cliente || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getClienteById = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({
                error: `Cliente no encontrado`
            });
        }
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({
                error: `Cliente no encontrado`
            });
        }
        await cliente.update(req.body);
        res.status(200).json(cliente);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({
                error: `Cliente no encontrado`
            });
        }
        await cliente.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createCliente,
    getClientes,
    getClienteById,
    updateCliente,
    deleteCliente
};
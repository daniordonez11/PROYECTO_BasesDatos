const sequelize = require('../../config/database');

const createSucursal = async (req, res) => {
    try {
        const Sucursal = sequelize.models.sucursal;
        const sucursal = await Sucursal.create(req.body);
        res.status(201).json(sucursal || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getSucursals = async (req, res) => {
    try {
        const Sucursal = sequelize.models.sucursal;
        const sucursal = await Sucursal.findAll();
        res.status(200).json(sucursal);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getSucursalById = async (req, res) => {
    try {
        const Sucursal = sequelize.models.sucursal;
        const sucursal = await Sucursal.findByPk(req.params.id);
        if (!sucursal){
            return res.status(404).json({
                error: `sucursalo no encontrado`
            })
        }

        res.status(200).json(sucursal);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateSucursal = async (req, res) => {
    try {
        const Sucursal = sequelize.models.sucursal;
        const sucursal = await Sucursal.findByPk(req.params.id);
        if (!sucursal){
            return res.status(404).json({
                error: `sucursalo no encontrado`
            })
        }

        await sucursal.update(req.body);
        res.status(200).json(sucursal);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteSucursal = async (req, res) => {
    try {
        const Sucursal = sequelize.models.sucursal;
        const sucursal = await Sucursal.findByPk(req.params.id);
        if (!sucursal){
            return res.status(404).json({
                error: `sucursalo no encontrado`
            })
        }

        await sucursal.destroy(req.body);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createSucursal,
    getSucursals,
    getSucursalById,
    updateSucursal,
    deleteSucursal
}
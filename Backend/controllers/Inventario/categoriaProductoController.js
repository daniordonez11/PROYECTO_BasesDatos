const sequelize = require('../../config/database');
const CategoriaProducto = sequelize.models.categoria_producto;

const createCategoriaProducto = async (req, res) => {
    try {
        const categoriaProducto = await CategoriaProducto.create(req.body);
        res.status(201).json(categoriaProducto || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getCategoriaProductos = async (req, res) => {
    try {
        const categoriaProductos = await CategoriaProducto.findAll();
        res.status(200).json(categoriaProductos);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getCategoriaProductoById = async (req, res) => {
    try {
        const categoriaProducto = await CategoriaProducto.findByPk(req.params.id);
        if (!categoriaProducto) {
            return res.status(404).json({
                error: `CategoriaProducto no encontrado`
            });
        }
        res.status(200).json(categoriaProducto);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateCategoriaProducto = async (req, res) => {
    try {
        const categoriaProducto = await CategoriaProducto.findByPk(req.params.id);
        if (!categoriaProducto) {
            return res.status(404).json({
                error: `CategoriaProducto no encontrado`
            });
        }
        await categoriaProducto.update(req.body);
        res.status(200).json(categoriaProducto);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteCategoriaProducto = async (req, res) => {
    try {
        const categoriaProducto = await CategoriaProducto.findByPk(req.params.id);
        if (!categoriaProducto) {
            return res.status(404).json({
                error: `CategoriaProducto no encontrado`
            });
        }
        await categoriaProducto.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createCategoriaProducto,
    getCategoriaProductos,
    getCategoriaProductoById,
    updateCategoriaProducto,
    deleteCategoriaProducto
};
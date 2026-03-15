const sequelize = require('../../config/database');
const Producto = sequelize.models.producto;

const createProducto = async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json(producto || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({
                error: `Producto no encontrado`
            });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({
                error: `Producto no encontrado`
            });
        }
        await producto.update(req.body);
        res.status(200).json(producto);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({
                error: `Producto no encontrado`
            });
        }
        await producto.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createProducto,
    getProductos,
    getProductoById,
    updateProducto,
    deleteProducto
};
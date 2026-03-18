const sequelize = require('../../config/database');

const getModel = () => sequelize.models.producto;
const getCategoriaProducto = () => sequelize.models.categoria_producto;

const getProductos = async (req, res) => {
  try {
    const productos = await getModel().findAll({
      include: [{ model: getCategoriaProducto(), as: 'categoria', attributes: ['id', 'nombre'] }]
    });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductoById = async (req, res) => {
  try {
    const producto = await getModel().findByPk(req.params.id, {
      include: [{ model: getCategoriaProducto(), as: 'categoria', attributes: ['id', 'nombre'] }]
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProducto = async (req, res) => {
  try {
    const producto = await getModel().create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProducto = async (req, res) => {
  try {
    const producto = await getModel().findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    await producto.update(req.body);
    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const producto = await getModel().findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    await producto.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFormData = async (req, res) => {
  try {
    const categorias = await getCategoriaProducto().findAll();
    res.json({ categorias });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getFormData
};

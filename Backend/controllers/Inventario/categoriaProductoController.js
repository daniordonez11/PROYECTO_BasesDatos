const sequelize = require('../../config/database');

const getModel = () => sequelize.models.categoria_producto;

const getCategoriasProducto = async (req, res) => {
  try {
    const categorias = await getModel().findAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoriaProductoById = async (req, res) => {
  try {
    const categoria = await getModel().findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría de producto no encontrada' });
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategoriaProducto = async (req, res) => {
  try {
    const categoria = await getModel().create(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategoriaProducto = async (req, res) => {
  try {
    const categoria = await getModel().findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría de producto no encontrada' });
    await categoria.update(req.body);
    res.status(200).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCategoriaProducto = async (req, res) => {
  try {
    const categoria = await getModel().findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría de producto no encontrada' });
    await categoria.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCategoriasProducto,
  getCategoriaProductoById,
  createCategoriaProducto,
  updateCategoriaProducto,
  deleteCategoriaProducto
};

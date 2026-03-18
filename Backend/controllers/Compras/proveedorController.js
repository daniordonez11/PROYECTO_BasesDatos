const sequelize = require('../../config/database');

const getModel = () => sequelize.models.proveedor;

const getProveedores = async (req, res) => {
  try {
    const proveedores = await getModel().findAll();
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProveedorById = async (req, res) => {
  try {
    const proveedor = await getModel().findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProveedor = async (req, res) => {
  try {
    const proveedor = await getModel().create(req.body);
    res.status(201).json(proveedor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProveedor = async (req, res) => {
  try {
    const proveedor = await getModel().findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
    await proveedor.update(req.body);
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProveedor = async (req, res) => {
  try {
    const proveedor = await getModel().findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
    await proveedor.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
};

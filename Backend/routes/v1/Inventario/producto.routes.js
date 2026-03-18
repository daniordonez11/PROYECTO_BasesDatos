const express = require(`express`);
const router = express.Router();
const productoController = require(`../../../controllers/Inventario/ProductoController`);
const { verificarToken, soloAdmin } = require('../../../middleware/auth');

router.use(verificarToken, soloAdmin);

router.post(`/`, productoController.createProducto);
router.get(`/`, productoController.getProductos);
router.get(`/form-data`, productoController.getFormData);
router.get(`/:id`, productoController.getProductoById);
router.put(`/:id`, productoController.updateProducto);
router.delete(`/:id`, productoController.deleteProducto);

module.exports = router;
const express = require(`express`);
const router = express.Router();
const inventarioController = require(`../../../controllers/Inventario/inventarioController`);
const { verificarToken, soloAdmin } = require('../../../middleware/auth');

router.use(verificarToken, soloAdmin);

router.get('/movimientos', inventarioController.getMovimientos);
router.post(`/`, inventarioController.createInventario);
router.get(`/`, inventarioController.getInventarios);
router.get(`/:id`, inventarioController.getInventarioById);
router.put(`/:id`, inventarioController.updateInventario);
router.delete(`/:id`, inventarioController.deleteInventario);

module.exports = router;
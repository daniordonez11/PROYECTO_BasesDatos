// routes/v1/Configuracion/impuesto.routes.js
const { Router } = require('express');
const router = Router();
const impuestoController = require('../../../controllers/Configuracion/impuestoController');
const { verificarToken, soloAdmin } = require('../../../middleware/auth');

router.use(verificarToken, soloAdmin);

router.get('/',     impuestoController.getImpuestos);
router.get('/:id',  impuestoController.getImpuestoById);
router.post('/',    impuestoController.createImpuesto);
router.put('/:id',  impuestoController.updateImpuesto);
router.delete('/:id', impuestoController.deleteImpuesto);

module.exports = router;
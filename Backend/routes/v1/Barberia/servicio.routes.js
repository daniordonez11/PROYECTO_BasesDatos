const { Router } = require('express');
const router = Router();
const serviciosController = require('../../../controllers/Barberia/serviciosController');
const { verificarToken, soloAdmin } = require('../../../middleware/auth');

router.use(verificarToken, soloAdmin);

router.get('/',     serviciosController.getServicios);
router.get('/:id',  serviciosController.getServicioById);
router.post('/',    serviciosController.createServicio);
router.put('/:id',  serviciosController.updateServicio);
router.delete('/:id', serviciosController.deleteServicio);

module.exports = router;
const { Router } = require('express');
const router = Router();
const clienteController = require('../../../controllers/Barberia/clienteController');
const { verificarToken, soloAdmin } = require('../../../middleware/auth');

router.use(verificarToken, soloAdmin);

router.get('/',     clienteController.getClientes);
router.get('/:id',  clienteController.getClienteById);
router.post('/',    clienteController.createCliente);
router.put('/:id',  clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;
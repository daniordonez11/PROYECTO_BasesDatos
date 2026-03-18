// routes/v1/Barberia/cita.routes.js
const { Router } = require('express');
const router = Router();
const citaController = require('../../../controllers/Barberia/citaController');
const reciboController = require('../../../controllers/Barberia/reciboController');
const { verificarToken } = require('../../../middleware/auth');

router.use(verificarToken);

router.get('/form-data',      citaController.getFormData);
router.get('/buscar-clientes', citaController.buscarClientes);
router.get('/:id/recibo',       reciboController.generarRecibo);
router.get('/',               citaController.getCitas);
router.get('/:id',            citaController.getCitaById);
router.post('/',              citaController.createCita);
router.put('/:id/estado',     citaController.updateEstadoCita);
router.delete('/:id',         citaController.deleteCita);

module.exports = router;
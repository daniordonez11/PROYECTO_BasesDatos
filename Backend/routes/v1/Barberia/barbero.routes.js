const express = require(`express`);
const router = express.Router();
const barberoController = require(`../../../controllers/Barberia/barberoController`);
const { verificarToken, soloAdmin } = require('../../../middleware/auth');

router.use(verificarToken, soloAdmin);

router.post(`/`, barberoController.createBarbero);
router.get(`/`, barberoController.getBarberos);
router.get(`/:id`, barberoController.getBarberoById);
router.put(`/:id`, barberoController.updateBarbero);
router.delete(`/:id`, barberoController.deleteBarbero);
router.get('/usuarios-disponibles', barberoController.getUsuariosDisponibles);

module.exports = router;
const express = require(`express`);
const router = express.Router();
const usuarioController = require(`../../../controllers/GestionInterna/usuarioController`);
const { verificarToken, soloAdmin } = require('../../middlewares/auth');

router.use(verificarToken, soloAdmin); 
router.get('/',      usuarioController.getUsuarios);
router.post('/',      usuarioController.createUsuario);
router.put('/:id',    usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;
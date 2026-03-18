const { Router } = require('express');
const router = Router();
const usuarioController = require('../../../controllers/GestionInterna/usuarioController');
const { verificarToken, soloAdmin } = require('../../../middleware/auth'); // ← corregir path

router.use(verificarToken, soloAdmin);

router.get('/roles',  usuarioController.getRoles);  // ← antes del /:id
router.get('/',       usuarioController.getUsuarios);
router.get('/:id',    usuarioController.getUsuarioById);
router.post('/',      usuarioController.createUsuario);
router.put('/:id',    usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;
const { Router } = require("express");
const { login, logout, me } = require("../../../controllers/Auth/authController");
const { verificarToken, soloAdmin } = require('../../../middleware/auth');

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verificarToken, me);

module.exports = router;
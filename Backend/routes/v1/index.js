const { Router } = require('express');
const sucursalRoutes = require('./GestionInterna/sucursal.Routes');
const authRoutes = require("./Auth/auth.routes");
const { verificarToken, soloAdmin } = require('../../middleware/auth');

const router = Router();

router.use("/auth", authRoutes);

router.use('/sucursales', verificarToken, sucursalRoutes);

module.exports = router;

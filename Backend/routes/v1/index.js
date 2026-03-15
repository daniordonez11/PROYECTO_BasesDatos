const { Router } = require('express');
const sucursalRoutes = require('./Organizacion/sucursal.Routes');
const authRoutes = require("./auth.routes");

const router = Router();

router.use("/auth", authRoutes);

router.use('/sucursales', sucursalRoutes);

module.exports = router;

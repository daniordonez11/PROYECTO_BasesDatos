const { Router } = require('express');
const sucursalRoutes = require('./Organizacion/sucursal.Routes');

const router = Router();

router.use('/sucursales', sucursalRoutes);

module.exports = router;

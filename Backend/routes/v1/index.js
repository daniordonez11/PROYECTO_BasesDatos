const { Router } = require('express');
const sucursalRoutes = require('./GestionInterna/sucursal.Routes');
const barberosRoutes = require('./Barberia/barbero.routes');
const serviciosRoutes = require('./Barberia/servicio.routes');
const clientesRoutes = require('./Barberia/cliente.routes');
const usuariosRoutes = require('./GestionInterna/usuarios.Routes');
const authRoutes = require("./Auth/auth.routes");
const dashboardRoutes = require('./GestionInterna/dashboard.routes');
const {  soloAdmin } = require('../../middleware/auth');

const router = Router();

router.use("/auth", authRoutes);
router.use('/barberos',  barberosRoutes);
router.use('/usuarios',  usuariosRoutes);
router.use('/servicios',  serviciosRoutes);
router.use('/clientes',  clientesRoutes);
router.use('/sucursales',  sucursalRoutes);
router.use('/impuestos',  require('./Configuracion/impuesto.routes'));
router.use('/dashboard', dashboardRoutes);
router.use('/citas',  require('./Barberia/cita.routes'));
router.use('/productos',  require('./Inventario/producto.routes'));
router.use('/inventario',  require('./Inventario/inventario.routes'));

module.exports = router;

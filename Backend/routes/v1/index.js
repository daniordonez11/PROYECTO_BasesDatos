const { Router } = require('express');
const sucursalRoutes = require('./GestionInterna/sucursal.Routes');
const barberosRoutes = require('./Barberia/barbero.routes');
const serviciosRoutes = require('./Barberia/servicio.routes');
const clientesRoutes = require('./Barberia/cliente.routes');
const usuariosRoutes = require('./GestionInterna/usuarios.Routes');
const authRoutes = require("./Auth/auth.routes");
const dashboardRoutes = require('./GestionInterna/dashboard.routes');
const { verificarToken, soloAdmin } = require('../../middleware/auth');

const router = Router();

router.use("/auth", authRoutes);
router.use('/barberos', verificarToken, barberosRoutes);
router.use('/usuarios', verificarToken, usuariosRoutes);
router.use('/servicios', verificarToken, serviciosRoutes);
router.use('/clientes', verificarToken, clientesRoutes);
router.use('/sucursales', verificarToken, sucursalRoutes);
router.use('/impuestos', verificarToken, require('./Configuracion/impuesto.routes'));
router.use('/dashboard', dashboardRoutes);
router.use('/citas', verificarToken, require('./Barberia/cita.routes'));
router.use('/productos',  verificarToken ,require('./Inventario/producto.routes'));
router.use('/inventario',  verificarToken ,require('./Inventario/inventario.routes'));

module.exports = router;

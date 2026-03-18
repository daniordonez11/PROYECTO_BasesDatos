// routes/v1/dashboard.routes.js
const { Router } = require('express');
const router = Router();
const { getDashboard } = require('../../../controllers/GestionInterna/dashboardController');
const { verificarToken } = require('../../../middleware/auth');
 
router.use(verificarToken);
router.get('/', getDashboard);
 
module.exports = router;

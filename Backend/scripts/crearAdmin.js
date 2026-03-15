require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
require('../models')(sequelize, DataTypes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la BD');

    // 1. Crear rol
    const [rol] = await sequelize.models.rol.findOrCreate({
      where: { nombre: 'Administrador' }
    });
    console.log('✅ Rol:', rol.nombre);

    // 2. Crear usuario admin
    const hash = await bcrypt.hash('admin123', 10);
    const [user, created] = await sequelize.models.usuario.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        nombre:        'Administrador',
        email:         'admin@paris.com',
        hash_password: hash,
        rol_id:        rol.id,
        is_activo:     true
      }
    });

    console.log(created ? '✅ Usuario admin creado' : '⚠️  El usuario admin ya existía');
    console.log('─────────────────────────');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('─────────────────────────');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
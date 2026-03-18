// seeders/seed.js
const bcrypt = require('bcryptjs');

module.exports = async (sequelize) => {
  const {
    rol, sucursal, metodo_pago, tipo_mov_inv,
    categoria_producto, usuario
  } = sequelize.models;
  

  // ── Roles ────────────────────────────────────
  const rolesExisten = await rol.count();
  if (!rolesExisten) {
    await rol.findOrCreate({ where: { nombre: 'Administrador' } });
  await rol.findOrCreate({ where: { nombre: 'Barbero' } });
  console.log('✅ Roles verificados');
    console.log('✅ Roles creados');
  }

  const todosRoles = await rol.findAll();
  console.log('Roles en BD:', todosRoles.map(r => r.nombre));

  const serviciosExisten = await sequelize.models.servicio.count();
  if (!serviciosExisten) {
    await sequelize.models.servicio.bulkCreate([
      {
        nombre:        'Corte de cabello',
        descripcion:   'Corte clásico con tijera y máquina',
        duracion_aprox: 30,
        precio_base:   150.00,
        estado:        true
      },
      {
        nombre:        'Corte de barba',
        descripcion:   'Corte y diseño de barba con navaja y máquina',
        duracion_aprox: 20,
        precio_base:   100.00,
        estado:        true
      },
      {
        nombre:        'Corte de cabello y barba',
        descripcion:   'Corte y diseño de cabello y barba con tijera, navaja y máquina',
        duracion_aprox: 50,
        precio_base:   230.00,
        estado:        true
      },
      {
        nombre:        'Limpieza facial',
        descripcion:   'Limpieza profunda de la cara con productos especializados',
        duracion_aprox: 30,
        precio_base:   120.00,
        estado:        true
      }
    ]);
    console.log('✅ Servicio de ejemplo creado');
  }
  
  const impuestosExisten = await sequelize.models.impuesto.count();
if (!impuestosExisten) {
  await sequelize.models.impuesto.bulkCreate([
    { nombre: 'ISV 15%', tasa: 0.15, es_incluido: false, estado: true },
    { nombre: 'Exento',  tasa: 0.00, es_incluido: false, estado: true },
  ]);
  console.log('✅ Impuestos creados');
}

  // ── Sucursales ───────────────────────────────
  const sucursalesExisten = await sucursal.count();
  if (!sucursalesExisten) {
    await sucursal.bulkCreate([
      { nombre: 'CA13', direccion: 'Plaza frente a Ferromax, carretera CA13', telefono: '12345678' },
      { nombre: 'Parque Central', direccion: 'Parque Central, frente a Rivasy', telefono: '00000000' },
    ]);
    console.log('✅ Sucursales creadas');
  }

  // ── Métodos de pago ──────────────────────────
  const metodosExisten = await metodo_pago.count();
  if (!metodosExisten) {
    await metodo_pago.bulkCreate([
      { nombre: 'Efectivo' },
      { nombre: 'Transferencia' },
      { nombre: 'Tarjeta' },
    ]);
    console.log('✅ Métodos de pago creados');
  }

  // ── Tipos de movimiento inventario ───────────
  const tiposExisten = await tipo_mov_inv.count();
  if (!tiposExisten) {
    await tipo_mov_inv.bulkCreate([
      { nombre: 'ENTRADA', signo: 1 },
      { nombre: 'SALIDA',  signo: -1 },
      { nombre: 'AJUSTE',  signo: 1 },
    ]);
    console.log('✅ Tipos de movimiento creados');
  }

  // ── Categorías de producto ───────────────────
  const categoriasExisten = await categoria_producto.count();
  if (!categoriasExisten) {
    await categoria_producto.bulkCreate([
      { nombre: 'General' },
      { nombre: 'Cuidado capilar' },
      { nombre: 'Cuidado de barba' },
    ]);
    console.log('✅ Categorías creadas');
  }
  
  const adminExiste = await usuario.findOne({ where: { username: 'admin' } });
  if (!adminExiste) {
    const rolAdmin = await rol.findOne({ where: { nombre: 'Administrador' } });
    if (!rolAdmin) {
      console.log('❌ Rol Administrador no encontrado, saltando creación de admin');
      return;
    }
    const hash = await bcrypt.hash('admin123', 10);
    await usuario.create({
      username:      'admin',
      nombre:        'Administrador',
      email:         'admin@paris.com',
      hash_password: hash,
      rol_id:        rolAdmin.id,
      is_activo:     true
    });
    console.log('✅ Usuario admin creado (admin / admin123)');
  }

  const barberoExiste = await sequelize.models.barbero.count();
  if (!barberoExiste) {
    const rolBarbero = await rol.findOne({ where: { nombre: 'Barbero' } });
    if (!rolBarbero) {
      console.log('❌ Rol Barbero no encontrado, saltando creación de barbero');
      return; // ← faltaba esto
    }
    const hash = await bcrypt.hash('barbero123', 10);
    const usuarioBarbero = await usuario.create({
      username:      'carlos_barbero',
      nombre:        'Carlos Mendoza',
      email:         'carlos@paris.com',
      hash_password: hash,
      rol_id:        rolBarbero.id,
      is_activo:     true
    });
    await sequelize.models.barbero.create({
      usuario_id:     usuarioBarbero.id,
      nombre_publico: 'El Maestro Carlos',
      estado:         true
    });
    console.log('✅ Barbero de ejemplo creado (carlos_barbero / barbero123)');
  }

};
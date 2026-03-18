
// models/index.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  // 1) Cargar TODOS los modelos
  const sucursal            = require('./sucursal')(sequelize, DataTypes);
  const rol                 = require('./rol')(sequelize, DataTypes);
  const usuario             = require('./usuario')(sequelize, DataTypes);
  const metodo_pago         = require('./metodo_pago')(sequelize, DataTypes);
  const impuesto            = require('./impuesto')(sequelize, DataTypes);
  const servicio            = require('./servicios')(sequelize, DataTypes);
  const barbero             = require('./barbero')(sequelize, DataTypes);
  // const barbero_servicio    = require('./barbero_servicio')(sequelize, DataTypes);
  const cliente             = require('./cliente')(sequelize, DataTypes);
  const cita                = require('./cita')(sequelize, DataTypes);
  const cita_estado_hist    = require('./cita_estado_hist')(sequelize, DataTypes);
  const cita_pago           = require('./cita_pago')(sequelize, DataTypes);
  const categoria_producto  = require('./categoria_producto')(sequelize, DataTypes);
  const producto            = require('./producto')(sequelize, DataTypes);
  const inventario          = require('./inventario')(sequelize, DataTypes);
  const tipo_mov_inv        = require('./tipo_mov_inv')(sequelize, DataTypes);
  const movimiento_inventario = require('./movimiento_inventario')(sequelize, DataTypes);
  // const proveedor           = require('./proveedor')(sequelize, DataTypes);
  // const recepcion_compra    = require('./recepcion_compra')(sequelize, DataTypes);
  // const recepcion_compra_det= require('./recepcion_compra_det')(sequelize, DataTypes);
  const cita_servicio = require('./cita_servicio')(sequelize, DataTypes);

  // 2) Registrar asociaciones (llama associate si existe)
  const models = sequelize.models; // Sequelize guarda aquí los modelos por modelName

  Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  });

  // Opcional: retornar el objeto models por comodidad
  return models;
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recepcion_compra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
      this.belongsTo(models.sucursal,  { foreignKey: 'sucursal_id',  as: 'sucursal'  });
      this.belongsTo(models.usuario,   { foreignKey: 'usuario_id',   as: 'usuario'   });
      this.hasMany(models.recepcion_compra_det, { foreignKey: 'recepcion_id', as: 'detalles', onDelete: 'CASCADE' });
    }
  }
  recepcion_compra.init({
    proveedor_id: { type: DataTypes.INTEGER, allowNull: false },
    sucursal_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
    impuesto: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
    total: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
    notas: { type: DataTypes.STRING(200), allowNull: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'recepcion_compra',
    tableName: 'recepcion_compras',
    underscored: true
  });
  return recepcion_compra;
};
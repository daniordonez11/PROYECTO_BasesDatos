'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.categoria_producto, {
        foreignKey: "categoria_id",
        as: "categoria",
      });
      this.hasMany(models.inventario, {
        foreignKey: "producto_id",
        as: "inventario",
      });
      this.hasMany(models.movimiento_inventario, {
        foreignKey: "producto_id",
        as: "movimiento_inventario",
      });
      this.hasMany(models.recepcion_compra_det, {
        foreignKey: "producto_id",
        as: "recepcion_compra_det",
      });
    }
  }
  producto.init({
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    categoria_id: { type: DataTypes.INTEGER, allowNull: false },
    codigo_barras: { type: DataTypes.STRING(60), unique: true },
    costo_ult_compra: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    precio_venta: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    controla_caducidad: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    sequelize,
    modelName: 'producto',
    tableName: 'productos',
    underscored: true
  });
  return producto;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.producto, {
        foreignKey: "producto_id",
        as: "producto",
        onDelete: 'CASCADE'
      });
      this.belongsTo(models.sucursal, {
        foreignKey: "sucursal_id",
        as: "sucursal",
        onDelete: 'CASCADE'
      });
    }
  }
  inventario.init({
    producto_id: { type: DataTypes.INTEGER, allowNull: false },
    sucursal_id: { type: DataTypes.INTEGER, allowNull: false },
    stock: { type: DataTypes.DECIMAL(18, 6), allowNull: false, defaultValue: 0 },
    stock_min: { type: DataTypes.DECIMAL(18, 6), allowNull: false, defaultValue: 0 },
    stock_max: { type: DataTypes.DECIMAL(18, 6), allowNull: false, defaultValue: 0 }
  }, {
    sequelize,
    modelName: 'inventario',
    tableName: 'inventarios',
    underscored: true,
  });
  return inventario;
};
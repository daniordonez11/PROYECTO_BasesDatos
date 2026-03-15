"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class movimiento_inventario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.producto, {
        foreignKey: "producto_id",
        as: "producto",
      });
      this.belongsTo(models.sucursal, {
        foreignKey: "sucursal_id",
        as: "sucursal",
      });
      this.belongsTo(models.tipo_mov_inv, {
        foreignKey: "tipo_id",
        as: "tipo",
      });
      this.belongsTo(models.usuario, {
        foreignKey: "usuario_id",
        as: "usuario",
        constraints: false,
      });
    }
  }
  movimiento_inventario.init(
    {
      producto_id: { type: DataTypes.INTEGER, allowNull: false },
      sucursal_id: { type: DataTypes.INTEGER, allowNull: false },
      fecha: { type: DataTypes.DATE, allowNull: false },
      tipo_id: { type: DataTypes.INTEGER, allowNull: false },
      cantidad: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
      costo_unitario: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
      referencia_tipo: { type: DataTypes.STRING, allowNull: true },
      referencia_id: { type: DataTypes.INTEGER, allowNull: true },
      nota: { type: DataTypes.STRING, allowNull: true },
      usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "movimiento_inventario",
      tableName: "movimiento_inventarios",
      underscored: true,
    },
  );
  return movimiento_inventario;
};

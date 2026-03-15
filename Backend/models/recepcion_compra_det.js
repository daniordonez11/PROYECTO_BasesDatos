"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class recepcion_compra_det extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.recepcion_compra, {
        foreignKey: "recepcion_id",
        as: "recepcion",
      });
      this.belongsTo(models.producto, {
        foreignKey: "producto_id",
        as: "producto",
      });
    }
  }
  recepcion_compra_det.init(
    {
      recepcion_id: { type: DataTypes.INTEGER, allowNull: false },
      producto_id: { type: DataTypes.INTEGER, allowNull: false },
      cantidad: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
      costo_unitario: { type: DataTypes.DECIMAL(12, 4), allowNull: false },
      descuento: { type: DataTypes.DECIMAL(12, 4), allowNull: true },
      impuesto_aplicado: { type: DataTypes.DECIMAL(12, 4), allowNull: true },
      total_linea: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    },
    {
      sequelize,
      modelName: "recepcion_compra_det",
      tableName: "recepcion_compra_dets",
      underscored: true,
    },
  );
  return recepcion_compra_det;
};

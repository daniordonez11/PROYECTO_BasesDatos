"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cita_pago extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.cita, { foreignKey: "cita_id", as: "cita" });
      this.belongsTo(models.metodo_pago, {
        foreignKey: "metodo_pago_id",
        as: "metodo",
      });
    }
  }
  cita_pago.init(
    {
      cita_id: { type: DataTypes.INTEGER, allowNull: false },
      metodo_pago_id: { type: DataTypes.INTEGER, allowNull: false }, // 1 EFECTIVO, 2 TRANSFERENCIA
      monto: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
      referencia: { type: DataTypes.STRING(100) },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "cita_pago",
      tableName: "cita_pagos",
      underscored: true
    },
  );
  return cita_pago;
};

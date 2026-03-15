"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comision_barbero extends Model {
    static associate(models) {
      this.belongsTo(models.cita, { foreignKey: "cita_id", as: "cita" });
      this.belongsTo(models.barbero, {
        foreignKey: "barbero_id",
        as: "barbero",
      });
    }
  }
  comision_barbero.init(
    {
      cita_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      barbero_id: { type: DataTypes.INTEGER, allowNull: false },
      base: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      porcentaje: { type: DataTypes.DECIMAL(6, 4) },
      monto_fijo: { type: DataTypes.DECIMAL(12, 4) },
      comision_calculada: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      calculada_sobre: {
        type: DataTypes.ENUM(
          "SUBTOTAL",
          "SUBTOTAL_SIN_DESCUENTO",
          "TOTAL_SIN_IMP_SIN_PROPINA",
        ),
        allowNull: false,
        defaultValue: "SUBTOTAL",
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "comision_barbero",
      tableName: "comision_barberos",
      underscored: true,
    },
  );
  return comision_barbero;
};

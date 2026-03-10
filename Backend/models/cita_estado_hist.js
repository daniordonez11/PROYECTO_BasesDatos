"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cita_estado_hist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.cita, { foreignKey: "cita_id", as: "cita" });
      this.belongsTo(models.usuario, {
        foreignKey: "usuario_id",
        as: "usuario",
      });
    }
  }
  cita_estado_hist.init(
    {
      cita_id: { type: DataTypes.INTEGER, allowNull: false },
      estado: {
        type: DataTypes.ENUM(
          "PENDIENTE",
          "CONFIRMADA",
          "EN_SERVICIO",
          "COMPLETADA",
          "CANCELADA",
          "NO_SHOW",
        ),
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      motivo: { type: DataTypes.STRING(200) },
      usuario_id: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "cita_estado_hist",
      tableName: "cita_estado_hists",
      underscored: true,
    },
  );
  return cita_estado_hist;
};

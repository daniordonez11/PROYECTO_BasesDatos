"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class barbero_servicio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.barbero, {
        foreignKey: "barbero_id",
        as: "barbero",
      });
      this.belongsTo(models.servicio, {
        foreignKey: "servicio_id",
        as: "servicio",
      });
    }
  }
  barbero_servicio.init(
    {
      barbero_id: { type: DataTypes.INTEGER, allowNull: false },
      servicio_id: { type: DataTypes.INTEGER, allowNull: false },
      comision_tipo: {
        type: DataTypes.ENUM("PORCENTAJE", "FIJO"),
        allowNull: false,
      },
      comision_valor: { type: DataTypes.DECIMAL(12, 4), allowNull: false },
      precio_personalizado: DataTypes.DECIMAL(12, 2),
      activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "barbero_servicio",
      tableName: "barbero_servicios",
      underscored: true,
    },
  );
  return barbero_servicio;
};

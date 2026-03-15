"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class servicios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.barbero, {
        through: models.barbero_servicio,
        foreignKey: "servicio_id",
        otherKey: "barbero_id",
        as: "barberos",
      });
      this.hasMany(models.cita, { foreignKey: "servicio_id", as: "citas" });
    }
  }
  servicios.init(
    {
      nombre: { type: DataTypes.STRING(120), allowNull: false, unique: true },
      descripcion: { type: DataTypes.STRING(250) },
      duracion_aprox: { type: DataTypes.INTEGER, allowNull: false },
      precio_base: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      estado: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "servicio",
      tableName: "servicios",
      underscored: true,
    },
  );
  return servicios;
};

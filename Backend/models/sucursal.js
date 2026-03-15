"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sucursal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  sucursal.init(
    {
      nombre: { type: DataTypes.STRING(120), allowNull: false },
      direccion: DataTypes.STRING(250),
      telefono: DataTypes.STRING(40),
      is_activa: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "sucursal",
      tableName: "sucursals",
      underscored: true
    },
  );
  return sucursal;
};

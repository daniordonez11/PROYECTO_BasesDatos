"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.cita, { foreignKey: "cliente_id", as: "citas" });
    }
  }
  cliente.init(
    {
      nombre: { type: DataTypes.STRING(160), allowNull: false },
      telefono: DataTypes.STRING(40),
      email: DataTypes.STRING(120),
      fecha_nacimiento: DataTypes.DATE,
      notas: DataTypes.STRING(250),
      rtn: DataTypes.STRING(40),
      activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "cliente",
      tableName: "clientes",
      underscored: true,
    },
  );
  return cliente;
};

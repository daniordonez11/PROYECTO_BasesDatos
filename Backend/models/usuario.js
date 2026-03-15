"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.rol, { foreignKey: "rol_id", as: "rol" });
      this.hasOne(models.barbero, { foreignKey: "usuario_id", as: "barbero" });
    }
  }
  usuario.init(
    {
      username: { type: DataTypes.STRING(60), allowNull: false },
      nombre: { type: DataTypes.STRING(120), allowNull: false },
      email: DataTypes.STRING(120),
      hash_password: { type: DataTypes.STRING(255), allowNull: false },
      rol_id: { type: DataTypes.INTEGER, allowNull: false },
      is_activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "usuario",
      tableName: "usuarios",
      underscored: true
    },
  );
  return usuario;
};

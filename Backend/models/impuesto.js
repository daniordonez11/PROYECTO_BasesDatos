"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class impuesto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  impuesto.init(
    {
      nombre: { type: DataTypes.STRING(60), allowNull: false },
      tasa: { type: DataTypes.DECIMAL(6, 4), allowNull: false },
      es_incluido: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
      sequelize,
      modelName: "impuesto",
      tableName: "impuestos",
      underscored: true
    },
  );
  return impuesto;
};

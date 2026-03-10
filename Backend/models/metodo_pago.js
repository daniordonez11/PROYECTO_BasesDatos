'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class metodo_pago extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  metodo_pago.init({
    nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
    sequelize,
    modelName: 'metodo_pago',
    tableName: 'metodo_pagos',
    underscored: true,
  });
  return metodo_pago;
};
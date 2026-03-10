'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tipo_mov_inv extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tipo_mov_inv.init({
    nombre: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    signo: { type: DataTypes.SMALLINT, allowNull: false }
  }, {
    sequelize,
    modelName: 'tipo_mov_inv',
    tableName: 'tipo_mov_invs',
    underscored: true
  });
  return tipo_mov_inv;
};
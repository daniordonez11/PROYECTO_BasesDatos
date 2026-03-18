'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rol extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.usuario, { foreignKey: 'rol_id', as: 'usuarios' });
    }
  }
  rol.init({
    nombre: { type: DataTypes.STRING(40), allowNull: false}
  }, {
    sequelize,
    modelName: 'rol',
    tableName: 'rols',
    underscored: true
  });
  return rol;
};
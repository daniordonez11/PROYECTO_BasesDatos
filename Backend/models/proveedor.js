'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class proveedor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.recepcion_compra, { foreignKey: 'proveedor_id', as: 'recepciones' });
    }
  }
  proveedor.init({
    nombre: { type: DataTypes.STRING, allowNull: false }, 
    rtn: DataTypes.STRING(40),  
    telefono: DataTypes.STRING(40),
    email: DataTypes.STRING(160),
    direccion: DataTypes.STRING(200),
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'proveedor',
    tableName: 'proveedors',
    underscored: true
  });
  return proveedor;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class barbero extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.usuario, { foreignKey: 'usuario_id', as: 'usuario' });
      this.belongsToMany(models.servicio, {
        through: models.barbero_servicio,
        foreignKey: 'barbero_id',
        otherKey: 'servicio_id',
        as: 'servicios'
      });
      this.hasMany(models.cita, { foreignKey: 'barbero_id', as: 'cita' });
    }
  }
  barbero.init({
    usuario_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    nombre_publico: { type: DataTypes.STRING(120) },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'barbero',
    tableName: 'barberos',
    underscored: true
  });
  return barbero;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cita_servicio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.cita,    { foreignKey: 'cita_id',    as: 'cita' });
      this.belongsTo(models.servicio, { foreignKey: 'servicio_id', as: 'servicio' })
      }
    }
    cita_servicio.init({
      cita_id: { type: DataTypes.INTEGER, allowNull: false },
      servicio_id: { type: DataTypes.INTEGER, allowNull: false },
      precio_aplicado: { type: DataTypes.DECIMAL(12, 2), allowNull: false }
    }, {
      sequelize,
      modelName: 'cita_servicio',
    });
    return cita_servicio;
  };
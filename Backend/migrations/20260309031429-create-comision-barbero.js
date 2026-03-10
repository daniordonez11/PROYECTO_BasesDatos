'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comision_barberos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cita_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cita', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE'
      },
      barbero_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'barbero', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'RESTRICT'
      },
      sucursal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sucursal', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'RESTRICT' 
      },
      base: {
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false
      },
      porcentaje: {
        type: Sequelize.DECIMAL(6,4)
      },
      monto_fijo: {
        type: Sequelize.DECIMAL(12,4)
      },
      comision_calculada: {
        type: Sequelize.DECIMAL(12,2)
      },
      calculada_sobre: {
        type: Sequelize.ENUM('PRECIO_SERVICIO','PRECIO_FINAL','BASE')
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('comision_barberos', ['barbero_id', 'fecha'], { name: 'idx_comision_barbero_barbero_fecha' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('comision_barberos', 'idx_comision_barbero_barbero_fecha');
    await queryInterface.dropTable('comision_barberos');
  }
};
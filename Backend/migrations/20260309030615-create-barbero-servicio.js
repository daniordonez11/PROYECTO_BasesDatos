'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('barbero_servicios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      barbero_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'barbero',key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      servicio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'servicios', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      comision_valor: {
        type: Sequelize.DECIMAL(12,4),
        allowNull: false
      },
      precio_personalizado: {
        type: Sequelize.DECIMAL(12,2)
      },
      estado: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('barbero_servicios');
  }
};
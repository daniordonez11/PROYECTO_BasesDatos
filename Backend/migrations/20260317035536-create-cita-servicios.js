'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cita_servicios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cita_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      servicio_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      precio_aplicado: {
        type: Sequelize.DECIMAL(12,2),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cita_servicios');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('servicios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.STRING(250)
      },
      duracion_aprox: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      precio_base: {
        type: Sequelize.DECIMAL(12,2),
        allowNull: false
      },
      estado: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.dropTable('servicios');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(160),
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING(40)
      },
      email: {
        type: Sequelize.STRING(120)
      },
      fecha_nacimiento: {
        type: Sequelize.DATE
      },
      notas: {
        type: Sequelize.STRING(250)
      },
      rtn: {
        type: Sequelize.STRING(40)
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
    await queryInterface.dropTable('clientes');
  }
};
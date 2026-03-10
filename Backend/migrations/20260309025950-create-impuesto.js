'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('impuestos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(60),
        allownull:false
      },
      tasa: {
        type: Sequelize.DECIMAL(6,4),
        allownull:false
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
await queryInterface.addConstraint('impuestos', {
      fields: ['nombre','tasa','vigente_desde'],
      type: 'unique',
      name: 'uniq_impuesto_nombre_tasa_desde'
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('impuestos','uniq_impuesto_nombre_tasa_desde')
    await queryInterface.dropTable('impuestos');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cita_pagos', {
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
      metodo_pago_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'metodo_pago', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'RESTRICT' 
      },
      monto: {
        type: Sequelize.DECIMAL(14,2),
        allowNull: false
      },
      referencia: {
        type: Sequelize.STRING(100)
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
    await queryInterface.addIndex('cita_pagos', ['cita_id'], { name: 'idx_cita_pago_cita_id' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('cita_pagos', 'idx_cita_pago_cita_id');
    await queryInterface.dropTable('cita_pagos');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cita_estado_hists', {
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
      estado: {
        type: Sequelize.ENUM('PENDIENTE','CONFIRMADA','EN_SERVICIO','COMPLETADA','CANCELADA','NO_SHOW'),
        allowNull: false

      },
      fecha: {
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.fn('NOW') 
      },
      motivo: {
        type: Sequelize.STRING(200)
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: { model: 'usuario', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'SET NULL' 

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
    await queryInterface.addIndex('cita_estado_hists', ['cita_id', 'fecha'], { name: 'idx_cita_hist_cita_fecha' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('cita_estado_hists', 'idx_cita_hist_cita_fecha');
    await queryInterface.dropTable('cita_estado_hists');
  }
};
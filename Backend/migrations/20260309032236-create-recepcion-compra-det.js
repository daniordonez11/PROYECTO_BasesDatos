'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recepcion_compra_dets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recepcion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'recepcion_compra', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'producto', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      cantidad: {
        type: Sequelize.DECIMAL(18,6),
        allowNull: false
      },
      costo_unitario: {
        type: Sequelize.DECIMAL(12,4),
        allowNull: false
      },
      descuento: {
        type: Sequelize.DECIMAL(12,4),
        allowNull: false,
        defaultValue: 0.00
      },
      impuesto_aplicado: {
        type: Sequelize.DECIMAL(12,4),
        allowNull: false,
        defaultValue: 0.00
      },
      total_linea: {
        type: Sequelize.DECIMAL(18,6),
        allowNull: false,
        defaultValue: 0.00
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
    await queryInterface.addIndex('recepcion_compra_dets', ['recepcion_id'], { name: 'idx_rec_det_recepcion' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('recepcion_compra_dets', 'idx_rec_det_recepcion');
    await queryInterface.dropTable('recepcion_compra_dets');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      producto_id: {
        type: Sequelize.INTEGER,
        references: { model: 'producto', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      sucursal_id: {
        type: Sequelize.INTEGER,
        references: { model: 'sucursal', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      stock: {
        type: Sequelize.DECIMAL(18,6),
        allowNull: false,
        defaultValue: 0.00
      },
      stock_min: {
        type: Sequelize.DECIMAL(18,6),
        allowNull: false,
        defaultValue: 0.00
      },
      stock_max: {
        type: Sequelize.DECIMAL(18,6)
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
    
    await queryInterface.addConstraint('inventarios', {
      fields: ['producto_id','sucursal_id'],
      type: 'unique',
      name: 'uniq_inventario_producto_sucursal'
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('inventarios', 'uniq_inventario_producto_sucursal');
    await queryInterface.dropTable('inventarios');
  }
};
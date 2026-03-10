'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        references: { model: 'categoria_producto', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'SET NULL' 
      },
      codigo_barras: {
        type: Sequelize.STRING(60),
        unique: true
      },
      costo_ult_compra: {
        type: Sequelize.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0.00
      },
      precio_venta: {
        type: Sequelize.DECIMAL(12,2)
      },
      controla_caducidad: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    await queryInterface.addIndex('productos', ['categoria_id'], { name: 'idx_prod_categoria' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('productos', 'idx_prod_categoria');
    await queryInterface.dropTable('productos');
  }
};
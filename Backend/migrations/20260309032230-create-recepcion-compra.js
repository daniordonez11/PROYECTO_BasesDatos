'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recepcion_compras', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      proveedor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'proveedor', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      sucursal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'sucursal', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false
      },
      subtotal: {
        type: Sequelize.DECIMAL(14,2),
        allowNull: false,
        defaultValue: 0.00
      },
      impuesto: {
          type: Sequelize.DECIMAL(14,2),
          allowNull: false,
          defaultValue: 0.00
      },
      total: {
        type: Sequelize.DECIMAL(14,2),
        allowNull: false,
        defaultValue: 0.00
      },
      notas: {
        type: Sequelize.STRING(200)
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {model: 'usuario', key: 'id'},
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
    
    await queryInterface.addIndex('recepcion_compras', ['proveedor_id','fecha'], { name: 'idx_rec_prov_fecha' });
    await queryInterface.addIndex('recepcion_compras', ['sucursal_id','fecha'], { name: 'idx_rec_suc_fecha' });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('recepcion_compras', 'idx_rec_suc_fecha');
    await queryInterface.removeIndex('recepcion_compras', 'idx_rec_prov_fecha');
    await queryInterface.dropTable('recepcion_compras');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('movimiento_inventarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'producto', key: 'id'},
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
      tipo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'tipo_mov_invs', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      cantidad: {
        type: Sequelize.DECIMAL(18,6),
        allowNull: false,
      },
      costo_unitario: {
        type: Sequelize.DECIMAL(12,4),
        allowNull: false
      },
      referencia_tipo: {
        type: Sequelize.STRING(30)
      },
      referencia_id: {
        type: Sequelize.INTEGER
      },
      nota: {
        type: Sequelize.STRING(200)
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    
    await queryInterface.addIndex('movimiento_inventarios', ['producto_id','fecha'], { name: 'idx_mov_prod_fecha' });
    await queryInterface.addIndex('movimiento_inventarios', ['sucursal_id','fecha'], { name: 'idx_mov_suc_fecha' });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('movimiento_inventarios', 'idx_mov_suc_fecha');
    await queryInterface.removeIndex('movimiento_inventarios', 'idx_mov_prod_fecha');
    await queryInterface.dropTable('movimiento_inventarios');
  }
};
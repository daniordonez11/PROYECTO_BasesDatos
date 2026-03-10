'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('citas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sucursal_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'sucursal', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'RESTRICT' 
      },
      cliente_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'cliente', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'RESTRICT' 
      },
      barbero_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'barbero', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'RESTRICT' 
      },
      servicio_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'servicio', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'RESTRICT' 
      },
      fecha_hora_inicio: {
        type: Sequelize.DATE, 
        allowNull: false
      },
      fecha_hora_fin: {
        type: Sequelize.DATE, 
        allowNull: false
      },
      precio_aplicado: {
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false
      },
      impuesto_id: {
        type: Sequelize.INTEGER,
        references: { model: 'impuesto', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'SET NULL' 

      },
      impuesto_monto: {
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false, 
        defaultValue: 0 
      },
      propina_monto: {
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false, 
        defaultValue: 0 
      },
      descuento_monto: {
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false, 
        defaultValue: 0 
      },
      subtotal: {
        type: Sequelize.DECIMAL(12,2), 
        allowNull: false
      },
      total: {
        type: Sequelize.DECIMAL(12,2),
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('PENDIENTE','CONFIRMADA','EN_SERVICIO','COMPLETADA','CANCELADA','NO_SHOW'),
        allowNull: false, defaultValue: 'PENDIENTE'
      },
      notas: {
        type: Sequelize.STRING(250)
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
    await queryInterface.addIndex('citas', ['sucursal_id', 'fecha_hora_inicio'], { name: 'idx_cita_suc_fecha' });
    await queryInterface.addIndex('citas', ['barbero_id', 'fecha_hora_inicio'], { name: 'idx_cita_barb_fecha' });
    await queryInterface.addIndex('citas', ['cliente_id'], { name: 'idx_cita_cliente' });
    await queryInterface.addIndex('citas', ['estado'], { name: 'idx_cita_estado' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('citas', 'idx_cita_estado');
    await queryInterface.removeIndex('citas', 'idx_cita_cliente');
    await queryInterface.removeIndex('citas', 'idx_cita_barb_fecha');
    await queryInterface.removeIndex('citas', 'idx_cita_suc_fecha');
    await queryInterface.dropTable('citas');
  }
};
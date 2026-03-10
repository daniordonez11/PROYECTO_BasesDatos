"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("usuarios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      user: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(120),
      },
      hash_contrasena: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "rol", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("usuarios", ["rol_id"], {
      name: "idx_usuario_rol",
    });
    await queryInterface.addIndex("usuarios", ["sucursal_id"], {
      name: "idx_usuario_sucursal",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("usuarios", "idx_usuario_rol");
    await queryInterface.removeIndex("usuarios", "idx_usuario_sucursal");
    await queryInterface.dropTable("usuarios");
  },
};

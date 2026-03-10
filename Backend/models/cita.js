"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cita extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.sucursal, {
        foreignKey: "sucursal_id",
        as: "sucursal",
      });
      this.belongsTo(models.cliente, {
        foreignKey: "cliente_id",
        as: "cliente",
      });
      this.belongsTo(models.barbero, {
        foreignKey: "barbero_id",
        as: "barbero",
      });
      this.belongsTo(models.servicio, {
        foreignKey: "servicio_id",
        as: "servicio",
      });
      this.belongsTo(models.impuesto, {
        foreignKey: "impuesto_id",
        as: "impuesto",
      });

      // creador/editor (opcional)
      this.belongsTo(models.usuario, {
        foreignKey: "created_by",
        as: "creador",
      });
      this.belongsTo(models.usuario, {
        foreignKey: "updated_by",
        as: "editor",
      });

      // hasMany / hasOne
      this.hasMany(models.cita_pago, {
        foreignKey: "cita_id",
        as: "pagos",
        onDelete: "CASCADE",
      });
      this.hasMany(models.cita_estado_hist, {
        foreignKey: "cita_id",
        as: "estados",
        onDelete: "CASCADE",
      });
      this.hasOne(models.comision_barbero, {
        foreignKey: "cita_id",
        as: "comision",
        onDelete: "CASCADE",
      });
    }
  }
  cita.init(
    {
      sucursal_id: { type: DataTypes.INTEGER, allowNull: false },
      cliente_id: { type: DataTypes.INTEGER, allowNull: false },
      barbero_id: { type: DataTypes.INTEGER, allowNull: false },
      servicio_id: { type: DataTypes.INTEGER, allowNull: false },

      fecha_hora_inicio: { type: DataTypes.DATE, allowNull: false },
      fecha_hora_fin: { type: DataTypes.DATE, allowNull: false },

      precio_aplicado: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      impuesto_id: { type: DataTypes.INTEGER, allowNull: true },
      impuesto_monto: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      propina_monto: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      descuento_monto: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },

      // Si prefieres STRING, cambia a DataTypes.STRING y quita el ENUM de la migration
      estado: {
        type: DataTypes.ENUM(
          "PENDIENTE",
          "CONFIRMADA",
          "EN_SERVICIO",
          "COMPLETADA",
          "CANCELADA",
          "NO_SHOW",
        ),
        allowNull: false,
        defaultValue: "PENDIENTE",
      },

      notas: { type: DataTypes.STRING(250) },

      // sucursal_id: DataTypes.INTEGER,
      // cliente_id: DataTypes.INTEGER,
      // barbero_id: DataTypes.INTEGER,
      // servicio_id: DataTypes.INTEGER,
      // fecha_hora_inicio: DataTypes.DATE,
      // fecha_hora_fin: DataTypes.DATE,
      // precio_aplicado: DataTypes.DECIMAL,
      // impuesto_id: DataTypes.INTEGER,
      // impuesto_monto: DataTypes.DECIMAL,
      // propina_monto: DataTypes.DECIMAL,
      // descuento_monto: DataTypes.DECIMAL,
      // subtotal: DataTypes.DECIMAL,
      // total: DataTypes.DECIMAL,
      // estado: DataTypes.STRING,
      // origen: DataTypes.STRING,
      // notas: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "cita",
      tableName: "citas",
      underscored: true
    },
  );
  return cita;
};

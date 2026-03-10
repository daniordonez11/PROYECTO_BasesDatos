require('dotenv').config();
const express = require(`express`);
const cors = require(`cors`);
const sequelize = require(`./config/database`);
const { DataTypes } = require('sequelize');

require('./models')(sequelize, DataTypes);

const app = express();
app.use(cors());
app.use(express.json());

// const appRoutes = require(`./routes/index.js`);
// app.use(`/api/tienda`, appRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la BD');

    // 3) Verifica que el modelo esté registrado
    console.log('Modelos registrados:', Object.keys(sequelize.models)); // Debe incluir 'Contact'

    // 4) Sincroniza (elige lo que necesitas)
    await sequelize.sync({logging: console.log }); // ¡CUIDADO! borra todo
    // await sequelize.sync({ alter: true, logging: console.log });
    // await sequelize.sync({ logging: console.log });

    console.log('✅ Tablas creadas/sincronizadas');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar:', err);
    process.exit(1);
  }
})();


// sequelize.sync({force: true}) // CAMBIAR A TRUE PARA REINICIAR TABLAS
//     .then(() => {
//         console.log(`conectado a la base de datos`);
//         app.listen(PORT, () => {
//             console.log(`Servidor corriendo en http://localhost:${PORT}`);
//         });
//     })
//     .catch(error => console.log(`Error al conectar con la DB`, error));
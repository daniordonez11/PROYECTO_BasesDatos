require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { DataTypes } = require('sequelize');
const path = require('path');

require('./models')(sequelize, DataTypes);

const app = express();
app.use(cors());
app.use(express.json());

// 1️⃣ Primero archivos estáticos
console.log('Static sirviendo desde:', path.join(__dirname, "../Frontend"));
app.use(express.static(path.join(__dirname, "../Frontend")));

// 2️⃣ Luego rutas API
const appRoutes = require('./routes/index.routes');
app.use('/api/tienda', appRoutes);

// 3️⃣ Fallback — solo rutas que no sean /api
app.get(/^(?!\/api)(?!\/components).*/, (req, res) => {
  console.log('Fallback:', req.path);
  const filePath = path.join(__dirname, "../Frontend", req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.log('No encontrado:', filePath);
      res.sendFile(path.join(__dirname, "../Frontend/pages/login.html"));
    }
  });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la BD');
    await sequelize.sync({ logging: false }); // ← quita el logging para limpiar consola
    console.log('✅ Tablas sincronizadas');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
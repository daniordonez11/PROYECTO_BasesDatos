const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  
  try {
    // req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    const { secret } = require('../config/jwt');
    req.usuario = jwt.verify(token, secret);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'Administrador')
    return res.status(403).json({ error: 'Acceso denegado' });
  next();
};

const soloBarbero = (req, res, next) => {
  if (req.usuario.rol !== 'Barbero')
    return res.status(403).json({ error: 'Acceso denegado' });
  next();
};

module.exports = {
  verificarToken,
  soloAdmin,
  soloBarbero,
};
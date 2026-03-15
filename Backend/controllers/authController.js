const bcrypt = require("bcrypt"); // si usas hash_password
const { usuario } = require("../models");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'Username y password requeridos' });
    }

    const user = await usuario.findOne({ where: { username } });
    if (!user) return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.hash_password);
    if (!match) return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });

    req.session.userId = user.id; // <--- aquí se crea la sesión
    return res.json({ ok: true, user: { id: user.id, username: user.username, nombre: user.nombre } });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ ok: false });
    res.clearCookie("connect.sid"); // o la cookie que uses
    res.json({ ok: true });
  });
};

exports.me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ ok: false, error: 'No autorizado' });
  }
  try {
    const user = await usuario.findByPk(req.session.userId, {
      attributes: ['id', 'username', 'nombre', 'email']
    });
    if (!user) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    }
    res.json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
    login: exports.login,
    logout: exports.logout,
    me: exports.me
};
const bcrypt = require("bcrypt"); // si usas hash_password
const { usuario } = require("../models");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await usuario.findOne({ where: { username } });
  if (!user) return res.status(401).json({ ok: false });

  const match = await bcrypt.compare(password, user.hash_password);
  if (!match) return res.status(401).json({ ok: false });

  req.session.userId = user.id; // <--- aquí se crea la sesión
  return res.json({ ok: true });
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ ok: false });
    res.clearCookie("connect.sid"); // o la cookie que uses
    res.json({ ok: true });
  });
};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../../config/jwt');
const sequelize = require('../../config/database');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ ok: false, error: 'Username y password requeridos' });

    const { usuario, rol, barbero } = sequelize.models; // ← así

    // Traer usuario con su rol y barbero
    const user = await usuario.findOne({
      where: { username },
      include: [
        { model: rol,     as: 'rol' },
        { model: barbero, as: 'barbero' }
      ]
    });

    if (!user)
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.hash_password);
    if (!match)
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });

    // Generar token
    const token = jwt.sign({
      id:         user.id,
      username:   user.username,
      nombre:     user.nombre,
      rol:        user.rol.nombre,
      barbero_id: user.barbero?.id || null
    }, secret, { expiresIn });

    return res.json({ ok: true, token });

  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

exports.logout = (req, res) => {
  // Con JWT el logout es responsabilidad del frontend (borrar el token)
  res.json({ ok: true, message: 'Sesión cerrada' });
};

exports.me = async (req, res) => {
  // req.usuario viene del middleware verificarToken
  try {
    const user = await usuario.findByPk(req.usuario.id, {
      attributes: ['id', 'username', 'nombre', 'email'],
      include: [{ model: rol, as: 'rol' }]
    });
    res.json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
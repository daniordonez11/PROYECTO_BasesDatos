const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../../config/jwt');
const sequelize = require('../../config/database');

const getModel = () => sequelize.models.usuario;
const getRol   = () => sequelize.models.rol;
const getBarbero = () => sequelize.models.barbero;

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ ok: false, error: 'Username y password requeridos' });

    // Traer usuario con su rol y barbero
    const user = await getModel().findOne({
      where: { username },
      include: [
        { model: getRol(),     as: 'rol' },
        { model: getBarbero(), as: 'barbero' }
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

const logout = (req, res) => {
  // Con JWT el logout es responsabilidad del frontend (borrar el token)
  res.json({ ok: true, message: 'Sesión cerrada' });
};

const me = async (req, res) => {
  // req.usuario viene del middleware verificarToken
  try {
    const user = await getModel().findByPk(req.usuario.id, {
      attributes: ['id', 'username', 'nombre', 'email'],
      include: [{ model: getRol(), as: 'rol' }]
    });
    res.json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  login,
  logout,
  me
};
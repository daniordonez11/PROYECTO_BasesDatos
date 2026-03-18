const sequelize = require('../../config/database');
const bcrypt = require('bcryptjs');

const getModel = () => sequelize.models.usuario;
const getRol   = () => sequelize.models.rol;
const getBarbero = () => sequelize.models.barbero;

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await getModel().findAll({
      include: [{ model: getRol(), as: 'rol', attributes: ['id', 'nombre'] }],
      attributes: { exclude: ['hash_password'] }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const usuario = await getModel().findByPk(req.params.id, {
      include: [{ model: getRol(), as: 'rol', attributes: ['id', 'nombre'] }],
      attributes: { exclude: ['hash_password'] }
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUsuario = async (req, res) => {
  try {
    const { username, nombre, email, password, rol_id, is_activo } = req.body;
    if (!password) return res.status(400).json({ error: 'Password requerido' });

    const hash = await bcrypt.hash(password, 10);
    const usuario = await getModel().create({
      username, nombre, email,
      hash_password: hash,
      rol_id, is_activo
    });

    // Si el rol es Barbero, crear perfil automáticamente
    const rol = await getRol().findByPk(rol_id);
    if (rol?.nombre === 'Barbero') {
      await getBarbero().create({
        usuario_id:    usuario.id,
        nombre_publico: nombre,
        estado:        true
      });
    }

    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const usuario = await getModel().findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { password, ...resto } = req.body;
    if (password) resto.hash_password = await bcrypt.hash(password, 10);

    await usuario.update(resto);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const usuario = await getModel().findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuario.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener roles disponibles para el formulario
const getRoles = async (req, res) => {
  try {
    const roles = await getRol().findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getRoles
};
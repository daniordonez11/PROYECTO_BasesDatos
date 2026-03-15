const sequelize = require('../../config/database');
const Usuario = sequelize.models.usuario;


const createUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.create(req.body);
        res.status(201).json(usuario || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getUsuarios = async (req, res) => {
    try {
        const usuario = await Usuario.findAll();
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario){
            return res.status(404).json({
                error: `usuario no encontrado`
            })
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario){
            return res.status(404).json({
                error: `usuario no encontrado`
            })
        }

        await usuario.update(req.body);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario){
            return res.status(404).json({
                error: `usuario no encontrado`
            })
        }

        await usuario.destroy(req.body);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createUsuario,
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
}
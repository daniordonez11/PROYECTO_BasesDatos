const sequelize = require('../../config/database');
const CitaEstadoHist = sequelize.models.cita_estado_hist;

const createCitaEstadoHist = async (req, res) => {
    try {
        const citaEstadoHist = await CitaEstadoHist.create(req.body);
        res.status(201).json(citaEstadoHist || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getCitaEstadoHists = async (req, res) => {
    try {
        const citaEstadoHists = await CitaEstadoHist.findAll();
        res.status(200).json(citaEstadoHists);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getCitaEstadoHistById = async (req, res) => {
    try {
        const citaEstadoHist = await CitaEstadoHist.findByPk(req.params.id);
        if (!citaEstadoHist) {
            return res.status(404).json({
                error: `CitaEstadoHist no encontrado`
            });
        }
        res.status(200).json(citaEstadoHist);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateCitaEstadoHist = async (req, res) => {
    try {
        const citaEstadoHist = await CitaEstadoHist.findByPk(req.params.id);
        if (!citaEstadoHist) {
            return res.status(404).json({
                error: `CitaEstadoHist no encontrado`
            });
        }
        await citaEstadoHist.update(req.body);
        res.status(200).json(citaEstadoHist);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteCitaEstadoHist = async (req, res) => {
    try {
        const citaEstadoHist = await CitaEstadoHist.findByPk(req.params.id);
        if (!citaEstadoHist) {
            return res.status(404).json({
                error: `CitaEstadoHist no encontrado`
            });
        }
        await citaEstadoHist.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createCitaEstadoHist,
    getCitaEstadoHists,
    getCitaEstadoHistById,
    updateCitaEstadoHist,
    deleteCitaEstadoHist
};
const sequelize = require('../config/database');
const Contact = sequelize.models.Contact;


const createContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact || {});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const getContacts = async (req, res) => {
    try {
        const contact = await Contact.findAll();
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact){
            return res.status(404).json({
                error: `Contacto no encontrado`
            })
        }

        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact){
            return res.status(404).json({
                error: `Contacto no encontrado`
            })
        }

        await contact.update(req.body);
        res.status(200).json(contact);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact){
            return res.status(404).json({
                error: `Contacto no encontrado`
            })
        }

        await contact.destroy(req.body);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
}
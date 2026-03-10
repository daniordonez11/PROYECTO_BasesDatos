const express = require(`express`);
const router = express.Router();
const contactoController = require(`../../controllers/contactoController`);

router.post(`/`, contactoController.createContact);
router.get(`/`, contactoController.getContacts);
router.get(`/:id`, contactoController.getContactById);
router.put(`/:id`, contactoController.updateContact);
router.delete(`/:id`, contactoController.deleteContact);

module.exports = router;
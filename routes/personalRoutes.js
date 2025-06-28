import express from 'express';
import personalController from '../controllers/personal/personalController.js';
import linksController from '../controllers/personal/linksController.js';
import skillsController from '../controllers/personal/skillsController.js';
import contactsController from '../controllers/personal/contactsController.js';

const router = express.Router();

router.route('/')
    .get(personalController.getAllPersonal)
    .post(personalController.addPersonal)
    .patch(personalController.updatePersonal)
    .delete(personalController.deletePersonal)
router.route('/links')
    .get(linksController.getAllLinks)
    .post(linksController.addLink)
    .patch(linksController.updateLink)
    .delete(linksController.deleteLink)
router.route('/skills')
    .get(skillsController.getAllSkills)
    .post(skillsController.addSkill)
    .patch(skillsController.updateSkill)
    .delete(skillsController.deleteSkill)
router.route('/contacts')
    .get(contactsController.getAllContacts)
    .post(contactsController.addContact)
    .delete(contactsController.deleteContact)
router.route('/:id')
    .get(personalController.getPersonalByUserId)
router.route('/links/:id')
    .get(linksController.getLinkById)
router.route('/skills/:id')
    .get(skillsController.getSkillById)
router.route('/contacts/:id')
    .get(contactsController.getContactById)

export default router
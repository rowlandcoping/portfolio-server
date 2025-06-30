import express from 'express';
import personalController from '../../controllers/personal/personalController.js';
import linksController from '../../controllers/personal/linksController.js';
import skillsController from '../../controllers/personal/skillsController.js';
import contactsController from '../../controllers/personal/contactsController.js';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();

router.get('/', personalController.getAllPersonal)
router.get('/links', linksController.getAllLinks)
router.get('/skills', skillsController.getAllSkills)
router.post('./contacts', contactsController.addContact)

router.use(requireSession);

router.route('/')
    .post(personalController.addPersonal)
    .patch(personalController.updatePersonal)
    .delete(personalController.deletePersonal)
router.route('/links')    
    .post(linksController.addLink)
    .patch(linksController.updateLink)
    .delete(linksController.deleteLink)
router.route('/skills')
    .post(requireSession, skillsController.addSkill)
    .patch(requireSession, skillsController.updateSkill)
    .delete(requireSession, skillsController.deleteSkill)
router.route('/contacts')
    .get(contactsController.getAllContacts)
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
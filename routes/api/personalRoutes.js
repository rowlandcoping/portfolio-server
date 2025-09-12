import express from 'express';
import upload from '../../middleware/imageUpload.js';
import requireSession from '../../middleware/requireSession.js';

import personalController from '../../controllers/personal/personalController.js';
import linksController from '../../controllers/personal/linksController.js';
import skillsController from '../../controllers/personal/skillsController.js';
import contactsController from '../../controllers/personal/contactsController.js';

const router = express.Router();

router.get('/', personalController.getAllPersonal)
router.get('/provider', personalController.getPersonalByPublicId)
router.get('/links', linksController.getAllLinks)
router.get('/skills', skillsController.getAllSkills)
router.post('/contacts', contactsController.addContact)

//router.use(requireSession);

router.route('/')
    .post(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformed', maxCount: 1 } 
    ]), personalController.addPersonal)
    .patch(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformed', maxCount: 1 }
    ]),personalController.updatePersonal)
    
    .delete(personalController.deletePersonal)

router.route('/profile')
    .get(personalController.getUserPersonal)

router.route('/links')

    .post(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformed', maxCount: 1 }
    ]),linksController.addLink)

    .patch(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformed', maxCount: 1 }
    ]),linksController.updateLink)

    .delete(linksController.deleteLink)

router.route('/profilelinks')
    .post(linksController.getLinksByProfileId)

router.route('/skills')
    .post(requireSession, skillsController.addSkill)
    .patch(requireSession, skillsController.updateSkill)
    .delete(requireSession, skillsController.deleteSkill)

router.route('/profileskills')
    .post(skillsController.getSkillsByProfileId)

router.route('/contacts')
    .get(contactsController.getAllContacts)
    .delete(contactsController.deleteContact)

router.route('/links/:id')
    .get(linksController.getLinkById)

router.route('/skills/:id')
    .get(skillsController.getSkillById)

router.route('/contacts/:id')
    .get(contactsController.getContactById)

export default router
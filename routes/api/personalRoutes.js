import express from 'express';
import upload from '../../middleware/imageUpload.js';
import requireSession from '../../middleware/requireSession.js';
import personalController from '../../controllers/personal/personalController.js';
import aboutController from '../../controllers/personal/aboutController.js';
import linksController from '../../controllers/personal/linksController.js';
import skillsController from '../../controllers/personal/skillsController.js';
import contactsController from '../../controllers/personal/contactsController.js';
import requireAboutOwnership from '../../middleware/requireAboutOwnership.js';
import requireAdmin from '../../middleware/requireAdmin.js';
import requireProfileOwnership from '../../middleware/requireProfileOwnership.js';

const router = express.Router();

router.get('/provider', personalController.getPersonalByPublicId)
router.get('/links', linksController.getAllLinks)
router.get('/skills', skillsController.getAllSkills)
router.post('/contacts', contactsController.addContact)
router.get('/about/provider', aboutController.getAboutByPublicId)

router.use(requireSession);

//NB routes below secured via session userID
router.route('/')
    .get(personalController.getAllPersonal)
    .post(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformedGreen', maxCount: 1 },
        { name: 'transformedGrayscale', maxCount: 1 }
    ]), personalController.addPersonal)
    .patch(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformedGreen', maxCount: 1 },
        { name: 'transformedGrayscale', maxCount: 1 }
    ]),personalController.updatePersonal)
router.route('/profile')
    .get(personalController.getUserPersonal)
router.route('/about')
    .get(aboutController.getAboutByCurrentUser)
    .post(aboutController.addAbout)

//NB these POST routes run controller ID checks
router.route('/skills')
    .post(skillsController.addSkill)
router.route('/links')
    .post(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformedGreen', maxCount: 1 },
        { name: 'transformedGrayscale', maxCount: 1 }
    ]),linksController.addLink)
router.route('/profilelinks')
    .post(linksController.getLinksByProfileId)
router.route('/profileskills')
    .post(skillsController.getSkillsByProfileId)

//contact views not yet established; tomorrow problem.
router.route('/contacts')
    .get(contactsController.getAllContacts)
    .delete(contactsController.deleteContact)

router.route('/about/:id')
    .get(requireAdmin, aboutController.getAbout)
    .patch(requireAboutOwnership, aboutController.updateAbout)

router.route('/links/:id')
    .get(requireProfileOwnership, linksController.getLinkById)
    .patch(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformedGreen', maxCount: 1 },
        { name: 'transformedGrayscale', maxCount: 1 }
    ]), requireProfileOwnership, linksController.updateLink)
    .delete(requireProfileOwnership, linksController.deleteLink)

router.route('/skills/:id')
    .get(requireProfileOwnership, skillsController.getSkillById)
    .patch(requireProfileOwnership, skillsController.updateSkill)
    .delete(requireProfileOwnership, skillsController.deleteSkill)

//route to be secured as views are built
router.route('/contacts/:id')
    .get(contactsController.getContactById)

export default router
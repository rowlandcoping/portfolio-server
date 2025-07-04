import express from 'express';
import projectsController from '../../controllers/project/projectsController.js';
import projectTypesController from '../../controllers/project/projectTypesController.js';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();

router.get('/', projectsController.getAllProjects)
router.get('/types', projectTypesController.getAllTypes)

router.use(requireSession)

router.route('/')
    .post(projectsController.addProject)
    .patch(projectsController.updateProject)
    .delete(projectsController.deleteProject)
router.route('/types')
    .post(projectTypesController.addType)
    .patch(projectTypesController.updateType)
    .delete(projectTypesController.deleteType)

router.route('/:id')
    .get(projectsController.getProjectById)
router.route('/types/:id')
    .get(projectTypesController.getProjectTypeById)

export default router
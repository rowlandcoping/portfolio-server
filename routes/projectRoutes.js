import express from 'express';
import projectsController from '../controllers/project/projectsController.js';
import projectTypesController from '../controllers/project/projectTypesController.js';

const router = express.Router();

router.route('/')
    .get(projectsController.getAllProjects)
    .post(projectsController.addProject)
    .patch(projectsController.updateProject)
    .delete(projectsController.deleteProject)
router.route('/types')
    .get(projectTypesController.getAllTypes)
    .post(projectTypesController.addType)
    .patch(projectTypesController.updateType)
    .delete(projectTypesController.deleteType)

router.route('/:id')
    .get(projectsController.getProjectById)
router.route('/types/:id')
    .get(projectTypesController.getProjectTypeById)

export default router
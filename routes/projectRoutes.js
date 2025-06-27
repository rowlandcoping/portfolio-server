import express from 'express';
import projectController from '../controllers/project/projectsController.js';
import projectTypesController from '../controllers/project/projectTypesController.js';

const router = express.Router();

router.route('/')
    .get(projectController.getAllProjects)
    .post(projectController.addProject)
    .patch(projectController.updateProject)
    .delete(projectController.deleteProject)
router.route('/types')
    .get(projectTypesController.getAllTypes)
    .post(projectTypesController.addType)
    .patch(projectTypesController.updateType)
    .delete(projectTypesController.deleteType)

export default router
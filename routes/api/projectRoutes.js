import express from 'express';
import upload from '../../middleware/imageUpload.js';

import projectsController from '../../controllers/project/projectsController.js';
import projectTypesController from '../../controllers/project/projectTypesController.js';
import projectEcosystemsController from '../../controllers/project/projectEcosystemsController.js';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();

router.get('/', projectsController.getAllProjects)
router.get('/provider', projectsController.getAllPortfolioProjects)
router.get('/types', projectTypesController.getAllTypes)

router.use(requireSession)

router.route('/')
    .post(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformed', maxCount: 1 }
    ]),projectsController.addProject)

    .patch(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformed', maxCount: 1 }
    ]),projectsController.updateProject)

    .delete(projectsController.deleteProject)
router.route('/types')
    .post(projectTypesController.addType)
    .patch(projectTypesController.updateType)
    .delete(projectTypesController.deleteType)

router.route('/projectecosystems')
    .post(projectEcosystemsController.addProjectEcosystem)
    .patch(projectEcosystemsController.updateProjectEcosystem)
    .delete(projectEcosystemsController.deleteProjectEcosystem)

router.route('/projectecosystems/projects/:id')
    .get(projectEcosystemsController.getProjectEcosystemByProjectId)
router.route('/types/:id')
    .get(projectTypesController.getProjectTypeById)
router.route('/features/:id')
    .get(projectsController.getFeaturesByProjectId)
router.route('/issues/:id')
    .get(projectsController.getIssuesByProjectId)
router.route('/projectecosystems/:id')
    .get(projectEcosystemsController.getProjectEcosystemById)
router.route('/:id') 
    .get(projectsController.getProjectById)


export default router
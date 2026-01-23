import express from 'express';
import upload from '../../middleware/imageUpload.js';

import projectsController from '../../controllers/project/projectsController.js';
import projectTypesController from '../../controllers/project/projectTypesController.js';
import projectEcosystemsController from '../../controllers/project/projectEcosystemsController.js';
import requireSession from '../../middleware/requireSession.js';
import requireAdmin from '../../middleware/requireAdmin.js';
import requireOwnership from '../../middleware/requireOwnership.js';

const router = express.Router();

router.get('/', projectsController.getAllProjects)
router.get('/provider', projectsController.getAllPortfolioProjects)
router.get('/types', projectTypesController.getAllTypes)

const sessionRouter = express.Router();
sessionRouter.use(requireSession);
router.use('/', sessionRouter);

//POST operations for projects
sessionRouter.post(
    '/', 
    upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformedGreen', maxCount: 1 },
        { name: 'transformedGrayscale', maxCount: 1 } 
    ]),
    projectsController.addProject
)

//retrieve projects by user
sessionRouter.route('/user')
    .get(projectsController.getUserProjects)

//adding and updating project types
sessionRouter.route('/types')
    .post(requireAdmin, projectTypesController.addType)
    .patch(requireAdmin, projectTypesController.updateType)
    .delete(requireAdmin, projectTypesController.deleteType)





//project ecosystem CRUD routes
sessionRouter.route('/projectecosystems')
    .post(projectEcosystemsController.addProjectEcosystem)
    .patch(projectEcosystemsController.updateProjectEcosystem)
    .delete(projectEcosystemsController.deleteProjectEcosystem)
sessionRouter.route('/projectecosystems/about')
    .post(projectEcosystemsController.addAboutProjectEcosystem)



//OTHER CRUD operations for projects
sessionRouter.get(
    '/:id', 
    requireOwnership, 
    projectsController.getProjectById
)
sessionRouter.patch(
    '/:id',
    requireOwnership,
    upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformedGreen', maxCount: 1 },
        { name: 'transformedGrayscale', maxCount: 1 } 
    ]),
    projectsController.updateProject
)
sessionRouter.delete(
    '/:id',
    requireOwnership,
    projectsController.deleteProject
)


//retrieve individual project ecosystems for editing
sessionRouter.route('/projectecosystems/about/:id')
    .get(projectEcosystemsController.getProjectEcosystemsByAboutId)
sessionRouter.route('/projectecosystems/projects/:id')
    .get(projectEcosystemsController.getProjectEcosystemsByProjectId)

//routes with parameters to retrieve specific data
sessionRouter.route('/types/:id')
    .get(requireAdmin, projectTypesController.getProjectTypeById)
sessionRouter.route('/features/:id')
    .get(projectsController.getFeaturesByProjectId)
sessionRouter.route('/issues/:id')
    .get(projectsController.getIssuesByProjectId)
sessionRouter.route('/projectecosystems/:id')
    .get(projectEcosystemsController.getProjectEcosystemById)



export default router
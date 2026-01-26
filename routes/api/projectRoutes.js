import express from 'express';
import upload from '../../middleware/imageUpload.js';

import projectsController from '../../controllers/project/projectsController.js';
import projectTypesController from '../../controllers/project/projectTypesController.js';
import projectEcosystemsController from '../../controllers/project/projectEcosystemsController.js';
import requireSession from '../../middleware/requireSession.js';
import requireAdmin from '../../middleware/requireAdmin.js';
import requireOwnership from '../../middleware/requireOwnership.js';
import requireProjectOwnership from '../../middleware/requireProjectOwnership.js';
import requireAboutOwnership from '../../middleware/requireAboutOwnership.js';

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
    .post(requireProjectOwnership, projectEcosystemsController.addProjectEcosystem)

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


sessionRouter.route('/projectecosystems/about')
    .post(requireAboutOwnership, projectEcosystemsController.addAboutProjectEcosystem)

sessionRouter.route('/projectecosystems/:id')
    .get(requireProjectOwnership, projectEcosystemsController.getProjectEcosystemById)
    .patch(requireProjectOwnership, projectEcosystemsController.updateProjectEcosystem)
    .delete(requireProjectOwnership, projectEcosystemsController.deleteProjectEcosystem)


//routes with parameters to retrieve specific data
sessionRouter.route('/types/:id')
    .get(requireAdmin, projectTypesController.getProjectTypeById)
sessionRouter.route('/features/:id')
    .get(requireOwnership, projectsController.getFeaturesByProjectId)
sessionRouter.route('/issues/:id')
    .get(requireOwnership, projectsController.getIssuesByProjectId)    


//retrieve individual project ecosystems for editing

//NB this route is used only used as an API client side and protected via the controller.
sessionRouter.route('/projectecosystems/about/:id')
    .get(projectEcosystemsController.getProjectEcosystemsByAboutId)
sessionRouter.route('/projectecosystems/projects/:id')
    .get(requireOwnership, projectEcosystemsController.getProjectEcosystemsByProjectId)





export default router
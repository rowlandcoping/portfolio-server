import express from 'express';
import upload from '../../middleware/imageUpload.js';

import projectsController from '../../controllers/project/projectsController.js';
import projectTypesController from '../../controllers/project/projectTypesController.js';
import projectEcosystemsController from '../../controllers/project/projectEcosystemsController.js';
import requireSession from '../../middleware/requireSession.js';
import requireAdmin from '../../middleware/requireAdmin.js';

const router = express.Router();

router.get('/', projectsController.getAllProjects)
router.get('/provider', projectsController.getAllPortfolioProjects)
router.get('/types', projectTypesController.getAllTypes)

const sessionRouter = express.Router();
const adminRouter = express.Router();
sessionRouter.use(requireSession);
adminRouter.use([requireSession, requireAdmin]);
router.use('/', sessionRouter);
router.use('/', adminRouter);

sessionRouter.route('/')
    .post(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformedGreen', maxCount: 1 },
        { name: 'transformedGrayscale', maxCount: 1 } 
    ]),projectsController.addProject)

    .patch(upload.fields([
        { name: 'original', maxCount: 1 },
        { name: 'transformedGreen', maxCount: 1 },
        { name: 'transformedGrayscale', maxCount: 1 }
    ]),projectsController.updateProject)

    .delete(projectsController.deleteProject)


sessionRouter.route('/user')
    .get(projectsController.getUserProjects)

adminRouter.route('/types')
    .post(projectTypesController.addType)
    .patch(projectTypesController.updateType)
    .delete(projectTypesController.deleteType)

sessionRouter.route('/projectecosystems')
    .post(projectEcosystemsController.addProjectEcosystem)
    .patch(projectEcosystemsController.updateProjectEcosystem)
    .delete(projectEcosystemsController.deleteProjectEcosystem)

sessionRouter.route('/projectecosystems/about')
    .post(projectEcosystemsController.addAboutProjectEcosystem)
sessionRouter.route('/projectecosystems/about/:id')
    .get(projectEcosystemsController.getProjectEcosystemsByAboutId)

sessionRouter.route('/projectecosystems/projects/:id')
    .get(projectEcosystemsController.getProjectEcosystemsByProjectId)

sessionRouter.route('/:id') 
.get(projectsController.getProjectById)
sessionRouter.route('/types/:id')
    .get(projectTypesController.getProjectTypeById)
sessionRouter.route('/features/:id')
    .get(projectsController.getFeaturesByProjectId)
sessionRouter.route('/issues/:id')
    .get(projectsController.getIssuesByProjectId)
sessionRouter.route('/projectecosystems/:id')
    .get(projectEcosystemsController.getProjectEcosystemById)



export default router
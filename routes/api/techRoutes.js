import express from 'express';
import techController from '../../controllers/tech/techController.js';
import ecosystemsController from '../../controllers/tech/ecosystemsController.js';
import techTypesController from '../../controllers/tech/techTypesController.js';
import ecoTypesController from '../../controllers/tech/ecoTypesController.js';
import requireSession from '../../middleware/requireSession.js';
import requireAdmin from '../../middleware/requireAdmin.js';

const router = express.Router();

//these routes are public

router.get('/', techController.getAllTech)
router.get('/ecosystems', ecosystemsController.getAllEcosystems)
router.get('/techtypes', techTypesController.getAllTechTypes)
router.get('/ecotypes', ecoTypesController.getAllEcoTypes)

const sessionRouter = express.Router();
const adminRouter = express.Router();
sessionRouter.use(requireSession);
adminRouter.use([requireSession, requireAdmin]);
router.use('/', sessionRouter);
router.use('/', adminRouter);

//these routes require admin only access

adminRouter.route('/')
    .post(techController.addTech)
    .patch(techController.updateTech)
    .delete(techController.deleteTech)
adminRouter.route('/ecosystems')  
    .post(ecosystemsController.addEcosystem)
    .patch(ecosystemsController.updateEcosystem)
    .delete(ecosystemsController.deleteEcosystem)
adminRouter.route('/techtypes')
    .post(techTypesController.addTechType)
    .patch(techTypesController.updateTechType)
    .delete(techTypesController.deleteTechType)
adminRouter.route('/ecotypes')
    .post(ecoTypesController.addEcoType)
    .patch(ecoTypesController.updateEcoType)
    .delete(ecoTypesController.deleteEcoType)

//get by id
//these routes require session only access (not admin only)
adminRouter.route('/:id')
    .get(techController.getTechById)
adminRouter.route('/ecosystems/:id')
    .get(ecosystemsController.getEcosystemById)
adminRouter.route('/techtypes/:id')
    .get(techTypesController.getTechTypeById)
adminRouter.route('/ecotypes/:id')
    .get(ecoTypesController.getEcoTypeById)
sessionRouter.route('/associated/:id')
    .get(techController.getTechByEcoId)

export default router
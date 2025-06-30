import express from 'express';
import techController from '../../controllers/tech/techController.js';
import ecosystemsController from '../../controllers/tech/ecosystemsController.js';
import techTypesController from '../../controllers/tech/techTypesController.js';
import ecoTypesController from '../../controllers/tech/ecoTypesController.js';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();

router.get('/', techController.getAllTech)
router.get('/ecosystems', ecosystemsController.getAllEcosystems)
router.get('/techtypes', techTypesController.getAllTechTypes)
router.get('/ecotypes', ecoTypesController.getAllEcoTypes)

router.use(requireSession);

router.route('/')
    .post(techController.addTech)
    .patch(techController.updateTech)
    .delete(techController.deleteTech)
router.route('/ecosystems')  
    .post(ecosystemsController.addEcosystem)
    .patch(ecosystemsController.updateEcosystem)
    .delete(ecosystemsController.deleteEcosystem)
router.route('/techtypes')
    .post(techTypesController.addTechType)
    .patch(techTypesController.updateTechType)
    .delete(techTypesController.deleteTechType)
router.route('/ecotypes')
    .post(ecoTypesController.addEcoType)
    .patch(ecoTypesController.updateEcoType)
    .delete(ecoTypesController.deleteEcoType)

//get by id
router.route('/:id')
    .get(techController.getTechById)
router.route('/ecosystems/:id')
    .get(ecosystemsController.getEcosystemById)
router.route('/techtypes/:id')
    .get(techTypesController.getTechTypeById)
router.route('/ecotypes/:id')
    .get(ecoTypesController.getEcoTypeById)

export default router
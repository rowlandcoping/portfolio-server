import express from 'express';
import techController from '../controllers/tech/techController.js';
import ecosystemsController from '../controllers/tech/ecosystemsController.js';
import techTypesController from '../controllers/tech/techTypesController.js';
import ecoTypesController from '../controllers/tech/ecoTypesController.js'

const router = express.Router();

router.route('/')
    .get(techController.getAllTech)
    .post(techController.addTech)
    .patch(techController.updateTech)
    .delete(techController.deleteTech)
router.route('/ecosystems')
    .get(ecosystemsController.getAllEcosystems)    
    .post(ecosystemsController.addEcosystem)
    .patch(ecosystemsController.updateEcosystem)
    .delete(ecosystemsController.deleteEcosystem)
router.route('/techtypes')
    .get(techTypesController.getAllTechTypes)
    .post(techTypesController.addTechType)
    .patch(techTypesController.updateTechType)
    .delete(techTypesController.deleteTechType)
router.route('/ecotypes')
    .get(ecoTypesController.getAllEcoTypes)
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
import express from 'express';
import usersController from '../../controllers/user/usersController.js';
import rolesController from '../../controllers/user/rolesController.js';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();

router.get('/provider', usersController.getPortfolioUser)

router.use(requireSession);

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.addUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

router.route('/roles')
    .get(rolesController.getAllRoles)
    .post(rolesController.addRole)
    .patch(rolesController.updateRole)

router.route('/:id')
    .get(usersController.getUserById)
router.route('/roles/:id')
    .get(rolesController.getRoleById)

export default router

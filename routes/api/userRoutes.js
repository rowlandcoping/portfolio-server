import express from 'express';
import usersController from '../../controllers/user/usersController.js';
import rolesController from '../../controllers/user/rolesController.js';
import requireSession from '../../middleware/requireSession.js';
import requireAdmin from '../../middleware/requireAdmin.js';

const router = express.Router();

router.get('/provider', usersController.getPortfolioUser)

router.use(requireSession);

router.route('/')
    .get(requireAdmin, usersController.getAllUsers)
    .post(requireAdmin, usersController.addUser)
    .patch(requireAdmin, usersController.updateUser)
    .delete(requireAdmin, usersController.deleteUser)

router.route('/roles')
    .get(requireAdmin, rolesController.getAllRoles)
    .post(requireAdmin, rolesController.addRole)
    .patch(requireAdmin, rolesController.updateRole)

router.route('/:id')
    .get(usersController.getUserById)

router.route('/roles/userroles')
    .get(rolesController.getRolesForCurrentUser)

router.route('/roles/:id')
    .get(requireAdmin, rolesController.getRoleById)

export default router

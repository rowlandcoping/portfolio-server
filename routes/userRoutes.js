import express from 'express';
import usersController from '../controllers/user/usersController.js'
import rolesController from '../controllers/user/rolesController.js'
const router = express.Router();

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.addUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

router.route('/roles')
    .get(rolesController.getAllRoles)
    .post(rolesController.addRole)
    .patch(rolesController.updateRole)

export default router

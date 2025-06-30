import express from 'express';
import authController from '../../controllers/auth/authController.js';
import loginLimiter from '../../middleware/loginLimiter.js';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();

router.route('/login')
    .post(loginLimiter, authController.login)

router.route('/logout')
    .post(requireSession, authController.logout)

export default router
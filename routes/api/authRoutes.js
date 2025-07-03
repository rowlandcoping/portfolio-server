import express from 'express';
import authController from '../../controllers/auth/authController.js';
import loginLimiter from '../../middleware/loginLimiter.js';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();

router.route('/login')
    .post(loginLimiter, authController.login)

router.route('/logout')
    .post(requireSession, authController.logout)

//returns a user's id from the session.  may or may not be needed!
router.get('/returnid', (req, res) => {
    if (req.session?.userId) {
        res.json({ loggedIn: true, userId: req.session.userId });
    } else {
        res.status(401).json({ loggedIn: false, message: 'No active session' });
    }
});

export default router
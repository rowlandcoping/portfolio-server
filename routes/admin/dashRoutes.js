import express from 'express';
import path from 'path';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();
const viewDir = path.join(process.cwd(), 'views');

router.use(requireSession);

router.get(['/', '/.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'root', 'dashboard.html'));
});

export default router;
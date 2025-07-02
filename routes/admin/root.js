import express from 'express';
import path from 'path';
import { redirectIfAuthenticated } from '../../middleware/sessionRedirects.js';

const router = express.Router();

router.get(/^\/$|\/index(\.html)?$/, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'root', 'index.html'));
});

router.get(['/login', '/login.html'], redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'root', 'login.html'));
});

export default router;
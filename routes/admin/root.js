import express from 'express';
import path from 'path';
const router = express.Router();

router.get(/^\/$|\/index(\.html)?$/, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'root', 'index.html'));
});

router.get(['/login', '/login.html'], (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'root', 'login.html'));
});

export default router;
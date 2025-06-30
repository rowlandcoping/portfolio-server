import express from 'express';
import path from 'path';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();
const viewDir = path.join(process.cwd(), 'views');

router.use(requireSession);

router.get(['/', '.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'user', 'add-user.html'));
});

router.get('/edit', (req, res) => {
    res.sendFile(path.join(viewDir, 'user', 'edit-user.html'));
});



router.get(['/role', '/role.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'user', 'add-role.html'));
});

router.get(['/role/edit', '/role/edit.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'user', 'edit-role.html'));
});

router.get('/role/edit/:id', (req, res) => {
    res.sendFile(path.join(viewDir, 'user', 'edit-role-form.html'));
});

router.get('/edit/:id', (req, res) => {
    res.sendFile(path.join(viewDir, 'user', 'edit-user-form.html'));
});



export default router;
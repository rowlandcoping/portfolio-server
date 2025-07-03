import express from 'express';
import path from 'path';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();
const viewDir = path.join(process.cwd(), 'views');

router.use(requireSession);

router.get(['/', '.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'personal', 'add-personal.html'));
});

router.get('/edit', (req, res) => {
    res.sendFile(path.join(viewDir, 'personal', 'edit-personal-form.html'));
});

router.get(['/skill', '/skill.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'personal', 'add-skill.html'));
});

router.get(['/skill/edit', '/skill/edit.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'personal', 'edit-skill.html'));
});

router.get(['/link', '/link.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'personal', 'add-link.html'));
});

router.get(['/link/edit', '/link/edit.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'personal', 'edit-link.html'));
});

router.get(['/messages', '/messages.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'personal', 'view-messages.html'));
});

router.get('/skill/edit/:id', (req, res) => {
    res.sendFile(path.join(viewDir, 'personal', 'edit-skill-form.html'));
});

router.get('/link/edit/:id', (req, res) => {
    res.sendFile(path.join(viewDir, 'personal', 'edit-link-form.html'));
});

export default router;
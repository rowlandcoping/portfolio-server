import express from 'express';
import path from 'path';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();
const viewDir = path.join(process.cwd(), 'views');

router.use(requireSession);

router.get(['/', '/.html'], (req, res) => {
   res.sendFile(path.join(viewDir, 'project', 'add-project.html'));
});
router.get('/edit', (req, res) => {
    res.sendFile(path.join(viewDir, 'project', 'edit-project.html'));
});
router.get(['/type', '/type.html'], (req, res) => {
   res.sendFile(path.join(viewDir, 'project', 'add-projtype.html'));
});
router.get('/type/edit', (req, res) => {
    res.sendFile(path.join(viewDir, 'project', 'edit-projtype.html'));
});


router.get(['/projectecosystem/:id'], (req, res) => {
    res.sendFile(path.join(viewDir, 'project', 'add-projectecosystem.html'));
});
router.get('/edit/:id', (req, res) => {
    res.sendFile(path.join(viewDir, 'project', 'edit-project-form.html'));
})
router.get('/type/edit/:id', (req, res) => {
    res.sendFile(path.join(viewDir, 'project', 'edit-projtype-form.html'));
})
router.get(['/projectecosystem/edit/:id'], (req, res) => {
    res.sendFile(path.join(viewDir, 'project', 'edit-projectecosystem-form.html'));
});

export default router;
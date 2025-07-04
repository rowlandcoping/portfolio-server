import express from 'express';
import path from 'path';
import requireSession from '../../middleware/requireSession.js';

const router = express.Router();
const viewDir = path.join(process.cwd(), 'views');

router.use(requireSession);

router.get(['/', '/.html'], (req, res) => {
   res.sendFile(path.join(viewDir, 'tech', 'add-tech.html'));
});
router.get('/edit', (req, res) => {
    res.sendFile(path.join(viewDir, 'tech', 'edit-tech.html'));
});

router.get(['/ecosystem', '/ecosystem.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'tech', 'add-ecosystem.html'));
});
router.get('/ecosystem/edit', (req, res) => {
    res.sendFile(path.join(viewDir, 'tech', 'edit-ecosystem.html'));
});

router.get(['/ecotype', '/ecotype.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'tech', 'add-ecotype.html'));
});
router.get('/ecotype/edit', (req, res) => {
    res.sendFile(path.join(viewDir, 'tech', 'edit-ecotype.html'));
})

router.get(['/techtype', '/techtype.html'], (req, res) => {
    res.sendFile(path.join(viewDir, 'tech', 'add-techtype.html'));
});
router.get('/techtype/edit', (req, res) => {
    res.sendFile(path.join(viewDir, 'tech', 'edit-techtype.html'));
})

router.get('/edit/:id', (req, res) => {
    res.sendFile(path.join(viewDir, 'tech', 'edit-tech-form.html'));
});
router.get('/ecosystem/edit/:id', (req, res) => {
    res.sendFile(path.join(viewDir, 'tech', 'edit-ecosystem-form.html'));
});
router.get('/ecotype/edit/:id', (req, res) => {
    res.sendFile(path.join(viewDir, 'tech', 'edit-ecotype-form.html'));
})
router.get('/techtype/edit/:id', (req, res) => {
    res.sendFile(path.join(viewDir, 'tech', 'edit-techtype-form.html'));
})



export default router;
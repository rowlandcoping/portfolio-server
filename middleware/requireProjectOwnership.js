import { query } from '../config/db.js';
import { logEvents } from "./logger.js";

const requireProjectOwnership = async (req, res, next) => {
    try {
        let isOwner = false;
        const projectId = req.body?.project; // for POST
        const id = req.params?.id;      // for GET/PATCH/DELETE
        const { userId, roles } = req.session;
        

        if (req.method === 'POST') {
            // POST: check ownership using projectId from body
            if (!projectId) return res.status(400).json({ message: 'Project ID required' });
            const result = await query(
                'SELECT "userId" FROM "Project" WHERE id = $1 LIMIT 1',
                [Number(projectId)]
            );
            const project = result.rows[0];
            if (!project) return res.status(404).json({ message: 'Project not found' });
            if (Number(project.userId) === Number(userId)) {
                isOwner = true;
            }
        } else {            
            if (!id) return res.status(400).json({ message: 'Project ID required' });
            const result = await query(
                'SELECT "projectId", "aboutId" FROM "ProjectEcosystem" WHERE id = $1 LIMIT 1',
                [Number(id)]
            );
            const ecosystem = result.rows[0];
            if (!ecosystem) return res.status(404).json({ message: 'Project Ecosystem not found' });
            if (ecosystem.projectId) {
                const idResult = await query(
                    'SELECT "userId" FROM "Project" WHERE id = $1 LIMIT 1',
                    [Number(ecosystem.projectId)]
                );
                const project = idResult.rows[0];
                if (Number(project.userId) === Number(userId)) {
                    isOwner = true;
                } 
            }
            if (!isOwner && ecosystem.aboutId) {
                const idResult = await query(
                    'SELECT "userId" FROM "About" WHERE id = $1 LIMIT 1',
                    [Number(ecosystem.aboutId)]
                );
                const about = idResult.rows[0];
                if (Number(about.userId) === Number(userId)) {
                    isOwner = true;
                } 
            }
        }

        const isAdmin = roles?.includes('admin') || roles?.includes('owner');

        if (!isOwner && !isAdmin) {
            logEvents('User attempted to access unowned resource','errLog.log');
            return res.status(403).json({ message: 'Permission Denied' });
        }
        next();
    } catch (err) {
        next(err);
    }
};

export default requireProjectOwnership;
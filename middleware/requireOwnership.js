import { query } from '../config/db.js';
import { logEvents } from "./logger.js";

const requireOwnership = async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    if (!id) return res.status(400).json({ message: 'Project ID required' });
    const { userId, roles } = req.session;
    console.log(userId)

    const result = await query(
        'SELECT * FROM "Project" WHERE "id"=$1 LIMIT 1',
        [Number(id)]
    );

    const project = result.rows[0];
    if (!project) return res.status(404).json({ message: 'No project found' });
    console.log(Number(project.userId))
    const isOwner = Number(project.userId) === userId;
    console.log(isOwner)
    const isAdmin = roles?.includes('admin') || roles?.includes('owner');

    if (!isOwner && !isAdmin) {
        logEvents('User attempted to access unowned resource','errLog.log');
        return res.status(403).json({ message: 'Permission Denied' });
    }
    
    if (req.method === 'GET') {
        req.project = project; // attach full object only for GET
    }
    
    next();
};

export default requireOwnership;
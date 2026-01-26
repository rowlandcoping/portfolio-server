import { query } from '../config/db.js';
import { logEvents } from "./logger.js";

const requireAboutOwnership = async (req, res, next) => {
    let isOwner = false;
    const aboutId = req.body?.about || req.params?.id;
    const { userId, roles } = req.session;

    const isAdmin = roles?.includes('admin') || roles?.includes('owner');
    
    if (!aboutId) return res.status(400).json({ message: 'Project ID required' });
    const result = await query(
        'SELECT "userId" FROM "About" WHERE id = $1 LIMIT 1',
        [Number(aboutId)]
    );
    const about = result.rows[0];
    if (!about) return res.status(404).json({ message: 'Project not found' });
    if (Number(about.userId) === Number(userId)) {
        isOwner = true;
    }

    if (!isOwner && !isAdmin) {
        logEvents('User attempted to access unowned resource','errLog.log');
        return res.status(403).json({ message: 'Permission Denied' });
    }
};

export default requireAboutOwnership;
import { query } from '../config/db.js';
import { logEvents } from "./logger.js";

const requireProfileOwnership = async (req, res, next) => {
    try {
        let isOwner = false;
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Link ID required' });
        const { userId, roles } = req.session;
        console.log(req.originalUrl)

        if (req.originalUrl.includes("links")) {
            try { 
                const result = await query(
                    'SELECT "userId" FROM "Link" WHERE id = $1 LIMIT 1',
                    [Number(id)]
                );
                const link = result.rows[0]
                if (Number(link.userId) === Number(userId)) {
                    isOwner = true;
                }
            } catch(err) {
                logEvents('User attempted to access unowned resource','errLog.log');
                return res.status(403).json({ message: 'Permission Denied' });
            }
        } else {
            try {
                const result = await query(
                    'SELECT "userId" FROM "Skill" WHERE id = $1 LIMIT 1',
                    [Number(id)]
                );
                const skill = result.rows[0]
                if (Number(skill.userId) === Number(userId)) {
                    isOwner = true;
                }
            } catch(err) {
                logEvents('User attempted to access unowned resource','errLog.log');
                return res.status(403).json({ message: 'Permission Denied' });
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

export default requireProfileOwnership;
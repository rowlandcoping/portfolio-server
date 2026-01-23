import { logEvents } from "./logger.js";

const requireAdmin = (req, res, next) => {
    const roles = req.session?.roles;
    if (!roles || (!roles.includes('admin') && !roles.includes('owner'))) {
        logEvents('Acess attempted with insufficent priviledges','errLog.log');
        return res.status(403).json({ message: 'Permission Denied' });
    }

    next();
};

export default requireAdmin;
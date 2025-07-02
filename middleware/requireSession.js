import { logEvents } from "./logger.js";

const requireSession = (req, res, next) => {
    if (!req.session?.userId) {
        logEvents('Unauthorized access attempt','errLog.log');
        return res.status(401).redirect('/login');
    }
    next();
}

export default requireSession;
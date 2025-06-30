import { logEvents } from "./logger.js";

const requireSession = (req, res, next) => {
    if (!req.session?.userId) {
        logEvents('Logout Unsuccessful','errLog.log');
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

export default requireSession;
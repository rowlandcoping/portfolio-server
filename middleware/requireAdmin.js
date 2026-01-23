const requireAdmin = (req, res, next) => {
    const roles = req.session?.roles;
    if (!roles || (!roles.includes('admin') && !roles.includes('owner'))) {
        return res.status(403).json({ message: 'User does not have the correct role' });
    }

    next();
};

export default requireAdmin;
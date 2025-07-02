export const redirectIfAuthenticated = (req, res, next) => {
    if (req.session?.userId) {
        return res.redirect('/dashboard');
    }
    next();
}
// Authentication middleware for admin routes

function requireAuth(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/admin/login');
}

function redirectIfAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return res.redirect('/admin');
    }
    next();
}

module.exports = {
    requireAuth,
    redirectIfAuthenticated
};

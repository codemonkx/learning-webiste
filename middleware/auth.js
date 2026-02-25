/**
 * Authentication middleware
 * Checks if user is logged in
 */
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}

/**
 * Admin authorization middleware
 * Checks if user is logged in and has admin role
 */
function requireAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
}

/**
 * Optional authentication middleware
 * Attaches user to request if logged in, but doesn't require it
 */
function optionalAuth(req, res, next) {
    // User info already in session if logged in
    next();
}

module.exports = {
    requireAuth,
    requireAdmin,
    optionalAuth
};

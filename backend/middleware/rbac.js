/**
 * Role-Based Access Control (RBAC) middleware for Express routes.
 *
 * Verifies that the authenticated user possesses at least one of the specified roles.
 *
 * @param {...string} allowedRoles - Allowed roles (e.g., 'patient', 'doctor', 'admin')
 */
function requireRole(...allowedRoles) {
  const normalizedAllowed = allowedRoles.map((r) => String(r).toLowerCase());

  return (req, res, next) => {
    const userRole = (req.user?.role || req.role || "").toLowerCase();

    if (!userRole) {
      return res.status(401).json({
        error: "Authentication required to access this resource.",
      });
    }

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        error: "Access denied. Insufficient role permissions.",
        requiredRoles: allowedRoles,
        userRole: req.user?.role || userRole,
      });
    }

    next();
  };
}

module.exports = { requireRole };

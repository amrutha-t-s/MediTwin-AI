const jwt = require("jsonwebtoken");
const prisma = require("../../prismaClient");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token missing",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;
    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role || "patient",
    };

    // Session revocation check for "Logout from all sessions"
    if (decoded.iat) {
      try {
        const tokenIssuedAt = new Date(decoded.iat * 1000);
        const revokedSession = await prisma.auditLog.findFirst({
          where: {
            userId: decoded.userId,
            action: "LOGOUT_ALL_SESSIONS",
            createdAt: { gt: tokenIssuedAt },
          },
        });

        if (revokedSession) {
          return res.status(401).json({
            message: "Session has been invalidated due to logout from all devices. Please log in again.",
            code: "SESSION_REVOKED",
          });
        }
      } catch (dbErr) {
        console.warn("Session check warning:", dbErr.message);
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
}

module.exports = authMiddleware;

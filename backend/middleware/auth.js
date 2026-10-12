const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

module.exports = async function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.userId = payload.userId;
    req.user = {
      id: payload.userId,
      userId: payload.userId,
      email: payload.email,
      role: payload.role || "patient",
    };

    // Session revocation check for "Logout from all sessions"
    if (payload.iat) {
      try {
        const tokenIssuedAt = new Date(payload.iat * 1000);
        const revokedSession = await prisma.auditLog.findFirst({
          where: {
            userId: payload.userId,
            action: "LOGOUT_ALL_SESSIONS",
            createdAt: { gt: tokenIssuedAt },
          },
        });

        if (revokedSession) {
          return res.status(401).json({
            error: "Session has been invalidated due to logout from all devices. Please log in again.",
            code: "SESSION_REVOKED",
          });
        }
      } catch (dbErr) {
        // If DB check fails, continue to not block valid users unexpectedly
        console.warn("Session check warning:", dbErr.message);
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

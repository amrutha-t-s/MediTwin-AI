const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Expected format:
    // Authorization: Bearer TOKEN
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token missing",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store authenticated user information
    // on the request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    // Continue to the protected route
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
}

module.exports = authMiddleware;

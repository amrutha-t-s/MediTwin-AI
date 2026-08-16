const prisma = require("../config/db");

async function healthCheck(req, res, next) {
  try {
    // Test the database connection
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "MediTwin API is running",
      database: "connected",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  healthCheck,
};

const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

// Use DATABASE_URL from .env, e.g. "file:./dev.db"
const connectionString = process.env.DATABASE_URL || "file:./dev.db";

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;

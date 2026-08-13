import * as dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";
import * as path from "path";

// Load .env from the same directory as prisma.config.ts
dotenv.config({
  path: path.join(__dirname, ".env"),
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

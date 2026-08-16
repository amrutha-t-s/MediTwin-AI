const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const healthRoutes = require("./routes/healthRoutes");

const app = express();

// ==============================
// Security
// ==============================

app.use(helmet());

// ==============================
// CORS
// ==============================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// ==============================
// Request logging
// ==============================

app.use(logger);

// ==============================
// JSON parsing
// ==============================

app.use(express.json());

// ==============================
// Health route
// ==============================

app.use("/api", healthRoutes);

// ==============================
// 404 handler
// ==============================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ==============================
// Error handler
// ==============================

app.use(errorHandler);

module.exports = app;

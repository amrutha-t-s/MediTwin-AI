const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const journalRoutes = require("./routes/journalRoutes");
const healthLogsRoutes = require("../routes/healthLogs");
const dashboardRoutes = require("../routes/dashboard");

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
// Root / API information
// ==============================

app.get("/", (req, res) => {
  res.json({
    name: "MediTwin API",
    version: "0.1.0",
    status: "running",
    message: "MediTwin backend is working",
    disclaimer:
      "MediTwin is a health-monitoring and educational prototype. It does not diagnose diseases, replace a doctor, or recommend changing medication.",
  });
});

// ==============================
// API Routes
// ==============================

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/health-logs", healthLogsRoutes);
app.use("/api/dashboard", dashboardRoutes);

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

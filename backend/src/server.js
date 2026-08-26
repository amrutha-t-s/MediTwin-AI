require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const entryRoutes = require("./routes/entries");
const insightRoutes = require("./routes/insights");
const scenarioRoutes = require("./routes/scenarios");

// Health Journal route
const journalRoutes = require("./src/routes/journalRoutes");

const app = express();

// ========================================
// Middleware
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

// ========================================
// Root / Health Check
// ========================================

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

// ========================================
// API Routes
// ========================================

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/entries", entryRoutes);

app.use("/api/insights", insightRoutes);

app.use("/api/scenarios", scenarioRoutes);

// Health Journal
app.use("/api/journal", journalRoutes);

// ========================================
// 404 Handler
// ========================================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// ========================================
// Error Handler
// ========================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// ========================================
// Start Server
// ========================================

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log(`🚀 MediTwin Backend running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("======================================");
});

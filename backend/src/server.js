const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("../routes/auth");
const profileRoutes = require("../routes/profile");
const onboardingRoutes = require("../routes/onboarding");
const entryRoutes = require("../routes/entries");
const insightRoutes = require("../routes/insights");
const scenarioRoutes = require("../routes/scenarios");

const app = express();

// ==========================
// Middleware
// ==========================

app.use(cors());
app.use(express.json());

// ==========================
// Health / Info
// ==========================

app.get("/", (req, res) => {
  res.json({
    name: "MediTwin API",
    version: "0.1.0",
    status: "running",
    disclaimer:
      "MediTwin is a health-monitoring and educational prototype. It does not diagnose diseases, replace a doctor, or recommend changing medication.",
  });
});

// ==========================
// Routes
// ==========================

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/onboarding", onboardingRoutes);

app.use("/api/entries", entryRoutes);

app.use("/api/insights", insightRoutes);

app.use("/api/scenarios", scenarioRoutes);

// ==========================
// 404
// ==========================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ==========================
// Error Handler
// ==========================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    error: "Internal server error",
  });
});

// ==========================
// Start Server
// ==========================

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`MediTwin API running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const entryRoutes = require("./routes/entries");
const insightRoutes = require("./routes/insights");
const scenarioRoutes = require("./routes/scenarios");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health / info endpoint
app.get("/", (req, res) => {
  res.json({
    name: "MediTwin API",
    version: "0.1.0",
    status: "running",
    disclaimer:
      "MediTwin is a health-monitoring and educational prototype. It does not diagnose diseases, replace a doctor, or recommend changing medication.",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/scenarios", scenarioRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MediTwin API running on port ${PORT}`);
});

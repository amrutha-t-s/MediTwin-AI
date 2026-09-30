require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const entryRoutes = require("./routes/entries");
const insightRoutes = require("./routes/insights");
const scenarioRoutes = require("./routes/scenarios");
const journalRoutes = require("./src/routes/journalRoutes");
const healthLogsRoutes = require("./routes/healthLogs");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

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

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/scenarios", scenarioRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/health-logs", healthLogsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log(`?? MediTwin Backend running on port ${PORT}`);
  console.log(`?? http://localhost:${PORT}`);
  console.log("======================================");
});

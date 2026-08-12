const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Simple health check
app.get("/", (req, res) => {
  res.json({
    name: "MediTwin API",
    version: "0.1.0",
    status: "running",
    disclaimer:
      "MediTwin is a health-monitoring and educational prototype. It does not diagnose diseases, replace a doctor, or recommend changing medication.",
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MediTwin API running on http://localhost:${PORT}`);
});

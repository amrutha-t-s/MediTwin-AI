const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

const UNIVERSAL_DISCLAIMER =
  "MediTwin is an educational wellness and lifestyle simulation prototype. " +
  "It does not diagnose diseases, replace professional medical consultations, " +
  "prescribe treatment, or recommend altering prescription medications. " +
  "Always consult a licensed medical clinician for health concerns.";

// Forwarder helper
async function proxyToMLService(endpoint, body, res) {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${ML_SERVICE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.warn(`[ML Service Warning] Call to ${endpoint} failed:`, err.message);
    return res.status(503).json({
      error: "ML Service Unavailable",
      message:
        "The Python Machine Learning service is currently offline or unreachable at " +
        ML_SERVICE_URL +
        ". Start the FastAPI service using 'uvicorn api.main:app --port 8000'.",
      disclaimer: UNIVERSAL_DISCLAIMER,
    });
  }
}

// GET /api/ml/health - Check Python ML microservice health
router.get("/health", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${ML_SERVICE_URL}/health`);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(503).json({
      status: "unavailable",
      message: "Python FastAPI ML engine is offline.",
      url: ML_SERVICE_URL,
      disclaimer: UNIVERSAL_DISCLAIMER,
    });
  }
});

// POST /api/ml/predict/diabetes-risk-pima
router.post("/predict/diabetes-risk-pima", async (req, res) => {
  return proxyToMLService("/predict/diabetes-risk-pima", req.body, res);
});

// POST /api/ml/predict/diabetes-risk-cdc
router.post("/predict/diabetes-risk-cdc", async (req, res) => {
  return proxyToMLService("/predict/diabetes-risk-cdc", req.body, res);
});

// POST /api/ml/predict/cardio-risk-framingham
router.post("/predict/cardio-risk-framingham", async (req, res) => {
  return proxyToMLService("/predict/cardio-risk-framingham", req.body, res);
});

// POST /api/ml/predict/cardio-risk
router.post("/predict/cardio-risk", async (req, res) => {
  return proxyToMLService("/predict/cardio-risk", req.body, res);
});

// POST /api/ml/predict/obesity-risk
router.post("/predict/obesity-risk", async (req, res) => {
  return proxyToMLService("/predict/obesity-risk", req.body, res);
});

// POST /api/ml/predict/stress-level
router.post("/predict/stress-level", async (req, res) => {
  return proxyToMLService("/predict/stress-level", req.body, res);
});

// POST /api/ml/predict/sleep-quality
router.post("/predict/sleep-quality", async (req, res) => {
  return proxyToMLService("/predict/sleep-quality", req.body, res);
});

// POST /api/ml/health-summary
router.post("/health-summary", async (req, res) => {
  return proxyToMLService("/health-summary", req.body, res);
});

module.exports = router;

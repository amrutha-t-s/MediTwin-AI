import api from "./api";

/**
 * MediTwin Machine Learning Service API Client
 *
 * CRITICAL SAFETY RULES:
 * - All outputs are educational screening estimates and wellness indicators.
 * - This service does NOT diagnose diseases, prescribe medication, or replace a medical professional.
 */

export const checkMLHealth = async () => {
  try {
    const res = await api.get("/ml/health");
    return res.data;
  } catch (error) {
    return {
      status: "unavailable",
      message: error.response?.data?.message || "ML Engine unreachable",
      disclaimer: "Educational simulation only.",
    };
  }
};

export const predictPimaDiabetes = async (data) => {
  const res = await api.post("/ml/predict/diabetes-risk-pima", data);
  return res.data;
};

export const predictCdcDiabetes = async (data) => {
  const res = await api.post("/ml/predict/diabetes-risk-cdc", data);
  return res.data;
};

export const predictFraminghamCardio = async (data) => {
  const res = await api.post("/ml/predict/cardio-risk-framingham", data);
  return res.data;
};

export const predictCardiovascular = async (data) => {
  const res = await api.post("/ml/predict/cardio-risk", data);
  return res.data;
};

export const predictObesity = async (data) => {
  const res = await api.post("/ml/predict/obesity-risk", data);
  return res.data;
};

export const predictStress = async (data) => {
  const res = await api.post("/ml/predict/stress-level", data);
  return res.data;
};

export const predictSleepQuality = async (data) => {
  const res = await api.post("/ml/predict/sleep-quality", data);
  return res.data;
};

export const getHealthSummary = async (data) => {
  const res = await api.post("/ml/health-summary", data);
  return res.data;
};

export default {
  checkMLHealth,
  predictPimaDiabetes,
  predictCdcDiabetes,
  predictFraminghamCardio,
  predictCardiovascular,
  predictObesity,
  predictStress,
  predictSleepQuality,
  getHealthSummary,
};

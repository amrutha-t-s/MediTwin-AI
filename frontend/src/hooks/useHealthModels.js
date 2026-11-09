import { useState, useEffect, useCallback } from "react";
import mlApi from "../services/mlApi";

/**
 * Custom React hook for accessing MediTwin's 7 machine learning models.
 * Handles state, asynchronous queries, loading, errors, and health check status.
 */
export function useHealthModels(initialBiometrics = null) {
  const [engineStatus, setEngineStatus] = useState({
    status: "checking",
    message: "Connecting to ML engine...",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState(null);

  // Check ML Service health on mount
  useEffect(() => {
    let isMounted = true;
    mlApi
      .checkMLHealth()
      .then((data) => {
        if (isMounted) {
          setEngineStatus({
            status: data.status === "healthy" ? "healthy" : "offline",
            message: data.status === "healthy" ? "7 ML Models Active" : data.message,
            modelsRegistered: data.models_registered || 0,
          });
        }
      })
      .catch((err) => {
        if (isMounted) {
          setEngineStatus({
            status: "offline",
            message: "Python ML engine offline",
            modelsRegistered: 0,
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Run comprehensive health-summary across all 7 models
  const runHealthAnalysis = useCallback(async (customBiometrics = null) => {
    setLoading(true);
    setError(null);
    try {
      const payload = customBiometrics || initialBiometrics || {};
      const res = await mlApi.getHealthSummary(payload);
      setResults(res.models || {});
      setSummary(res.overall_summary || "Educational assessment complete.");
      return res;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Could not generate educational predictions. Ensure ML microservice is running.";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [initialBiometrics]);

  return {
    engineStatus,
    loading,
    error,
    results,
    summary,
    runHealthAnalysis,
  };
}

export default useHealthModels;

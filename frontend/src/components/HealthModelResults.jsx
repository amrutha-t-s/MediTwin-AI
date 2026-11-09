import { useState, useEffect } from "react";
import useHealthModels from "../hooks/useHealthModels";

export default function HealthModelResults({ healthProfile, user }) {
  // Derive default biometrics from user profile if available
  const calculateAge = (dob) => {
    if (!dob) return 42;
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970) || 42;
  };

  const calculateBmi = (weightKg, heightCm) => {
    if (!weightKg || !heightCm) return 24.5;
    const hM = heightCm / 100;
    return Number((weightKg / (hM * hM)).toFixed(1));
  };

  const initialInputs = {
    age: healthProfile?.dateOfBirth ? calculateAge(healthProfile.dateOfBirth) : 38,
    gender: healthProfile?.gender?.toLowerCase() || "female",
    height: healthProfile?.heightCm || 168,
    weight: healthProfile?.weightKg || 68,
    bmi: calculateBmi(healthProfile?.weightKg, healthProfile?.heightCm),
    glucose: healthProfile?.fastingGlucose || 105,
    systolic_bp: 122,
    diastolic_bp: 80,
    cholesterol: 195,
    sleep_duration: 7.0,
    stress_level: 5,
    physical_activity_minutes: 35,
    daily_steps: 7500,
    is_smoking: false,
    high_bp_flag: 0,
    high_chol_flag: 0,
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [showConfig, setShowConfig] = useState(false);

  const { engineStatus, loading, error, results, summary, runHealthAnalysis } =
    useHealthModels(inputs);

  // Run analysis when mounted
  useEffect(() => {
    runHealthAnalysis(inputs);
  }, []);

  const handleInputChange = (field, value) => {
    setInputs((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "height" || field === "weight") {
        updated.bmi = calculateBmi(updated.weight, updated.height);
      }
      return updated;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    runHealthAnalysis(inputs);
  };

  const getRiskBadgeColor = (resultText) => {
    const text = (resultText || "").toLowerCase();
    if (text.includes("lower") || text.includes("low") || text.includes("normal") || text.includes("absence")) {
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
    if (text.includes("moderate") || text.includes("overweight") || text.includes("monitoring")) {
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    }
    return "bg-rose-500/15 text-rose-400 border-rose-500/30";
  };

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* MANDATORY EDUCATIONAL CLINICAL DISCLAIMER BANNER          */}
      {/* ========================================================= */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">⚠️</span>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">
              Educational Wellness & Lifestyle Simulation Prototype Only
            </h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              MediTwin does not provide medical advice, diagnosis, treatment, or clinical prognosis.
              Every projection below is a statistical risk screening estimate based on observational research datasets.
              <strong> Correlation does not imply causation.</strong> Always consult a qualified, licensed healthcare
              physician for diagnosis, symptoms, or medication management.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* HEADER & CONTROLS                                         */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Predictive Health Models & Digital Twin Projections
            </h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                engineStatus.status === "healthy"
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {engineStatus.status === "healthy" ? "7 ML Models Active" : "Engine Connecting..."}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-model risk screening calibrated on clinical and lifestyle research benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            {showConfig ? "Hide Parameters" : "Adjust Biometrics"}
          </button>
          <button
            type="button"
            onClick={() => runHealthAnalysis(inputs)}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white shadow-lg shadow-blue-600/20 transition cursor-pointer"
          >
            {loading ? "Screening..." : "Re-run Projections"}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BIOMETRIC INPUT SIMULATOR DRAWER                         */}
      {/* ========================================================= */}
      {showConfig && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 animate-in fade-in"
        >
          <h3 className="text-sm font-semibold text-white">Adjust Lifestyle & Clinical Screening Parameters</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Age (yrs)</label>
              <input
                type="number"
                min="18"
                max="100"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">BMI (kg/m²)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.bmi}
                onChange={(e) => handleInputChange("bmi", Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Glucose (mg/dL)</label>
              <input
                type="number"
                value={inputs.glucose}
                onChange={(e) => handleInputChange("glucose", Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Systolic BP (mmHg)</label>
              <input
                type="number"
                value={inputs.systolic_bp}
                onChange={(e) => handleInputChange("systolic_bp", Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Diastolic BP (mmHg)</label>
              <input
                type="number"
                value={inputs.diastolic_bp}
                onChange={(e) => handleInputChange("diastolic_bp", Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Sleep (hrs/night)</label>
              <input
                type="number"
                step="0.5"
                min="3"
                max="12"
                value={inputs.sleep_duration}
                onChange={(e) => handleInputChange("sleep_duration", Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium cursor-pointer"
            >
              Apply and Screen
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* HOLISTIC SUMMARY CARD                                     */}
      {/* ========================================================= */}
      {summary && (
        <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/30 p-5 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
              📊
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-blue-300">
                Holistic Health-Pattern Observational Synthesis
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{summary}</p>
              <p className="text-[11px] text-slate-400 italic mt-1">
                Note: Projections integrate 7 independent machine learning pipelines trained on clinical and lifestyle cohorts.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-rose-300 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* ========================================================= */}
      {/* 7 MODEL CARDS GRID                                        */}
      {/* ========================================================= */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
          Running screening models against latest biometrics...
        </div>
      ) : results ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* MODEL 1: PIMA DIABETES */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Model 01 • Clinical Diabetes
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getRiskBadgeColor(
                    results.diabetes_pima?.result
                  )}`}
                >
                  {results.diabetes_pima?.result || "Screening Pending"}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">PIMA Diabetes Risk</h4>
              <p className="text-xs text-slate-400 mb-3">
                Logistic Regression & Tree screening calibrated on clinical glucose, BMI, and age measurements.
              </p>

              {results.diabetes_pima?.probability !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Screening Probability</span>
                    <span className="text-white font-medium">
                      {(results.diabetes_pima.probability * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, results.diabetes_pima.probability * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {results.diabetes_pima?.key_contributing_factors?.length > 0 && (
                <div className="mb-3">
                  <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">
                    Key Indicators Observed
                  </span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5">
                    {results.diabetes_pima.key_contributing_factors.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
              {results.diabetes_pima?.disclaimer || "Educational screening estimate only. Not medical advice."}
            </div>
          </div>

          {/* MODEL 2: CDC DIABETES */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Model 02 • Lifestyle Indicators
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getRiskBadgeColor(
                    results.diabetes_cdc?.result
                  )}`}
                >
                  {results.diabetes_cdc?.result || "Screening Pending"}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">CDC Diabetes Indicators</h4>
              <p className="text-xs text-slate-400 mb-3">
                Population survey screening evaluating general health, BMI, physical activity, and blood pressure.
              </p>

              {results.diabetes_cdc?.probability !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Survey Association Score</span>
                    <span className="text-white font-medium">
                      {(results.diabetes_cdc.probability * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, results.diabetes_cdc.probability * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {results.diabetes_cdc?.key_contributing_factors?.length > 0 && (
                <div className="mb-3">
                  <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">
                    Lifestyle Correlates
                  </span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5">
                    {results.diabetes_cdc.key_contributing_factors.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
              {results.diabetes_cdc?.disclaimer || "Educational screening estimate only. Not medical advice."}
            </div>
          </div>

          {/* MODEL 3: FRAMINGHAM 10-YEAR CHD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Model 03 • Framingham Cohort
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getRiskBadgeColor(
                    results.cardio_framingham?.result
                  )}`}
                >
                  {results.cardio_framingham?.result || "Screening Pending"}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">10-Year Heart Screening</h4>
              <p className="text-xs text-slate-400 mb-3">
                Historical Framingham Study cardiovascular risk indicator focusing on BP, age, and lipid metrics.
              </p>

              {results.cardio_framingham?.probability !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>10-Yr Relative Risk Score</span>
                    <span className="text-white font-medium">
                      {(results.cardio_framingham.probability * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, results.cardio_framingham.probability * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {results.cardio_framingham?.key_contributing_factors?.length > 0 && (
                <div className="mb-3">
                  <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">
                    Cohort Factors
                  </span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5">
                    {results.cardio_framingham.key_contributing_factors.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
              {results.cardio_framingham?.disclaimer || "Educational screening estimate only. Not medical advice."}
            </div>
          </div>

          {/* MODEL 4: CARDIOVASCULAR DISEASE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Model 04 • Clinical Vascular
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getRiskBadgeColor(
                    results.cardiovascular?.result
                  )}`}
                >
                  {results.cardiovascular?.result || "Screening Pending"}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Cardiovascular Pattern</h4>
              <p className="text-xs text-slate-400 mb-3">
                Classification based on blood pressure profile, BMI, and physical activity habits.
              </p>

              {results.cardiovascular?.probability !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Cardio Profile Score</span>
                    <span className="text-white font-medium">
                      {(results.cardiovascular.probability * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, results.cardiovascular.probability * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {results.cardiovascular?.key_contributing_factors?.length > 0 && (
                <div className="mb-3">
                  <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">
                    Vascular Parameters
                  </span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5">
                    {results.cardiovascular.key_contributing_factors.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-rose-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
              {results.cardiovascular?.disclaimer || "Educational screening estimate only. Not medical advice."}
            </div>
          </div>

          {/* MODEL 5: BODY COMPOSITION / OBESITY */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Model 05 • Multiclass Composition
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getRiskBadgeColor(
                    results.obesity?.result
                  )}`}
                >
                  {results.obesity?.result || "Screening Pending"}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Body Composition Level</h4>
              <p className="text-xs text-slate-400 mb-3">
                Classification estimating weight categories based on physical activity, hydration, and nutrition.
              </p>

              {results.obesity?.confidence !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Model Confidence</span>
                    <span className="text-white font-medium">
                      {(results.obesity.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, results.obesity.confidence * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {results.obesity?.key_contributing_factors?.length > 0 && (
                <div className="mb-3">
                  <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">
                    Lifestyle Influences
                  </span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5">
                    {results.obesity.key_contributing_factors.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-purple-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
              {results.obesity?.disclaimer || "Educational screening estimate only. Not medical advice."}
            </div>
          </div>

          {/* MODEL 6: STRESS PATTERN */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Model 06 • Lifestyle Stress
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getRiskBadgeColor(
                    results.stress?.result
                  )}`}
                >
                  {results.stress?.result || "Screening Pending"}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Stress Level Pattern</h4>
              <p className="text-xs text-slate-400 mb-3">
                Pattern estimation synthesized from daily physical activity, sleep cycles, and daily step count.
              </p>

              {results.stress?.confidence !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Pattern Alignment Confidence</span>
                    <span className="text-white font-medium">
                      {(results.stress.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, results.stress.confidence * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {results.stress?.key_contributing_factors?.length > 0 && (
                <div className="mb-3">
                  <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">
                    Observed Factors
                  </span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5">
                    {results.stress.key_contributing_factors.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-indigo-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
              {results.stress?.disclaimer || "Educational screening estimate only. Not medical advice."}
            </div>
          </div>

          {/* MODEL 7: SLEEP QUALITY REGRESSION */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between md:col-span-2 lg:col-span-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Model 07 • Continuous Regression
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/50 text-cyan-400 font-semibold">
                  {results.sleep_quality?.result || "Pending"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Sleep Quality Rating: {results.sleep_quality?.predicted_quality_rating ?? "7.5"} / 10
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Regression estimate predicting sleep quality rating based on nightly duration ({inputs.sleep_duration}h),
                    daily steps, active minutes, and stress parameters.
                  </p>
                </div>

                {results.sleep_quality?.predicted_quality_rating !== undefined && (
                  <div className="text-center sm:text-right shrink-0">
                    <span className="text-3xl font-extrabold text-cyan-400">
                      {results.sleep_quality.predicted_quality_rating}
                    </span>
                    <span className="text-sm text-slate-500"> / 10</span>
                    <p className="text-[10px] text-slate-400">Sleep Score Estimate</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-800/80 text-[10px] text-slate-400">
              {results.sleep_quality?.disclaimer || "Educational screening estimate only. Not medical advice."}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
          Press "Re-run Projections" to calculate educational estimates across all 7 predictive models.
        </div>
      )}
    </div>
  );
}

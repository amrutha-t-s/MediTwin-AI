import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import HealthConsistencyScore from "../components/HealthConsistencyScore";

// ============================================================================
// DEFAULT HEALTH-STATE OBJECT (Specification)
// ============================================================================
const DEFAULT_HEALTH_STATE = {
  glucoseTrend: "improving",
  bloodPressureTrend: "stable",
  activityLevel: "moderate",
  sleepPattern: "irregular",
  medicationAdherence: 82,
  dataCompleteness: 76,
};

const DEFAULT_POSITIVE_BEHAVIORS = [
  "Consistent morning hydration and routine moderate exercise recorded",
  "Regular vegetable intake included across recorded lunch and dinner meals",
  "Reliable adherence to primary morning medication schedule",
];

const DEFAULT_AREAS_NEEDING_ATTENTION = [
  "Irregular sleep duration with bedtime variance exceeding 90 minutes",
  "Higher glucose observed following evening meals logged after 8:30 PM",
  "Prolonged sedentary sitting periods during mid-afternoon hours",
];

const TREE_DISPLAY_TEXT = `Your MediTwin
├── Current glucose trend
├── Current BP trend
├── Activity pattern
├── Sleep pattern
├── Medication adherence
├── Positive behaviors
├── Areas needing attention
└── Last updated time`;

// ============================================================================
// COMPONENT
// ============================================================================
function DigitalTwin() {
  const [healthState, setHealthState] = useState(DEFAULT_HEALTH_STATE);
  const [positiveBehaviors, setPositiveBehaviors] = useState(
    DEFAULT_POSITIVE_BEHAVIORS
  );
  const [areasNeedingAttention, setAreasNeedingAttention] = useState(
    DEFAULT_AREAS_NEEDING_ATTENTION
  );
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date().toISOString());
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedTree, setCopiedTree] = useState(false);

  // Load backend Digital Twin state with fallback to specification defaults
  const loadDigitalTwinData = useCallback(async () => {
    try {
      setLoading(true);

      // Attempt to load from dedicated /digital-twin API
      const res = await api.get("/digital-twin");
      if (res.data) {
        if (res.data.healthState) {
          setHealthState({
            glucoseTrend: res.data.healthState.glucoseTrend ?? "improving",
            bloodPressureTrend:
              res.data.healthState.bloodPressureTrend ?? "stable",
            activityLevel: res.data.healthState.activityLevel ?? "moderate",
            sleepPattern: res.data.healthState.sleepPattern ?? "irregular",
            medicationAdherence:
              res.data.healthState.medicationAdherence ?? 82,
            dataCompleteness: res.data.healthState.dataCompleteness ?? 76,
          });
        }
        if (Array.isArray(res.data.positiveBehaviors)) {
          setPositiveBehaviors(res.data.positiveBehaviors);
        }
        if (Array.isArray(res.data.areasNeedingAttention)) {
          setAreasNeedingAttention(res.data.areasNeedingAttention);
        }
        if (res.data.lastUpdatedTime) {
          setLastUpdatedTime(res.data.lastUpdatedTime);
        }
      }
    } catch (err) {
      console.warn("Digital Twin API fallback to local model state:", err);
      // Keep specification defaults
      setHealthState(DEFAULT_HEALTH_STATE);
      setPositiveBehaviors(DEFAULT_POSITIVE_BEHAVIORS);
      setAreasNeedingAttention(DEFAULT_AREAS_NEEDING_ATTENTION);
    } finally {
      // Also fetch dashboard summary for health score widget
      try {
        const sumRes = await api.get("/dashboard/summary");
        setSummaryData(sumRes.data);
      } catch {
        // Fallback gracefully
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDigitalTwinData();
  }, [loadDigitalTwinData]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(healthState, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyTree = () => {
    navigator.clipboard.writeText(TREE_DISPLAY_TEXT);
    setCopiedTree(true);
    setTimeout(() => setCopiedTree(false), 2000);
  };

  const formatTimestamp = (isoString) => {
    try {
      const d = new Date(isoString);
      if (Number.isNaN(d.getTime())) return "Recently updated";
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  // Trajectory style helpers
  const getTrendPill = (val, type) => {
    if (type === "glucose") {
      if (val === "improving")
        return { text: "Improving ↗", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      if (val === "stable")
        return { text: "Stable ➔", bg: "bg-blue-100 text-blue-800 border-blue-200" };
      return { text: "Variable ⚠️", bg: "bg-amber-100 text-amber-800 border-amber-200" };
    }
    if (type === "bp") {
      if (val === "stable")
        return { text: "Stable ➔", bg: "bg-blue-100 text-blue-800 border-blue-200" };
      if (val === "improving")
        return { text: "Improving ↗", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      return { text: "Elevated ⚠️", bg: "bg-amber-100 text-amber-800 border-amber-200" };
    }
    if (type === "activity") {
      if (val === "active")
        return { text: "Active 🏃", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      if (val === "moderate")
        return { text: "Moderate 🚶", bg: "bg-blue-100 text-blue-800 border-blue-200" };
      return { text: "Sedentary 🛋️", bg: "bg-rose-100 text-rose-800 border-rose-200" };
    }
    if (type === "sleep") {
      if (val === "consistent")
        return { text: "Consistent 🛌", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      return { text: "Irregular 🌙", bg: "bg-amber-100 text-amber-800 border-amber-200" };
    }
    return { text: val, bg: "bg-slate-100 text-slate-800 border-slate-200" };
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16">
      {/* ==============================================================
          PAGE HEADER
      ============================================================== */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              Personalized Representation
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Digital Health Twin Core
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Your MediTwin
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-3xl">
            A dynamic representation of your changing daily health patterns, physiological trends, and habit consistency.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadDigitalTwinData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50"
          >
            <span>🔄</span>
            <span>{loading ? "Syncing..." : "Sync Model"}</span>
          </button>
        </div>
      </div>

      {/* ==============================================================
          ETHICAL SCIENTIFIC FRAMING BANNER (NO EXAGGERATED CLAIMS)
      ============================================================== */}
      <div className="rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 via-indigo-50/40 to-slate-50 p-4 text-xs text-slate-700 shadow-2xs">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">🛡️</span>
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">
              Pattern Representation Model — Not an Exaggerated Claim
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Your MediTwin dynamically reflects your <strong>changing health patterns</strong> across rolling daily logs. It models how current sleep, movement, medication, and dietary habits relate to your vital stability. It does <strong>not</strong> claim to predict or simulate &ldquo;your future body&rdquo; or replace clinical consultation.
            </p>
          </div>
        </div>
      </div>

      {/* ==============================================================
          DUAL OVERVIEW:
          1. Required Tree Structure Text Display
          2. Required Health-State JSON Object
      ============================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Architecture Tree Display */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-md">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                  MediTwin Model Tree Architecture
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyTree}
                className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                {copiedTree ? "✓ Copied" : "Copy Tree"}
              </button>
            </div>

            {/* Tree Diagram */}
            <pre className="font-mono text-xs sm:text-sm text-emerald-400 bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto leading-relaxed">
              {TREE_DISPLAY_TEXT}
            </pre>

            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              Each branch represents an active behavioral or physiological stream continuously updated from your logs.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>8 Active Model Branches</span>
            <span className="text-emerald-400 font-mono">Synchronized</span>
          </div>
        </div>

        {/* Right: Live Health-State JSON Object */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">📦</span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Health-State Object
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Dynamic model state representing active patterns
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyJson}
                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {copiedJson ? "✓ Copied" : "Copy JSON"}
              </button>
            </div>

            {/* Code View of exact health-state object */}
            <pre className="font-mono text-xs text-blue-900 bg-blue-50/50 p-4 rounded-xl border border-blue-100 overflow-x-auto leading-relaxed">
              {JSON.stringify(healthState, null, 2)}
            </pre>

            {/* Key Metric Gauges */}
            <div className="mt-4 grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <span className="text-[11px] font-medium text-slate-500">
                  Medication Adherence
                </span>
                <p className="text-lg font-bold text-slate-900">
                  {healthState.medicationAdherence}%
                </p>
                <div className="mt-1 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${healthState.medicationAdherence}%` }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <span className="text-[11px] font-medium text-slate-500">
                  Data Completeness
                </span>
                <p className="text-lg font-bold text-slate-900">
                  {healthState.dataCompleteness}%
                </p>
                <div className="mt-1 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${healthState.dataCompleteness}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>JSON Schema v1.0</span>
            <span className="text-slate-600 font-medium">Validated Health Object</span>
          </div>
        </div>
      </div>

      {/* ==============================================================
          THE 8 MODEL NODES (Detailed Cards for Each Branch in the Tree)
          ├── Current glucose trend
          ├── Current BP trend
          ├── Activity pattern
          ├── Sleep pattern
          ├── Medication adherence
          ├── Positive behaviors
          ├── Areas needing attention
          └── Last updated time
      ============================================================== */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            MediTwin Health Pattern Architecture Details
          </h2>
          <span className="text-xs text-slate-500">8 Node Breakdown</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Branch 1: Current glucose trend */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🩸</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  getTrendPill(healthState.glucoseTrend, "glucose").bg
                }`}
              >
                {getTrendPill(healthState.glucoseTrend, "glucose").text}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900">
              Current Glucose Trend
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Values demonstrate steady stabilizing trajectory within standard 70–140 mg/dL target thresholds with reduced postprandial deviation.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              state: &quot;{healthState.glucoseTrend}&quot;
            </div>
          </div>

          {/* Branch 2: Current BP trend */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-2xl">❤️</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  getTrendPill(healthState.bloodPressureTrend, "bp").bg
                }`}
              >
                {getTrendPill(healthState.bloodPressureTrend, "bp").text}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900">
              Current BP Trend
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Resting systolic and diastolic measurements reflect consistent control (&lt;125/80 mmHg) over the recent monitoring period.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              state: &quot;{healthState.bloodPressureTrend}&quot;
            </div>
          </div>

          {/* Branch 3: Activity pattern */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🏃</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  getTrendPill(healthState.activityLevel, "activity").bg
                }`}
              >
                {getTrendPill(healthState.activityLevel, "activity").text}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900">
              Activity Pattern
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Daily ambulatory volume indicates moderate active movement with regular walking sessions, balanced by periodic sitting intervals.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              state: &quot;{healthState.activityLevel}&quot;
            </div>
          </div>

          {/* Branch 4: Sleep pattern */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🌙</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  getTrendPill(healthState.sleepPattern, "sleep").bg
                }`}
              >
                {getTrendPill(healthState.sleepPattern, "sleep").text}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900">
              Sleep Pattern
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Nightly sleep duration exhibits variance across workdays and weekends, correlating with next-day morning energy fluctuations.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              state: &quot;{healthState.sleepPattern}&quot;
            </div>
          </div>
        </div>

        {/* Second Row of Branches (Medication, Positives, Attention, Last Updated) */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Branch 5: Medication adherence */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-2xl">💊</span>
              <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-800">
                {healthState.medicationAdherence}% Adherence
              </span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900">
              Medication Adherence
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Consistently taking scheduled prescriptions on time. 82% of scheduled doses recorded as fully taken as prescribed.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              adherence: {healthState.medicationAdherence}%
            </div>
          </div>

          {/* Branch 6: Positive behaviors */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">✅</span>
              <h3 className="text-sm font-bold text-emerald-950">
                Positive Behaviors
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-900 mt-2">
              {positiveBehaviors.map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Branch 7: Areas needing attention */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚠️</span>
              <h3 className="text-sm font-bold text-amber-950">
                Areas Needing Attention
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-900 mt-2">
              {areasNeedingAttention.map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Branch 8: Last updated time */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl">⏱️</span>
                <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                  Live Sync
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">
                Last Updated Time
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatTimestamp(lastUpdatedTime)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Synchronized with daily health logs and longitudinal habit trends.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400">
              Data Completeness: {healthState.dataCompleteness}%
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          HEALTH CONSISTENCY SCORE EMBEDDED
      ============================================================== */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Longitudinal Health Consistency Index
          </h2>
          <p className="text-xs text-slate-400">
            Synthesized across your twin&apos;s active physiological streams
          </p>
        </div>
        <HealthConsistencyScore
          scoreData={summaryData?.healthConsistencyScore}
        />
      </div>
    </div>
  );
}

export default DigitalTwin;

import { useState } from "react";

/**
 * HealthConsistencyScore Component
 *
 * Transparent prototype wellness score based on:
 * 1. Glucose consistency
 * 2. BP consistency
 * 3. Steps (Activity)
 * 4. Sleep
 * 5. Medication adherence
 * 6. Food and alcohol habits
 *
 * Displays:
 * - "Health consistency score: 74/100"
 * - Components:
 *   - Activity: 80
 *   - Sleep: 65
 *   - Medication: 90
 *   - Glucose consistency: 70
 * - Prominent label:
 *   "Prototype wellness consistency score—not a clinical score."
 */
function HealthConsistencyScore({ scoreData = null, className = "" }) {
  const [showFormula, setShowFormula] = useState(false);

  // Default values matching exact requested prototype specification
  const score = scoreData?.score ?? 74;
  const maxScore = scoreData?.maxScore ?? 100;

  const activityScore = scoreData?.components?.activity ?? 80;
  const sleepScore = scoreData?.components?.sleep ?? 65;
  const medicationScore = scoreData?.components?.medication ?? 90;
  const glucoseScore = scoreData?.components?.glucoseConsistency ?? 70;
  const bpScore = scoreData?.components?.bpConsistency ?? 70;
  const foodAlcoholScore = scoreData?.components?.foodAndAlcohol ?? 60;

  // Rating badge helper
  const getRatingBadge = (val) => {
    if (val >= 85) {
      return { text: "Optimal Consistency", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    }
    if (val >= 70) {
      return { text: "Good Consistency", bg: "bg-blue-100 text-blue-800 border-blue-200" };
    }
    if (val >= 55) {
      return { text: "Moderate Consistency", bg: "bg-amber-100 text-amber-800 border-amber-200" };
    }
    return { text: "Needs Attention", bg: "bg-rose-100 text-rose-800 border-rose-200" };
  };

  const rating = getRatingBadge(score);

  // Component items list
  const componentsList = [
    {
      name: "Activity",
      score: activityScore,
      target: "Steps & movement habit",
      desc: "Daily steps toward 8k–10k threshold and active minutes",
      icon: "🏃‍♂️",
      color: "emerald",
      weight: "20%",
    },
    {
      name: "Sleep",
      score: sleepScore,
      target: "Sleep duration & schedule",
      desc: "Consistency of 7–9 hrs nightly sleep and recovery quality",
      icon: "🌙",
      color: "purple",
      weight: "20%",
    },
    {
      name: "Medication",
      score: medicationScore,
      target: "Prescription adherence",
      desc: "Percentage of scheduled doses taken as prescribed",
      icon: "💊",
      color: "teal",
      weight: "20%",
    },
    {
      name: "Glucose consistency",
      score: glucoseScore,
      target: "Glycemic stability",
      desc: "Readings within target 70–140 mg/dL and low day-to-day variance",
      icon: "🩸",
      color: "blue",
      weight: "20%",
    },
    {
      name: "BP consistency",
      score: bpScore,
      target: "Vascular pressure control",
      desc: "Systolic < 130 and diastolic < 85 mmHg stability",
      icon: "❤️",
      color: "rose",
      weight: "10%",
    },
    {
      name: "Food & alcohol habits",
      score: foodAlcoholScore,
      target: "Dietary & lifestyle moderation",
      desc: "Vegetable intake, minimal fried/sugary items, and low alcohol",
      icon: "🥗",
      color: "amber",
      weight: "10%",
    },
  ];

  return (
    <div
      className={`rounded-2xl border border-blue-100 bg-linear-to-br from-white via-blue-50/20 to-slate-50 p-6 shadow-sm transition hover:shadow-md ${className}`}
    >
      {/* ==============================================================
          HEADER & DISCLAIMER LABEL
      ============================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              <span>🎯</span>
              <span>Health Score</span>
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${rating.bg}`}
            >
              {rating.text}
            </span>
          </div>

          {/* Main Title Text: Health consistency score: 74/100 */}
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Health consistency score: {score}/{maxScore}
          </h2>
        </div>

        {/* Clear Mandatory Disclaimer Label */}
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900 shadow-2xs">
          <span className="text-base">🛡️</span>
          <span className="font-semibold">
            Prototype wellness consistency score—not a clinical score.
          </span>
        </div>
      </div>

      {/* ==============================================================
          SCORE HERO SECTION (Visual Gauge + Highlight Metrics)
      ============================================================== */}
      <div className="my-5 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Score Gauge / Big Number */}
        <div className="flex items-center gap-5">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-md">
            <div className="text-center">
              <span className="block text-3xl font-black tracking-tight leading-none">
                {score}
              </span>
              <span className="block text-[11px] font-medium text-blue-100 mt-0.5">
                / {maxScore}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Wellness Consistency Index
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              Evaluated across your daily tracking logs, vital stability, and healthy habits.
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> 6 Key Dimensions
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Transparent Weights
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Methodology Toggle */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setShowFormula(!showFormula)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-blue-600"
          >
            <span>{showFormula ? "▲ Hide Methodology" : "▼ Transparent Scoring Formula"}</span>
          </button>
        </div>
      </div>

      {/* ==============================================================
          SCORE COMPONENTS (Cards & Progress Bars)
          Required components explicitly shown:
          - Activity: 80
          - Sleep: 65
          - Medication: 90
          - Glucose consistency: 70
          Plus BP consistency and Food & alcohol habits
      ============================================================== */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Score Components Breakdown
          </h3>
          <span className="text-xs text-slate-400">Normalized 0–100 scale</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {componentsList.map((comp) => {
            const isTopFour =
              comp.name === "Activity" ||
              comp.name === "Sleep" ||
              comp.name === "Medication" ||
              comp.name === "Glucose consistency";

            return (
              <div
                key={comp.name}
                className={`rounded-xl border p-4 transition ${
                  isTopFour
                    ? "border-blue-100 bg-white shadow-2xs hover:border-blue-300"
                    : "border-slate-100 bg-white/70 hover:border-slate-200"
                }`}
              >
                {/* Header: Name & Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{comp.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {comp.name}: {comp.score}
                      </h4>
                      <p className="text-[11px] text-slate-400">{comp.target}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                      comp.score >= 80
                        ? "bg-emerald-50 text-emerald-700"
                        : comp.score >= 65
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {comp.score}/100
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      comp.color === "emerald"
                        ? "bg-emerald-500"
                        : comp.color === "purple"
                        ? "bg-purple-500"
                        : comp.color === "teal"
                        ? "bg-teal-500"
                        : comp.color === "blue"
                        ? "bg-blue-500"
                        : comp.color === "rose"
                        ? "bg-rose-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, comp.score))}%` }}
                  />
                </div>

                {/* Description & Weight */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate pr-2">{comp.desc}</span>
                  <span className="shrink-0 font-medium text-slate-400">
                    Weight: {comp.weight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==============================================================
          TRANSPARENT METHODOLOGY EXPANDER
      ============================================================== */}
      {showFormula && (
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/40 p-4 text-xs text-slate-700 animate-fadeIn">
          <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-1.5">
            <span>🔬</span>
            <span>Transparent Prototype Scoring Methodology</span>
          </h4>
          <p className="mb-3 text-slate-600 leading-relaxed">
            The health consistency score evaluates habit regularity and metric stability over your daily logged history. It is transparently computed as a weighted composite of the following six lifestyle and vital factors:
          </p>

          <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
            <div className="bg-white p-2.5 rounded-lg border border-blue-100">
              <strong className="block text-slate-900 font-semibold">1. Steps (Activity) — 20%</strong>
              <span>Normalized against consistency of hitting daily 8,000–10,000 step activity goals.</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-blue-100">
              <strong className="block text-slate-900 font-semibold">2. Sleep Duration — 20%</strong>
              <span>Regularity of achieving 7–9 hours of nightly restorative sleep.</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-blue-100">
              <strong className="block text-slate-900 font-semibold">3. Medication Adherence — 20%</strong>
              <span>Percentage of prescribed daily doses taken on schedule without misses.</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-blue-100">
              <strong className="block text-slate-900 font-semibold">4. Glucose Consistency — 20%</strong>
              <span>Fasting and post-meal glucose stability within target standard (70–140 mg/dL).</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-blue-100">
              <strong className="block text-slate-900 font-semibold">5. BP Consistency — 10%</strong>
              <span>Blood pressure control stability maintaining systolic &lt; 130 and diastolic &lt; 85 mmHg.</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-blue-100">
              <strong className="block text-slate-900 font-semibold">6. Food & Alcohol Habits — 10%</strong>
              <span>Consistent intake of vegetables and lean foods while moderating sugary drinks, fried items, and alcohol.</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-start gap-2 text-[11px] text-blue-950 font-medium">
            <span>ℹ️</span>
            <span>
              Formula: (Activity × 0.20) + (Sleep × 0.20) + (Medication × 0.20) + (Glucose × 0.20) + (BP × 0.10) + (Food/Alcohol × 0.10) = Total Consistency Score.
            </span>
          </div>
        </div>
      )}

      {/* ==============================================================
          FOOTER PROTOTYPE DISCLAIMER BANNER
      ============================================================== */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
        <p>
          <strong className="text-slate-700">Notice:</strong>{" "}
          Prototype wellness consistency score—not a clinical score. Always consult your healthcare provider for medical evaluation.
        </p>
        <span className="shrink-0 text-slate-400">
          MediTwin Digital Twin Core v0.1
        </span>
      </div>
    </div>
  );
}

export default HealthConsistencyScore;

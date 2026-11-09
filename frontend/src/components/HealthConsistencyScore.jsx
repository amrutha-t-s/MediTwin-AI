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
      return { text: "Optimal Consistency", bg: "bg-emerald-950/60 text-emerald-400 border-emerald-500/30" };
    }
    if (val >= 70) {
      return { text: "Good Consistency", bg: "bg-blue-950/60 text-blue-400 border-blue-500/30" };
    }
    if (val >= 55) {
      return { text: "Moderate Consistency", bg: "bg-amber-950/60 text-amber-400 border-amber-500/30" };
    }
    return { text: "Needs Attention", bg: "bg-red-950/60 text-red-400 border-red-500/30" };
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
      className={`rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl text-slate-100 transition hover:border-blue-500/40 ${className}`}
    >
      {/* ==============================================================
          HEADER & DISCLAIMER LABEL
      ============================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-950/60 border border-blue-500/40 px-3 py-1 text-xs font-semibold text-blue-400">
              <span>🎯</span>
              <span>Health Score</span>
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold border ${rating.bg}`}
            >
              {rating.text}
            </span>
          </div>

          {/* Main Title Text: Health consistency score: 74/100 */}
          <h2 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Health consistency score: <span className="text-blue-400">{score}</span>/{maxScore}
          </h2>
        </div>

        {/* Clear Mandatory Disclaimer Label */}
        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/30 px-3.5 py-2 text-xs font-medium text-amber-300">
          <span className="text-base shrink-0">🛡️</span>
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
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30">
            <div className="text-center">
              <span className="block text-3xl font-black tracking-tight leading-none text-white">
                {score}
              </span>
              <span className="block text-[11px] font-medium text-blue-200 mt-1">
                / {maxScore}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Wellness Consistency Index
            </p>
            <p className="mt-1 text-sm font-medium text-slate-300">
              Evaluated across your daily tracking logs, vital stability, and healthy habits.
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> 6 Key Dimensions
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400" /> Transparent Weights
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Methodology Toggle */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setShowFormula(!showFormula)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white cursor-pointer"
          >
            <span>{showFormula ? "▲ Hide Methodology" : "▼ Transparent Scoring Formula"}</span>
          </button>
        </div>
      </div>

      {/* ==============================================================
          SCORE COMPONENTS (Cards & Progress Bars)
      ============================================================== */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
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
                    ? "border-slate-800 bg-[#090d16] hover:border-blue-500/40"
                    : "border-slate-800/80 bg-[#090d16]/70 hover:border-slate-700"
                }`}
              >
                {/* Header: Name & Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{comp.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {comp.name}: {comp.score}
                      </h4>
                      <p className="text-[11px] text-slate-400">{comp.target}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-lg px-2 py-0.5 text-xs font-bold ${
                      comp.score >= 80
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                        : comp.score >= 65
                        ? "bg-blue-950/60 text-blue-400 border border-blue-500/30"
                        : "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {comp.score}/100
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      comp.color === "emerald"
                        ? "bg-emerald-500"
                        : comp.color === "purple"
                        ? "bg-purple-500"
                        : comp.color === "teal"
                        ? "bg-cyan-500"
                        : comp.color === "blue"
                        ? "bg-blue-500"
                        : comp.color === "rose"
                        ? "bg-red-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, comp.score))}%` }}
                  />
                </div>

                {/* Description & Weight */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
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
        <div className="mt-5 rounded-xl border border-blue-500/30 bg-[#090d16] p-4 text-xs text-slate-300">
          <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-1.5 text-sm">
            <span>🔬</span>
            <span>Transparent Prototype Scoring Methodology</span>
          </h4>
          <p className="mb-3 text-slate-400 leading-relaxed">
            The health consistency score evaluates habit regularity and metric stability over your daily logged history. It is transparently computed as a weighted composite of the following six lifestyle and vital factors:
          </p>

          <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
            <div className="bg-[#0d1322] p-3 rounded-xl border border-slate-800">
              <strong className="block text-white font-semibold mb-1">1. Steps (Activity) — 20%</strong>
              <span className="text-slate-400">Normalized against consistency of hitting daily 8,000–10,000 step activity goals.</span>
            </div>

            <div className="bg-[#0d1322] p-3 rounded-xl border border-slate-800">
              <strong className="block text-white font-semibold mb-1">2. Sleep Duration — 20%</strong>
              <span className="text-slate-400">Regularity of achieving 7–9 hours of nightly restorative sleep.</span>
            </div>

            <div className="bg-[#0d1322] p-3 rounded-xl border border-slate-800">
              <strong className="block text-white font-semibold mb-1">3. Medication Adherence — 20%</strong>
              <span className="text-slate-400">Percentage of prescribed daily doses taken on schedule without misses.</span>
            </div>

            <div className="bg-[#0d1322] p-3 rounded-xl border border-slate-800">
              <strong className="block text-white font-semibold mb-1">4. Glucose Consistency — 20%</strong>
              <span className="text-slate-400">Fasting and post-meal glucose stability within target standard (70–140 mg/dL).</span>
            </div>

            <div className="bg-[#0d1322] p-3 rounded-xl border border-slate-800">
              <strong className="block text-white font-semibold mb-1">5. BP Consistency — 10%</strong>
              <span className="text-slate-400">Blood pressure control stability maintaining systolic &lt; 130 and diastolic &lt; 85 mmHg.</span>
            </div>

            <div className="bg-[#0d1322] p-3 rounded-xl border border-slate-800">
              <strong className="block text-white font-semibold mb-1">6. Food & Alcohol Habits — 10%</strong>
              <span className="text-slate-400">Consistent intake of vegetables and lean foods while moderating sugary drinks, fried items, and alcohol.</span>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-start gap-2 text-[11px] text-blue-300 font-medium">
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
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-800 pt-3">
        <p>
          <strong className="text-slate-300">Notice:</strong>{" "}
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

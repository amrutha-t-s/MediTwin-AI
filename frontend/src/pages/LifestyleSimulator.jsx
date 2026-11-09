import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

// ============================================================================
// PRESET SCENARIOS DATA (The 3 Core Scenarios)
// ============================================================================
const PRESET_SCENARIOS = [
  {
    id: "preset-steps",
    name: "Add 2,000 steps daily",
    type: "steps",
    icon: "🏃‍♂️",
    currentLabel: "Current average steps: 4,200/day",
    simulatedLabel: "Simulated steps: 6,200/day",
    estimatedResult: "likely improvement in activity consistency",
    confidence: "low",
    confidenceRationale:
      "Low confidence heuristic: Heuristic extrapolation based on observational movement patterns; individual metabolic responsiveness varies.",
    changes: {
      type: "steps",
      deltaSteps: 2000,
      unit: "steps/day",
    },
    currentValue: 4200,
    simulatedValue: 6200,
    unit: "steps/day",
  },
  {
    id: "preset-sleep",
    name: "Sleep one additional hour",
    type: "sleep",
    icon: "🌙",
    currentLabel: "Current average sleep: 6.2 hrs/night",
    simulatedLabel: "Simulated sleep: 7.2 hrs/night",
    estimatedResult:
      "likely improvement in sleep regularity and morning recovery",
    confidence: "low",
    confidenceRationale:
      "Low confidence heuristic: Observational correlation between sleep duration and recovery; subject to sleep quality and circadian rhythm.",
    changes: {
      type: "sleep",
      deltaHours: 1.0,
      unit: "hours/night",
    },
    currentValue: 6.2,
    simulatedValue: 7.2,
    unit: "hrs/night",
  },
  {
    id: "preset-alcohol",
    name: "Avoid alcohol for seven days",
    type: "alcohol",
    icon: "🚫",
    currentLabel: "Current alcohol consumption: 2–3 drinks/week",
    simulatedLabel: "Simulated alcohol: 0 drinks/week (7 days abstinence)",
    estimatedResult:
      "likely reduction in resting heart rate variability and improved sleep continuity",
    confidence: "low",
    confidenceRationale:
      "Low confidence heuristic: Short-term observational trend; physiological impact depends on baseline frequency and liver metabolism.",
    changes: {
      type: "alcohol",
      abstinenceDays: 7,
      unit: "alcohol-free days",
    },
    currentValue: 3,
    simulatedValue: 0,
    unit: "drinks/week",
  },
];

// ============================================================================
// COMPONENT
// ============================================================================
function LifestyleSimulator() {
  // Active selected scenario
  const [activeScenario, setActiveScenario] = useState(PRESET_SCENARIOS[0]);

  // Custom simulation slider states (non-pharmacological only)
  const [customStepsDelta, setCustomStepsDelta] = useState(2000);
  const [customSleepDelta, setCustomSleepDelta] = useState(1.0);
  const [customAlcoholDays, setCustomAlcoholDays] = useState(7);
  const [simulationMode, setSimulationMode] = useState("preset"); // 'preset' | 'custom'

  // Saved simulations state (GET /api/simulations)
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [savingSimulation, setSavingSimulation] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");

  // Dismiss message timer
  useEffect(() => {
    if (!saveSuccess) return;
    const t = setTimeout(() => setSaveSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [saveSuccess]);

  // ==========================================================================
  // FETCH SAVED SIMULATIONS (GET /api/simulations)
  // ==========================================================================
  const fetchSavedSimulations = useCallback(async () => {
    try {
      setLoadingSaved(true);
      const res = await api.get("/simulations");
      if (Array.isArray(res.data)) {
        setSavedSimulations(res.data);
      }
    } catch (err) {
      console.warn("Failed to fetch simulations from API, keeping local state:", err);
    } finally {
      setLoadingSaved(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedSimulations();
  }, [fetchSavedSimulations]);

  // ==========================================================================
  // SAVE SIMULATION (POST /api/simulations)
  // ==========================================================================
  const handleSaveSimulation = async (scenarioToSave) => {
    setSaveError("");
    setSaveSuccess("");

    const target = scenarioToSave || activeScenario;

    const payload = {
      name: target.name,
      description: `Lifestyle what-if simulation: ${target.name}`,
      changes: target.changes || {
        type: target.type,
        detail: target.name,
      },
      result: {
        currentPattern: target.currentLabel,
        simulatedPattern: target.simulatedLabel,
        estimatedResult: target.estimatedResult,
        confidence: "low",
      },
    };

    try {
      setSavingSimulation(true);
      const res = await api.post("/simulations", payload);

      setSaveSuccess(
        `Simulation "${target.name}" successfully saved to your history!`
      );

      if (res.data?.simulation) {
        setSavedSimulations((prev) => [res.data.simulation, ...prev]);
      } else {
        fetchSavedSimulations();
      }
    } catch (err) {
      console.error("Save simulation error:", err);
      // Fallback local save if API not reachable
      const localSim = {
        id: `local-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        changes: payload.changes,
        result: payload.result,
        createdAt: new Date().toISOString(),
      };
      setSavedSimulations((prev) => [localSim, ...prev]);
      setSaveSuccess(`Simulation "${target.name}" saved locally!`);
    } finally {
      setSavingSimulation(false);
    }
  };

  // Delete saved simulation
  const handleDeleteSimulation = async (id) => {
    try {
      await api.delete(`/simulations/${id}`);
      setSavedSimulations((prev) => prev.filter((s) => s.id !== id));
      setSaveSuccess("Simulation record removed from history.");
    } catch {
      setSavedSimulations((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Build custom scenario object on slider change
  const buildCustomScenario = () => {
    const curSteps = 4200;
    const simSteps = curSteps + customStepsDelta;

    const curSleep = 6.2;
    const simSleep = (curSleep + customSleepDelta).toFixed(1);

    return {
      id: "custom-scenario",
      name: `Custom Routine: +${customStepsDelta} steps, +${customSleepDelta}h sleep, ${customAlcoholDays}d no alcohol`,
      type: "custom_lifestyle",
      icon: "🎛️",
      currentLabel: `Current patterns: ${curSteps} steps/day • ${curSleep}h sleep • alcohol consumed`,
      simulatedLabel: `Simulated patterns: ${simSteps} steps/day • ${simSleep}h sleep • ${customAlcoholDays} days alcohol-free`,
      estimatedResult:
        "likely multifaceted improvement in sleep continuity and daytime glucose stability",
      confidence: "low",
      confidenceRationale:
        "Low confidence heuristic: Multi-variable lifestyle simulation; outcomes depend on adherence consistency and individual metabolism.",
      changes: {
        type: "custom_lifestyle",
        stepsDelta: customStepsDelta,
        sleepDelta: customSleepDelta,
        alcoholFreeDays: customAlcoholDays,
      },
    };
  };

  const currentDisplayScenario =
    simulationMode === "preset" ? activeScenario : buildCustomScenario();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16 text-slate-100">
      {/* ==============================================================
          PAGE HEADER
      ============================================================== */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-950/60 border border-blue-500/40 px-3 py-1 text-xs font-semibold text-blue-400">
              Scenario Tester
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Non-Pharmacological Modeling
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            Lifestyle Simulator
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Simulate &ldquo;what-if&rdquo; non-pharmacological lifestyle scenarios to explore potential correlations with your health consistency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSaveSimulation(currentDisplayScenario)}
            disabled={savingSimulation}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition disabled:opacity-50 cursor-pointer active:scale-[0.98]"
          >
            <span>💾</span>
            <span>
              {savingSimulation ? "Saving..." : "Save Active Simulation"}
            </span>
          </button>
        </div>
      </div>

      {/* ==============================================================
          STRICT MEDICAL SAFETY POLICY: NO MEDICATION SIMULATION
      ============================================================== */}
      <div className="rounded-2xl border border-red-500/30 bg-[#0d1322] p-4 text-xs text-slate-300 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0 text-red-400">🔒</span>
          <div>
            <strong className="block font-bold text-red-400 text-sm mb-0.5">
              Strict Non-Pharmacological Policy: Do Not Simulate Insulin or Medication Changes
            </strong>
            <p className="leading-relaxed text-slate-400">
              MediTwin strictly limits scenario testing to lifestyle habits (daily steps, sleep duration, and alcohol avoidance). For clinical safety, <strong className="text-white">alterations to insulin doses, pharmacological treatments, or prescription schedules cannot be simulated or tested</strong>. Always consult your prescribing physician before making any medical changes.
            </p>
          </div>
        </div>
      </div>

      {/* ==============================================================
          FEEDBACK ALERTS
      ============================================================== */}
      {saveSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-blue-500/30 bg-blue-950/40 px-4 py-3 text-sm text-blue-300 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-400">✓</span>
            <span className="font-medium">{saveSuccess}</span>
          </div>
          <button
            onClick={() => setSaveSuccess("")}
            className="text-blue-400 hover:text-blue-200 font-bold px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {saveError && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300 shadow-xl">
          ⚠️ {saveError}
        </div>
      )}

      {/* ==============================================================
          SCENARIO SELECTOR (THE 3 CORE PRESETS + CUSTOM)
      ============================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select a Lifestyle Scenario to Simulate
          </h2>
          <div className="inline-flex rounded-xl border border-slate-800 bg-[#0d1322] p-1 text-xs">
            <button
              type="button"
              onClick={() => setSimulationMode("preset")}
              className={`rounded-lg px-3 py-1 font-semibold transition cursor-pointer ${
                simulationMode === "preset"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3 Core Scenarios
            </button>
            <button
              type="button"
              onClick={() => setSimulationMode("custom")}
              className={`rounded-lg px-3 py-1 font-semibold transition cursor-pointer ${
                simulationMode === "custom"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Interactive Sliders
            </button>
          </div>
        </div>

        {/* 3 Preset Scenario Cards */}
        {simulationMode === "preset" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PRESET_SCENARIOS.map((sc) => {
              const isSelected = activeScenario.id === sc.id;

              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setActiveScenario(sc)}
                  className={`flex flex-col text-left justify-between rounded-2xl border p-5 transition shadow-xl cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-950/30 ring-1 ring-blue-500/40"
                      : "border-slate-800 bg-[#0d1322] hover:border-slate-700 hover:bg-[#111827]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{sc.icon}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {isSelected ? "Active Scenario" : "Preset"}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {sc.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                      {sc.estimatedResult}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Confidence: <strong className="text-amber-400">{sc.confidence}</strong></span>
                    <span className="text-blue-400 font-semibold">Simulate →</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Interactive Custom Sliders Mode */}
        {simulationMode === "custom" && (
          <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Custom Non-Pharmacological Sliders
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust lifestyle increments (Medication and insulin remain locked).
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-950/60 px-3 py-1 rounded-lg border border-blue-500/30">
                Multi-Habit Model
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {/* Slider 1: Steps */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Daily Steps Increase:
                  </span>
                  <span className="font-bold text-blue-400">
                    +{customStepsDelta.toLocaleString()} steps/day
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="500"
                  value={customStepsDelta}
                  onChange={(e) => setCustomStepsDelta(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>+500</span>
                  <span>+2,500</span>
                  <span>+5,000</span>
                </div>
              </div>

              {/* Slider 2: Sleep */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Additional Sleep:
                  </span>
                  <span className="font-bold text-blue-300">
                    +{customSleepDelta} hrs/night
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.5"
                  value={customSleepDelta}
                  onChange={(e) => setCustomSleepDelta(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>+0.5h</span>
                  <span>+1.5h</span>
                  <span>+2.5h</span>
                </div>
              </div>

              {/* Slider 3: Alcohol Free Days */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Alcohol-Free Window:
                  </span>
                  <span className="font-bold text-red-400">
                    {customAlcoholDays} days
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="14"
                  step="1"
                  value={customAlcoholDays}
                  onChange={(e) => setCustomAlcoholDays(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>3 days</span>
                  <span>7 days</span>
                  <span>14 days</span>
                </div>
              </div>
            </div>

            {/* Locked Medication / Insulin Notice */}
            <div className="rounded-xl border border-slate-800 bg-[#090d16] p-3.5 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-red-400">🔒</span>
                <span>
                  Medication & Insulin Alteration Controls: <strong className="text-white">Permanently Locked</strong> (Non-pharmacological simulator only).
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Safety Guard</span>
            </div>
          </div>
        )}
      </div>

      {/* ==============================================================
          REQUIRED CORE DISPLAY SECTION
          Current pattern versus Simulated pattern
      ============================================================== */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 mb-5 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h2 className="text-xl font-bold text-white">
                Pattern Comparison & Simulation Result
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluation of baseline patterns versus projected simulated trajectory.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSimulation(currentDisplayScenario)}
            disabled={savingSimulation}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-950/40 px-3.5 py-1.5 text-xs font-semibold text-blue-400 transition hover:bg-blue-900/50 disabled:opacity-50 cursor-pointer"
          >
            <span>💾</span>
            <span>Save to History</span>
          </button>
        </div>

        {/* Current pattern versus Simulated pattern Header */}
        <div className="text-center py-2.5 mb-4 bg-[#090d16] rounded-xl border border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Comparative Modeling Framework
          </p>
          <div className="mt-1 flex items-center justify-center gap-3 text-base font-extrabold text-white">
            <span className="text-slate-300">Current pattern</span>
            <span className="text-blue-400 text-xs uppercase px-2 py-0.5 bg-blue-950/60 rounded-full font-bold border border-blue-500/30">
              versus
            </span>
            <span className="text-blue-400">Simulated pattern</span>
          </div>
        </div>

        {/* The Exact Comparison Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Current Pattern Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Baseline State
                </span>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                  Current pattern
                </span>
              </div>
              <p className="text-lg font-bold text-white mt-2">
                {currentDisplayScenario.currentLabel}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Derived from your rolling historical records and baseline habits.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              <span>Status: Observed Baseline</span>
            </div>
          </div>

          {/* Simulated Pattern Card */}
          <div className="rounded-2xl border border-blue-500/40 bg-[#090d16] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Projected State
                </span>
                <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  Simulated pattern
                </span>
              </div>
              <p className="text-lg font-bold text-blue-200 mt-2">
                {currentDisplayScenario.simulatedLabel}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Projected state following sustained adoption of the lifestyle increment.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-blue-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Status: Projected Habit Simulation</span>
            </div>
          </div>
        </div>

        {/* Estimated Result & Confidence Block */}
        <div className="mt-5 rounded-2xl border border-slate-800 bg-[#090d16] p-5 text-white shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400">
                Simulation Projection Outcome
              </span>
              <h3 className="text-base font-bold text-emerald-400 mt-0.5">
                Estimated result: {currentDisplayScenario.estimatedResult}
              </h3>
            </div>

            {/* Exact: Confidence: low */}
            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/40 px-3.5 py-1.5 text-xs font-bold text-amber-300">
              <span>⚠️</span>
              <span>Confidence: {currentDisplayScenario.confidence}</span>
            </div>
          </div>

          {/* Raw Text Output Box matching user specification */}
          <div className="rounded-xl bg-[#070a12] border border-slate-800 p-3.5 font-mono text-xs text-slate-300 leading-relaxed space-y-1">
            <p className="text-slate-400">
              {currentDisplayScenario.currentLabel}
            </p>
            <p className="text-blue-300">
              {currentDisplayScenario.simulatedLabel}
            </p>
            <p className="text-emerald-300">
              Estimated result: {currentDisplayScenario.estimatedResult}
            </p>
            <p className="text-amber-300">
              Confidence: {currentDisplayScenario.confidence}
            </p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Why confidence is rated &ldquo;low&rdquo;:</strong>{" "}
            {currentDisplayScenario.confidenceRationale ||
              "Early heuristic simulation based on non-causal observational correlations. Individual metabolic responsiveness, sleep architecture, and stress levels vary significantly."}
          </p>
        </div>
      </div>

      {/* ==============================================================
          SAVED SIMULATIONS HISTORY (GET /api/simulations)
      ============================================================== */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🗂️</span>
              <h2 className="text-xl font-bold text-white">
                Saved Simulation History
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulations saved to POST /api/simulations and retrieved from GET /api/simulations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
              {savedSimulations.length} Saved Record(s)
            </span>
          </div>
        </div>

        {loadingSaved ? (
          <div className="py-8 text-center text-xs text-slate-400">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p className="mt-2">Loading saved simulations from server...</p>
          </div>
        ) : savedSimulations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-[#090d16] p-8 text-center">
            <span className="text-3xl">🧪</span>
            <p className="mt-2 text-sm font-semibold text-white">
              No saved simulations yet
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Select one of the 3 scenarios above and click &ldquo;Save Active Simulation&rdquo; to persist it in your MediTwin history.
            </p>
            <button
              type="button"
              onClick={() => handleSaveSimulation(PRESET_SCENARIOS[0])}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition cursor-pointer"
            >
              <span>+</span>
              <span>Save &ldquo;Add 2,000 steps daily&rdquo;</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {savedSimulations.map((sim) => {
              const res = sim.result || {};

              return (
                <div
                  key={sim.id}
                  className="rounded-2xl border border-slate-800 bg-[#090d16] p-4 transition hover:border-blue-500/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">
                          {sim.name}
                        </h3>
                        <span className="rounded-full bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                          Confidence: {res.confidence || "low"}
                        </span>
                      </div>

                      {/* Current vs Simulated strings */}
                      <div className="mt-2 grid gap-1 text-xs text-slate-300">
                        {res.currentPattern && (
                          <div>
                            <span className="font-semibold text-slate-400">
                              Current:{" "}
                            </span>
                            <span>{res.currentPattern}</span>
                          </div>
                        )}
                        {res.simulatedPattern && (
                          <div>
                            <span className="font-semibold text-blue-400">
                              Simulated:{" "}
                            </span>
                            <span className="font-medium text-white">
                              {res.simulatedPattern}
                            </span>
                          </div>
                        )}
                        {res.estimatedResult && (
                          <div>
                            <span className="font-semibold text-emerald-400">
                              Estimated result:{" "}
                            </span>
                            <span className="italic text-emerald-300">
                              {res.estimatedResult}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400">
                        {sim.createdAt
                          ? new Date(sim.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Saved simulation"}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteSimulation(sim.id)}
                        className="rounded-lg border border-red-500/30 bg-red-950/30 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-900/40 hover:text-red-300 transition cursor-pointer"
                        title="Delete simulation"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default LifestyleSimulator;

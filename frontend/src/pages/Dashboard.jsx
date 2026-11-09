import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUserRole } from "../utils/auth";
import HealthConsistencyScore from "../components/HealthConsistencyScore";
import InsightEngine from "../components/InsightEngine";
import HealthModelResults from "../components/HealthModelResults";

function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [healthProfile, setHealthProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dashboard health summary states
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  // ==================================================
  // Load profile
  // ==================================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/profile");

      console.log("PROFILE RESPONSE:", response.data);

      setProfile(response.data?.user || null);

      setHealthProfile(response.data?.healthProfile || null);
    } catch (error) {
      console.error("PROFILE ERROR:", error.response?.data || error.message);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load your profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Load dashboard summary
  // ==================================================

  const loadSummary = async () => {
    try {
      setSummaryLoading(true);
      setSummaryError("");

      const response = await api.get("/dashboard/summary");
      setSummary(response.data);
    } catch (err) {
      console.error("DASHBOARD SUMMARY ERROR:", err.response?.data || err.message);
      setSummaryError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load daily health summary."
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    const role = getUserRole();
    if (role === "doctor") {
      navigate("/doctor-dashboard", { replace: true });
      return;
    }
    loadProfile();
    loadSummary();
  }, [navigate]);

  const getStatusBadge = (status, color) => {
    if (!status) return null;
    const colorClasses = {
      green: "bg-emerald-950/60 text-emerald-400 border-emerald-500/30",
      amber: "bg-amber-950/60 text-amber-400 border-amber-500/30",
      red: "bg-red-950/60 text-red-400 border-red-500/30",
      blue: "bg-blue-950/60 text-blue-400 border-blue-500/30",
      gray: "bg-slate-800 text-slate-400 border-slate-700",
    };
    const cls = colorClasses[color] || colorClasses.green;
    return (
      <span
        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${cls}`}
      >
        {status}
      </span>
    );
  };

  const formatDateShort = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // ==================================================
  // Calculate profile completion
  // ==================================================

  const calculateCompletion = () => {
    if (!healthProfile) {
      return 0;
    }

    const fields = [
      {
        name: "Date of Birth",
        value: healthProfile.dateOfBirth,
      },

      {
        name: "Gender",
        value: healthProfile.gender,
      },

      {
        name: "Height",
        value: healthProfile.heightCm,
      },

      {
        name: "Weight",
        value: healthProfile.weightKg,
      },

      {
        name: "Location",
        value: healthProfile.location,
      },

      {
        name: "Diabetes Status",
        value: healthProfile.diabetesStatus,
      },

      {
        name: "Diabetes Type",
        value: healthProfile.diabetesType,
      },

      {
        name: "Diagnosis Year",
        value: healthProfile.diagnosisYear,
      },

      {
        name: "HbA1c",
        value: healthProfile.hba1c,
      },

      {
        name: "Fasting Glucose",
        value: healthProfile.fastingGlucose,
      },

      {
        name: "Blood Pressure History",
        value: healthProfile.bloodPressureHistory,
      },

      {
        name: "Cholesterol",
        value: healthProfile.cholesterol,
      },

      {
        name: "Kidney History",
        value: healthProfile.kidneyHistory,
      },

      {
        name: "Heart History",
        value: healthProfile.heartHistory,
      },

      {
        name: "Other Conditions",
        value: healthProfile.otherConditions,
      },

      {
        name: "Smoking",
        value: healthProfile.smoking,
      },

      {
        name: "Alcohol",
        value: healthProfile.alcohol,
      },

      {
        name: "Typical Sleep",
        value: healthProfile.typicalSleep,
      },

      {
        name: "Typical Activity",
        value: healthProfile.typicalActivity,
      },

      {
        name: "Food Preference",
        value: healthProfile.foodPreference,
      },
    ];

    const completed = fields.filter(
      (field) =>
        field.value !== null && field.value !== undefined && field.value !== "",
    );

    return Math.round((completed.length / fields.length) * 100);
  };

  // ==================================================
  // Missing information
  // ==================================================

  const getMissingFields = () => {
    if (!healthProfile) {
      return [
        "Date of Birth",
        "Gender",
        "Height",
        "Weight",
        "Location",
        "Diabetes Status",
        "Medical History",
        "Lifestyle",
      ];
    }

    const fields = [
      ["Date of Birth", healthProfile.dateOfBirth],
      ["Gender", healthProfile.gender],
      ["Height", healthProfile.heightCm],
      ["Weight", healthProfile.weightKg],
      ["Location", healthProfile.location],

      ["Diabetes Status", healthProfile.diabetesStatus],
      ["Diabetes Type", healthProfile.diabetesType],
      ["Diagnosis Year", healthProfile.diagnosisYear],
      ["HbA1c", healthProfile.hba1c],
      ["Fasting Glucose", healthProfile.fastingGlucose],

      ["Blood Pressure History", healthProfile.bloodPressureHistory],

      ["Cholesterol", healthProfile.cholesterol],

      ["Kidney History", healthProfile.kidneyHistory],

      ["Heart History", healthProfile.heartHistory],

      ["Other Conditions", healthProfile.otherConditions],

      ["Smoking", healthProfile.smoking],
      ["Alcohol", healthProfile.alcohol],
      ["Typical Sleep", healthProfile.typicalSleep],
      ["Typical Activity", healthProfile.typicalActivity],
      ["Food Preference", healthProfile.foodPreference],
    ];

    return fields
      .filter(
        ([, value]) => value === null || value === undefined || value === "",
      )
      .map(([name]) => name);
  };

  const completion = calculateCompletion();

  const missingFields = getMissingFields();

  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070a12]">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // ==================================================
  // Error
  // ==================================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070a12] px-6">
        <div className="bg-[#0d1322] border border-red-500/40 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-400 mb-3">
            Unable to load dashboard
          </h2>

          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // ==================================================
  // Dashboard
  // ==================================================

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white">
            Welcome, {profile?.fullName || "User"} 👋
          </h1>

          <p className="text-slate-400 mt-2 text-sm">
            Welcome to your MediTwin health dashboard.
          </p>
        </div>

        {/* ==================================================
            DAILY HEALTH OVERVIEW (7 HEALTH METRIC CARDS)
        ================================================== */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Daily Health Summary
              </h2>
              <p className="text-sm text-slate-400">
                Your latest recorded vitals, daily activity, and weekly health score.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/health-history")}
                className="px-4 py-2 bg-slate-800/90 border border-slate-700 text-slate-200 text-sm font-medium rounded-xl hover:bg-slate-700 hover:text-white transition cursor-pointer"
              >
                View History
              </button>
              <button
                onClick={() => navigate("/health-journal")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/30 transition cursor-pointer active:scale-[0.98]"
              >
                + Log Vitals
              </button>
            </div>
          </div>

          {summaryError && (
            <div className="mb-4 p-4 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center justify-between text-sm text-red-300">
              <span className="flex items-center gap-2">
                <span className="text-red-400">⚠️</span>
                <span>{summaryError}</span>
              </span>
              <button
                onClick={loadSummary}
                className="px-3 py-1 bg-red-900/50 hover:bg-red-800/60 text-red-200 border border-red-500/30 rounded-lg font-semibold text-xs cursor-pointer transition"
              >
                Retry
              </button>
            </div>
          )}

          {summaryLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`bg-[#0d1322] rounded-2xl p-5 border border-slate-800 shadow-xl animate-pulse ${
                    i === 6 ? "sm:col-span-2 lg:col-span-3 xl:col-span-2" : ""
                  }`}
                >
                  <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
                  <div className="h-8 bg-slate-800 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* 1. LATEST GLUCOSE READING */}
              <div className="bg-[#0d1322] rounded-2xl shadow-xl p-5 border border-slate-800 hover:border-red-500/40 transition group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🩸</span>
                    <h3 className="font-semibold text-slate-200">Latest Glucose</h3>
                  </div>
                  {summary?.latestGlucose
                    ? getStatusBadge(
                        summary.latestGlucose.status,
                        summary.latestGlucose.statusColor
                      )
                    : null}
                </div>
                {summary?.latestGlucose ? (
                  <div>
                    <div className="text-3xl font-extrabold text-white">
                      {summary.latestGlucose.value}
                      <span className="text-sm font-normal text-slate-400 ml-1.5">
                        {summary.latestGlucose.unit}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      {summary.latestGlucose.isProfileBaseline
                        ? "Profile baseline"
                        : `Recorded ${formatDateShort(summary.latestGlucose.date)}`}
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-slate-400 text-sm">No glucose readings logged yet.</p>
                    <button
                      onClick={() => navigate("/health-journal")}
                      className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                    >
                      + Log reading
                    </button>
                  </div>
                )}
              </div>

              {/* 2. LATEST BP READING */}
              <div className="bg-[#0d1322] rounded-2xl shadow-xl p-5 border border-slate-800 hover:border-red-500/40 transition group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🫀</span>
                    <h3 className="font-semibold text-slate-200">Latest Blood Pressure</h3>
                  </div>
                  {summary?.latestBP
                    ? getStatusBadge(summary.latestBP.status, summary.latestBP.statusColor)
                    : null}
                </div>
                {summary?.latestBP ? (
                  <div>
                    <div className="text-3xl font-extrabold text-white">
                      {summary.latestBP.systolic ?? "—"}/{summary.latestBP.diastolic ?? "—"}
                      <span className="text-sm font-normal text-slate-400 ml-1.5">
                        {summary.latestBP.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                      <span>
                        {summary.latestBP.heartRate
                          ? `Pulse: ${summary.latestBP.heartRate} bpm`
                          : "Pulse: —"}
                      </span>
                      <span className="text-slate-400">
                        {formatDateShort(summary.latestBP.date)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-slate-400 text-sm">No BP logged yet.</p>
                    <button
                      onClick={() => navigate("/health-journal")}
                      className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                    >
                      + Log blood pressure
                    </button>
                  </div>
                )}
              </div>

              {/* 3. TODAY'S STEPS */}
              <div className="bg-[#0d1322] rounded-2xl shadow-xl p-5 border border-slate-800 hover:border-blue-500/40 transition group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👟</span>
                    <h3 className="font-semibold text-slate-200">Today&apos;s Steps</h3>
                  </div>
                  <span className="text-xs font-semibold text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                    {summary?.todaySteps?.percentage ?? 0}%
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">
                    {(summary?.todaySteps?.steps ?? 0).toLocaleString()}
                    <span className="text-sm font-normal text-slate-400 ml-1.5">
                      / 10,000
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${summary?.todaySteps?.percentage ?? 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                    <span>
                      {summary?.todaySteps?.isToday
                        ? "Logged today"
                        : summary?.todaySteps?.steps
                        ? `Latest (${formatDateShort(summary.todaySteps.date)})`
                        : "0 steps logged"}
                    </span>
                    {summary?.todaySteps?.exerciseMinutes ? (
                      <span className="text-blue-400 font-medium">
                        {summary.todaySteps.exerciseMinutes}m active
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* 4. SLEEP DURATION */}
              <div className="bg-[#0d1322] rounded-2xl shadow-xl p-5 border border-slate-800 hover:border-blue-500/40 transition group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌙</span>
                    <h3 className="font-semibold text-slate-200">Sleep Duration</h3>
                  </div>
                  {summary?.sleepDuration
                    ? getStatusBadge(
                        summary.sleepDuration.status,
                        summary.sleepDuration.statusColor
                      )
                    : null}
                </div>
                {summary?.sleepDuration ? (
                  <div>
                    <div className="text-3xl font-extrabold text-white">
                      {summary.sleepDuration.hours}
                      <span className="text-sm font-normal text-slate-400 ml-1.5">
                        hours
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                      <span>
                        {summary.sleepDuration.quality
                          ? `Quality: ${summary.sleepDuration.quality}/5 ⭐`
                          : "Quality: Unrated"}
                      </span>
                      <span className="text-slate-400">
                        {summary.sleepDuration.isProfileBaseline
                          ? "Profile typical"
                          : formatDateShort(summary.sleepDuration.date)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-slate-400 text-sm">No sleep logs recorded yet.</p>
                    <button
                      onClick={() => navigate("/health-journal")}
                      className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                    >
                      + Log sleep
                    </button>
                  </div>
                )}
              </div>

              {/* 5. WEIGHT */}
              <div className="bg-[#0d1322] rounded-2xl shadow-xl p-5 border border-slate-800 hover:border-blue-500/40 transition group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚖️</span>
                    <h3 className="font-semibold text-slate-200">Weight</h3>
                  </div>
                  {summary?.weight?.bmiCategory
                    ? getStatusBadge(summary.weight.bmiCategory, summary.weight.bmiColor)
                    : null}
                </div>
                {summary?.weight?.current != null ? (
                  <div>
                    <div className="text-3xl font-extrabold text-white">
                      {summary.weight.current}
                      <span className="text-sm font-normal text-slate-400 ml-1.5">
                        {summary.weight.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                      <span>
                        {summary.weight.bmi ? `BMI: ${summary.weight.bmi}` : "BMI: —"}
                      </span>
                      <span className="text-slate-400">
                        {summary.weight.diff !== 0
                          ? `${summary.weight.diff > 0 ? "+" : ""}${summary.weight.diff} kg vs last`
                          : summary.weight.isProfileBaseline
                          ? "Profile baseline"
                          : formatDateShort(summary.weight.date)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-slate-400 text-sm">No weight recorded yet.</p>
                    <button
                      onClick={() => navigate("/health-journal")}
                      className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                    >
                      + Log weight
                    </button>
                  </div>
                )}
              </div>

              {/* 6. MEDICATION STATUS */}
              <div className="bg-[#0d1322] rounded-2xl shadow-xl p-5 border border-slate-800 hover:border-red-500/40 transition group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💊</span>
                    <h3 className="font-semibold text-slate-200">Medication Status</h3>
                  </div>
                  {summary?.medicationStatus
                    ? getStatusBadge(
                        summary.medicationStatus.status,
                        summary.medicationStatus.statusColor
                      )
                    : null}
                </div>
                <div>
                  <div className="text-xl font-bold text-white leading-tight">
                    {summary?.medicationStatus?.status || "Pending"}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                    <span>
                      {summary?.medicationStatus?.activeCount ?? 0} active prescription(s)
                    </span>
                    <button
                      onClick={() => navigate("/medications")}
                      className="text-blue-400 hover:text-blue-300 font-medium hover:underline cursor-pointer"
                    >
                      View meds →
                    </button>
                  </div>
                </div>
              </div>

              {/* 7. HEALTH CONSISTENCY SCORE (PROTOTYPE) */}
              <div className="col-span-full">
                <HealthConsistencyScore
                  scoreData={summary?.healthConsistencyScore}
                />
              </div>
            </div>
          )}
        </div>

        {/* ==================================================
            RULE-BASED INSIGHT ENGINE
        ================================================== */}
        <div className="mb-6">
          <InsightEngine />
        </div>

        {/* ==================================================
            7 PREDICTIVE HEALTH MODELS & DIGITAL TWIN
        ================================================== */}
        <div className="mb-6">
          <HealthModelResults healthProfile={healthProfile} user={profile} />
        </div>

        {/* ==================================================
            PROFILE COMPLETION
        ================================================== */}

        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Profile Completion
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Complete your health profile for a better MediTwin experience.
              </p>
            </div>

            <div className="text-3xl font-extrabold text-blue-400">
              {completion}%
            </div>
          </div>

          {/* Progress bar */}

          <div className="mt-5">
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>
          </div>

          {/* Missing information */}

          {missingFields.length > 0 && (
            <div className="mt-6 bg-amber-950/30 border border-amber-500/30 rounded-xl p-4">
              <h3 className="font-semibold text-amber-300 mb-2">
                Missing Information
              </h3>

              <p className="text-sm text-amber-400 mb-3">
                Complete the following information:
              </p>

              <ul className="list-disc list-inside text-sm text-amber-300 space-y-1">
                {missingFields.slice(0, 5).map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>

              {missingFields.length > 5 && (
                <p className="text-sm text-amber-400 mt-2">
                  + {missingFields.length - 5} more
                </p>
              )}
            </div>
          )}

          {/* Complete message */}

          {completion === 100 && (
            <div className="mt-6 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4">
              <p className="text-emerald-400 font-medium">
                ✓ Your profile is complete!
              </p>
            </div>
          )}

          {/* Edit button */}

          <div className="mt-6">
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-600/30 transition active:scale-[0.98] cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* ==================================================
            USER PROFILE
        ================================================== */}

        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-5">
            Your Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-400">Full Name</p>

              <p className="text-lg font-semibold text-white mt-0.5">
                {profile?.fullName || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Email</p>

              <p className="text-lg font-semibold text-white mt-0.5">
                {profile?.email || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Role</p>

              <p className="text-lg font-semibold text-blue-400 capitalize mt-0.5">
                {profile?.role || "patient"}
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            HEALTH INFORMATION
        ================================================== */}

        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-white mb-5">
            Health Information
          </h2>

          {!healthProfile ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4 text-sm">
                Your health profile has not been completed yet.
              </p>

              <button
                onClick={() => navigate("/edit-profile")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-600/30 transition cursor-pointer"
              >
                Complete Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-400">Date of Birth</p>

                <p className="text-lg font-semibold text-white mt-0.5">
                  {healthProfile.dateOfBirth
                    ? new Date(healthProfile.dateOfBirth).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Gender</p>

                <p className="text-lg font-semibold text-white mt-0.5">
                  {healthProfile.gender || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Height</p>

                <p className="text-lg font-semibold text-white mt-0.5">
                  {healthProfile.heightCm
                    ? `${healthProfile.heightCm} cm`
                    : "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Weight</p>

                <p className="text-lg font-semibold text-white mt-0.5">
                  {healthProfile.weightKg
                    ? `${healthProfile.weightKg} kg`
                    : "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Diabetes Status</p>

                <p className="text-lg font-semibold text-white mt-0.5">
                  {healthProfile.diabetesStatus || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">HbA1c</p>

                <p className="text-lg font-semibold text-white mt-0.5">
                  {healthProfile.hba1c
                    ? `${healthProfile.hba1c}%`
                    : "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Fasting Glucose</p>

                <p className="text-lg font-semibold text-white mt-0.5">
                  {healthProfile.fastingGlucose
                    ? `${healthProfile.fastingGlucose} mg/dL`
                    : "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Activity</p>

                <p className="text-lg font-semibold text-white mt-0.5">
                  {healthProfile.typicalActivity || "Not available"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

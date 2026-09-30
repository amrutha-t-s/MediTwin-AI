import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
    loadProfile();
    loadSummary();
  }, []);

  const getStatusBadge = (status, color) => {
    if (!status) return null;
    const colorClasses = {
      green: "bg-green-100 text-green-800 border-green-200",
      amber: "bg-amber-100 text-amber-800 border-amber-200",
      red: "bg-red-100 text-red-800 border-red-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      gray: "bg-gray-100 text-gray-700 border-gray-200",
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  // ==================================================
  // Error
  // ==================================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-3">
            Unable to load dashboard
          </h2>

          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  // ==================================================
  // Dashboard
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {profile?.fullName || "User"} 👋
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome to your MediTwin health dashboard.
          </p>
        </div>

        {/* ==================================================
            DAILY HEALTH OVERVIEW (7 HEALTH METRIC CARDS)
        ================================================== */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Daily Health Summary
              </h2>
              <p className="text-sm text-slate-500">
                Your latest recorded vitals, daily activity, and weekly health score.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/health-history")}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition"
              >
                View History
              </button>
              <button
                onClick={() => navigate("/health-journal")}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                + Log Vitals
              </button>
            </div>
          </div>

          {summaryError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-sm text-red-700">
              <span>{summaryError}</span>
              <button
                onClick={loadSummary}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-md font-semibold text-xs hover:bg-red-200"
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
                  className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse ${
                    i === 6 ? "sm:col-span-2 lg:col-span-3 xl:col-span-2" : ""
                  }`}
                >
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
                  <div className="h-8 bg-slate-200 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* 1. LATEST GLUCOSE READING */}
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🩸</span>
                    <h3 className="font-semibold text-slate-800">Latest Glucose</h3>
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
                    <div className="text-3xl font-bold text-slate-900">
                      {summary.latestGlucose.value}
                      <span className="text-sm font-normal text-slate-500 ml-1.5">
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
                      className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      + Log reading
                    </button>
                  </div>
                )}
              </div>

              {/* 2. LATEST BP READING */}
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🫀</span>
                    <h3 className="font-semibold text-slate-800">Latest Blood Pressure</h3>
                  </div>
                  {summary?.latestBP
                    ? getStatusBadge(summary.latestBP.status, summary.latestBP.statusColor)
                    : null}
                </div>
                {summary?.latestBP ? (
                  <div>
                    <div className="text-3xl font-bold text-slate-900">
                      {summary.latestBP.systolic ?? "—"}/{summary.latestBP.diastolic ?? "—"}
                      <span className="text-sm font-normal text-slate-500 ml-1.5">
                        {summary.latestBP.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
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
                      className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      + Log blood pressure
                    </button>
                  </div>
                )}
              </div>

              {/* 3. TODAY'S STEPS */}
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👟</span>
                    <h3 className="font-semibold text-slate-800">Today&apos;s Steps</h3>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    {summary?.todaySteps?.percentage ?? 0}%
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">
                    {(summary?.todaySteps?.steps ?? 0).toLocaleString()}
                    <span className="text-sm font-normal text-slate-500 ml-1.5">
                      / 10,000
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
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
                      <span className="text-slate-500 font-medium">
                        {summary.todaySteps.exerciseMinutes}m active
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* 4. SLEEP DURATION */}
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌙</span>
                    <h3 className="font-semibold text-slate-800">Sleep Duration</h3>
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
                    <div className="text-3xl font-bold text-slate-900">
                      {summary.sleepDuration.hours}
                      <span className="text-sm font-normal text-slate-500 ml-1.5">
                        hours
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
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
                      className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      + Log sleep
                    </button>
                  </div>
                )}
              </div>

              {/* 5. WEIGHT */}
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚖️</span>
                    <h3 className="font-semibold text-slate-800">Weight</h3>
                  </div>
                  {summary?.weight?.bmiCategory
                    ? getStatusBadge(summary.weight.bmiCategory, summary.weight.bmiColor)
                    : null}
                </div>
                {summary?.weight?.current != null ? (
                  <div>
                    <div className="text-3xl font-bold text-slate-900">
                      {summary.weight.current}
                      <span className="text-sm font-normal text-slate-500 ml-1.5">
                        {summary.weight.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
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
                      className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      + Log weight
                    </button>
                  </div>
                )}
              </div>

              {/* 6. MEDICATION STATUS */}
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💊</span>
                    <h3 className="font-semibold text-slate-800">Medication Status</h3>
                  </div>
                  {summary?.medicationStatus
                    ? getStatusBadge(
                        summary.medicationStatus.status,
                        summary.medicationStatus.statusColor
                      )
                    : null}
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 leading-tight">
                    {summary?.medicationStatus?.status || "Pending"}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <span>
                      {summary?.medicationStatus?.activeCount ?? 0} active prescription(s)
                    </span>
                    <button
                      onClick={() => navigate("/medications")}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      View meds →
                    </button>
                  </div>
                </div>
              </div>

              {/* 7. WEEKLY HEALTH SCORE */}
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition sm:col-span-2 lg:col-span-3 xl:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <h3 className="font-semibold text-slate-800">Weekly Health Score</h3>
                  </div>
                  {summary?.weeklyHealthScore ? (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Grade {summary.weeklyHealthScore.grade} • {summary.weeklyHealthScore.rating}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-blue-600">
                      {summary?.weeklyHealthScore?.score ?? 0}
                    </span>
                    <span className="text-slate-400 font-medium">/ 100</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-slate-50 rounded-md border border-slate-200 text-slate-600">
                      Glucose: {summary?.weeklyHealthScore?.breakdown?.glucose ?? 0}/25
                    </span>
                    <span className="px-2 py-1 bg-slate-50 rounded-md border border-slate-200 text-slate-600">
                      BP: {summary?.weeklyHealthScore?.breakdown?.bloodPressure ?? 0}/25
                    </span>
                    <span className="px-2 py-1 bg-slate-50 rounded-md border border-slate-200 text-slate-600">
                      Activity: {summary?.weeklyHealthScore?.breakdown?.activity ?? 0}/20
                    </span>
                    <span className="px-2 py-1 bg-slate-50 rounded-md border border-slate-200 text-slate-600">
                      Sleep: {summary?.weeklyHealthScore?.breakdown?.sleep ?? 0}/15
                    </span>
                    <span className="px-2 py-1 bg-slate-50 rounded-md border border-slate-200 text-slate-600">
                      Adherence: {summary?.weeklyHealthScore?.breakdown?.adherence ?? 0}/15
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Calculated across your past 7 days of daily health entries (
                  {summary?.weeklyHealthScore?.daysLogged ?? 0}/7 days recorded).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================
            PROFILE COMPLETION
        ================================================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Profile Completion
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Complete your health profile for a better MediTwin experience.
              </p>
            </div>

            <div className="text-3xl font-bold text-blue-600">
              {completion}%
            </div>
          </div>

          {/* Progress bar */}

          <div className="mt-5">
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>
          </div>

          {/* Missing information */}

          {missingFields.length > 0 && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-2">
                Missing Information
              </h3>

              <p className="text-sm text-amber-700 mb-3">
                Complete the following information:
              </p>

              <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                {missingFields.slice(0, 5).map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>

              {missingFields.length > 5 && (
                <p className="text-sm text-amber-700 mt-2">
                  + {missingFields.length - 5} more
                </p>
              )}
            </div>
          )}

          {/* Complete message */}

          {completion === 100 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 font-medium">
                ✓ Your profile is complete!
              </p>
            </div>
          )}

          {/* Edit button */}

          <div className="mt-6">
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* ==================================================
            USER PROFILE
        ================================================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">
            Your Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500">Full Name</p>

              <p className="text-lg font-medium text-slate-900">
                {profile?.fullName || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email</p>

              <p className="text-lg font-medium text-slate-900">
                {profile?.email || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Role</p>

              <p className="text-lg font-medium text-blue-600 capitalize">
                {profile?.role || "patient"}
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            HEALTH INFORMATION
        ================================================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">
            Health Information
          </h2>

          {!healthProfile ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">
                Your health profile has not been completed yet.
              </p>

              <button
                onClick={() => navigate("/edit-profile")}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
              >
                Complete Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500">Date of Birth</p>

                <p className="text-lg font-medium">
                  {healthProfile.dateOfBirth
                    ? new Date(healthProfile.dateOfBirth).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Gender</p>

                <p className="text-lg font-medium">
                  {healthProfile.gender || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Height</p>

                <p className="text-lg font-medium">
                  {healthProfile.heightCm
                    ? `${healthProfile.heightCm} cm`
                    : "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Weight</p>

                <p className="text-lg font-medium">
                  {healthProfile.weightKg
                    ? `${healthProfile.weightKg} kg`
                    : "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Diabetes Status</p>

                <p className="text-lg font-medium">
                  {healthProfile.diabetesStatus || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">HbA1c</p>

                <p className="text-lg font-medium">
                  {healthProfile.hba1c
                    ? `${healthProfile.hba1c}%`
                    : "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Fasting Glucose</p>

                <p className="text-lg font-medium">
                  {healthProfile.fastingGlucose
                    ? `${healthProfile.fastingGlucose} mg/dL`
                    : "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Activity</p>

                <p className="text-lg font-medium">
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

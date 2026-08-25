import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [healthProfile, setHealthProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // Load profile
  // ==================================================

  useEffect(() => {
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

    loadProfile();
  }, []);

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

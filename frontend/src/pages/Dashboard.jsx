import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [healthProfile, setHealthProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/profile");

        console.log("=================================");
        console.log("PROFILE RESPONSE:", response.data);
        console.log("=================================");

        // Safely read user
        setProfile(response.data?.user || null);

        // Safely read health profile
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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">⚠️</div>

          <h2 className="text-xl font-semibold text-red-600 mb-3">
            Unable to load dashboard
          </h2>

          <p className="text-slate-600 mb-6">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome, {profile?.fullName || "User"} 👋
              </h1>

              <p className="text-slate-500 mt-2">
                Welcome to your MediTwin health dashboard.
              </p>
            </div>

            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">
                MediTwin Health Monitor
              </p>
            </div>
          </div>
        </div>

        {/* ======================================
            USER PROFILE
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">
            Your Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Full Name */}

            <div>
              <p className="text-sm text-slate-500">Full Name</p>

              <p className="text-lg font-medium text-slate-900 mt-1">
                {profile?.fullName || "Not available"}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm text-slate-500">Email</p>

              <p className="text-lg font-medium text-slate-900 mt-1 break-words">
                {profile?.email || "Not available"}
              </p>
            </div>

            {/* Role */}

            <div>
              <p className="text-sm text-slate-500">Role</p>

              <p className="text-lg font-medium text-blue-600 capitalize mt-1">
                {profile?.role || "patient"}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================
            HEALTH PROFILE
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Health Information
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Information collected during your health onboarding.
              </p>
            </div>

            {healthProfile && (
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                ✓ Profile completed
              </div>
            )}
          </div>

          {/* ====================================
              NO HEALTH PROFILE
          ==================================== */}

          {!healthProfile ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🩺</div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Health profile not completed
              </h3>

              <p className="text-slate-500 mb-6">
                Complete your health onboarding to see your health information
                here.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/onboarding";
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Complete Onboarding
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* ==================================
                  BASIC DETAILS
              ================================== */}

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Basic Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* DOB */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Date of Birth</p>

                    <p className="font-medium text-slate-900 mt-1">
                      {healthProfile.dateOfBirth
                        ? new Date(
                            healthProfile.dateOfBirth,
                          ).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>

                  {/* Gender */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Gender</p>

                    <p className="font-medium text-slate-900 mt-1 capitalize">
                      {healthProfile.gender || "Not available"}
                    </p>
                  </div>

                  {/* Height */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Height</p>

                    <p className="font-medium text-slate-900 mt-1">
                      {healthProfile.heightCm
                        ? `${healthProfile.heightCm} cm`
                        : "Not available"}
                    </p>
                  </div>

                  {/* Weight */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Weight</p>

                    <p className="font-medium text-slate-900 mt-1">
                      {healthProfile.weightKg
                        ? `${healthProfile.weightKg} kg`
                        : "Not available"}
                    </p>
                  </div>

                  {/* Location */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Location</p>

                    <p className="font-medium text-slate-900 mt-1">
                      {healthProfile.location || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================
                  DIABETES INFORMATION
              ================================== */}

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Diabetes Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Status */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Diabetes Status</p>

                    <p className="font-medium text-slate-900 mt-1 capitalize">
                      {healthProfile.diabetesStatus || "Not available"}
                    </p>
                  </div>

                  {/* Type */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Diabetes Type</p>

                    <p className="font-medium text-slate-900 mt-1 capitalize">
                      {healthProfile.diabetesType || "Not available"}
                    </p>
                  </div>

                  {/* Diagnosis Year */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Year of Diagnosis</p>

                    <p className="font-medium text-slate-900 mt-1">
                      {healthProfile.diagnosisYear || "Not available"}
                    </p>
                  </div>

                  {/* HbA1c */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">HbA1c</p>

                    <p className="font-medium text-slate-900 mt-1">
                      {healthProfile.hba1c
                        ? `${healthProfile.hba1c}%`
                        : "Not available"}
                    </p>
                  </div>

                  {/* Fasting Glucose */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Fasting Glucose</p>

                    <p className="font-medium text-slate-900 mt-1">
                      {healthProfile.fastingGlucose
                        ? `${healthProfile.fastingGlucose} mg/dL`
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================
                  MEDICAL HISTORY
              ================================== */}

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Medical History
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Blood Pressure */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">
                      Blood Pressure History
                    </p>

                    <p className="font-medium text-slate-900 mt-1 capitalize">
                      {healthProfile.bloodPressureHistory || "Not available"}
                    </p>
                  </div>

                  {/* Cholesterol */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Cholesterol</p>

                    <p className="font-medium text-slate-900 mt-1 capitalize">
                      {healthProfile.cholesterol || "Not available"}
                    </p>
                  </div>

                  {/* Kidney */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">
                      Kidney-related History
                    </p>

                    <p className="font-medium text-slate-900 mt-1">
                      {healthProfile.kidneyHistory || "Not available"}
                    </p>
                  </div>

                  {/* Heart */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">
                      Heart-related History
                    </p>

                    <p className="font-medium text-slate-900 mt-1">
                      {healthProfile.heartHistory || "Not available"}
                    </p>
                  </div>

                  {/* Other Conditions */}

                  <div className="bg-slate-50 rounded-xl p-4 md:col-span-2">
                    <p className="text-sm text-slate-500">Other Conditions</p>

                    <p className="font-medium text-slate-900 mt-1">
                      {healthProfile.otherConditions || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================
                  LIFESTYLE
              ================================== */}

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Lifestyle
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Smoking */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Smoking</p>

                    <p className="font-medium text-slate-900 mt-1 capitalize">
                      {healthProfile.smoking || "Not available"}
                    </p>
                  </div>

                  {/* Alcohol */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Alcohol</p>

                    <p className="font-medium text-slate-900 mt-1 capitalize">
                      {healthProfile.alcohol || "Not available"}
                    </p>
                  </div>

                  {/* Sleep */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Typical Sleep</p>

                    <p className="font-medium text-slate-900 mt-1">
                      {healthProfile.typicalSleep
                        ? `${healthProfile.typicalSleep} hours`
                        : "Not available"}
                    </p>
                  </div>

                  {/* Activity */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Typical Activity</p>

                    <p className="font-medium text-slate-900 mt-1 capitalize">
                      {healthProfile.typicalActivity || "Not available"}
                    </p>
                  </div>

                  {/* Food Preference */}

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">Food Preference</p>

                    <p className="font-medium text-slate-900 mt-1 capitalize">
                      {healthProfile.foodPreference || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================
            FOOTER
        ====================================== */}

        <div className="text-center mt-6 pb-6">
          <p className="text-xs text-slate-400">
            MediTwin is a health-monitoring and educational prototype.
          </p>

          <p className="text-xs text-slate-400 mt-1">
            It does not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

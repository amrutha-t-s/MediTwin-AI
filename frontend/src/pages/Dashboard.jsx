import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/profile");

        console.log("PROFILE:", response.data);

        setProfile(response.data.user);
      } catch (error) {
        console.error("PROFILE ERROR:", error.response?.data || error.message);

        setError(
          error.response?.data?.message || "Failed to load your profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  // ==========================
  // Error
  // ==========================

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

  // ==========================
  // Dashboard
  // ==========================

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {profile?.fullName} 👋
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome to your MediTwin health dashboard.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">
            Your Profile
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <p className="text-sm text-slate-500">Full Name</p>

              <p className="text-lg font-medium text-slate-900">
                {profile?.fullName}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-slate-500">Email</p>

              <p className="text-lg font-medium text-slate-900">
                {profile?.email}
              </p>
            </div>

            {/* Role */}
            <div>
              <p className="text-sm text-slate-500">Role</p>

              <p className="text-lg font-medium text-blue-600 capitalize">
                {profile?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

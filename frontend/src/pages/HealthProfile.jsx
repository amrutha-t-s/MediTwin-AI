import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HealthProfile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:4000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser(data.user || null);
          setProfile(data.healthProfile || data);
        }
      })
      .catch((err) => console.warn("Failed to load health profile:", err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Calculate BMI if height and weight exist
  const heightM = profile?.heightCm ? profile.heightCm / 100 : null;
  const bmi =
    heightM && profile?.weightKg
      ? (profile.weightKg / (heightM * heightM)).toFixed(1)
      : null;

  const getBmiCategory = (val) => {
    if (!val) return null;
    const num = parseFloat(val);
    if (num < 18.5) return { label: "Underweight", color: "text-amber-300 bg-amber-950/60 border border-amber-500/30" };
    if (num < 25) return { label: "Normal weight", color: "text-emerald-300 bg-emerald-950/60 border border-emerald-500/30" };
    if (num < 30) return { label: "Overweight", color: "text-orange-300 bg-orange-950/60 border border-orange-500/30" };
    return { label: "Obese", color: "text-rose-300 bg-rose-950/60 border border-rose-500/30" };
  };

  const bmiCat = getBmiCategory(bmi);

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-950/60 border border-blue-500/30 text-blue-400 rounded-xl text-2xl">
              👤
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Health Profile & Baseline Record
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {user ? `Record for ${user.name || user.email} • ` : ""}Your biological baseline, clinical history, and demographic context.
              </p>
            </div>
          </div>
          <Link
            to="/edit-profile"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition flex items-center gap-1.5"
          >
            <span>✏️</span> Edit Profile Details
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#0d1322] border border-slate-800 p-12 rounded-2xl text-center text-slate-400 text-sm">
          Loading health profile baseline...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card 1: Identity & Key Biometrics */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">🩺</span> Key Physical Biometrics
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#090d16] rounded-xl border border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">Height</span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {profile?.heightCm ? `${profile.heightCm} cm` : "—"}
                </span>
              </div>

              <div className="p-4 bg-[#090d16] rounded-xl border border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">Weight</span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {profile?.weightKg ? `${profile.weightKg} kg` : "—"}
                </span>
              </div>

              <div className="p-4 bg-[#090d16] rounded-xl border border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">Calculated BMI</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold text-white">
                    {bmi || "—"}
                  </span>
                  {bmiCat && (
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${bmiCat.color}`}>
                      {bmiCat.label}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-[#090d16] rounded-xl border border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">Gender / Sex</span>
                <span className="text-xl font-bold text-white mt-1 capitalize block">
                  {profile?.gender || profile?.sex || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Clinical Background */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">📋</span> Clinical Background & Conditions
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block font-medium">Diabetes Status</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {profile?.diabetesStatus || "None reported"}
                </span>
                {profile?.diabetesType && (
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Type: {profile.diabetesType}
                  </span>
                )}
              </div>

              <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block font-medium">Fasting Glucose Baseline</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {profile?.fastingGlucose ? `${profile.fastingGlucose} mg/dL` : "Not recorded"}
                </span>
              </div>

              <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block font-medium">Baseline HbA1c</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {profile?.hba1c ? `${profile.hba1c}%` : "Not recorded"}
                </span>
              </div>

              <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block font-medium">Blood Pressure History</span>
                <span className="font-semibold text-white text-sm mt-0.5 block">
                  {profile?.bloodPressureHistory || "Normal"}
                </span>
              </div>

              <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block font-medium">Cholesterol Level</span>
                <span className="font-semibold text-white text-sm mt-0.5 block">
                  {profile?.cholesterol || "Normal"}
                </span>
              </div>

              <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block font-medium">Kidney & Heart Health</span>
                <span className="font-semibold text-white text-sm mt-0.5 block">
                  {profile?.heartHistory || profile?.kidneyHistory || "No reported history"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Lifestyle Habits Baseline */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">🏃</span> Baseline Lifestyle & Sleep Patterns
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block font-medium">Typical Nightly Sleep</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {profile?.typicalSleep ? `${profile.typicalSleep} hours` : "—"}
                </span>
              </div>

              <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block font-medium">Typical Activity Level</span>
                <span className="font-bold text-white text-sm mt-0.5 capitalize block">
                  {profile?.typicalActivity || "Moderate"}
                </span>
              </div>

              <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block font-medium">Dietary Preference</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {profile?.foodPreference || "Standard balanced"}
                </span>
              </div>

              <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block font-medium">Smoking / Alcohol</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {profile?.smoking || "Non-smoker"} / {profile?.alcohol || "Moderate"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthProfile;

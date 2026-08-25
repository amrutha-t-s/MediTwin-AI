import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function EditProfile() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    // STEP 1
    dateOfBirth: "",
    gender: "",
    heightCm: "",
    weightKg: "",
    location: "",

    // STEP 2
    diabetesStatus: "",
    diabetesType: "",
    diagnosisYear: "",
    hba1c: "",
    fastingGlucose: "",

    // STEP 3
    bloodPressureHistory: "",
    cholesterol: "",
    kidneyHistory: "",
    heartHistory: "",
    otherConditions: "",

    // STEP 4
    smoking: "",
    alcohol: "",
    typicalSleep: "",
    typicalActivity: "",
    foodPreference: "",
  });

  // =====================================================
  // LOAD EXISTING PROFILE
  // =====================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/profile");

        console.log("EDIT PROFILE RESPONSE:", response.data);

        const profile = response.data?.healthProfile;

        if (profile) {
          setFormData({
            dateOfBirth: profile.dateOfBirth
              ? profile.dateOfBirth.substring(0, 10)
              : "",

            gender: profile.gender || "",
            heightCm: profile.heightCm ?? "",
            weightKg: profile.weightKg ?? "",
            location: profile.location || "",

            diabetesStatus: profile.diabetesStatus || "",
            diabetesType: profile.diabetesType || "",
            diagnosisYear: profile.diagnosisYear ?? "",
            hba1c: profile.hba1c ?? "",
            fastingGlucose: profile.fastingGlucose ?? "",

            bloodPressureHistory: profile.bloodPressureHistory || "",
            cholesterol: profile.cholesterol || "",
            kidneyHistory: profile.kidneyHistory || "",
            heartHistory: profile.heartHistory || "",
            otherConditions: profile.otherConditions || "",

            smoking: profile.smoking || "",
            alcohol: profile.alcohol || "",
            typicalSleep: profile.typicalSleep ?? "",
            typicalActivity: profile.typicalActivity || "",
            foodPreference: profile.foodPreference || "",
          });
        }
      } catch (error) {
        console.error(
          "EDIT PROFILE ERROR:",
          error.response?.data || error.message,
        );

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

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
  }, [navigate]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // =====================================================
  // VALIDATE STEP
  // =====================================================

  const validateStep = () => {
    setError("");

    // STEP 1
    if (step === 1) {
      if (!formData.dateOfBirth) {
        setError("Please enter your date of birth.");
        return false;
      }

      if (!formData.gender) {
        setError("Please select your gender.");
        return false;
      }

      if (
        formData.heightCm !== "" &&
        (Number(formData.heightCm) <= 0 || Number(formData.heightCm) > 300)
      ) {
        setError("Please enter a valid height.");
        return false;
      }

      if (
        formData.weightKg !== "" &&
        (Number(formData.weightKg) <= 0 || Number(formData.weightKg) > 500)
      ) {
        setError("Please enter a valid weight.");
        return false;
      }
    }

    // STEP 2
    if (step === 2) {
      if (!formData.diabetesStatus) {
        setError("Please select your diabetes status.");
        return false;
      }

      if (
        formData.diagnosisYear !== "" &&
        (Number(formData.diagnosisYear) < 1900 ||
          Number(formData.diagnosisYear) > new Date().getFullYear())
      ) {
        setError("Please enter a valid diagnosis year.");
        return false;
      }

      if (
        formData.hba1c !== "" &&
        (Number(formData.hba1c) < 0 || Number(formData.hba1c) > 30)
      ) {
        setError("Please enter a valid HbA1c value.");
        return false;
      }

      if (
        formData.fastingGlucose !== "" &&
        (Number(formData.fastingGlucose) < 0 ||
          Number(formData.fastingGlucose) > 1000)
      ) {
        setError("Please enter a valid fasting glucose value.");
        return false;
      }
    }

    // STEP 3
    if (step === 3) {
      // All medical history fields are optional.
    }

    // STEP 4
    if (step === 4) {
      if (
        formData.typicalSleep !== "" &&
        (Number(formData.typicalSleep) < 0 ||
          Number(formData.typicalSleep) > 24)
      ) {
        setError("Sleep hours must be between 0 and 24.");
        return false;
      }
    }

    return true;
  };

  // =====================================================
  // NEXT STEP
  // =====================================================

  const nextStep = (e) => {
    // VERY IMPORTANT:
    // Prevent any accidental form submission.
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("NEXT CLICKED - CURRENT STEP:", step);

    if (!validateStep()) {
      return;
    }

    setSuccess("");
    setError("");

    if (step < 4) {
      setStep((previous) => {
        const next = previous + 1;

        console.log("MOVING TO STEP:", next);

        return next;
      });
    }
  };

  // =====================================================
  // PREVIOUS STEP
  // =====================================================

  const previousStep = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setError("");
    setSuccess("");

    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const saveProfile = async () => {
    console.log("SAVE PROFILE CLICKED");

    if (!validateStep()) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      console.log("PROFILE DATA BEING SENT:");
      console.log(formData);

      const response = await api.post("/profile", formData);

      console.log("PROFILE SAVED:", response.data);

      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(
        "SAVE PROFILE ERROR:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to save your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // STYLES
  // =====================================================

  const inputClass =
    "w-full px-4 py-3 border border-slate-300 rounded-lg " +
    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
    "outline-none transition bg-white";

  const labelClass = "block text-sm font-medium text-slate-700 mb-2";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading your profile...</p>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {/* HEADER */}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">MediTwin</h1>

          <h2 className="text-2xl font-semibold text-slate-900 mt-4">
            Edit Health Profile
          </h2>

          <p className="text-slate-500 mt-2">
            Update your health and lifestyle information.
          </p>
        </div>

        {/* PROGRESS */}

        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Step {step} of 4</span>

            <span>{Math.round((step / 4) * 100)}%</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(step / 4) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* =================================================
            DO NOT USE <form>
            This prevents accidental submission while
            changing between steps.
        ================================================= */}

        <div>
          {/* =================================================
              STEP 1
          ================================================= */}

          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-slate-900">
                Step 1: Basic Details
              </h3>

              <div>
                <label className={labelClass}>Date of Birth</label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select gender</option>

                  <option value="female">Female</option>

                  <option value="male">Male</option>

                  <option value="other">Other</option>

                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Height (cm)</label>

                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={handleChange}
                  placeholder="Example: 165"
                  min="1"
                  max="300"
                  step="0.1"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Weight (kg)</label>

                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleChange}
                  placeholder="Example: 60"
                  min="1"
                  max="500"
                  step="0.1"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Location</label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City / State"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* =================================================
              STEP 2
          ================================================= */}

          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-slate-900">
                Step 2: Diabetes Information
              </h3>

              <div>
                <label className={labelClass}>Diabetes Status</label>

                <select
                  name="diabetesStatus"
                  value={formData.diabetesStatus}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select status</option>

                  <option value="no">No diabetes</option>

                  <option value="prediabetes">Prediabetes</option>

                  <option value="yes">Diabetes</option>

                  <option value="unknown">Not sure</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Diabetes Type</label>

                <select
                  name="diabetesType"
                  value={formData.diabetesType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select type</option>

                  <option value="type1">Type 1</option>

                  <option value="type2">Type 2</option>

                  <option value="gestational">Gestational</option>

                  <option value="other">Other</option>

                  <option value="not_applicable">Not applicable</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Year of Diagnosis</label>

                <input
                  type="number"
                  name="diagnosisYear"
                  value={formData.diagnosisYear}
                  onChange={handleChange}
                  placeholder="Example: 2022"
                  min="1900"
                  max={new Date().getFullYear()}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>HbA1c (%) — if known</label>

                <input
                  type="number"
                  name="hba1c"
                  value={formData.hba1c}
                  onChange={handleChange}
                  placeholder="Example: 6.5"
                  min="0"
                  max="30"
                  step="0.1"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Fasting Glucose (mg/dL)</label>

                <input
                  type="number"
                  name="fastingGlucose"
                  value={formData.fastingGlucose}
                  onChange={handleChange}
                  placeholder="Example: 100"
                  min="0"
                  max="1000"
                  step="0.1"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* =================================================
              STEP 3
          ================================================= */}

          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-slate-900">
                Step 3: Medical History
              </h3>

              <div>
                <label className={labelClass}>Blood Pressure History</label>

                <select
                  name="bloodPressureHistory"
                  value={formData.bloodPressureHistory}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>

                  <option value="normal">Normal</option>

                  <option value="high">High blood pressure</option>

                  <option value="low">Low blood pressure</option>

                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Cholesterol</label>

                <select
                  name="cholesterol"
                  value={formData.cholesterol}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>

                  <option value="normal">Normal</option>

                  <option value="high">High</option>

                  <option value="low">Low</option>

                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Kidney-related History</label>

                <textarea
                  name="kidneyHistory"
                  value={formData.kidneyHistory}
                  onChange={handleChange}
                  placeholder="Enter details if applicable"
                  rows={3}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Heart-related History</label>

                <textarea
                  name="heartHistory"
                  value={formData.heartHistory}
                  onChange={handleChange}
                  placeholder="Enter details if applicable"
                  rows={3}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Other Conditions</label>

                <textarea
                  name="otherConditions"
                  value={formData.otherConditions}
                  onChange={handleChange}
                  placeholder="Enter any other medical conditions"
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* =================================================
              STEP 4
          ================================================= */}

          {step === 4 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-slate-900">
                Step 4: Lifestyle
              </h3>

              <div>
                <label className={labelClass}>Smoking</label>

                <select
                  name="smoking"
                  value={formData.smoking}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>

                  <option value="never">Never</option>

                  <option value="former">Former smoker</option>

                  <option value="current">Current smoker</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Alcohol</label>

                <select
                  name="alcohol"
                  value={formData.alcohol}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>

                  <option value="never">Never</option>

                  <option value="occasionally">Occasionally</option>

                  <option value="regularly">Regularly</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Typical Sleep (hours per night)
                </label>

                <input
                  type="number"
                  name="typicalSleep"
                  value={formData.typicalSleep}
                  onChange={handleChange}
                  placeholder="Example: 7"
                  min="0"
                  max="24"
                  step="0.5"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Typical Activity</label>

                <select
                  name="typicalActivity"
                  value={formData.typicalActivity}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>

                  <option value="sedentary">Sedentary</option>

                  <option value="light">Lightly active</option>

                  <option value="moderate">Moderately active</option>

                  <option value="very_active">Very active</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Food Preference</label>

                <select
                  name="foodPreference"
                  value={formData.foodPreference}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>

                  <option value="vegetarian">Vegetarian</option>

                  <option value="non_vegetarian">Non-vegetarian</option>

                  <option value="vegan">Vegan</option>

                  <option value="mixed">Mixed</option>

                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="flex justify-between mt-8">
            {/* PREVIOUS */}

            <button
              type="button"
              onClick={previousStep}
              disabled={step === 1 || saving}
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>

            {/* NEXT */}

            {step < 4 && (
              <button
                type="button"
                onClick={nextStep}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Save & Continue
              </button>
            )}

            {/* FINAL SAVE */}

            {step === 4 && (
              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save & Continue"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;

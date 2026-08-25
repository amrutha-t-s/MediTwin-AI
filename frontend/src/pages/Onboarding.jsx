import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Onboarding() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    // =========================
    // STEP 1 - BASIC DETAILS
    // =========================
    dateOfBirth: "",
    gender: "",
    heightCm: "",
    weightKg: "",
    location: "",

    // =========================
    // STEP 2 - DIABETES
    // =========================
    diabetesStatus: "",
    diabetesType: "",
    diagnosisYear: "",
    hba1c: "",
    fastingGlucose: "",

    // =========================
    // STEP 3 - MEDICAL HISTORY
    // =========================
    bloodPressureHistory: "",
    cholesterol: "",
    kidneyHistory: "",
    heartHistory: "",
    otherConditions: "",

    // =========================
    // STEP 4 - LIFESTYLE
    // =========================
    smoking: "",
    alcohol: "",
    typicalSleep: "",
    typicalActivity: "",
    foodPreference: "",
  });

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear error when user changes a field
    if (error) {
      setError("");
    }
  };

  // ==========================================
  // VALIDATE CURRENT STEP
  // ==========================================

  const validateStep = () => {
    setError("");

    // ------------------------------------------
    // STEP 1
    // ------------------------------------------

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

    // ------------------------------------------
    // STEP 2
    // ------------------------------------------

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

    // ------------------------------------------
    // STEP 3
    // ------------------------------------------

    if (step === 3) {
      // All medical history fields are optional.
    }

    // ------------------------------------------
    // STEP 4
    // ------------------------------------------

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

  // ==========================================
  // NEXT STEP
  // ==========================================

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    setSuccess("");

    if (step < 4) {
      setStep((previous) => previous + 1);
    }
  };

  // ==========================================
  // PREVIOUS STEP
  // ==========================================

  const previousStep = () => {
    setError("");
    setSuccess("");

    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  };

  // ==========================================
  // SUBMIT ONBOARDING
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Check whether token exists
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please login again.");

        setTimeout(() => {
          navigate("/login");
        }, 1000);

        return;
      }

      console.log("=================================");
      console.log("Sending onboarding data:");
      console.log(formData);
      console.log("=================================");

      /*
       * api.js automatically adds:
       *
       * Authorization: Bearer <token>
       *
       * Therefore we do NOT manually add the Authorization header here.
       */

      const response = await api.post("/profile", formData);

      console.log("=================================");
      console.log("Onboarding response:");
      console.log(response.data);
      console.log("=================================");

      setSuccess(
        "Onboarding completed successfully! Redirecting to dashboard...",
      );

      // Redirect after successful save
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Onboarding error:", error.response?.data || error.message);

      // Authentication error
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("role");

        navigate("/login");
        return;
      }

      // Backend error
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to save your onboarding information.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STYLES
  // ==========================================

  const inputClass =
    "w-full px-4 py-3 border border-slate-300 rounded-lg " +
    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
    "outline-none transition";

  const labelClass = "block text-sm font-medium text-slate-700 mb-2";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">MediTwin</h1>

          <h2 className="text-2xl font-semibold text-slate-900 mt-4">
            Health Onboarding
          </h2>

          <p className="text-slate-500 mt-2">
            Help us understand your health and lifestyle.
          </p>
        </div>

        {/* ======================================
            PROGRESS
        ====================================== */}

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

        {/* ======================================
            FORM
        ====================================== */}

        <form onSubmit={handleSubmit}>
          {/* ====================================
              STEP 1
          ==================================== */}

          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-slate-900">
                Step 1: Basic Details
              </h3>

              {/* Date of Birth */}

              <div>
                <label className={labelClass}>Date of Birth</label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              {/* Gender */}

              <div>
                <label className={labelClass}>Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select gender</option>

                  <option value="female">Female</option>

                  <option value="male">Male</option>

                  <option value="other">Other</option>

                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              {/* Height */}

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

              {/* Weight */}

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

              {/* Location */}

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

          {/* ====================================
              STEP 2
          ==================================== */}

          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-slate-900">
                Step 2: Diabetes Information
              </h3>

              {/* Diabetes Status */}

              <div>
                <label className={labelClass}>Diabetes Status</label>

                <select
                  name="diabetesStatus"
                  value={formData.diabetesStatus}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select status</option>

                  <option value="no">No diabetes</option>

                  <option value="prediabetes">Prediabetes</option>

                  <option value="yes">Diabetes</option>

                  <option value="unknown">Not sure</option>
                </select>
              </div>

              {/* Diabetes Type */}

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

              {/* Diagnosis Year */}

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

              {/* HbA1c */}

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

              {/* Fasting Glucose */}

              <div>
                <label className={labelClass}>
                  Fasting Glucose (mg/dL) — if known
                </label>

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

          {/* ====================================
              STEP 3
          ==================================== */}

          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-slate-900">
                Step 3: Medical History
              </h3>

              {/* Blood Pressure */}

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

              {/* Cholesterol */}

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

              {/* Kidney */}

              <div>
                <label className={labelClass}>Kidney-related History</label>

                <textarea
                  name="kidneyHistory"
                  value={formData.kidneyHistory}
                  onChange={handleChange}
                  placeholder="Enter details if applicable"
                  rows="3"
                  className={inputClass}
                />
              </div>

              {/* Heart */}

              <div>
                <label className={labelClass}>Heart-related History</label>

                <textarea
                  name="heartHistory"
                  value={formData.heartHistory}
                  onChange={handleChange}
                  placeholder="Enter details if applicable"
                  rows="3"
                  className={inputClass}
                />
              </div>

              {/* Other Conditions */}

              <div>
                <label className={labelClass}>Other Conditions</label>

                <textarea
                  name="otherConditions"
                  value={formData.otherConditions}
                  onChange={handleChange}
                  placeholder="Enter any other medical conditions"
                  rows="3"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* ====================================
              STEP 4
          ==================================== */}

          {step === 4 && (
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-slate-900">
                Step 4: Lifestyle
              </h3>

              {/* Smoking */}

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

              {/* Alcohol */}

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

              {/* Sleep */}

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

              {/* Activity */}

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

              {/* Food Preference */}

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

          {/* ====================================
              ERROR MESSAGE
          ==================================== */}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ====================================
              SUCCESS MESSAGE
          ==================================== */}

          {success && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* ====================================
              BUTTONS
          ==================================== */}

          <div className="flex justify-between mt-8">
            {/* Previous */}

            {step > 1 ? (
              <button
                type="button"
                onClick={previousStep}
                disabled={loading}
                className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            {/* Next / Submit */}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Complete Onboarding"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;

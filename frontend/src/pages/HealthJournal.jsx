import { useEffect, useState } from "react";
import api from "../services/api";

function HealthJournal() {
  const initialFormData = {
    date: new Date().toISOString().split("T")[0],

    glucose: "",
    systolicBP: "",
    diastolicBP: "",
    weight: "",

    steps: "",
    sleep: "",

    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: "",

    medication: "",

    water: "",
    smoking: "",
    alcohol: "",

    notes: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // =====================================================
  // SAVED JOURNALS
  // =====================================================

  const [journals, setJournals] = useState([]);
  const [loadingJournals, setLoadingJournals] = useState(true);

  // =====================================================
  // LOAD PREVIOUS JOURNALS
  // =====================================================

  const loadJournals = async () => {
    try {
      setLoadingJournals(true);

      const response = await api.get("/journal");

      console.log("JOURNALS LOADED:", response.data);

      // Backend returns an array
      setJournals(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(
        "LOAD JOURNALS ERROR:",
        error.response?.data || error.message,
      );

      // Don't show an error if there are simply no journals
      if (error.response?.status !== 404) {
        setError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to load previous journal entries.",
        );
      }
    } finally {
      setLoadingJournals(false);
    }
  };

  // Load journals whenever this page opens
  useEffect(() => {
    loadJournals();
  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (!formData.date) {
      setError("Please select a date.");
      return false;
    }

    if (
      formData.glucose !== "" &&
      (Number(formData.glucose) <= 0 || Number(formData.glucose) > 1000)
    ) {
      setError("Please enter a valid glucose value.");
      return false;
    }

    if (
      formData.systolicBP !== "" &&
      (Number(formData.systolicBP) <= 0 || Number(formData.systolicBP) > 300)
    ) {
      setError("Please enter a valid systolic blood pressure.");
      return false;
    }

    if (
      formData.diastolicBP !== "" &&
      (Number(formData.diastolicBP) <= 0 || Number(formData.diastolicBP) > 200)
    ) {
      setError("Please enter a valid diastolic blood pressure.");
      return false;
    }

    if (
      formData.weight !== "" &&
      (Number(formData.weight) <= 0 || Number(formData.weight) > 500)
    ) {
      setError("Please enter a valid weight.");
      return false;
    }

    if (
      formData.steps !== "" &&
      (Number(formData.steps) < 0 || Number(formData.steps) > 100000)
    ) {
      setError("Please enter a valid number of steps.");
      return false;
    }

    if (
      formData.sleep !== "" &&
      (Number(formData.sleep) < 0 || Number(formData.sleep) > 24)
    ) {
      setError("Sleep must be between 0 and 24 hours.");
      return false;
    }

    if (
      formData.water !== "" &&
      (Number(formData.water) < 0 || Number(formData.water) > 20)
    ) {
      setError("Please enter a valid water intake.");
      return false;
    }

    return true;
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // =================================================
      // SEND DATA TO BACKEND
      // =================================================

      const response = await api.post("/journal", {
        date: formData.date,

        glucose: formData.glucose,
        systolicBP: formData.systolicBP,
        diastolicBP: formData.diastolicBP,

        weight: formData.weight,

        steps: formData.steps,
        sleep: formData.sleep,

        breakfast: formData.breakfast,
        lunch: formData.lunch,
        dinner: formData.dinner,
        snacks: formData.snacks,

        medication: formData.medication,

        water: formData.water,
        smoking: formData.smoking,
        alcohol: formData.alcohol,

        notes: formData.notes,
      });

      console.log("JOURNAL SAVED:", response.data);

      setSuccess("Daily health journal saved successfully!");

      // =================================================
      // CLEAR FORM AFTER SUCCESSFUL SAVE
      // =================================================

      setFormData({
        ...initialFormData,
        date: formData.date,
      });

      // =================================================
      // RELOAD PREVIOUS JOURNALS
      // =================================================

      await loadJournals();
    } catch (error) {
      console.error(
        "SAVE JOURNAL ERROR:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to save daily health journal.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const handleReset = () => {
    setFormData({
      ...initialFormData,
      date: new Date().toISOString().split("T")[0],
    });

    setSuccess("");
    setError("");
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // STYLES
  // =====================================================

  const inputClass =
    "w-full px-4 py-3 border border-slate-300 rounded-lg " +
    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
    "outline-none transition bg-white";

  const labelClass = "block text-sm font-medium text-slate-700 mb-2";

  const sectionClass =
    "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Daily Health Journal
          </h1>

          <p className="text-slate-500 mt-2">
            Record your daily health, activity, food and lifestyle information.
          </p>
        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* =================================================
            JOURNAL FORM
        ================================================= */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* =================================================
              DATE
          ================================================= */}

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-5">
              📅 Date
            </h2>

            <div>
              <label className={labelClass}>Journal Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* =================================================
              GLUCOSE
          ================================================= */}

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-5">
              🩸 Glucose
            </h2>

            <div>
              <label className={labelClass}>Blood Glucose</label>

              <div className="relative">
                <input
                  type="number"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  placeholder="Example: 100"
                  min="0"
                  max="1000"
                  step="0.1"
                  className={inputClass}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  mg/dL
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Enter your blood glucose reading in mg/dL.
              </p>
            </div>
          </div>

          {/* =================================================
              BLOOD PRESSURE
          ================================================= */}

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-5">
              ❤️ Blood Pressure
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Systolic</label>

                <div className="relative">
                  <input
                    type="number"
                    name="systolicBP"
                    value={formData.systolicBP}
                    onChange={handleChange}
                    placeholder="Example: 120"
                    min="0"
                    max="300"
                    className={inputClass}
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    mmHg
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Diastolic</label>

                <div className="relative">
                  <input
                    type="number"
                    name="diastolicBP"
                    value={formData.diastolicBP}
                    onChange={handleChange}
                    placeholder="Example: 80"
                    min="0"
                    max="200"
                    className={inputClass}
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    mmHg
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Example: 120 / 80 mmHg
            </p>
          </div>

          {/* =================================================
              WEIGHT
          ================================================= */}

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-5">
              ⚖️ Weight
            </h2>

            <div>
              <label className={labelClass}>Weight</label>

              <div className="relative">
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Example: 60"
                  min="0"
                  max="500"
                  step="0.1"
                  className={inputClass}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              ACTIVITY
          ================================================= */}

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-5">
              🚶 Activity
            </h2>

            <div>
              <label className={labelClass}>Steps</label>

              <div className="relative">
                <input
                  type="number"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  placeholder="Example: 8000"
                  min="0"
                  max="100000"
                  className={inputClass}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  steps
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              SLEEP
          ================================================= */}

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-5">
              😴 Sleep
            </h2>

            <div>
              <label className={labelClass}>Sleep Duration</label>

              <div className="relative">
                <input
                  type="number"
                  name="sleep"
                  value={formData.sleep}
                  onChange={handleChange}
                  placeholder="Example: 7.5"
                  min="0"
                  max="24"
                  step="0.5"
                  className={inputClass}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  hours
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              FOOD
          ================================================= */}

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-5">
              🍽️ Food
            </h2>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Breakfast</label>

                <textarea
                  name="breakfast"
                  value={formData.breakfast}
                  onChange={handleChange}
                  placeholder="What did you eat for breakfast?"
                  rows="3"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Lunch</label>

                <textarea
                  name="lunch"
                  value={formData.lunch}
                  onChange={handleChange}
                  placeholder="What did you eat for lunch?"
                  rows="3"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Dinner</label>

                <textarea
                  name="dinner"
                  value={formData.dinner}
                  onChange={handleChange}
                  placeholder="What did you eat for dinner?"
                  rows="3"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Snacks</label>

                <textarea
                  name="snacks"
                  value={formData.snacks}
                  onChange={handleChange}
                  placeholder="Any snacks during the day?"
                  rows="2"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              MEDICATION
          ================================================= */}

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-5">
              💊 Medication
            </h2>

            <div>
              <label className={labelClass}>Medication Taken</label>

              <textarea
                name="medication"
                value={formData.medication}
                onChange={handleChange}
                placeholder="Enter medications taken today..."
                rows="3"
                className={inputClass}
              />
            </div>
          </div>

          {/* =================================================
              LIFESTYLE
          ================================================= */}

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-5">
              🌱 Lifestyle
            </h2>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Water Intake</label>

                <div className="relative">
                  <input
                    type="number"
                    name="water"
                    value={formData.water}
                    onChange={handleChange}
                    placeholder="Example: 2.5"
                    min="0"
                    max="20"
                    step="0.1"
                    className={inputClass}
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    litres
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Smoking</label>

                <select
                  name="smoking"
                  value={formData.smoking}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option value="none">None</option>
                  <option value="yes">Yes</option>
                  <option value="occasionally">Occasionally</option>
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
                  <option value="none">None</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="regularly">Regularly</option>
                </select>
              </div>
            </div>
          </div>

          {/* =================================================
              NOTES
          ================================================= */}

          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-5">
              📝 Notes
            </h2>

            <div>
              <label className={labelClass}>Additional Notes</label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Anything else you would like to record about today?"
                rows="5"
                className={inputClass}
              />
            </div>
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Journal"}
            </button>
          </div>
        </form>

        {/* =====================================================
            PREVIOUS JOURNAL ENTRIES
        ===================================================== */}

        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              📋 Previous Journal Entries
            </h2>

            <p className="text-slate-500 mt-1">
              Your saved daily health records are stored here.
            </p>
          </div>

          {/* LOADING */}

          {loadingJournals && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
              <p className="text-slate-500">
                Loading previous journal entries...
              </p>
            </div>
          )}

          {/* NO JOURNALS */}

          {!loadingJournals && journals.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">📔</div>

              <h3 className="text-lg font-semibold text-slate-800">
                No journal entries yet
              </h3>

              <p className="text-slate-500 mt-2">
                Save your first daily health journal and it will appear here.
              </p>
            </div>
          )}

          {/* SAVED JOURNALS */}

          {!loadingJournals && journals.length > 0 && (
            <div className="space-y-6">
              {journals.map((journal) => (
                <div
                  key={journal.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                >
                  {/* DATE */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        📅 {formatDate(journal.date)}
                      </h3>

                      <p className="text-sm text-slate-400 mt-1">
                        Daily Health Record
                      </p>
                    </div>

                    <span className="inline-flex w-fit px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                      Saved
                    </span>
                  </div>

                  {/* HEALTH VALUES */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* GLUCOSE */}

                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-500">🩸 Glucose</p>

                      <p className="text-lg font-semibold text-slate-900 mt-1">
                        {journal.glucose !== null &&
                        journal.glucose !== undefined
                          ? `${journal.glucose} mg/dL`
                          : "Not entered"}
                      </p>
                    </div>

                    {/* BLOOD PRESSURE */}

                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-500">
                        ❤️ Blood Pressure
                      </p>

                      <p className="text-lg font-semibold text-slate-900 mt-1">
                        {journal.bpSystolic !== null &&
                        journal.bpSystolic !== undefined
                          ? `${journal.bpSystolic}/${journal.bpDiastolic ?? "-"} mmHg`
                          : "Not entered"}
                      </p>
                    </div>

                    {/* STEPS */}

                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-500">🚶 Steps</p>

                      <p className="text-lg font-semibold text-slate-900 mt-1">
                        {journal.steps !== null && journal.steps !== undefined
                          ? journal.steps
                          : "Not entered"}
                      </p>
                    </div>

                    {/* SLEEP */}

                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm text-slate-500">😴 Sleep</p>

                      <p className="text-lg font-semibold text-slate-900 mt-1">
                        {journal.sleepHours !== null &&
                        journal.sleepHours !== undefined
                          ? `${journal.sleepHours} hours`
                          : "Not entered"}
                      </p>
                    </div>
                  </div>

                  {/* WATER */}

                  <div className="mt-4 bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">💧 Water Intake</p>

                    <p className="text-lg font-semibold text-slate-900 mt-1">
                      {journal.waterLiters !== null &&
                      journal.waterLiters !== undefined
                        ? `${journal.waterLiters} litres`
                        : "Not entered"}
                    </p>
                  </div>

                  {/* FOOD */}

                  {journal.foodSummary && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-700 mb-2">
                        🍽️ Food
                      </p>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">
                          {journal.foodSummary}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* NOTES */}

                  {journal.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-700 mb-2">
                        📝 Notes
                      </p>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">
                          {journal.notes}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HealthJournal;

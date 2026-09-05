import { useState } from "react";
import api from "../services/api";

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

function HealthJournal() {
  const [formData, setFormData] = useState(initialFormData);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // -----------------------------------------
  // HANDLE INPUT CHANGE
  // -----------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear messages while editing
    setError("");
    setSuccess("");
  };

  // -----------------------------------------
  // VALIDATION
  // -----------------------------------------
  const validateForm = () => {
    setError("");

    // Date validation
    if (!formData.date) {
      setError("Please select a date.");
      return false;
    }

    const selectedDate = new Date(formData.date);

    if (Number.isNaN(selectedDate.getTime())) {
      setError("Please enter a valid date.");
      return false;
    }

    // Glucose
    if (formData.glucose !== "") {
      const glucose = Number(formData.glucose);

      if (Number.isNaN(glucose)) {
        setError("Glucose must be a numeric value.");
        return false;
      }

      if (glucose < 0) {
        setError("Glucose cannot be negative.");
        return false;
      }

      if (glucose > 1000) {
        setError("Please enter a reasonable glucose value.");
        return false;
      }
    }

    // Systolic BP
    if (formData.systolicBP !== "") {
      const systolic = Number(formData.systolicBP);

      if (Number.isNaN(systolic)) {
        setError("Systolic blood pressure must be numeric.");
        return false;
      }

      if (systolic < 0) {
        setError("Systolic blood pressure cannot be negative.");
        return false;
      }

      if (systolic > 300) {
        setError("Please enter a reasonable systolic blood pressure.");
        return false;
      }
    }

    // Diastolic BP
    if (formData.diastolicBP !== "") {
      const diastolic = Number(formData.diastolicBP);

      if (Number.isNaN(diastolic)) {
        setError("Diastolic blood pressure must be numeric.");
        return false;
      }

      if (diastolic < 0) {
        setError("Diastolic blood pressure cannot be negative.");
        return false;
      }

      if (diastolic > 200) {
        setError("Please enter a reasonable diastolic blood pressure.");
        return false;
      }
    }

    // Weight
    if (formData.weight !== "") {
      const weight = Number(formData.weight);

      if (Number.isNaN(weight)) {
        setError("Weight must be numeric.");
        return false;
      }

      if (weight < 0) {
        setError("Weight cannot be negative.");
        return false;
      }

      if (weight > 500) {
        setError("Please enter a reasonable weight.");
        return false;
      }
    }

    // Steps
    if (formData.steps !== "") {
      const steps = Number(formData.steps);

      if (Number.isNaN(steps)) {
        setError("Steps must be numeric.");
        return false;
      }

      if (steps < 0) {
        setError("Steps cannot be negative.");
        return false;
      }

      if (steps > 200000) {
        setError("Please enter a reasonable number of steps.");
        return false;
      }
    }

    // Sleep
    if (formData.sleep !== "") {
      const sleep = Number(formData.sleep);

      if (Number.isNaN(sleep)) {
        setError("Sleep duration must be numeric.");
        return false;
      }

      if (sleep < 0 || sleep > 24) {
        setError("Sleep duration must be between 0 and 24 hours.");
        return false;
      }
    }

    // Water
    if (formData.water !== "") {
      const water = Number(formData.water);

      if (Number.isNaN(water)) {
        setError("Water intake must be numeric.");
        return false;
      }

      if (water < 0 || water > 20) {
        setError("Water intake must be between 0 and 20 litres.");
        return false;
      }
    }

    return true;
  };

  // -----------------------------------------
  // SUBMIT JOURNAL
  // -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const response = await api.post("/journal", formData);

      console.log("DAILY JOURNAL SAVED:", response.data);

      setSuccess("Daily health journal saved successfully!");

      // Reset form after successful save
      setFormData({
        ...initialFormData,
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("JOURNAL SAVE ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save daily health journal.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // CLEAR FORM
  // -----------------------------------------
  const handleClear = () => {
    setFormData({
      ...initialFormData,
      date: new Date().toISOString().split("T")[0],
    });

    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Daily Health Journal
          </h1>

          <p className="mt-2 text-gray-600">
            Record your daily health, lifestyle, food and activity information.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* -------------------------------- */}
          {/* DATE */}
          {/* -------------------------------- */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Date</h2>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Journal Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </section>

          {/* -------------------------------- */}
          {/* GLUCOSE */}
          {/* -------------------------------- */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Blood Glucose
            </h2>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Glucose
            </label>

            <input
              type="number"
              name="glucose"
              value={formData.glucose}
              onChange={handleChange}
              min="0"
              max="1000"
              step="0.1"
              placeholder="Enter glucose value"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-xs text-gray-500">
              Optional. Enter the value recorded for the day.
            </p>
          </section>

          {/* -------------------------------- */}
          {/* BLOOD PRESSURE */}
          {/* -------------------------------- */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Blood Pressure
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Systolic BP
                </label>

                <input
                  type="number"
                  name="systolicBP"
                  value={formData.systolicBP}
                  onChange={handleChange}
                  min="0"
                  max="300"
                  placeholder="e.g. 120"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Diastolic BP
                </label>

                <input
                  type="number"
                  name="diastolicBP"
                  value={formData.diastolicBP}
                  onChange={handleChange}
                  min="0"
                  max="200"
                  placeholder="e.g. 80"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </section>

          {/* -------------------------------- */}
          {/* BODY & ACTIVITY */}
          {/* -------------------------------- */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Body & Activity
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Weight */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>

                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0"
                  max="500"
                  step="0.1"
                  placeholder="e.g. 65"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Steps */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Steps
                </label>

                <input
                  type="number"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  min="0"
                  max="200000"
                  placeholder="e.g. 8000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Sleep */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Sleep (hours)
                </label>

                <input
                  type="number"
                  name="sleep"
                  value={formData.sleep}
                  onChange={handleChange}
                  min="0"
                  max="24"
                  step="0.1"
                  placeholder="e.g. 7.5"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </section>

          {/* -------------------------------- */}
          {/* FOOD */}
          {/* -------------------------------- */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Food & Meals
            </h2>

            <div className="space-y-4">
              {/* Breakfast */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Breakfast
                </label>

                <textarea
                  name="breakfast"
                  value={formData.breakfast}
                  onChange={handleChange}
                  rows="2"
                  placeholder="What did you have for breakfast?"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Lunch */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Lunch
                </label>

                <textarea
                  name="lunch"
                  value={formData.lunch}
                  onChange={handleChange}
                  rows="2"
                  placeholder="What did you have for lunch?"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Dinner */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Dinner
                </label>

                <textarea
                  name="dinner"
                  value={formData.dinner}
                  onChange={handleChange}
                  rows="2"
                  placeholder="What did you have for dinner?"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Snacks */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Snacks
                </label>

                <textarea
                  name="snacks"
                  value={formData.snacks}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Any snacks during the day?"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </section>

          {/* -------------------------------- */}
          {/* MEDICATION */}
          {/* -------------------------------- */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Medication
            </h2>

            <textarea
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              rows="3"
              placeholder="Record medications taken today, if applicable."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-2 text-xs text-gray-500">
              This is for record keeping only. MediTwin does not recommend
              changing medication.
            </p>
          </section>

          {/* -------------------------------- */}
          {/* LIFESTYLE */}
          {/* -------------------------------- */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Lifestyle
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Water */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Water (litres)
                </label>

                <input
                  type="number"
                  name="water"
                  value={formData.water}
                  onChange={handleChange}
                  min="0"
                  max="20"
                  step="0.1"
                  placeholder="e.g. 2.5"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Smoking */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Smoking
                </label>

                <select
                  name="smoking"
                  value={formData.smoking}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Select</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {/* Alcohol */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Alcohol
                </label>

                <select
                  name="alcohol"
                  value={formData.alcohol}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Select</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </section>

          {/* -------------------------------- */}
          {/* NOTES */}
          {/* -------------------------------- */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Additional Notes
            </h2>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add anything else you would like to record..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </section>

          {/* -------------------------------- */}
          {/* DISCLAIMER */}
          {/* -------------------------------- */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            <strong>Note:</strong> This journal is intended for health
            monitoring and educational purposes. A single health entry should
            not be used to diagnose a medical condition or make medication
            decisions.
          </div>

          {/* -------------------------------- */}
          {/* BUTTONS */}
          {/* -------------------------------- */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClear}
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Journal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HealthJournal;

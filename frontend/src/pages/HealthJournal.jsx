import { useState } from "react";
import api from "../services/api";
import ActivityEntry from "../components/ActivityEntry";
import SleepEntry from "../components/SleepEntry";
import FoodEntry from "../components/FoodEntry";

const initialFormData = {
  date: new Date().toISOString().split("T")[0],

  // Day 16 - Glucose
  glucose: "",

  // Day 17 - BP & Vitals
  systolicBP: "",
  diastolicBP: "",
  pulseRate: "",
  weight: "",
  waistCircumference: "",

  // Day 18 - Activity
  steps: "",
  exerciseMinutes: "",
  exerciseType: "",
  sittingHours: "",

  // Day 18 - Sleep
  sleepStartTime: "",
  wakeUpTime: "",
  sleepDuration: "",
  sleep: "",
  sleepQuality: "",
  nightAwakenings: "",

  // Day 19 - Food Entry
  breakfast: "",
  breakfastTime: "",
  breakfastPortion: "",
  breakfastCustomPortion: "",
  breakfastSugaryDrink: false,
  breakfastFriedFood: false,
  breakfastHighCarb: false,
  breakfastVegetables: false,
  breakfastSatisfaction: "",

  lunch: "",
  lunchTime: "",
  lunchPortion: "",
  lunchCustomPortion: "",
  lunchSugaryDrink: false,
  lunchFriedFood: false,
  lunchHighCarb: false,
  lunchVegetables: false,
  lunchSatisfaction: "",

  dinner: "",
  dinnerTime: "",
  dinnerPortion: "",
  dinnerCustomPortion: "",
  dinnerSugaryDrink: false,
  dinnerFriedFood: false,
  dinnerHighCarb: false,
  dinnerVegetables: false,
  dinnerSatisfaction: "",

  snacks: "",
  snacksTime: "",
  snacksPortion: "",
  snacksCustomPortion: "",
  snacksSugaryDrink: false,
  snacksFriedFood: false,
  snacksHighCarb: false,
  snacksVegetables: false,
  snacksSatisfaction: "",

  // Day 16 - Medication
  medication: "",

  // Day 16 - Lifestyle
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

    setError("");
    setSuccess("");
  };

  // -----------------------------------------
  // VALIDATION
  // -----------------------------------------
  const validateForm = () => {
    setError("");

    // ---------------------------------------
    // DATE
    // ---------------------------------------
    if (!formData.date) {
      setError("Please select a date.");
      return false;
    }

    const selectedDate = new Date(formData.date);

    if (Number.isNaN(selectedDate.getTime())) {
      setError("Please enter a valid date.");
      return false;
    }

    // ---------------------------------------
    // GLUCOSE
    // ---------------------------------------
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

    // ---------------------------------------
    // SYSTOLIC BP
    // ---------------------------------------
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

    // ---------------------------------------
    // DIASTOLIC BP
    // ---------------------------------------
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

    // ---------------------------------------
    // PULSE RATE
    // ---------------------------------------
    if (formData.pulseRate !== "") {
      const pulseRate = Number(formData.pulseRate);

      if (Number.isNaN(pulseRate)) {
        setError("Pulse rate must be numeric.");
        return false;
      }

      if (pulseRate < 0) {
        setError("Pulse rate cannot be negative.");
        return false;
      }

      if (pulseRate > 250) {
        setError("Please enter a reasonable pulse rate.");
        return false;
      }
    }

    // ---------------------------------------
    // WEIGHT
    // ---------------------------------------
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

    // ---------------------------------------
    // WAIST CIRCUMFERENCE
    // ---------------------------------------
    if (formData.waistCircumference !== "") {
      const waist = Number(formData.waistCircumference);

      if (Number.isNaN(waist)) {
        setError("Waist circumference must be numeric.");
        return false;
      }

      if (waist < 0) {
        setError("Waist circumference cannot be negative.");
        return false;
      }

      if (waist > 300) {
        setError("Please enter a reasonable waist circumference.");
        return false;
      }
    }

    // ---------------------------------------
    // DAY 18 - STEPS
    // ---------------------------------------
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

    // ---------------------------------------
    // DAY 18 - EXERCISE MINUTES
    // ---------------------------------------
    if (formData.exerciseMinutes !== "") {
      const exMinutes = Number(formData.exerciseMinutes);

      if (Number.isNaN(exMinutes)) {
        setError("Exercise minutes must be numeric.");
        return false;
      }

      if (exMinutes < 0 || exMinutes > 1440) {
        setError("Exercise minutes must be between 0 and 1440 minutes.");
        return false;
      }
    }

    // ---------------------------------------
    // DAY 18 - SITTING HOURS
    // ---------------------------------------
    if (formData.sittingHours !== "") {
      const sitting = Number(formData.sittingHours);

      if (Number.isNaN(sitting)) {
        setError("Sitting hours must be numeric.");
        return false;
      }

      if (sitting < 0 || sitting > 24) {
        setError("Sitting hours must be between 0 and 24 hours.");
        return false;
      }
    }

    // ---------------------------------------
    // DAY 18 - SLEEP DURATION
    // ---------------------------------------
    const rawSleepDuration =
      formData.sleepDuration !== "" ? formData.sleepDuration : formData.sleep;

    if (rawSleepDuration !== "") {
      const sleep = Number(rawSleepDuration);

      if (Number.isNaN(sleep)) {
        setError("Sleep duration must be numeric.");
        return false;
      }

      if (sleep < 0 || sleep > 24) {
        setError("Sleep duration must be between 0 and 24 hours.");
        return false;
      }
    }

    // ---------------------------------------
    // DAY 18 - SLEEP QUALITY (1-5)
    // ---------------------------------------
    if (formData.sleepQuality !== "") {
      const quality = Number(formData.sleepQuality);

      if (Number.isNaN(quality) || quality < 1 || quality > 5) {
        setError("Sleep quality must be a rating between 1 and 5.");
        return false;
      }
    }

    // ---------------------------------------
    // DAY 18 - NIGHT AWAKENINGS
    // ---------------------------------------
    if (formData.nightAwakenings !== "") {
      const awakenings = Number(formData.nightAwakenings);

      if (Number.isNaN(awakenings) || awakenings < 0 || awakenings > 50) {
        setError("Night awakenings must be a non-negative number.");
        return false;
      }
    }

    // ---------------------------------------
    // WATER
    // ---------------------------------------
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
  // UNUSUAL VALUE WARNINGS
  // -----------------------------------------
  const getVitalWarnings = () => {
    const warnings = [];

    const systolic = Number(formData.systolicBP);
    const diastolic = Number(formData.diastolicBP);
    const pulse = Number(formData.pulseRate);

    // ---------------------------------------
    // BLOOD PRESSURE WARNING
    // ---------------------------------------
    if (formData.systolicBP !== "" && systolic >= 140) {
      warnings.push(
        "The systolic blood pressure reading is above the usual range. Consider rechecking the measurement and discussing persistent readings with a healthcare professional.",
      );
    }

    if (formData.diastolicBP !== "" && diastolic >= 90) {
      warnings.push(
        "The diastolic blood pressure reading is above the usual range. Consider rechecking the measurement and discussing persistent readings with a healthcare professional.",
      );
    }

    // ---------------------------------------
    // LOW BP WARNING
    // ---------------------------------------
    if (
      formData.systolicBP !== "" &&
      formData.diastolicBP !== "" &&
      systolic < 90 &&
      diastolic < 60
    ) {
      warnings.push(
        "This blood pressure reading is lower than the usual range. If you feel unwell or this occurs repeatedly, consider discussing it with a healthcare professional.",
      );
    }

    // ---------------------------------------
    // PULSE WARNING
    // ---------------------------------------
    if (formData.pulseRate !== "" && pulse > 100) {
      warnings.push(
        "The pulse rate is above the typical resting range. Consider checking it again when you are relaxed and discussing persistent unusual readings with a healthcare professional.",
      );
    }

    if (formData.pulseRate !== "" && pulse < 50) {
      warnings.push(
        "The pulse rate is below the typical resting range. This can vary between individuals, so consider rechecking it and discussing persistent concerns with a healthcare professional.",
      );
    }

    return warnings;
  };

  const vitalWarnings = getVitalWarnings();

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
        {/* =====================================
            HEADER
        ====================================== */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Daily Health Journal
          </h1>

          <p className="mt-2 text-gray-600">
            Record your daily health, vital signs, lifestyle, food and activity
            information.
          </p>
        </div>

        {/* =====================================
            SUCCESS MESSAGE
        ====================================== */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* =====================================
            ERROR MESSAGE
        ====================================== */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* =====================================
              DATE
          ====================================== */}
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

          {/* =====================================
              GLUCOSE
          ====================================== */}
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

          {/* =====================================
              DAY 17 - BP & VITALS
          ====================================== */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Blood Pressure & Vitals
            </h2>

            <p className="mb-5 text-sm text-gray-500">
              Enter your measured blood pressure, pulse, weight and waist
              circumference.
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {/* SYSTOLIC */}
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

                <p className="mt-1 text-xs text-gray-500">mmHg</p>
              </div>

              {/* DIASTOLIC */}
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

                <p className="mt-1 text-xs text-gray-500">mmHg</p>
              </div>

              {/* PULSE RATE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Pulse Rate
                </label>

                <input
                  type="number"
                  name="pulseRate"
                  value={formData.pulseRate}
                  onChange={handleChange}
                  min="0"
                  max="250"
                  placeholder="e.g. 72"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Beats per minute (bpm)
                </p>
              </div>

              {/* WEIGHT */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Weight
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

                <p className="mt-1 text-xs text-gray-500">Kilograms (kg)</p>
              </div>

              {/* WAIST */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Waist Circumference
                </label>

                <input
                  type="number"
                  name="waistCircumference"
                  value={formData.waistCircumference}
                  onChange={handleChange}
                  min="0"
                  max="300"
                  step="0.1"
                  placeholder="e.g. 85"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <p className="mt-1 text-xs text-gray-500">Centimetres (cm)</p>
              </div>
            </div>
          </section>

          {/* =====================================
              VITAL WARNINGS
          ====================================== */}
          {vitalWarnings.length > 0 && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5">
              <h3 className="mb-3 font-semibold text-yellow-800">
                Please review these readings
              </h3>

              <ul className="space-y-2 text-sm text-yellow-800">
                {vitalWarnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>

              <p className="mt-4 text-xs text-yellow-700">
                These messages are general health prompts and are not medical
                diagnoses.
              </p>
            </div>
          )}

          {/* =====================================
              DAY 18 - ACTIVITY & SLEEP ENTRY
          ====================================== */}
          <ActivityEntry formData={formData} onChange={handleChange} />

          <SleepEntry
            formData={formData}
            onChange={handleChange}
            onAutoCalculateDuration={(duration) => {
              setFormData((prev) => ({
                ...prev,
                sleepDuration: duration,
                sleep: duration,
              }));
              setError("");
            }}
          />

          {/* =====================================
              DAY 19 - FOOD ENTRY
          ====================================== */}
          <FoodEntry
            formData={formData}
            onChange={handleChange}
            setFormData={setFormData}
          />

          {/* =====================================
              MEDICATION
          ====================================== */}
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

          {/* =====================================
              LIFESTYLE
          ====================================== */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Lifestyle
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {/* WATER */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Water
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

                <p className="mt-1 text-xs text-gray-500">Litres</p>
              </div>

              {/* SMOKING */}
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

              {/* ALCOHOL */}
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

          {/* =====================================
              NOTES
          ====================================== */}
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

          {/* =====================================
              DISCLAIMER
          ====================================== */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            <strong>Note:</strong> This journal is intended for health
            monitoring and educational purposes. A single health entry should
            not be used to diagnose a medical condition or make medication
            decisions.
          </div>

          {/* =====================================
              BUTTONS
          ====================================== */}
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

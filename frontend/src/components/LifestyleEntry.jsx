import React from "react";

function LifestyleEntry({ formData, onChange, setFormData }) {
  const alcoholOptions = [
    "None / No alcohol today",
    "1 standard drink (Light)",
    "2–3 standard drinks (Moderate)",
    "4+ standard drinks (Heavy)",
  ];

  const smokingOptions = [
    "No",
    "Yes",
    "Occasional / Social",
  ];

  const stressLevels = [
    { value: 1, label: "1 - Relaxed", emoji: "🙂", desc: "Low stress" },
    { value: 2, label: "2 - Mild", emoji: "😌", desc: "Manageable" },
    { value: 3, label: "3 - Moderate", emoji: "😐", desc: "Average stress" },
    { value: 4, label: "4 - High", emoji: "😟", desc: "Significant tension" },
    { value: 5, label: "5 - Overwhelmed", emoji: "😫", desc: "Severe stress" },
  ];

  const energyLevels = [
    { value: 1, label: "1 - Exhausted", emoji: "🥱", desc: "Very low energy" },
    { value: 2, label: "2 - Low", emoji: "🪫", desc: "Sluggish" },
    { value: 3, label: "3 - Normal", emoji: "⚡", desc: "Adequate energy" },
    { value: 4, label: "4 - High", emoji: "💪", desc: "Active & alert" },
    { value: 5, label: "5 - Peak", emoji: "🌟", desc: "Vibrant energy" },
  ];

  const commonSymptoms = [
    "None / Feeling fine",
    "Fatigue / Tiredness",
    "Headache",
    "Dizziness",
    "Nausea",
    "Joint / Muscle Pain",
    "Shortness of breath",
    "Cough / Cold",
  ];

  const handleToggleSymptom = (symp) => {
    let current = (formData.symptoms || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (symp === "None / Feeling fine") {
      current = current.includes(symp) ? [] : ["None / Feeling fine"];
    } else {
      current = current.filter((s) => s !== "None / Feeling fine");
      if (current.includes(symp)) {
        current = current.filter((s) => s !== symp);
      } else {
        current.push(symp);
      }
    }

    const updated = current.join(", ");
    if (setFormData) {
      setFormData((prev) => ({ ...prev, symptoms: updated }));
    } else {
      onChange({ target: { name: "symptoms", value: updated } });
    }
  };

  const selectedSymptomsList = (formData.symptoms || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex flex-col justify-between border-b pb-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Lifestyle Entry
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your habits, daily stress, energy levels, physical symptoms, and notes.
          </p>
        </div>
        <span className="mt-2 self-start rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 sm:mt-0 sm:self-center">
          Wellbeing & Habits
        </span>
      </div>

      <div className="space-y-6">
        {/* Alcohol, Smoking & Water */}
        <div className="grid gap-5 md:grid-cols-3">
          {/* Alcohol */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Alcohol Consumption
            </label>
            <select
              name="alcohol"
              value={formData.alcohol ?? ""}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            >
              <option value="">Select consumption</option>
              {alcoholOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Drinks consumed in the past 24 hours.
            </p>
          </div>

          {/* Smoking */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Smoking
            </label>
            <select
              name="smoking"
              value={formData.smoking ?? ""}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            >
              <option value="">Select smoking status</option>
              {smokingOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Tobacco or nicotine use today.
            </p>
          </div>

          {/* Water */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Water Intake
            </label>
            <div className="relative">
              <input
                type="number"
                name="water"
                value={formData.water ?? ""}
                onChange={onChange}
                min="0"
                max="20"
                step="0.1"
                placeholder="e.g. 2.5"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
              <span className="pointer-events-none absolute right-4 top-2.5 text-sm text-gray-400">
                Litres
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Total hydration consumed today.
            </p>
          </div>
        </div>

        {/* Stress Level (1–5) */}
        <div className="border-t pt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Stress Level (1–5)
          </label>
          <p className="mb-3 text-xs text-gray-500">
            Rate your overall perceived mental and emotional stress today.
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {stressLevels.map((lvl) => {
              const isSelected =
                String(formData.stressLevel) === String(lvl.value);
              return (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      target: { name: "stressLevel", value: lvl.value },
                    })
                  }
                  className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition ${
                    isSelected
                      ? "border-purple-600 bg-purple-50 text-purple-800 shadow-sm ring-2 ring-purple-300"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl">{lvl.emoji}</span>
                  <span className="mt-1 text-xs font-semibold">{lvl.label}</span>
                  <span className="mt-0.5 text-[10px] text-gray-500">
                    {lvl.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy Level (1–5) */}
        <div className="border-t pt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Energy Level (1–5)
          </label>
          <p className="mb-3 text-xs text-gray-500">
            How energetic and alert did you feel throughout the day?
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {energyLevels.map((lvl) => {
              const isSelected =
                String(formData.energyLevel) === String(lvl.value);
              return (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      target: { name: "energyLevel", value: lvl.value },
                    })
                  }
                  className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition ${
                    isSelected
                      ? "border-purple-600 bg-purple-50 text-purple-800 shadow-sm ring-2 ring-purple-300"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl">{lvl.emoji}</span>
                  <span className="mt-1 text-xs font-semibold">{lvl.label}</span>
                  <span className="mt-0.5 text-[10px] text-gray-500">
                    {lvl.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Symptoms */}
        <div className="border-t pt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Symptoms
          </label>
          <p className="mb-3 text-xs text-gray-500">
            Select any symptoms you experienced today, or type custom symptoms below.
          </p>

          <div className="mb-3 flex flex-wrap gap-2">
            {commonSymptoms.map((symp) => {
              const isSelected = selectedSymptomsList.includes(symp);
              return (
                <button
                  key={symp}
                  type="button"
                  onClick={() => handleToggleSymptom(symp)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    isSelected
                      ? "border-purple-600 bg-purple-100 text-purple-800 ring-2 ring-purple-200"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "}
                  {symp}
                </button>
              );
            })}
          </div>

          <input
            type="text"
            name="symptoms"
            value={formData.symptoms ?? ""}
            onChange={onChange}
            placeholder="Custom symptoms (e.g. slight lower back ache, mild sinus pressure)"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Notes */}
        <div className="border-t pt-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes ?? ""}
            onChange={onChange}
            rows="3"
            placeholder="Record any other thoughts, mood, symptoms, or observations for the day..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>
    </section>
  );
}

export default LifestyleEntry;

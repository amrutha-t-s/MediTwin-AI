import React from "react";

function SleepEntry({ formData, onChange, onAutoCalculateDuration }) {
  const qualityOptions = [
    { value: 1, label: "1 - Poor", emoji: "😫", desc: "Restless / low energy" },
    { value: 2, label: "2 - Fair", emoji: "😐", desc: "Interrupted" },
    { value: 3, label: "3 - Good", emoji: "🙂", desc: "Adequate rest" },
    { value: 4, label: "4 - Very Good", emoji: "😊", desc: "Refreshing" },
    { value: 5, label: "5 - Excellent", emoji: "🌟", desc: "Deep & energizing" },
  ];

  const handleCalculateDuration = () => {
    if (!formData.sleepStartTime || !formData.wakeUpTime) return;

    const [startH, startM] = formData.sleepStartTime.split(":").map(Number);
    const [wakeH, wakeM] = formData.wakeUpTime.split(":").map(Number);

    if (
      Number.isNaN(startH) ||
      Number.isNaN(startM) ||
      Number.isNaN(wakeH) ||
      Number.isNaN(wakeM)
    ) {
      return;
    }

    let diffMinutes = wakeH * 60 + wakeM - (startH * 60 + startM);
    // If wake time is earlier than start time, sleep crossed midnight
    if (diffMinutes <= 0) {
      diffMinutes += 24 * 60;
    }

    const durationHours = (diffMinutes / 60).toFixed(1);

    if (onAutoCalculateDuration) {
      onAutoCalculateDuration(durationHours);
    } else {
      onChange({ target: { name: "sleepDuration", value: durationHours } });
      onChange({ target: { name: "sleep", value: durationHours } });
    }
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b pb-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Day 18 — Sleep Entry
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your sleep schedule, duration, nighttime awakenings, and rest quality.
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          Sleep
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* SLEEP START TIME */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Sleep Start Time
          </label>
          <input
            type="time"
            name="sleepStartTime"
            value={formData.sleepStartTime ?? ""}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <p className="mt-1 text-xs text-gray-500">
            Bedtime or time you fell asleep (e.g. 10:30 PM).
          </p>
        </div>

        {/* WAKE-UP TIME */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Wake-up Time
          </label>
          <input
            type="time"
            name="wakeUpTime"
            value={formData.wakeUpTime ?? ""}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <p className="mt-1 text-xs text-gray-500">
            Time you woke up in the morning (e.g. 06:30 AM).
          </p>
        </div>

        {/* SLEEP DURATION */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Sleep Duration
            </label>
            {formData.sleepStartTime && formData.wakeUpTime && (
              <button
                type="button"
                onClick={handleCalculateDuration}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
              >
                Auto-calculate from times
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="number"
              name="sleepDuration"
              value={formData.sleepDuration ?? formData.sleep ?? ""}
              onChange={(e) => {
                onChange(e);
                // Keep backward-compatible sleep field in sync
                onChange({ target: { name: "sleep", value: e.target.value } });
              }}
              min="0"
              max="24"
              step="0.1"
              placeholder="e.g. 7.5"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <span className="pointer-events-none absolute right-4 top-2.5 text-sm text-gray-400">
              Hours
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Total actual hours slept (0–24).
          </p>
        </div>

        {/* NIGHT AWAKENINGS */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Night Awakenings
          </label>
          <input
            type="number"
            name="nightAwakenings"
            value={formData.nightAwakenings ?? ""}
            onChange={onChange}
            min="0"
            max="20"
            placeholder="e.g. 1"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <p className="mt-1 text-xs text-gray-500">
            Number of times you woke up during the night (e.g. 0, 1, 2).
          </p>
        </div>
      </div>

      {/* SLEEP QUALITY (1-5) */}
      <div className="mt-5 border-t pt-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Sleep Quality from 1–5
        </label>
        <p className="mb-3 text-xs text-gray-500">
          Select how rested you felt upon waking (1 = Poor, 5 = Excellent).
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {qualityOptions.map((opt) => {
            const isSelected =
              String(formData.sleepQuality) === String(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  onChange({
                    target: { name: "sleepQuality", value: opt.value },
                  })
                }
                className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-2 ring-indigo-300"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="mt-1 text-xs font-semibold">{opt.label}</span>
                <span className="mt-0.5 text-[10px] text-gray-500">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Fallback hidden or select field for full standard accessibility */}
        <select
          name="sleepQuality"
          value={formData.sleepQuality ?? ""}
          onChange={onChange}
          className="mt-3 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:hidden"
        >
          <option value="">Select sleep quality rating (1-5)</option>
          {qualityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} - {opt.desc}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default SleepEntry;

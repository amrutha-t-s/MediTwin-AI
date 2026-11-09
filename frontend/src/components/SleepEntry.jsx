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
    <section className="rounded-xl border border-slate-800 bg-[#0d1322] p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white">
            Sleep Entry
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Track your sleep schedule, duration, nighttime awakenings, and rest quality.
          </p>
        </div>
        <span className="rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-400">
          Sleep
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* SLEEP START TIME */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Sleep Start Time
          </label>
          <input
            type="time"
            name="sleepStartTime"
            value={formData.sleepStartTime ?? ""}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Bedtime or time you fell asleep (e.g. 10:30 PM).
          </p>
        </div>

        {/* WAKE-UP TIME */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Wake-up Time
          </label>
          <input
            type="time"
            name="wakeUpTime"
            value={formData.wakeUpTime ?? ""}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Time you woke up in the morning (e.g. 06:30 AM).
          </p>
        </div>

        {/* SLEEP DURATION */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-300">
              Sleep Duration
            </label>
            {formData.sleepStartTime && formData.wakeUpTime && (
              <button
                type="button"
                onClick={handleCalculateDuration}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline cursor-pointer"
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
              className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="pointer-events-none absolute right-4 top-2.5 text-sm text-slate-400">
              Hours
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Total actual hours slept (0–24).
          </p>
        </div>

        {/* NIGHT AWAKENINGS */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
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
            className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Number of times you woke up during the night (e.g. 0, 1, 2).
          </p>
        </div>
      </div>

      {/* SLEEP QUALITY (1-5) */}
      <div className="mt-5 border-t border-slate-800/80 pt-4">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Sleep Quality from 1–5
        </label>
        <p className="mb-3 text-xs text-slate-500">
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
                className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-950/50 text-blue-300 shadow-sm ring-2 ring-blue-500/30"
                    : "border-slate-800 bg-[#090d16] text-slate-300 hover:border-slate-700 hover:bg-slate-800/40 hover:text-white"
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="mt-1 text-xs font-semibold">{opt.label}</span>
                <span className="mt-0.5 text-[10px] text-slate-400">
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
          className="mt-3 block w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:hidden"
        >
          <option value="" className="bg-[#090d16]">Select sleep quality rating (1-5)</option>
          {qualityOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#090d16]">
              {opt.label} - {opt.desc}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default SleepEntry;

import React from "react";

function ActivityEntry({ formData, onChange }) {
  const commonExerciseTypes = [
    "Walking",
    "Running / Jogging",
    "Cycling",
    "Swimming",
    "Gym / Strength Training",
    "Yoga / Stretching",
    "HIIT / Aerobics",
    "Sports",
    "Other",
  ];

  const isCustomType =
    formData.exerciseType &&
    !commonExerciseTypes.includes(formData.exerciseType) &&
    formData.exerciseType !== "";

  return (
    <section className="rounded-xl border border-slate-800 bg-[#0d1322] p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white">
            Activity Entry
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Record your daily physical activity, exercise details, and sedentary time.
          </p>
        </div>
        <span className="rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-400">
          Activity
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* STEPS */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Steps
          </label>
          <input
            type="number"
            name="steps"
            value={formData.steps ?? ""}
            onChange={onChange}
            min="0"
            max="200000"
            placeholder="e.g. 8000"
            className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Total steps walked or run today.
          </p>
        </div>

        {/* EXERCISE MINUTES */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Exercise Minutes
          </label>
          <input
            type="number"
            name="exerciseMinutes"
            value={formData.exerciseMinutes ?? ""}
            onChange={onChange}
            min="0"
            max="1440"
            placeholder="e.g. 45"
            className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Active workout or exercise time in minutes.
          </p>
        </div>

        {/* EXERCISE TYPE */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Exercise Type
          </label>
          <select
            name="exerciseType"
            value={isCustomType ? "Other" : (formData.exerciseType ?? "")}
            onChange={(e) => {
              if (e.target.value !== "Other") {
                onChange(e);
              } else {
                onChange({ target: { name: "exerciseType", value: "Other" } });
              }
            }}
            className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="" className="bg-[#090d16] text-slate-300">Select activity type</option>
            {commonExerciseTypes.map((type) => (
              <option key={type} value={type} className="bg-[#090d16] text-white">
                {type}
              </option>
            ))}
          </select>

          {(formData.exerciseType === "Other" || isCustomType) && (
            <input
              type="text"
              name="exerciseType"
              value={formData.exerciseType === "Other" ? "" : formData.exerciseType}
              onChange={onChange}
              placeholder="Specify exercise type"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          )}

          <p className="mt-1 text-xs text-slate-500">
            Primary workout type performed today.
          </p>
        </div>

        {/* SITTING HOURS */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Sitting Hours
          </label>
          <input
            type="number"
            name="sittingHours"
            value={formData.sittingHours ?? ""}
            onChange={onChange}
            min="0"
            max="24"
            step="0.5"
            placeholder="e.g. 6.5"
            className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Estimated sedentary or desk hours today (0–24 hours).
          </p>
        </div>
      </div>
    </section>
  );
}

export default ActivityEntry;

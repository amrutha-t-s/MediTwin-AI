import React from "react";

function MedicationEntry({ formData, onChange }) {
  const frequencies = [
    "Once daily",
    "Twice daily (Morning & Evening)",
    "Three times daily",
    "Four times daily",
    "With meals",
    "Before bedtime",
    "As needed (PRN)",
    "Weekly",
  ];

  const missedReasons = [
    "Forgot / busy schedule",
    "Experienced unpleasant side effects",
    "Ran out of medication / refill pending",
    "Felt unwell / stomach upset",
    "Felt better / skipped dose",
    "Advised by doctor / clinical pause",
    "Other",
  ];

  const adherenceStatus = formData.medicationTaken || "";

  return (
    <section className="rounded-xl border border-slate-800 bg-[#0d1322] p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex flex-col justify-between border-b border-slate-800/80 pb-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-white">
            Medication Entry
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Record your daily medication adherence and dosage tracking.
          </p>
        </div>
        <span className="mt-2 self-start rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-400 sm:mt-0 sm:self-center">
          Adherence Log
        </span>
      </div>

      {/* Strict Medical Disclaimer / Plan Protection Banner */}
      <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-300">
        <span className="text-lg">🔒</span>
        <div>
          <strong className="block font-semibold text-amber-200">
            Medication Plans Cannot Be Altered Here
          </strong>
          <span className="text-amber-300/80">
            MediTwin is strictly for recording your daily adherence. For your safety, medication prescriptions, dosages, and schedules cannot be changed within the application. Always consult your prescribing doctor before altering any medication regimen.
          </span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Medication Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Medication Name
          </label>
          <input
            type="text"
            name="medicationName"
            value={formData.medicationName ?? ""}
            onChange={onChange}
            placeholder="e.g. Metformin, Lisinopril, Aspirin"
            className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Brand or generic name of your prescribed medication.
          </p>
        </div>

        {/* Dosage Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Dosage Description
          </label>
          <input
            type="text"
            name="medicationDosage"
            value={formData.medicationDosage ?? ""}
            onChange={onChange}
            placeholder="e.g. 500 mg tablet, 10 ml syrup"
            className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Prescribed dose strength and formulation.
          </p>
        </div>

        {/* Frequency */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Frequency
          </label>
          <select
            name="medicationFrequency"
            value={formData.medicationFrequency ?? ""}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="" className="bg-[#090d16]">Select prescribed frequency</option>
            {frequencies.map((freq) => (
              <option key={freq} value={freq} className="bg-[#090d16]">
                {freq}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            How often this dose is prescribed.
          </p>
        </div>

        {/* Medication Taken Today */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Medication Taken Today
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: "Yes", label: "Yes, Taken", color: "blue", icon: "✓" },
              { val: "Partially", label: "Partially", color: "amber", icon: "◐" },
              { val: "No", label: "No / Missed", color: "red", icon: "✕" },
            ].map((opt) => {
              const isSelected = adherenceStatus === opt.val;
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() =>
                    onChange({
                      target: { name: "medicationTaken", value: opt.val },
                    })
                  }
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? opt.color === "blue"
                        ? "border-blue-500 bg-blue-950/50 text-blue-300 ring-2 ring-blue-500/30"
                        : opt.color === "amber"
                        ? "border-amber-500 bg-amber-950/50 text-amber-300 ring-2 ring-amber-500/30"
                        : "border-red-500 bg-red-950/50 text-red-300 ring-2 ring-red-500/30"
                      : "border-slate-800 bg-[#090d16] text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Did you take this medication as prescribed today?
          </p>
        </div>
      </div>

      {/* Missed Medication Reason (shown when No, Partially, or if user wants to log reason) */}
      {(adherenceStatus === "No" ||
        adherenceStatus === "Partially" ||
        formData.missedReason) && (
        <div className="mt-5 rounded-lg border border-red-500/30 bg-red-950/20 p-4">
          <label className="mb-1.5 block text-sm font-semibold text-red-300">
            Reason for Missed or Incomplete Dose
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              name="missedReason"
              value={formData.missedReason ?? ""}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option value="" className="bg-[#090d16]">Select reason for missed dose</option>
              {missedReasons.map((r) => (
                <option key={r} value={r} className="bg-[#090d16]">
                  {r}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="missedReasonDetails"
              value={formData.missedReasonDetails ?? ""}
              onChange={onChange}
              placeholder="Additional explanation (optional)"
              className="w-full rounded-lg border border-slate-700 bg-[#090d16] px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <p className="mt-1 text-xs text-red-400/80">
            Logging missed reasons helps identify adherence challenges to discuss with your doctor.
          </p>
        </div>
      )}
    </section>
  );
}

export default MedicationEntry;

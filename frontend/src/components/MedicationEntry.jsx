import React from "react";

function MedicationEntry({ formData, onChange, setFormData }) {
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
    <section className="rounded-xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex flex-col justify-between border-b pb-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Medication Entry
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Record your daily medication adherence and dosage tracking.
          </p>
        </div>
        <span className="mt-2 self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 sm:mt-0 sm:self-center">
          Adherence Log
        </span>
      </div>

      {/* Strict Medical Disclaimer / Plan Protection Banner */}
      <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
        <span className="text-lg">🔒</span>
        <div>
          <strong className="block font-semibold">
            Medication Plans Cannot Be Altered Here
          </strong>
          <span>
            MediTwin is strictly for recording your daily adherence. For your safety, medication prescriptions, dosages, and schedules cannot be changed within the application. Always consult your prescribing doctor before altering any medication regimen.
          </span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Medication Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Medication Name
          </label>
          <input
            type="text"
            name="medicationName"
            value={formData.medicationName ?? ""}
            onChange={onChange}
            placeholder="e.g. Metformin, Lisinopril, Aspirin"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <p className="mt-1 text-xs text-gray-500">
            Brand or generic name of your prescribed medication.
          </p>
        </div>

        {/* Dosage Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Dosage Description
          </label>
          <input
            type="text"
            name="medicationDosage"
            value={formData.medicationDosage ?? ""}
            onChange={onChange}
            placeholder="e.g. 500 mg tablet, 10 ml syrup"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <p className="mt-1 text-xs text-gray-500">
            Prescribed dose strength and formulation.
          </p>
        </div>

        {/* Frequency */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Frequency
          </label>
          <select
            name="medicationFrequency"
            value={formData.medicationFrequency ?? ""}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select prescribed frequency</option>
            {frequencies.map((freq) => (
              <option key={freq} value={freq}>
                {freq}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            How often this dose is prescribed.
          </p>
        </div>

        {/* Medication Taken Today */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Medication Taken Today
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: "Yes", label: "Yes, Taken", color: "emerald", icon: "✓" },
              { val: "Partially", label: "Partially", color: "amber", icon: "◐" },
              { val: "No", label: "No / Missed", color: "rose", icon: "✕" },
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
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-semibold transition ${
                    isSelected
                      ? opt.color === "emerald"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200"
                        : opt.color === "amber"
                        ? "border-amber-600 bg-amber-50 text-amber-700 ring-2 ring-amber-200"
                        : "border-rose-600 bg-rose-50 text-rose-700 ring-2 ring-rose-200"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Did you take this medication as prescribed today?
          </p>
        </div>
      </div>

      {/* Missed Medication Reason (shown when No, Partially, or if user wants to log reason) */}
      {(adherenceStatus === "No" ||
        adherenceStatus === "Partially" ||
        formData.missedReason) && (
        <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50/50 p-4">
          <label className="mb-1.5 block text-sm font-semibold text-rose-900">
            Reason for Missed or Incomplete Dose
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              name="missedReason"
              value={formData.missedReason ?? ""}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            >
              <option value="">Select reason for missed dose</option>
              {missedReasons.map((r) => (
                <option key={r} value={r}>
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            />
          </div>
          <p className="mt-1 text-xs text-rose-700">
            Logging missed reasons helps identify adherence challenges to discuss with your doctor.
          </p>
        </div>
      )}
    </section>
  );
}

export default MedicationEntry;

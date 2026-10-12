import { useState, useEffect, useCallback } from "react";

function Medication() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    instructions: "",
    startDate: new Date().toISOString().slice(0, 10),
    isActive: true,
  });

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const loadMedications = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch("http://localhost:4000/api/medications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.medications) {
          setMedications(data.medications);
        }
      })
      .catch((err) => console.warn("Failed to load medications:", err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Medication name is required." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:4000/api/medications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add medication.");

      setMessage({ type: "success", text: "Medication added successfully." });
      setForm({
        name: "",
        dosage: "",
        frequency: "Once daily",
        instructions: "",
        startDate: new Date().toISOString().slice(0, 10),
        isActive: true,
      });
      loadMedications();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (med) => {
    try {
      const res = await fetch(`http://localhost:4000/api/medications/${med.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !med.isActive }),
      });
      if (res.ok) loadMedications();
    } catch (err) {
      console.warn("Toggle error:", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medication record?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/medications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMedications((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.warn("Delete error:", err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl text-2xl">
              💊
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Medication Records & Schedules
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Maintain accurate records of your prescribed medications and schedules for adherence monitoring.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
            {medications.filter((m) => m.isActive).length} Active Prescriptions
          </span>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-xs text-amber-900 flex items-start gap-3">
        <span className="text-xl flex-shrink-0">⚠️</span>
        <div>
          <strong>Medical Safety Notice:</strong> MediTwin tracks adherence strictly for personal self-monitoring and historical logging. <strong>Never adjust, titrate, or stop your prescribed medications</strong> without consulting your licensed healthcare provider.
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add Medication Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>➕</span> Add New Medication
          </h2>

          {message && (
            <div
              className={`p-3 rounded-lg text-xs mb-4 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Medication Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Metformin, Lisinopril, Atorvastatin"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Dosage
              </label>
              <input
                type="text"
                placeholder="e.g. 500 mg, 10 mg, 1 tablet"
                value={form.dosage}
                onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Frequency
              </label>
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily (Morning & Evening)">Twice daily (Morning & Evening)</option>
                <option value="Three times daily (With meals)">Three times daily (With meals)</option>
                <option value="Before bedtime">Before bedtime</option>
                <option value="As needed (PRN)">As needed (PRN)</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Special Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Take with dinner to reduce stomach upset"
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Add Medication"}
            </button>
          </form>
        </div>

        {/* Medication List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Current Prescriptions ({medications.length})</span>
              <button
                onClick={loadMedications}
                className="text-xs text-blue-600 hover:underline font-normal"
              >
                Refresh List
              </button>
            </h2>

            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Loading medication records...
              </div>
            ) : medications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed">
                No medication records saved yet. Add your current prescriptions using the form.
              </div>
            ) : (
              <div className="space-y-3">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className={`p-4 rounded-xl border transition ${
                      med.isActive
                        ? "border-slate-200 bg-white hover:border-blue-200"
                        : "border-slate-100 bg-slate-50 opacity-60"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                          💊
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <span>{med.name}</span>
                            {med.dosage && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono font-medium">
                                {med.dosage}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {med.frequency || "Schedule not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(med)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                            med.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {med.isActive ? "● Active" : "○ Inactive"}
                        </button>
                        <button
                          onClick={() => handleDelete(med.id)}
                          className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded text-xs"
                          title="Delete medication"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {med.instructions && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
                        <span className="text-slate-400">Instructions:</span>
                        <span>{med.instructions}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Medication;

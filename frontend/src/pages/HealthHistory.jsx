import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function HealthHistory() {
  const navigate = useNavigate();

  // Records and view state
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filter state
  const [filterDate, setFilterDate] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);

  // Edit Modal state
  const [editingRecord, setEditingRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete Confirmation Dialog state
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-clear success message after 4 seconds
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  // ==================================================
  // RETRIEVE RECORDS
  // ==================================================
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/health-logs");
      setRecords(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch health logs:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load health history records. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // ==================================================
  // SEARCH / FILTER BY DATE
  // ==================================================
  const handleDateFilter = async (e) => {
    e.preventDefault();
    if (!filterDate) {
      fetchRecords();
      return;
    }

    try {
      setFilterLoading(true);
      setError("");

      const response = await api.get(`/health-logs/${filterDate}`);
      setRecords(response.data ? [response.data] : []);
    } catch (err) {
      if (err.response?.status === 404) {
        setRecords([]);
      } else {
        console.error("Filter error:", err);
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to filter records by date."
        );
      }
    } finally {
      setFilterLoading(false);
    }
  };

  const handleClearFilter = () => {
    setFilterDate("");
    fetchRecords();
  };

  // ==================================================
  // EDIT RECORD
  // ==================================================
  const handleOpenEdit = (record) => {
    setEditError("");
    setEditingRecord(record);

    const formattedDate = record.date
      ? new Date(record.date).toISOString().split("T")[0]
      : "";

    setEditFormData({
      date: formattedDate,
      glucose: record.glucose ?? "",
      bpSystolic: record.bpSystolic ?? "",
      bpDiastolic: record.bpDiastolic ?? "",
      heartRate: record.heartRate ?? "",
      weightKg: record.weightKg ?? "",
      waistCircumference: record.waistCircumference ?? "",
      sleepHours: record.sleepHours ?? record.sleepDuration ?? "",
      steps: record.steps ?? "",
      waterLiters: record.waterLiters ?? "",
      exerciseMinutes: record.exerciseMinutes ?? "",
      exerciseType: record.exerciseType ?? "",
      sittingHours: record.sittingHours ?? "",
      sleepQuality: record.sleepQuality ?? "",
      nightAwakenings: record.nightAwakenings ?? "",
      smoking: record.smoking ?? "",
      alcohol: record.alcohol ?? "",
      stressLevel: record.stressLevel ?? "",
      energyLevel: record.energyLevel ?? "",
      symptoms: record.symptoms ?? "",
      notes: record.notes ?? "",
      foodSummary: record.foodSummary ?? "",
      medicationName: record.medicationName ?? "",
      medicationDosage: record.medicationDosage ?? "",
      medicationFrequency: record.medicationFrequency ?? "",
      medicationTaken: record.medicationTaken ?? "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setEditError("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;

    if (!editFormData.date) {
      setEditError("Date is required.");
      return;
    }

    try {
      setSavingEdit(true);
      setEditError("");

      const response = await api.put(
        `/health-logs/${editingRecord.id}`,
        editFormData
      );

      setSuccess("Health record updated successfully!");
      setEditingRecord(null);

      // Update state with updated record or refetch
      if (response.data?.log) {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === editingRecord.id ? response.data.log : r
          )
        );
      } else {
        fetchRecords();
      }
    } catch (err) {
      console.error("Failed to update record:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save changes. Please try again.";
      setEditError(errMsg);
    } finally {
      setSavingEdit(false);
    }
  };

  // ==================================================
  // DELETE RECORD WITH CONFIRMATION
  // ==================================================
  const handleOpenDelete = (record) => {
    setDeletingRecord(record);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRecord) return;

    try {
      setIsDeleting(true);
      setError("");

      await api.delete(`/health-logs/${deletingRecord.id}`);

      setSuccess("Health record deleted successfully!");
      setRecords((prev) => prev.filter((r) => r.id !== deletingRecord.id));
      setDeletingRecord(null);
    } catch (err) {
      console.error("Failed to delete record:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete health record."
      );
      setDeletingRecord(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper date formatter
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* ==================================================
            HEADER & ACTIONS
        ================================================== */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health History</h1>
            <p className="mt-1 text-gray-600">
              Retrieve, view, edit, and manage your daily health logs and records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/health-journal")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              <span>+</span>
              <span>New Daily Entry</span>
            </button>
          </div>
        </div>

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}
        {success && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              <span className="font-medium">{success}</span>
            </div>
            <button
              onClick={() => setSuccess("")}
              className="text-green-600 hover:text-green-900"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* ==================================================
            ERROR STATE BANNER
        ================================================== */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">Unable to complete request</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={fetchRecords}
                className="ml-4 rounded-md bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 transition hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            DATE FILTER / SEARCH BAR
        ================================================== */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <form
            onSubmit={handleDateFilter}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <label
                htmlFor="filterDate"
                className="text-sm font-medium text-gray-700"
              >
                Filter by Date:
              </label>
              <input
                type="date"
                id="filterDate"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={filterLoading}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {filterLoading ? "Searching..." : "Search Date"}
            </button>

            {filterDate && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Clear Filter
              </button>
            )}

            <div className="ml-auto text-sm text-gray-500">
              Showing {records.length} {records.length === 1 ? "record" : "records"}
            </div>
          </form>
        </div>

        {/* ==================================================
            LOADING STATE
        ================================================== */}
        {loading ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <LoadingSpinner />
            <p className="mt-3 text-sm font-medium text-gray-600">
              Loading daily health records...
            </p>
          </div>
        ) : records.length === 0 ? (
          /* ==================================================
              EMPTY STATE
          ================================================== */
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-600">
              📋
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No health records found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {filterDate
                ? `No daily record found for ${filterDate}. Try another date or clear your filter.`
                : "You haven't saved any daily health records yet. Start tracking your vitals, sleep, and lifestyle today."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {filterDate ? (
                <button
                  onClick={handleClearFilter}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  View All Records
                </button>
              ) : (
                <button
                  onClick={() => navigate("/health-journal")}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Create First Record
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ==================================================
              RECORDS LIST
          ================================================== */
          <div className="space-y-4">
            {records.map((record) => {
              const dateStr = record.date
                ? new Date(record.date).toISOString().split("T")[0]
                : "";

              return (
                <div
                  key={record.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* Card Header: Date & Action Buttons */}
                  <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-gray-900">
                          {formatDateDisplay(record.date)}
                        </span>
                        <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          {dateStr}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        Record ID: {record.id}
                      </p>
                    </div>

                    {/* Action Buttons: Edit & Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(record)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleOpenDelete(record)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Vitals & Metrics Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {/* Glucose */}
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Glucose</p>
                      <p className="text-base font-semibold text-gray-900">
                        {record.glucose != null
                          ? `${record.glucose} mg/dL`
                          : "—"}
                      </p>
                    </div>

                    {/* Blood Pressure */}
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Blood Pressure</p>
                      <p className="text-base font-semibold text-gray-900">
                        {record.bpSystolic != null || record.bpDiastolic != null
                          ? `${record.bpSystolic ?? "—"}/${record.bpDiastolic ?? "—"} mmHg`
                          : "—"}
                      </p>
                    </div>

                    {/* Heart Rate */}
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Heart Rate</p>
                      <p className="text-base font-semibold text-gray-900">
                        {record.heartRate != null
                          ? `${record.heartRate} bpm`
                          : "—"}
                      </p>
                    </div>

                    {/* Weight */}
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="text-base font-semibold text-gray-900">
                        {record.weightKg != null
                          ? `${record.weightKg} kg`
                          : "—"}
                      </p>
                    </div>

                    {/* Sleep */}
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Sleep</p>
                      <p className="text-base font-semibold text-gray-900">
                        {record.sleepHours != null || record.sleepDuration != null
                          ? `${record.sleepHours ?? record.sleepDuration} hrs`
                          : "—"}
                      </p>
                    </div>

                    {/* Steps */}
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Steps</p>
                      <p className="text-base font-semibold text-gray-900">
                        {record.steps != null
                          ? record.steps.toLocaleString()
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Secondary Details (Food, Medication, Notes) */}
                  {(record.foodSummary ||
                    record.medicationName ||
                    record.notes ||
                    record.symptoms) && (
                    <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm">
                      {record.foodSummary && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Food Summary:{" "}
                          </span>
                          <span className="text-gray-600 whitespace-pre-line">
                            {record.foodSummary}
                          </span>
                        </div>
                      )}

                      {record.medicationName && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Medication:{" "}
                          </span>
                          <span className="text-gray-600">
                            {record.medicationName}{" "}
                            {record.medicationDosage &&
                              `(${record.medicationDosage})`}{" "}
                            {record.medicationTaken &&
                              `— Taken: ${record.medicationTaken}`}
                          </span>
                        </div>
                      )}

                      {record.symptoms && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Symptoms:{" "}
                          </span>
                          <span className="text-gray-600">
                            {record.symptoms}
                          </span>
                        </div>
                      )}

                      {record.notes && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Notes:{" "}
                          </span>
                          <span className="text-gray-600 whitespace-pre-line">
                            {record.notes}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ==================================================
            EDIT RECORD MODAL (WITH SAVE BUTTON)
        ================================================== */}
        {editingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Daily Health Record
                </h2>
                <button
                  onClick={() => setEditingRecord(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {editError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {editError}
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Record Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={editFormData.date || ""}
                    onChange={handleEditChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Duplicate entries on the same date for your account are prevented.
                  </p>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Glucose (mg/dL)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="glucose"
                      value={editFormData.glucose}
                      onChange={handleEditChange}
                      placeholder="e.g. 110"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Systolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      name="bpSystolic"
                      value={editFormData.bpSystolic}
                      onChange={handleEditChange}
                      placeholder="e.g. 120"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Diastolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      name="bpDiastolic"
                      value={editFormData.bpDiastolic}
                      onChange={handleEditChange}
                      placeholder="e.g. 80"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      name="heartRate"
                      value={editFormData.heartRate}
                      onChange={handleEditChange}
                      placeholder="e.g. 72"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="weightKg"
                      value={editFormData.weightKg}
                      onChange={handleEditChange}
                      placeholder="e.g. 70"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Waist (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="waistCircumference"
                      value={editFormData.waistCircumference}
                      onChange={handleEditChange}
                      placeholder="e.g. 85"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Activity & Sleep */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Sleep Duration (hours)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="sleepHours"
                      value={editFormData.sleepHours}
                      onChange={handleEditChange}
                      placeholder="e.g. 7.5"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Steps
                    </label>
                    <input
                      type="number"
                      name="steps"
                      value={editFormData.steps}
                      onChange={handleEditChange}
                      placeholder="e.g. 8000"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Water (Liters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="waterLiters"
                      value={editFormData.waterLiters}
                      onChange={handleEditChange}
                      placeholder="e.g. 2.5"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Notes & Symptoms */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Symptoms
                    </label>
                    <input
                      type="text"
                      name="symptoms"
                      value={editFormData.symptoms || ""}
                      onChange={handleEditChange}
                      placeholder="Any symptoms experienced today"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      rows="3"
                      value={editFormData.notes || ""}
                      onChange={handleEditChange}
                      placeholder="Daily notes, medications, or meals"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingRecord(null)}
                    disabled={savingEdit}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  {/* Save button with Loading State */}
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {savingEdit ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================
            DELETE CONFIRMATION DIALOG
        ================================================== */}
        {deletingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
                🗑️
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Health Record
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Are you sure you want to delete the daily health log for{" "}
                  <strong className="text-gray-800">
                    {formatDateDisplay(deletingRecord.date)}
                  </strong>
                  ?
                </p>
                <p className="mt-1 text-xs text-red-600">
                  This action cannot be undone.
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingRecord(null)}
                  disabled={isDeleting}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Confirm Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthHistory;

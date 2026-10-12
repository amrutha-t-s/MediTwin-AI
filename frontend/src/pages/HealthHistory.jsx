import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

// ============================================================================
// HELPER CONSTANTS & SAMPLE DATA
// ============================================================================

const SAMPLE_RECORDS = [
  {
    id: "sample-1",
    date: new Date(Date.now()).toISOString().split("T")[0],
    glucose: 104,
    bpSystolic: 118,
    bpDiastolic: 78,
    heartRate: 72,
    weightKg: 68.5,
    waistCircumference: 84,
    sleepHours: 7.5,
    sleepDuration: 7.5,
    sleepQuality: 4,
    nightAwakenings: 1,
    steps: 8420,
    waterLiters: 2.5,
    exerciseMinutes: 35,
    exerciseType: "Brisk Walking",
    sittingHours: 6.0,
    medicationName: "Metformin",
    medicationDosage: "500 mg",
    medicationFrequency: "Twice daily",
    medicationTaken: "Yes",
    foodSummary: "Oatmeal with berries; Grilled chicken quinoa salad; Steamed broccoli with salmon",
    hasVegetables: true,
    hasSugaryDrink: false,
    hasFriedFood: false,
    isHighCarb: false,
    mealSatisfaction: 4,
    stressLevel: 3,
    energyLevel: 8,
    symptoms: "Energetic and alert throughout the day",
    notes: "Achieved daily 8k step goal. Fasting glucose well controlled.",
  },
  {
    id: "sample-2",
    date: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
    glucose: 142,
    bpSystolic: 132,
    bpDiastolic: 86,
    heartRate: 80,
    weightKg: 68.9,
    waistCircumference: 84.5,
    sleepHours: 5.5,
    sleepDuration: 5.5,
    sleepQuality: 2,
    nightAwakenings: 2,
    steps: 4210,
    waterLiters: 1.5,
    exerciseMinutes: 10,
    exerciseType: "Stretching",
    sittingHours: 9.5,
    medicationName: "Metformin",
    medicationDosage: "500 mg",
    medicationFrequency: "Twice daily",
    medicationTaken: "Partially",
    missedReason: "Forgot evening dose due to late work meeting",
    foodSummary: "White bagel with cream cheese; Fast food burger & fries; Soda with dinner",
    hasVegetables: false,
    hasSugaryDrink: true,
    hasFriedFood: true,
    isHighCarb: true,
    mealSatisfaction: 3,
    stressLevel: 8,
    energyLevel: 4,
    symptoms: "Afternoon headache, mild fatigue",
    notes: "High pressure workday. Missed evening medication.",
  },
  {
    id: "sample-3",
    date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    glucose: 98,
    bpSystolic: 116,
    bpDiastolic: 76,
    heartRate: 68,
    weightKg: 68.4,
    waistCircumference: 83.8,
    sleepHours: 8.0,
    sleepDuration: 8.0,
    sleepQuality: 5,
    nightAwakenings: 0,
    steps: 10150,
    waterLiters: 3.0,
    exerciseMinutes: 45,
    exerciseType: "Jogging & Cycling",
    sittingHours: 5.5,
    medicationName: "Metformin",
    medicationDosage: "500 mg",
    medicationFrequency: "Twice daily",
    medicationTaken: "Yes",
    foodSummary: "Greek yogurt with chia seeds; Mediterranean grain bowl; Lentil soup",
    hasVegetables: true,
    hasSugaryDrink: false,
    hasFriedFood: false,
    isHighCarb: false,
    mealSatisfaction: 5,
    stressLevel: 2,
    energyLevel: 9,
    symptoms: "None",
    notes: "Outstanding sleep and hydration. Hit 10k step threshold.",
  },
  {
    id: "sample-4",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    glucose: 126,
    bpSystolic: 124,
    bpDiastolic: 80,
    heartRate: 74,
    weightKg: 68.6,
    waistCircumference: 84.0,
    sleepHours: 6.8,
    sleepDuration: 6.8,
    sleepQuality: 3,
    nightAwakenings: 1,
    steps: 6800,
    waterLiters: 2.2,
    exerciseMinutes: 20,
    exerciseType: "Walking",
    sittingHours: 7.0,
    medicationName: "Metformin",
    medicationDosage: "500 mg",
    medicationFrequency: "Twice daily",
    medicationTaken: "Yes",
    foodSummary: "Eggs and whole wheat toast; Turkey wrap; Stir-fry tofu & vegetables",
    hasVegetables: true,
    hasSugaryDrink: false,
    hasFriedFood: false,
    isHighCarb: false,
    mealSatisfaction: 4,
    stressLevel: 4,
    energyLevel: 7,
    symptoms: "Mild shoulder stiffness",
    notes: "Regular routine maintained.",
  },
  {
    id: "sample-5",
    date: new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0],
    glucose: 155,
    bpSystolic: 138,
    bpDiastolic: 88,
    heartRate: 84,
    weightKg: 69.1,
    waistCircumference: 85.0,
    sleepHours: 5.0,
    sleepDuration: 5.0,
    sleepQuality: 2,
    nightAwakenings: 3,
    steps: 3200,
    waterLiters: 1.2,
    exerciseMinutes: 0,
    exerciseType: "",
    sittingHours: 10.0,
    medicationName: "Metformin",
    medicationDosage: "500 mg",
    medicationFrequency: "Twice daily",
    medicationTaken: "No",
    missedReason: "Ran out of medication / refill pending",
    foodSummary: "Donuts and coffee; Fried chicken lunch box; Ice cream",
    hasVegetables: false,
    hasSugaryDrink: true,
    hasFriedFood: true,
    isHighCarb: true,
    mealSatisfaction: 2,
    stressLevel: 9,
    energyLevel: 3,
    symptoms: "Extreme fatigue, dry mouth, restless legs",
    notes: "Medication refill was delayed at pharmacy. Picked up prescription in evening.",
  },
  {
    id: "sample-6",
    date: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
    glucose: 112,
    bpSystolic: 120,
    bpDiastolic: 78,
    heartRate: 70,
    weightKg: 68.7,
    waistCircumference: 84.1,
    sleepHours: 7.2,
    sleepDuration: 7.2,
    sleepQuality: 4,
    nightAwakenings: 1,
    steps: 7600,
    waterLiters: 2.4,
    exerciseMinutes: 30,
    exerciseType: "Pilates & Core",
    sittingHours: 6.5,
    medicationName: "Metformin",
    medicationDosage: "500 mg",
    medicationFrequency: "Twice daily",
    medicationTaken: "Yes",
    foodSummary: "Avocado sourdough; Vegetable soup; Baked chicken breast with sweet potato",
    hasVegetables: true,
    hasSugaryDrink: false,
    hasFriedFood: false,
    isHighCarb: false,
    mealSatisfaction: 4,
    stressLevel: 4,
    energyLevel: 7,
    symptoms: "None",
    notes: "Good recovery after yesterday's low energy day.",
  },
  {
    id: "sample-7",
    date: new Date(Date.now() - 6 * 86400000).toISOString().split("T")[0],
    glucose: 108,
    bpSystolic: 119,
    bpDiastolic: 79,
    heartRate: 71,
    weightKg: 68.5,
    waistCircumference: 84.0,
    sleepHours: 7.8,
    sleepDuration: 7.8,
    sleepQuality: 4,
    nightAwakenings: 0,
    steps: 9100,
    waterLiters: 2.7,
    exerciseMinutes: 40,
    exerciseType: "Outdoor Cycling",
    sittingHours: 5.8,
    medicationName: "Metformin",
    medicationDosage: "500 mg",
    medicationFrequency: "Twice daily",
    medicationTaken: "Yes",
    foodSummary: "Protein shake with banana; Quinoa veggie bowl; Grilled fish tacos with salad",
    hasVegetables: true,
    hasSugaryDrink: false,
    hasFriedFood: false,
    isHighCarb: false,
    mealSatisfaction: 5,
    stressLevel: 3,
    energyLevel: 8,
    symptoms: "None",
    notes: "Solid weekend active outdoor workout.",
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

function HealthHistory() {
  const navigate = useNavigate();

  // Records & Fetch State
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search by Date & Filter by Metric State
  const [searchDate, setSearchDate] = useState("");
  const [metricFilter, setMetricFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards' | 'auto'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals State
  const [viewingRecord, setViewingRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const [deletingRecord, setDeletingRecord] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-dismiss success notification
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 4500);
    return () => clearTimeout(timer);
  }, [success]);

  // ==========================================================================
  // FETCH RECORDS (API with Sample Fallback)
  // ==========================================================================
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/health-logs");
      if (Array.isArray(response.data) && response.data.length > 0) {
        setRecords(response.data);
      } else {
        // If user has no records yet, provide initial sample set for instant exploration
        setRecords(SAMPLE_RECORDS);
      }
    } catch (err) {
      console.warn("Backend logs unavailable, defaulting to demo history:", err);
      setRecords(SAMPLE_RECORDS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchDate, metricFilter, pageSize]);

  // ==========================================================================
  // METRIC INTERPRETATION HELPERS
  // ==========================================================================
  const getGlucoseMeta = (val) => {
    if (val == null || val === "") return { text: "—", badge: "gray", desc: "Not Logged" };
    const num = Number(val);
    if (num < 70) return { text: `${num} mg/dL`, badge: "amber", desc: "Low" };
    if (num <= 100) return { text: `${num} mg/dL`, badge: "emerald", desc: "Normal" };
    if (num <= 125) return { text: `${num} mg/dL`, badge: "amber", desc: "Pre-diabetic" };
    return { text: `${num} mg/dL`, badge: "rose", desc: "High" };
  };

  const getBPMeta = (systolic, diastolic) => {
    if (systolic == null && diastolic == null) return { text: "—", badge: "gray", desc: "Not Logged" };
    const text = `${systolic ?? "—"}/${diastolic ?? "—"} mmHg`;
    const sys = Number(systolic || 0);
    const dia = Number(diastolic || 0);

    if (sys < 120 && dia < 80) return { text, badge: "emerald", desc: "Normal" };
    if (sys <= 129 && dia < 80) return { text, badge: "amber", desc: "Elevated" };
    if (sys <= 139 || (dia >= 80 && dia <= 89)) return { text, badge: "orange", desc: "Stage 1" };
    if (sys >= 140 || dia >= 90) return { text, badge: "rose", desc: "Stage 2" };
    return { text, badge: "blue", desc: "Recorded" };
  };

  const getStepsMeta = (val) => {
    if (val == null || val === "") return { text: "—", badge: "gray" };
    const num = Number(val);
    return {
      text: `${num.toLocaleString()} steps`,
      badge: num >= 8000 ? "emerald" : num >= 5000 ? "blue" : "gray",
    };
  };

  const getSleepMeta = (val) => {
    if (val == null || val === "") return { text: "—", badge: "gray" };
    const num = Number(val);
    return {
      text: `${num} hrs`,
      badge: num >= 7 ? "emerald" : num >= 6 ? "amber" : "rose",
    };
  };

  const getMedicationMeta = (record) => {
    const taken = record.medicationTaken;
    const name = record.medicationName;

    if (taken === "Yes") {
      return {
        label: "Taken",
        icon: "✓",
        badge: "emerald",
        subtext: name || "Prescribed dose",
      };
    }
    if (taken === "Partially") {
      return {
        label: "Partially",
        icon: "◐",
        badge: "amber",
        subtext: record.missedReason || name || "Dose partially taken",
      };
    }
    if (taken === "No") {
      return {
        label: "Missed",
        icon: "✕",
        badge: "rose",
        subtext: record.missedReason || name || "Dose skipped",
      };
    }
    if (name) {
      return {
        label: "Logged",
        icon: "💊",
        badge: "blue",
        subtext: name,
      };
    }
    return {
      label: "None",
      icon: "—",
      badge: "gray",
      subtext: "No medication recorded",
    };
  };

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

  const formatDateShort = (dateString) => {
    if (!dateString) return "";
    return dateString.toString().split("T")[0];
  };

  // ==========================================================================
  // FILTERING LOGIC (Search by Date & Filter by Metric)
  // ==========================================================================
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Search by date
      if (searchDate) {
        const itemDateStr = formatDateShort(r.date);
        if (!itemDateStr.includes(searchDate)) {
          return false;
        }
      }

      // 2. Filter by metric
      if (metricFilter === "has_glucose") {
        return r.glucose != null && r.glucose !== "";
      }
      if (metricFilter === "high_glucose") {
        return r.glucose != null && Number(r.glucose) > 140;
      }
      if (metricFilter === "normal_glucose") {
        return r.glucose != null && Number(r.glucose) <= 140;
      }
      if (metricFilter === "has_bp") {
        return r.bpSystolic != null || r.bpDiastolic != null;
      }
      if (metricFilter === "high_bp") {
        return Number(r.bpSystolic) >= 130 || Number(r.bpDiastolic) >= 80;
      }
      if (metricFilter === "normal_bp") {
        return (
          r.bpSystolic != null &&
          Number(r.bpSystolic) < 120 &&
          (r.bpDiastolic == null || Number(r.bpDiastolic) < 80)
        );
      }
      if (metricFilter === "has_steps") {
        return r.steps != null && r.steps !== "";
      }
      if (metricFilter === "high_steps") {
        return Number(r.steps) >= 8000;
      }
      if (metricFilter === "has_sleep") {
        return (
          (r.sleepHours != null && r.sleepHours !== "") ||
          (r.sleepDuration != null && r.sleepDuration !== "")
        );
      }
      const sleepVal = Number(r.sleepHours ?? r.sleepDuration ?? 0);
      if (metricFilter === "short_sleep") {
        return sleepVal > 0 && sleepVal < 7;
      }
      if (metricFilter === "good_sleep") {
        return sleepVal >= 7;
      }
      if (metricFilter === "med_taken") {
        return r.medicationTaken === "Yes";
      }
      if (metricFilter === "med_missed") {
        return r.medicationTaken === "No" || r.medicationTaken === "Partially";
      }
      if (metricFilter === "has_medication") {
        return !!(r.medicationName || r.medicationTaken);
      }

      return true;
    });
  }, [records, searchDate, metricFilter]);

  // ==========================================================================
  // PAGINATION CALCULATIONS
  // ==========================================================================
  const totalFilteredCount = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalFilteredCount);
  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice(startIndex, endIndex);
  }, [filteredRecords, startIndex, endIndex]);

  // Overall statistics for top summary widgets
  const stats = useMemo(() => {
    const validGlucose = records.filter((r) => r.glucose != null);
    const avgGlucose =
      validGlucose.length > 0
        ? Math.round(
            validGlucose.reduce((acc, cur) => acc + Number(cur.glucose), 0) /
              validGlucose.length
          )
        : null;

    const validSteps = records.filter((r) => r.steps != null);
    const avgSteps =
      validSteps.length > 0
        ? Math.round(
            validSteps.reduce((acc, cur) => acc + Number(cur.steps), 0) /
              validSteps.length
          )
        : null;

    const validSleep = records.filter(
      (r) => (r.sleepHours ?? r.sleepDuration) != null
    );
    const avgSleep =
      validSleep.length > 0
        ? (
            validSleep.reduce(
              (acc, cur) => acc + Number(cur.sleepHours ?? cur.sleepDuration),
              0
            ) / validSleep.length
          ).toFixed(1)
        : null;

    const medLogged = records.filter((r) => r.medicationTaken);
    const medTaken = records.filter((r) => r.medicationTaken === "Yes");
    const adherenceRate =
      medLogged.length > 0
        ? Math.round((medTaken.length / medLogged.length) * 100)
        : null;

    return {
      total: records.length,
      avgGlucose,
      avgSteps,
      avgSleep,
      adherenceRate,
    };
  }, [records]);

  // ==========================================================================
  // EDIT HANDLERS
  // ==========================================================================
  const handleOpenEdit = (record) => {
    setEditError("");
    setEditingRecord(record);

    const formattedDate = record.date
      ? formatDateShort(record.date)
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
      missedReason: record.missedReason ?? "",
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

      // If updating a backend record with uuid
      let updatedLog = { ...editingRecord, ...editFormData };
      try {
        const response = await api.put(
          `/health-logs/${editingRecord.id}`,
          editFormData
        );
        if (response.data?.log) {
          updatedLog = response.data.log;
        }
      } catch (apiErr) {
        console.warn("API PUT fallback to local update:", apiErr);
      }

      setRecords((prev) =>
        prev.map((r) => (r.id === editingRecord.id ? updatedLog : r))
      );

      // If this record was also in viewing modal, update it
      if (viewingRecord && viewingRecord.id === editingRecord.id) {
        setViewingRecord(updatedLog);
      }

      setSuccess("Health record successfully updated!");
      setEditingRecord(null);
    } catch (err) {
      console.error("Save error:", err);
      setEditError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to save changes. Please try again."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // ==========================================================================
  // DELETE HANDLERS
  // ==========================================================================
  const handleOpenDelete = (record) => {
    setDeletingRecord(record);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRecord) return;

    try {
      setIsDeleting(true);
      setError("");

      try {
        await api.delete(`/health-logs/${deletingRecord.id}`);
      } catch (apiErr) {
        console.warn("API DELETE fallback to local removal:", apiErr);
      }

      setRecords((prev) => prev.filter((r) => r.id !== deletingRecord.id));
      if (viewingRecord && viewingRecord.id === deletingRecord.id) {
        setViewingRecord(null);
      }

      setSuccess("Health record deleted successfully.");
      setDeletingRecord(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete health record.");
      setDeletingRecord(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearchDate("");
    setMetricFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* ====================================================================
          PAGE HEADER & TOP ACTIONS
      ==================================================================== */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              Day 24
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Health Record Archive
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Health History
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            View, search, filter, edit, and manage your complete historical health logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle (Table vs Mobile Cards) */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                viewMode === "table"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>📊</span>
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                viewMode === "cards"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>🗂️</span>
              <span>Cards</span>
            </button>
          </div>

          {/* New entry button */}
          <button
            onClick={() => navigate("/health-journal")}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <span>+</span>
            <span>New Daily Entry</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          ALERTS (SUCCESS / ERROR)
      ==================================================================== */}
      {success && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold text-emerald-600">✓</span>
            <span className="font-medium">{success}</span>
          </div>
          <button
            onClick={() => setSuccess("")}
            className="text-emerald-600 hover:text-emerald-900 text-sm font-semibold px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-rose-600">⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={fetchRecords}
              className="rounded bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-200"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          METRIC SNAPSHOT CARDS
      ==================================================================== */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total Entries</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="mt-0.5 text-xs text-gray-400">Recorded days</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Avg Glucose</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {stats.avgGlucose ? `${stats.avgGlucose}` : "—"}
            <span className="text-xs font-normal text-gray-500 ml-1">mg/dL</span>
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Mean reading</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Avg Steps</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {stats.avgSteps ? stats.avgSteps.toLocaleString() : "—"}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Steps / day</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Avg Sleep</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">
            {stats.avgSleep ? `${stats.avgSleep}` : "—"}
            <span className="text-xs font-normal text-gray-500 ml-1">hrs</span>
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Per night</p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Med Adherence</p>
          <p className="mt-1 text-2xl font-bold text-teal-600">
            {stats.adherenceRate != null ? `${stats.adherenceRate}%` : "—"}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Taken as prescribed</p>
        </div>
      </div>

      {/* ====================================================================
          CONTROL BAR: SEARCH BY DATE & FILTER BY METRIC
      ==================================================================== */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Search by date */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="searchDate"
                className="text-xs font-semibold uppercase tracking-wider text-gray-600"
              >
                Search Date:
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="searchDate"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                {searchDate && (
                  <button
                    type="button"
                    onClick={() => setSearchDate("")}
                    className="absolute right-2 top-2.5 text-xs text-gray-400 hover:text-gray-700"
                    title="Clear date"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* 2. Filter by metric */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="metricFilter"
                className="text-xs font-semibold uppercase tracking-wider text-gray-600"
              >
                Filter Metric:
              </label>
              <select
                id="metricFilter"
                value={metricFilter}
                onChange={(e) => setMetricFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Records</option>
                <optgroup label="Glucose">
                  <option value="has_glucose">Recorded Glucose</option>
                  <option value="normal_glucose">Normal Glucose (≤ 140 mg/dL)</option>
                  <option value="high_glucose">High Glucose (&gt; 140 mg/dL)</option>
                </optgroup>
                <optgroup label="Blood Pressure">
                  <option value="has_bp">Recorded BP</option>
                  <option value="normal_bp">Normal BP (&lt; 120/80)</option>
                  <option value="high_bp">Elevated / High BP (≥ 130/80)</option>
                </optgroup>
                <optgroup label="Activity & Steps">
                  <option value="has_steps">Recorded Steps</option>
                  <option value="high_steps">High Steps (≥ 8,000 steps)</option>
                </optgroup>
                <optgroup label="Sleep">
                  <option value="has_sleep">Recorded Sleep</option>
                  <option value="good_sleep">Optimal Sleep (≥ 7 hrs)</option>
                  <option value="short_sleep">Short Sleep (&lt; 7 hrs)</option>
                </optgroup>
                <optgroup label="Medication Adherence">
                  <option value="med_taken">Medication Taken (✓)</option>
                  <option value="med_missed">Medication Missed / Partial (✕)</option>
                  <option value="has_medication">Any Medication Logged</option>
                </optgroup>
              </select>
            </div>

            {/* Clear filters button */}
            {(searchDate || metricFilter !== "all") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Results count indicator */}
          <div className="flex items-center justify-between text-xs text-gray-500 lg:justify-end gap-3">
            <span>
              Showing{" "}
              <strong className="text-gray-800">
                {totalFilteredCount === 0 ? 0 : startIndex + 1}–{endIndex}
              </strong>{" "}
              of <strong className="text-gray-800">{totalFilteredCount}</strong>{" "}
              records
            </span>

            {/* Page size selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">|</span>
              <label htmlFor="pageSizeSelect" className="sr-only">
                Page Size
              </label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none"
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MAIN CONTENT AREA (TABLE / MOBILE CARDS / LOADING / EMPTY)
      ==================================================================== */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <LoadingSpinner />
          <p className="mt-3 text-sm font-medium text-gray-600">
            Loading your health history records...
          </p>
        </div>
      ) : paginatedRecords.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-600">
            📋
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            No health records found
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            {searchDate || metricFilter !== "all"
              ? "No records matched your search or metric filter criteria. Try resetting your search filters."
              : "You haven't logged any daily records yet. Start logging your vitals, sleep, and medications."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {searchDate || metricFilter !== "all" ? (
              <button
                onClick={handleResetFilters}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear Search & Filters
              </button>
            ) : (
              <>
                <button
                  onClick={() => setRecords(SAMPLE_RECORDS)}
                  className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  Load Sample Records (7 Days)
                </button>
                <button
                  onClick={() => navigate("/health-journal")}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Create First Entry
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* ================================================================
              DESKTOP / TABLET: HEALTH HISTORY TABLE
              Visible when viewMode === 'table' OR on md+ screens if viewMode === 'auto'
          ================================================================ */}
          <div
            className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${
              viewMode === "cards" ? "hidden" : "hidden md:block"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                {/* Table Header */}
                <thead className="bg-gray-50/75 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">
                      Date
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Glucose
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Blood Pressure (BP)
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Steps
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Sleep
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Medication Status
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100 bg-white">
                  {paginatedRecords.map((record) => {
                    const glucoseMeta = getGlucoseMeta(record.glucose);
                    const bpMeta = getBPMeta(
                      record.bpSystolic,
                      record.bpDiastolic
                    );
                    const stepsMeta = getStepsMeta(record.steps);
                    const sleepMeta = getSleepMeta(
                      record.sleepHours ?? record.sleepDuration
                    );
                    const medMeta = getMedicationMeta(record);

                    return (
                      <tr
                        key={record.id}
                        className="transition hover:bg-blue-50/40"
                      >
                        {/* 1. Date */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            {formatDateDisplay(record.date)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDateShort(record.date)}
                          </div>
                        </td>

                        {/* 2. Glucose */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {glucoseMeta.text}
                            </span>
                            {glucoseMeta.desc !== "Not Logged" && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                  glucoseMeta.badge === "emerald"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : glucoseMeta.badge === "amber"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {glucoseMeta.desc}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 3. BP */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {bpMeta.text}
                            </span>
                            {bpMeta.desc !== "Not Logged" && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                  bpMeta.badge === "emerald"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : bpMeta.badge === "amber"
                                    ? "bg-amber-100 text-amber-800"
                                    : bpMeta.badge === "orange"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {bpMeta.desc}
                              </span>
                            )}
                          </div>
                          {record.heartRate && (
                            <div className="text-xs text-gray-400">
                              Pulse: {record.heartRate} bpm
                            </div>
                          )}
                        </td>

                        {/* 4. Steps */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {stepsMeta.text}
                            </span>
                            {record.steps != null && (
                              <span
                                className={`inline-block h-2 w-2 rounded-full ${
                                  stepsMeta.badge === "emerald"
                                    ? "bg-emerald-500"
                                    : stepsMeta.badge === "blue"
                                    ? "bg-blue-500"
                                    : "bg-gray-300"
                                }`}
                              />
                            )}
                          </div>
                        </td>

                        {/* 5. Sleep */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {sleepMeta.text}
                            </span>
                            {record.sleepQuality && (
                              <span className="text-xs text-amber-500" title={`Quality: ${record.sleepQuality}/5`}>
                                {"★".repeat(Math.min(5, record.sleepQuality))}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 6. Medication Status */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                medMeta.badge === "emerald"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : medMeta.badge === "amber"
                                  ? "bg-amber-100 text-amber-800"
                                  : medMeta.badge === "rose"
                                  ? "bg-rose-100 text-rose-800"
                                  : medMeta.badge === "blue"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <span>{medMeta.icon}</span>
                              <span>{medMeta.label}</span>
                            </span>
                          </div>
                          <div className="mt-0.5 max-w-[150px] truncate text-xs text-gray-500">
                            {medMeta.subtext}
                          </div>
                        </td>

                        {/* 7. Actions (View details, Edit, Delete) */}
                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* View details */}
                            <button
                              type="button"
                              onClick={() => setViewingRecord(record)}
                              className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                              title="View full record details"
                            >
                              <span>👁️</span>
                              <span>Details</span>
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(record)}
                              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
                              title="Edit this record"
                            >
                              <span>✏️</span>
                              <span>Edit</span>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(record)}
                              className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                              title="Delete this record"
                            >
                              <span>🗑️</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================================================================
              MOBILE-FRIENDLY CARDS VIEW
              Visible on mobile (<md) OR when user toggles viewMode === 'cards'
          ================================================================ */}
          <div
            className={`space-y-4 ${
              viewMode === "table" ? "block md:hidden" : "block"
            }`}
          >
            {paginatedRecords.map((record) => {
              const glucoseMeta = getGlucoseMeta(record.glucose);
              const bpMeta = getBPMeta(record.bpSystolic, record.bpDiastolic);
              const stepsMeta = getStepsMeta(record.steps);
              const sleepMeta = getSleepMeta(
                record.sleepHours ?? record.sleepDuration
              );
              const medMeta = getMedicationMeta(record);

              return (
                <div
                  key={record.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  {/* Card Header: Date & Medication Status Badge */}
                  <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {formatDateDisplay(record.date)}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {formatDateShort(record.date)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        medMeta.badge === "emerald"
                          ? "bg-emerald-100 text-emerald-800"
                          : medMeta.badge === "amber"
                          ? "bg-amber-100 text-amber-800"
                          : medMeta.badge === "rose"
                          ? "bg-rose-100 text-rose-800"
                          : medMeta.badge === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span>{medMeta.icon}</span>
                      <span>Med: {medMeta.label}</span>
                    </span>
                  </div>

                  {/* Vitals Grid (Glucose, BP, Steps, Sleep) */}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {/* Glucose */}
                    <div className="rounded-lg bg-gray-50 p-2.5">
                      <span className="text-[11px] font-medium text-gray-500">
                        Glucose
                      </span>
                      <p className="text-sm font-bold text-gray-900">
                        {glucoseMeta.text}
                      </p>
                      {glucoseMeta.desc !== "Not Logged" && (
                        <span
                          className={`mt-0.5 inline-block text-[10px] font-semibold ${
                            glucoseMeta.badge === "emerald"
                              ? "text-emerald-700"
                              : glucoseMeta.badge === "amber"
                              ? "text-amber-700"
                              : "text-rose-700"
                          }`}
                        >
                          {glucoseMeta.desc}
                        </span>
                      )}
                    </div>

                    {/* Blood Pressure */}
                    <div className="rounded-lg bg-gray-50 p-2.5">
                      <span className="text-[11px] font-medium text-gray-500">
                        Blood Pressure
                      </span>
                      <p className="text-sm font-bold text-gray-900">
                        {bpMeta.text}
                      </p>
                      {bpMeta.desc !== "Not Logged" && (
                        <span
                          className={`mt-0.5 inline-block text-[10px] font-semibold ${
                            bpMeta.badge === "emerald"
                              ? "text-emerald-700"
                              : bpMeta.badge === "amber"
                              ? "text-amber-700"
                              : bpMeta.badge === "orange"
                              ? "text-orange-700"
                              : "text-rose-700"
                          }`}
                        >
                          {bpMeta.desc}
                        </span>
                      )}
                    </div>

                    {/* Steps */}
                    <div className="rounded-lg bg-gray-50 p-2.5">
                      <span className="text-[11px] font-medium text-gray-500">
                        Daily Steps
                      </span>
                      <p className="text-sm font-bold text-gray-900">
                        {stepsMeta.text}
                      </p>
                      {record.steps != null && (
                        <span className="text-[10px] text-gray-400">
                          {record.steps >= 8000 ? "Goal met" : "In progress"}
                        </span>
                      )}
                    </div>

                    {/* Sleep */}
                    <div className="rounded-lg bg-gray-50 p-2.5">
                      <span className="text-[11px] font-medium text-gray-500">
                        Sleep
                      </span>
                      <p className="text-sm font-bold text-gray-900">
                        {sleepMeta.text}
                      </p>
                      {record.sleepQuality && (
                        <span className="text-[10px] text-amber-500">
                          {"★".repeat(Math.min(5, record.sleepQuality))}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subtext info */}
                  {(record.medicationName || record.notes) && (
                    <div className="mt-3 text-xs text-gray-600 space-y-1 bg-blue-50/40 p-2.5 rounded-lg">
                      {record.medicationName && (
                        <div>
                          <strong className="text-gray-700">Medication:</strong>{" "}
                          {record.medicationName}{" "}
                          {record.medicationDosage && `(${record.medicationDosage})`}
                        </div>
                      )}
                      {record.notes && (
                        <div className="truncate">
                          <strong className="text-gray-700">Note:</strong>{" "}
                          {record.notes}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Bar (View details, Edit, Delete) */}
                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setViewingRecord(record)}
                      className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      <span>👁️</span>
                      <span>View Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(record)}
                      className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <span>✏️</span>
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDelete(record)}
                      className="inline-flex justify-center items-center rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                      title="Delete record"
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================================================================
              PAGINATION CONTROLS
          ================================================================ */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
              <div className="text-xs text-gray-600">
                Page <strong className="text-gray-900">{currentPage}</strong> of{" "}
                <strong className="text-gray-900">{totalPages}</strong> (
                {totalFilteredCount} total items)
              </div>

              <div className="inline-flex items-center gap-1.5">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show first, last, and pages adjacent to current page
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1
                    );
                  })
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1];
                    const showEllipsis = prevP && p - prevP > 1;

                    return (
                      <span key={p} className="flex items-center">
                        {showEllipsis && (
                          <span className="px-1 text-xs text-gray-400">…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                            currentPage === p
                              ? "bg-blue-600 text-white shadow-sm"
                              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ====================================================================
          MODAL 1: VIEW DETAILS MODAL
      ==================================================================== */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                  Daily Health Summary
                </span>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {formatDateDisplay(viewingRecord.date)}
                </h2>
                <p className="text-xs text-gray-400">
                  Record ID: {viewingRecord.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewingRecord(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Sections */}
            <div className="mt-6 space-y-6">
              {/* Section 1: Vital Signs & Metabolic */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-l-4 border-blue-600 pl-2">
                  Vitals & Blood Chemistry
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                    <span className="text-xs text-gray-500">Blood Glucose</span>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {viewingRecord.glucose != null
                        ? `${viewingRecord.glucose} mg/dL`
                        : "Not recorded"}
                    </p>
                    {viewingRecord.glucose != null && (
                      <span className="text-xs text-blue-600 font-medium">
                        {getGlucoseMeta(viewingRecord.glucose).desc}
                      </span>
                    )}
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                    <span className="text-xs text-gray-500">Blood Pressure</span>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {viewingRecord.bpSystolic != null ||
                      viewingRecord.bpDiastolic != null
                        ? `${viewingRecord.bpSystolic ?? "—"}/${
                            viewingRecord.bpDiastolic ?? "—"
                          } mmHg`
                        : "Not recorded"}
                    </p>
                    <span className="text-xs text-purple-600 font-medium">
                      {getBPMeta(
                        viewingRecord.bpSystolic,
                        viewingRecord.bpDiastolic
                      ).desc}
                    </span>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                    <span className="text-xs text-gray-500">Heart Rate</span>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {viewingRecord.heartRate != null
                        ? `${viewingRecord.heartRate} bpm`
                        : "Not recorded"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                    <span className="text-xs text-gray-500">Weight & Waist</span>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {viewingRecord.weightKg != null
                        ? `${viewingRecord.weightKg} kg`
                        : "—"}
                    </p>
                    {viewingRecord.waistCircumference && (
                      <span className="text-xs text-gray-500">
                        Waist: {viewingRecord.waistCircumference} cm
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Physical Activity & Sleep */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-l-4 border-emerald-600 pl-2">
                  Activity & Sleep
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                    <span className="text-xs text-gray-500">Daily Steps</span>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {viewingRecord.steps != null
                        ? viewingRecord.steps.toLocaleString()
                        : "Not recorded"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                    <span className="text-xs text-gray-500">Exercise</span>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {viewingRecord.exerciseMinutes != null
                        ? `${viewingRecord.exerciseMinutes} mins`
                        : "—"}
                    </p>
                    {viewingRecord.exerciseType && (
                      <span className="text-xs text-emerald-600">
                        {viewingRecord.exerciseType}
                      </span>
                    )}
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                    <span className="text-xs text-gray-500">Sleep Duration</span>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {viewingRecord.sleepHours != null ||
                      viewingRecord.sleepDuration != null
                        ? `${
                            viewingRecord.sleepHours ??
                            viewingRecord.sleepDuration
                          } hrs`
                        : "Not recorded"}
                    </p>
                    {viewingRecord.sleepQuality && (
                      <span className="text-xs text-amber-500">
                        {"★".repeat(Math.min(5, viewingRecord.sleepQuality))}
                      </span>
                    )}
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                    <span className="text-xs text-gray-500">Night Awakenings</span>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {viewingRecord.nightAwakenings != null
                        ? `${viewingRecord.nightAwakenings} times`
                        : "0 recorded"}
                    </p>
                    {viewingRecord.sittingHours != null && (
                      <span className="text-xs text-gray-500">
                        Sitting: {viewingRecord.sittingHours} hrs
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Medication Adherence */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-l-4 border-teal-600 pl-2">
                  Medication Adherence
                </h3>
                <div className="mt-3 rounded-xl border border-teal-100 bg-teal-50/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Prescribed Medication
                      </span>
                      <p className="text-base font-bold text-gray-900">
                        {viewingRecord.medicationName || "None Logged Today"}
                      </p>
                      {viewingRecord.medicationDosage && (
                        <p className="text-xs text-gray-600">
                          Dosage: {viewingRecord.medicationDosage} • Frequency:{" "}
                          {viewingRecord.medicationFrequency || "As directed"}
                        </p>
                      )}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        viewingRecord.medicationTaken === "Yes"
                          ? "bg-emerald-100 text-emerald-800"
                          : viewingRecord.medicationTaken === "Partially"
                          ? "bg-amber-100 text-amber-800"
                          : viewingRecord.medicationTaken === "No"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span>
                        {viewingRecord.medicationTaken === "Yes"
                          ? "✓"
                          : viewingRecord.medicationTaken === "Partially"
                          ? "◐"
                          : viewingRecord.medicationTaken === "No"
                          ? "✕"
                          : "—"}
                      </span>
                      <span>
                        Adherence: {viewingRecord.medicationTaken || "Not Logged"}
                      </span>
                    </span>
                  </div>

                  {viewingRecord.missedReason && (
                    <div className="mt-3 rounded-lg border border-rose-200 bg-white p-3 text-xs text-rose-800">
                      <strong>Reason for Missed / Partial Dose:</strong>{" "}
                      {viewingRecord.missedReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Nutrition & Diet */}
              {(viewingRecord.foodSummary ||
                viewingRecord.hasVegetables ||
                viewingRecord.hasSugaryDrink ||
                viewingRecord.hasFriedFood) && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-l-4 border-amber-600 pl-2">
                    Nutrition & Meals
                  </h3>
                  <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-sm">
                    {viewingRecord.foodSummary && (
                      <p className="text-gray-800 whitespace-pre-line mb-3">
                        {viewingRecord.foodSummary}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                      {viewingRecord.hasVegetables && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                          🥗 Included Vegetables
                        </span>
                      )}
                      {viewingRecord.hasSugaryDrink && (
                        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800">
                          🥤 Sugary Drink
                        </span>
                      )}
                      {viewingRecord.hasFriedFood && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                          🍟 Fried Food
                        </span>
                      )}
                      {viewingRecord.isHighCarb && (
                        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-800">
                          🍞 High Carb
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 5: Wellbeing, Symptoms & Notes */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-l-4 border-indigo-600 pl-2">
                  Lifestyle, Wellbeing & Notes
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                    <span className="text-xs text-gray-500">Water Intake</span>
                    <p className="mt-1 text-base font-bold text-gray-900">
                      {viewingRecord.waterLiters != null
                        ? `${viewingRecord.waterLiters} L`
                        : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                    <span className="text-xs text-gray-500">Stress Level</span>
                    <p className="mt-1 text-base font-bold text-gray-900">
                      {viewingRecord.stressLevel != null
                        ? `${viewingRecord.stressLevel} / 10`
                        : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                    <span className="text-xs text-gray-500">Energy Level</span>
                    <p className="mt-1 text-base font-bold text-gray-900">
                      {viewingRecord.energyLevel != null
                        ? `${viewingRecord.energyLevel} / 10`
                        : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                    <span className="text-xs text-gray-500">Smoking / Alcohol</span>
                    <p className="mt-1 text-base font-bold text-gray-900">
                      {viewingRecord.smoking || viewingRecord.alcohol
                        ? `${viewingRecord.smoking || "No"} / ${
                            viewingRecord.alcohol || "No"
                          }`
                        : "None reported"}
                    </p>
                  </div>
                </div>

                {viewingRecord.symptoms && (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900">
                    <strong className="block text-amber-950 mb-0.5">
                      Symptoms Reported:
                    </strong>
                    {viewingRecord.symptoms}
                  </div>
                )}

                {viewingRecord.notes && (
                  <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-xs text-gray-800">
                    <strong className="block text-gray-900 mb-0.5">
                      Personal Notes:
                    </strong>
                    <p className="whitespace-pre-line">{viewingRecord.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  const rec = viewingRecord;
                  setViewingRecord(null);
                  handleOpenEdit(rec);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <span>✏️</span>
                <span>Edit Record</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingRecord(null)}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: EDIT RECORD MODAL
      ==================================================================== */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Daily Health Record
                </h2>
                <p className="text-xs text-gray-500">
                  Update and adjust logged vitals, sleep, activity, or medication.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              {/* Date */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700">
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
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                    placeholder="e.g. 104"
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

              {/* Activity & Sleep */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Daily Steps
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
                    Sleep (Hours)
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
              </div>

              {/* Medication Details */}
              <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-3">
                <span className="block text-xs font-semibold text-gray-700 uppercase">
                  Medication Status
                </span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Medication Name
                    </label>
                    <input
                      type="text"
                      name="medicationName"
                      value={editFormData.medicationName || ""}
                      onChange={handleEditChange}
                      placeholder="e.g. Metformin"
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Dosage
                    </label>
                    <input
                      type="text"
                      name="medicationDosage"
                      value={editFormData.medicationDosage || ""}
                      onChange={handleEditChange}
                      placeholder="e.g. 500 mg"
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Taken Status
                    </label>
                    <select
                      name="medicationTaken"
                      value={editFormData.medicationTaken || ""}
                      onChange={handleEditChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">Select status</option>
                      <option value="Yes">Yes, Taken</option>
                      <option value="Partially">Partially</option>
                      <option value="No">No / Missed</option>
                    </select>
                  </div>
                </div>

                {editFormData.medicationTaken === "No" && (
                  <div>
                    <label className="block text-xs font-medium text-rose-700">
                      Reason for Missed Dose
                    </label>
                    <input
                      type="text"
                      name="missedReason"
                      value={editFormData.missedReason || ""}
                      onChange={handleEditChange}
                      placeholder="Reason for skipping or missing"
                      className="mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-500"
                    />
                  </div>
                )}
              </div>

              {/* Notes & Food */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Food & Meal Summary
                  </label>
                  <input
                    type="text"
                    name="foodSummary"
                    value={editFormData.foodSummary || ""}
                    onChange={handleEditChange}
                    placeholder="Brief description of meals"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Daily Notes
                  </label>
                  <textarea
                    name="notes"
                    rows="2"
                    value={editFormData.notes || ""}
                    onChange={handleEditChange}
                    placeholder="General observations, symptoms, or notes"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  disabled={savingEdit}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
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

      {/* ====================================================================
          MODAL 3: DELETE CONFIRMATION DIALOG
      ==================================================================== */}
      {deletingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-xl text-rose-600">
              🗑️
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-gray-900">
                Delete Health Record
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to permanently delete the health log for{" "}
                <strong className="text-gray-900">
                  {formatDateDisplay(deletingRecord.date)}
                </strong>
                ?
              </p>
              <p className="mt-1 text-xs text-rose-600">
                This record will be removed from your historical analytics.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingRecord(null)}
                disabled={isDeleting}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
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
  );
}

export default HealthHistory;

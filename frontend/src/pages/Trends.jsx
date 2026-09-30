import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import api from "../services/api";

function Trends() {
  const navigate = useNavigate();

  // Filter state: 7, 14, or 30 days
  const [days, setDays] = useState(7);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrends = useCallback(async (selectedDays) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/trends?days=${selectedDays}`);
      setData(response.data?.timeSeries || []);
      setStats(response.data?.stats || null);
    } catch (err) {
      console.error("Trends fetch error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load health trends. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends(days);
  }, [days, fetchTrends]);

  // Tooltip custom styling
  const tooltipStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    padding: "8px 12px",
    fontSize: "13px",
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* ==================================================
            HEADER & TIME-RANGE FILTER BUTTONS
        ================================================== */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Health Trends</h1>
            <p className="mt-1 text-slate-600">
              Track your vitals, sleep, activity, and medication adherence over time.
            </p>
          </div>

          {/* Time range filter buttons: Last 7, 14, 30 days */}
          <div className="flex items-center gap-1 rounded-xl bg-white p-1.5 shadow-sm border border-slate-200">
            {[
              { label: "Last 7 days", value: 7 },
              { label: "Last 14 days", value: 14 },
              { label: "Last 30 days", value: 30 },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setDays(tab.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  days === tab.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ==================================================
            ERROR BANNER
        ================================================== */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold">Unable to load trends</p>
              <p className="text-sm mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => fetchTrends(days)}
              className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-200 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* ==================================================
            SUMMARY KPI STRIP
        ================================================== */}
        {stats && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Avg Glucose</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {stats.avgGlucose ? `${stats.avgGlucose} mg/dL` : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Avg Blood Pressure</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {stats.avgSystolic && stats.avgDiastolic
                  ? `${stats.avgSystolic}/${stats.avgDiastolic}`
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Avg Daily Steps</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {stats.avgSteps ? stats.avgSteps.toLocaleString() : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Avg Sleep</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {stats.avgSleep ? `${stats.avgSleep} hrs` : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Latest Weight</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {stats.latestWeight ? `${stats.latestWeight} kg` : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Adherence Rate</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {stats.adherenceRate != null ? `${stats.adherenceRate}%` : "—"}
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            LOADING SKELETON STATE
        ================================================== */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm animate-pulse flex flex-col justify-between"
              >
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="h-44 bg-slate-100 rounded-lg w-full" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          /* ==================================================
              EMPTY STATE
          ================================================== */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
              📈
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No trend data available
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You don&apos;t have any recorded health entries for the last {days} days.
              Record daily health logs to generate detailed trend charts.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/health-journal")}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                + Log Health Entry
              </button>
            </div>
          </div>
        ) : (
          /* ==================================================
              6 RECHARTS TREND CHARTS
          ================================================== */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 1. GLUCOSE OVER TIME */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>🩸</span> Glucose Over Time
                  </h2>
                  <p className="text-xs text-slate-500">
                    Blood glucose readings (mg/dL) • Target: 70–140 mg/dL
                  </p>
                </div>
                {stats?.avgGlucose && (
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
                    Avg: {stats.avgGlucose} mg/dL
                  </span>
                )}
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={["auto", "auto"]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <ReferenceLine
                      y={70}
                      stroke="#3b82f6"
                      strokeDasharray="3 3"
                      label={{ value: "Low 70", fill: "#3b82f6", fontSize: 10 }}
                    />
                    <ReferenceLine
                      y={140}
                      stroke="#10b981"
                      strokeDasharray="3 3"
                      label={{ value: "Target 140", fill: "#10b981", fontSize: 10 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="glucose"
                      name="Glucose (mg/dL)"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#glucoseGrad)"
                      connectNulls
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. SYSTOLIC AND DIASTOLIC BP */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>🫀</span> Systolic & Diastolic BP
                  </h2>
                  <p className="text-xs text-slate-500">
                    Blood pressure (mmHg) • Target: &lt;120/80 mmHg
                  </p>
                </div>
                {stats?.avgSystolic && (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-100">
                    Avg: {stats.avgSystolic}/{stats.avgDiastolic}
                  </span>
                )}
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={["auto", "auto"]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                    <ReferenceLine
                      y={120}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                      label={{ value: "Sys 120", fill: "#ef4444", fontSize: 10 }}
                    />
                    <ReferenceLine
                      y={80}
                      stroke="#3b82f6"
                      strokeDasharray="3 3"
                      label={{ value: "Dia 80", fill: "#3b82f6", fontSize: 10 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bpSystolic"
                      name="Systolic (mmHg)"
                      stroke="#ef4444"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="bpDiastolic"
                      name="Diastolic (mmHg)"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. STEPS PER DAY */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>👟</span> Steps Per Day
                  </h2>
                  <p className="text-xs text-slate-500">
                    Daily physical activity • Target: 10,000 steps/day
                  </p>
                </div>
                {stats?.avgSteps && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                    Avg: {stats.avgSteps.toLocaleString()} steps
                  </span>
                )}
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <ReferenceLine
                      y={10000}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      label={{ value: "10k Goal", fill: "#10b981", fontSize: 10 }}
                    />
                    <Bar
                      dataKey="steps"
                      name="Steps"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. SLEEP DURATION */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>🌙</span> Sleep Duration
                  </h2>
                  <p className="text-xs text-slate-500">
                    Nightly hours of sleep • Recommended: 7–9 hours
                  </p>
                </div>
                {stats?.avgSleep && (
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
                    Avg: {stats.avgSleep} hrs
                  </span>
                )}
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={[0, 12]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <ReferenceLine
                      y={7}
                      stroke="#10b981"
                      strokeDasharray="3 3"
                      label={{ value: "7h Min", fill: "#10b981", fontSize: 10 }}
                    />
                    <ReferenceLine
                      y={9}
                      stroke="#10b981"
                      strokeDasharray="3 3"
                      label={{ value: "9h Max", fill: "#10b981", fontSize: 10 }}
                    />
                    <Bar
                      dataKey="sleepHours"
                      name="Sleep (hours)"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 5. WEIGHT */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>⚖️</span> Weight
                  </h2>
                  <p className="text-xs text-slate-500">
                    Body weight trajectory over time (kg)
                  </p>
                </div>
                {stats?.latestWeight && (
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-100">
                    Latest: {stats.latestWeight} kg
                  </span>
                )}
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={["dataMin - 2", "dataMax + 2"]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line
                      type="monotone"
                      dataKey="weightKg"
                      name="Weight (kg)"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#0284c7" }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 6. MEDICATION ADHERENCE */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>💊</span> Medication Adherence
                  </h2>
                  <p className="text-xs text-slate-500">
                    Daily prescription adherence status (% taken)
                  </p>
                </div>
                {stats?.adherenceRate != null && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                    Adherence: {stats.adherenceRate}%
                  </span>
                )}
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <ReferenceLine
                      y={80}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      label={{ value: "80% Target", fill: "#10b981", fontSize: 10 }}
                    />
                    <Bar
                      dataKey="adherence"
                      name="Adherence (%)"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Trends;

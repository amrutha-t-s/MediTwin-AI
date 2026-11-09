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
    backgroundColor: "#0d1322",
    borderRadius: "12px",
    border: "1px solid #1e293b",
    boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.7)",
    padding: "8px 12px",
    fontSize: "13px",
    color: "#f8fafc",
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* ==================================================
            HEADER & TIME-RANGE FILTER BUTTONS
        ================================================== */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Health Trends</h1>
            <p className="mt-1 text-slate-400 text-sm">
              Track your vitals, sleep, activity, and medication adherence over time.
            </p>
          </div>

          {/* Time range filter buttons: Last 7, 14, 30 days */}
          <div className="flex items-center gap-1 rounded-2xl bg-[#0d1322] p-1.5 shadow-xl border border-slate-800">
            {[
              { label: "Last 7 days", value: 7 },
              { label: "Last 14 days", value: 14 },
              { label: "Last 30 days", value: 30 },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setDays(tab.value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition cursor-pointer ${
                  days === tab.value
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
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
          <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-950/40 p-4 text-red-300 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-red-400 font-bold text-lg">⚠️</span>
              <div>
                <p className="font-semibold text-white">Unable to load trends</p>
                <p className="text-sm mt-0.5 text-red-300">{error}</p>
              </div>
            </div>
            <button
              onClick={() => fetchTrends(days)}
              className="rounded-xl bg-red-900/50 hover:bg-red-800/60 border border-red-500/40 px-3.5 py-1.5 text-xs font-semibold text-red-200 transition cursor-pointer"
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
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-4 shadow-xl">
              <p className="text-xs text-slate-400 font-medium">Avg Glucose</p>
              <p className="mt-1 text-xl font-bold text-white">
                {stats.avgGlucose ? `${stats.avgGlucose} mg/dL` : "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-4 shadow-xl">
              <p className="text-xs text-slate-400 font-medium">Avg Blood Pressure</p>
              <p className="mt-1 text-xl font-bold text-white">
                {stats.avgSystolic && stats.avgDiastolic
                  ? `${stats.avgSystolic}/${stats.avgDiastolic}`
                  : "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-4 shadow-xl">
              <p className="text-xs text-slate-400 font-medium">Avg Daily Steps</p>
              <p className="mt-1 text-xl font-bold text-white">
                {stats.avgSteps ? stats.avgSteps.toLocaleString() : "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-4 shadow-xl">
              <p className="text-xs text-slate-400 font-medium">Avg Sleep</p>
              <p className="mt-1 text-xl font-bold text-white">
                {stats.avgSleep ? `${stats.avgSleep} hrs` : "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-4 shadow-xl">
              <p className="text-xs text-slate-400 font-medium">Latest Weight</p>
              <p className="mt-1 text-xl font-bold text-white">
                {stats.latestWeight ? `${stats.latestWeight} kg` : "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-4 shadow-xl">
              <p className="text-xs text-slate-400 font-medium">Adherence Rate</p>
              <p className="mt-1 text-xl font-bold text-white">
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
                className="h-80 rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl animate-pulse flex flex-col justify-between"
              >
                <div className="h-5 bg-slate-800 rounded w-1/3" />
                <div className="h-44 bg-slate-900 rounded-xl w-full" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          /* ==================================================
              EMPTY STATE
          ================================================== */
          <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-12 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-950/60 border border-blue-500/40 text-2xl">
              📈
            </div>
            <h3 className="text-lg font-bold text-white">
              No trend data available
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              You don&apos;t have any recorded health entries for the last {days} days.
              Record daily health logs to generate detailed trend charts.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/health-journal")}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 cursor-pointer"
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
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl hover:border-red-500/30 transition">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🩸</span> Glucose Over Time
                  </h2>
                  <p className="text-xs text-slate-400">
                    Blood glucose readings (mg/dL) • Target: 70–140 mg/dL
                  </p>
                </div>
                {stats?.avgGlucose && (
                  <span className="rounded-full bg-red-950/60 px-3 py-1 text-xs font-semibold text-red-400 border border-red-500/30">
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
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="displayDate" stroke="#64748b" fontSize={12} />
                    <YAxis domain={["auto", "auto"]} stroke="#64748b" fontSize={12} />
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
                      stroke="#ef4444"
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
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl hover:border-red-500/30 transition">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🫀</span> Systolic & Diastolic BP
                  </h2>
                  <p className="text-xs text-slate-400">
                    Blood pressure (mmHg) • Target: &lt;120/80 mmHg
                  </p>
                </div>
                {stats?.avgSystolic && (
                  <span className="rounded-full bg-red-950/60 px-3 py-1 text-xs font-semibold text-red-400 border border-red-500/30">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="displayDate" stroke="#64748b" fontSize={12} />
                    <YAxis domain={["auto", "auto"]} stroke="#64748b" fontSize={12} />
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
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl hover:border-blue-500/30 transition">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>👟</span> Steps Per Day
                  </h2>
                  <p className="text-xs text-slate-400">
                    Daily physical activity • Target: 10,000 steps/day
                  </p>
                </div>
                {stats?.avgSteps && (
                  <span className="rounded-full bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/30">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="displayDate" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
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
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl hover:border-blue-500/30 transition">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🌙</span> Sleep Duration
                  </h2>
                  <p className="text-xs text-slate-400">
                    Nightly hours of sleep • Recommended: 7–9 hours
                  </p>
                </div>
                {stats?.avgSleep && (
                  <span className="rounded-full bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/30">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="displayDate" stroke="#64748b" fontSize={12} />
                    <YAxis domain={[0, 12]} stroke="#64748b" fontSize={12} />
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
                      fill="#60a5fa"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 5. WEIGHT */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl hover:border-blue-500/30 transition">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>⚖️</span> Weight
                  </h2>
                  <p className="text-xs text-slate-400">
                    Body weight trajectory over time (kg)
                  </p>
                </div>
                {stats?.latestWeight && (
                  <span className="rounded-full bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/30">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="displayDate" stroke="#64748b" fontSize={12} />
                    <YAxis domain={["dataMin - 2", "dataMax + 2"]} stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line
                      type="monotone"
                      dataKey="weightKg"
                      name="Weight (kg)"
                      stroke="#38bdf8"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#38bdf8" }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 6. MEDICATION ADHERENCE */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-xl hover:border-blue-500/30 transition">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>💊</span> Medication Adherence
                  </h2>
                  <p className="text-xs text-slate-400">
                    Daily prescription adherence status (% taken)
                  </p>
                </div>
                {stats?.adherenceRate != null && (
                  <span className="rounded-full bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/30">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="displayDate" stroke="#64748b" fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <ReferenceLine
                      y={80}
                      stroke="#3b82f6"
                      strokeDasharray="4 4"
                      label={{ value: "80% Target", fill: "#3b82f6", fontSize: 10 }}
                    />
                    <Bar
                      dataKey="adherence"
                      name="Adherence (%)"
                      fill="#2563eb"
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

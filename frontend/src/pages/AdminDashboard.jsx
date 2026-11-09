import { useState, useEffect } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: "--",
    totalDailyLogs: "--",
    totalSimulations: "--",
    totalAuditLogs: "--",
    usersByRole: {},
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    Promise.all([
      fetch("http://localhost:4000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
      fetch("http://localhost:4000/api/admin/audit-logs?limit=15", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
    ])
      .then(([statsData, auditData]) => {
        setStats(statsData);
        setAuditLogs(auditData.auditLogs || []);
      })
      .catch((_err) => {
        setError(
          "Administrative access denied or failed to load server statistics."
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-950/60 border border-blue-500/30 text-blue-400 rounded-xl text-2xl">
                🛡️
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Admin System Control & Audit Telemetry
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Role-protected administrative console. Inspect system counts,
                  active accounts, and security compliance logs.
                </p>
              </div>
            </div>
          </div>
          <span className="px-3.5 py-1.5 bg-red-950/60 border border-red-500/40 text-red-300 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            Admin Privileged
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-300 rounded-xl text-sm mb-6 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-[#0d1322] p-6 rounded-2xl border border-slate-800 shadow-xl shadow-black/20 hover:border-blue-500/40 transition">
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Total Users</p>
          <h2 className="text-3xl font-extrabold text-white mt-2">
            {stats.totalUsers}
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">
            Registered patient & staff accounts
          </p>
        </div>

        <div className="bg-[#0d1322] p-6 rounded-2xl border border-slate-800 shadow-xl shadow-black/20 hover:border-blue-500/40 transition">
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Health Records</p>
          <h2 className="text-3xl font-extrabold text-white mt-2">
            {stats.totalDailyLogs}
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">
            Logged daily biometrics & habits
          </p>
        </div>

        <div className="bg-[#0d1322] p-6 rounded-2xl border border-slate-800 shadow-xl shadow-black/20 hover:border-blue-500/40 transition">
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Simulations</p>
          <h2 className="text-3xl font-extrabold text-white mt-2">
            {stats.totalSimulations}
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">
            Lifestyle scenarios generated
          </p>
        </div>

        <div className="bg-[#0d1322] p-6 rounded-2xl border border-slate-800 shadow-xl shadow-black/20 hover:border-blue-500/40 transition">
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Audit Logs</p>
          <h2 className="text-3xl font-extrabold text-white mt-2">
            {stats.totalAuditLogs}
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">
            Security & compliance events
          </p>
        </div>
      </div>

      {/* System Audit Trail */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-blue-400">📜</span> System-Wide Security Audit Trail
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Immutable event log of logins, data exports, consent modifications,
          and session revocations. Clinical data is strictly excluded.
        </p>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Loading system audit logs...
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm bg-[#090d16] border border-dashed border-slate-800 rounded-xl">
            No system audit logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-[#090d16] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3 border-b border-slate-800">Timestamp</th>
                  <th className="p-3 border-b border-slate-800">User ID</th>
                  <th className="p-3 border-b border-slate-800">Action</th>
                  <th className="p-3 border-b border-slate-800">Entity</th>
                  <th className="p-3 border-b border-slate-800">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px] bg-[#0d1322]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="p-3 text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-300 truncate max-w-[120px]">
                      {log.userId || "system/unlinked"}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-blue-950/60 border border-blue-500/30 text-blue-300 rounded font-semibold text-[11px] font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-sans">
                      {log.entity || "—"}
                    </td>
                    <td className="p-3 text-slate-400">{log.ipAddress || "127.0.0.1"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

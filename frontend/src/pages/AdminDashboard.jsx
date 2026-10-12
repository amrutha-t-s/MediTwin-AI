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
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-purple-50 text-purple-600 rounded-xl text-2xl">
                🛡️
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Admin System Control & Audit Telemetry
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Role-protected administrative console. Inspect system counts,
                  active accounts, and security compliance logs.
                </p>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase">
            Admin Privileged
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs uppercase font-semibold text-slate-400">Total Users</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {stats.totalUsers}
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">
            Registered patient & staff accounts
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs uppercase font-semibold text-slate-400">Health Records</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {stats.totalDailyLogs}
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">
            Logged daily biometrics & habits
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs uppercase font-semibold text-slate-400">Simulations</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {stats.totalSimulations}
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">
            Lifestyle scenarios generated
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs uppercase font-semibold text-slate-400">Audit Logs</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {stats.totalAuditLogs}
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">
            Security & compliance events
          </p>
        </div>
      </div>

      {/* System Audit Trail */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span>📜</span> System-Wide Security Audit Trail
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Immutable event log of logins, data exports, consent modifications,
          and session revocations. Clinical data is strictly excluded.
        </p>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Loading system audit logs...
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm bg-slate-50 rounded-xl">
            No system audit logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-semibold">
                <tr>
                  <th className="p-3 border-b">Timestamp</th>
                  <th className="p-3 border-b">User ID</th>
                  <th className="p-3 border-b">Action</th>
                  <th className="p-3 border-b">Entity</th>
                  <th className="p-3 border-b">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-600 truncate max-w-[120px]">
                      {log.userId || "system/unlinked"}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 rounded font-semibold text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 font-sans">
                      {log.entity || "—"}
                    </td>
                    <td className="p-3 text-slate-500">{log.ipAddress || "127.0.0.1"}</td>
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

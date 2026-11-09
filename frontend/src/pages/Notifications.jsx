function Notifications() {
  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-950/60 border border-blue-500/30 text-blue-400 rounded-xl text-xl">
              🔔
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Notifications</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Clinical telemetry alerts, journal reminders, and medical regimen notices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-950/40 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold">
            2 Unread
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Health Reminder Card - Blue */}
        <div className="bg-[#0d1322] border border-blue-500/30 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-blue-500/60 transition flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center text-lg shrink-0">
            📝
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-white text-base">Health Journal Reminder</h2>
              <span className="text-[11px] text-blue-400 font-medium">Just now</span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Remember to record your daily health journal to maintain active digital twin calibration.
            </p>
          </div>
        </div>

        {/* Medication Reminder Card - Red */}
        <div className="bg-[#0d1322] border border-red-500/30 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-red-500/60 transition flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 text-red-400 flex items-center justify-center text-lg shrink-0">
            💊
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-white text-base">Medication Schedule</h2>
              <span className="text-[11px] text-red-400 font-medium">Scheduled</span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Your scheduled prescriptions and adherence checkpoints will appear here.
            </p>
          </div>
        </div>

        {/* System Diagnostics Card - Slate */}
        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/20 hover:border-slate-700 transition flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center justify-center text-lg shrink-0">
            🧬
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-white text-base">Digital Twin Synchronized</h2>
              <span className="text-[11px] text-slate-400 font-medium">Today</span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Predictive health forecasting model is calibrated to your latest baseline records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;

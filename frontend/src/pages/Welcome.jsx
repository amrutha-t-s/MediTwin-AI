import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              AI-Powered Personal Healthcare
            </div>

            <h2 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
              Your Health.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-red-400 bg-clip-text text-transparent">
                Your Digital Twin.
              </span>
            </h2>

            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              MediTwin helps you understand your health, track daily habits,
              monitor trends and explore how lifestyle choices may influence
              your future health.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/register"
                className="px-7 py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition active:scale-[0.98]"
              >
                Create Account
              </Link>

              <Link
                to="/login"
                className="px-7 py-3.5 bg-slate-900/80 border border-slate-700/80 rounded-xl font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition active:scale-[0.98]"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Health illustration dashboard card */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-3xl shadow-2xl p-8 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-3xl shadow-lg shadow-red-900/20">
                ❤️
              </div>

              <h3 className="text-2xl font-bold text-white">
                Personal Health Dashboard
              </h3>

              <p className="text-slate-400 mt-2 text-sm">
                Track your health data and understand your personal trends.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-[#111827] border border-blue-900/30 hover:border-blue-500/50 rounded-2xl p-4 transition group">
                <p className="text-xs font-medium text-slate-400">Heart Rate</p>
                <p className="text-2xl font-bold text-red-400 mt-1 flex items-center gap-1.5">
                  72 <span className="text-xs text-slate-400 font-normal">BPM</span>
                </p>
              </div>

              <div className="bg-[#111827] border border-blue-900/30 hover:border-blue-500/50 rounded-2xl p-4 transition group">
                <p className="text-xs font-medium text-slate-400">Sleep</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">7.5 <span className="text-xs text-slate-400 font-normal">hrs</span></p>
              </div>

              <div className="bg-[#111827] border border-blue-900/30 hover:border-blue-500/50 rounded-2xl p-4 transition group">
                <p className="text-xs font-medium text-slate-400">Steps</p>
                <p className="text-2xl font-bold text-blue-300 mt-1">7,240</p>
              </div>

              <div className="bg-[#111827] border border-blue-900/30 hover:border-blue-500/50 rounded-2xl p-4 transition group">
                <p className="text-xs font-medium text-slate-400">Health Score</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">84%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section className="mt-28">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-semibold text-xs tracking-widest uppercase">
              Intelligent Telemetry & Insights
            </p>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
              Everything you need to understand your health
            </h2>

            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
              MediTwin brings important health information and monitoring tools
              together in one unified clinical-grade platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#0d1322] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-lg shadow-black/40">
              <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-2xl mb-4">
                📊
              </div>

              <h3 className="text-xl font-bold text-white">
                Health Tracking
              </h3>

              <p className="text-slate-400 mt-2.5 text-sm leading-relaxed">
                Track daily health information such as heart rate, sleep,
                activity, water intake, and other health indicators.
              </p>
            </div>

            <div className="bg-[#0d1322] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-lg shadow-black/40">
              <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-2xl mb-4">
                📈
              </div>

              <h3 className="text-xl font-bold text-white">
                Health Trends
              </h3>

              <p className="text-slate-400 mt-2.5 text-sm leading-relaxed">
                Understand changes in your health information through meaningful
                trends and historical records.
              </p>
            </div>

            <div className="bg-[#0d1322] border border-slate-800 hover:border-red-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-lg shadow-black/40">
              <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-2xl mb-4">
                💊
              </div>

              <h3 className="text-xl font-bold text-white">
                Medication Tracking
              </h3>

              <p className="text-slate-400 mt-2.5 text-sm leading-relaxed">
                Organize medication information, dosage details, schedules, and
                instructions.
              </p>
            </div>

            <div className="bg-[#0d1322] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-lg shadow-black/40">
              <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-2xl mb-4">
                🧬
              </div>

              <h3 className="text-xl font-bold text-white">
                Digital Twin
              </h3>

              <p className="text-slate-400 mt-2.5 text-sm leading-relaxed">
                Explore a personalized digital representation of your health
                information.
              </p>
            </div>

            <div className="bg-[#0d1322] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-lg shadow-black/40">
              <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-2xl mb-4">
                🔮
              </div>

              <h3 className="text-xl font-bold text-white">
                Lifestyle Simulation
              </h3>

              <p className="text-slate-400 mt-2.5 text-sm leading-relaxed">
                Explore how different lifestyle scenarios could potentially
                influence health trends.
              </p>
            </div>

            <div className="bg-[#0d1322] border border-slate-800 hover:border-red-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-lg shadow-black/40">
              <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-2xl mb-4">
                🔒
              </div>

              <h3 className="text-xl font-bold text-white">
                Privacy & Consent
              </h3>

              <p className="text-slate-400 mt-2.5 text-sm leading-relaxed">
                Manage your health information, privacy preferences, and consent
                settings.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-16 bg-[#0d1322] border border-red-900/40 rounded-2xl p-5 shadow-lg flex items-start gap-3">
          <span className="text-red-400 text-xl shrink-0">⚠️</span>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-red-400">Disclaimer:</strong> MediTwin is a health-monitoring and
            educational prototype. It does not diagnose diseases, replace
            professional medical advice, or recommend changing medications.
          </p>
        </div>
      </main>

      <footer className="text-center py-8 text-xs text-slate-400 border-t border-slate-800/80">
        MediTwin © {new Date().getFullYear()} — Professional Digital Health Prototype
      </footer>
    </div>
  );
}

export default Welcome;

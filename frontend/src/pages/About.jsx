import { Link } from "react-router-dom";

function About() {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar Header */}
      <header className="border-b border-slate-800/80 px-6 lg:px-12 py-4 flex justify-between items-center bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 shadow-md">
            <span className="text-lg">🫀</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent">
            MediTwin
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-slate-300 hover:text-white transition">
            Home
          </Link>
          <Link
            to="/login"
            className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-xl transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            About MediTwin
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Your Health.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-red-400 bg-clip-text text-transparent">
              Your Digital Twin.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-slate-400 leading-relaxed">
            MediTwin is an AI-powered healthcare monitoring platform designed to
            help users understand their health data, track daily habits, monitor
            health trends, and explore how lifestyle choices may influence
            future health.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-blue-400 font-semibold text-xs tracking-widest uppercase mb-2">Our Mission</p>

            <h2 className="text-3xl font-bold text-white">
              Making personal health information easier to understand
            </h2>

            <p className="mt-5 text-slate-400 leading-relaxed">
              MediTwin brings health information into one place so users can
              monitor their daily activities, understand patterns, and make more
              informed lifestyle decisions.
            </p>

            <p className="mt-4 text-slate-400 leading-relaxed">
              The platform is designed as an educational and health-monitoring
              prototype and is not intended to replace professional medical
              care.
            </p>
          </div>

          <div className="bg-[#0d1322] border border-slate-800 rounded-3xl shadow-xl p-8 text-center relative overflow-hidden">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-4xl mb-4 shadow-lg shadow-blue-900/30">
              🧬
            </div>

            <h3 className="text-2xl font-bold text-white">
              Digital Health Twin
            </h3>

            <p className="text-slate-400 mt-3 text-sm leading-relaxed">
              A personalized representation of your health information and
              trends.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/40 via-[#0d1322] to-red-950/40 border border-blue-500/30 rounded-3xl p-10 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white">
              Start your personalized health journey
            </h2>

            <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm">
              Create an account and explore the MediTwin platform.
            </p>

            <Link
              to="/register"
              className="inline-block mt-8 px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-xs text-slate-500 border-t border-slate-800/80">
        MediTwin © {new Date().getFullYear()} — Professional Digital Health Prototype
      </footer>
    </div>
  );
}

export default About;

import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b">
        <h1 className="text-2xl font-bold text-blue-600">MediTwin</h1>

        <div className="flex gap-3">
          <Link to="/login" className="px-5 py-2 text-blue-600 font-medium">
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-600 font-semibold mb-3">
              AI-Powered Personal Healthcare
            </p>

            <h2 className="text-5xl font-bold text-slate-900 leading-tight">
              Your Health.
              <br />
              Your Digital Twin.
            </h2>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              MediTwin helps you understand your health, track daily habits,
              monitor trends and explore how lifestyle choices may influence
              your future health.
            </p>

            <div className="flex gap-4 mt-8">
              <Link
                to="/register"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Create Account
              </Link>

              <Link
                to="/login"
                className="px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-white"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Health illustration placeholder */}

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="text-6xl mb-5">❤️</div>

              <h3 className="text-2xl font-semibold">
                Personal Health Dashboard
              </h3>

              <p className="text-slate-500 mt-3">
                Track your health data and understand your personal trends.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Heart Rate</p>
                <p className="text-2xl font-bold text-blue-600">72 BPM</p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Sleep</p>
                <p className="text-2xl font-bold text-green-600">7.5 hrs</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Steps</p>
                <p className="text-2xl font-bold text-purple-600">7,240</p>
              </div>

              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Health Score</p>
                <p className="text-2xl font-bold text-orange-600">84%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}

        <div className="mt-16 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <p className="text-sm text-yellow-900">
            <strong>Disclaimer:</strong> MediTwin is a health-monitoring and
            educational prototype. It does not diagnose diseases, replace
            professional medical advice, or recommend changing medications.
          </p>
        </div>
      </main>

      <footer className="text-center py-8 text-sm text-slate-500">
        MediTwin © {new Date().getFullYear()} — Educational Prototype
      </footer>
    </div>
  );
}

export default Welcome;

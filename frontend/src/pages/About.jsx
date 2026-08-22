import { Link } from "react-router-dom";

function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-blue-600 font-semibold mb-3">About MediTwin</p>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Your Health. Your Digital Twin.
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-slate-600 leading-relaxed">
            MediTwin is an AI-powered healthcare monitoring platform designed to
            help users understand their health data, track daily habits, monitor
            health trends, and explore how lifestyle choices may influence
            future health.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-blue-600 font-semibold mb-3">Our Mission</p>

            <h2 className="text-3xl font-bold text-slate-900">
              Making personal health information easier to understand
            </h2>

            <p className="mt-5 text-slate-600 leading-relaxed">
              MediTwin brings health information into one place so users can
              monitor their daily activities, understand patterns, and make more
              informed lifestyle decisions.
            </p>

            <p className="mt-4 text-slate-600 leading-relaxed">
              The platform is designed as an educational and health-monitoring
              prototype and is not intended to replace professional medical
              care.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-6xl text-center">🧬</div>

            <h3 className="text-2xl font-semibold text-center mt-5">
              Digital Health Twin
            </h3>

            <p className="text-center text-slate-500 mt-3">
              A personalized representation of your health information and
              trends.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-blue-600 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold">
            Start your personalized health journey
          </h2>

          <p className="mt-4 text-blue-100">
            Create an account and explore the MediTwin platform.
          </p>

          <Link
            to="/register"
            className="inline-block mt-7 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;

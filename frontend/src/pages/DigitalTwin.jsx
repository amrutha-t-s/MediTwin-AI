import { useEffect, useState } from "react";
import api from "../services/api";
import HealthConsistencyScore from "../components/HealthConsistencyScore";

function DigitalTwin() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/dashboard/summary");
        setSummary(res.data);
      } catch (err) {
        console.warn("DigitalTwin summary load fallback:", err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">Digital Health Twin</h1>
        <p className="text-slate-600 text-sm">
          Explore your personalized digital health representation, consistency scores, and simulated models.
        </p>
      </div>

      {/* Featured Health Consistency Score */}
      <HealthConsistencyScore
        scoreData={summary?.healthConsistencyScore}
      />

      {/* Digital Twin Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-6xl p-5 bg-blue-50 rounded-2xl text-center shrink-0">
            🧬
          </div>

          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900">
              Personalized Twin Model Active
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
              MediTwin synthesizes your logged metrics—including glucose consistency, blood pressure patterns, sleep architecture, daily steps, and medication adherence—to create a digital model representing your wellness stability.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start text-xs">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-full border border-blue-200">
                Rule-based Engine v0.1
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-200">
                Consistency Driven
              </span>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 font-semibold rounded-full border border-amber-200">
                Educational Prototype
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DigitalTwin;

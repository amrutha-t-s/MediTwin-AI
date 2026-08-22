function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Doctor Dashboard</h1>

        <p className="mt-2 text-slate-500">
          Welcome to the MediTwin doctor dashboard.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold text-lg">Patients</h2>

            <p className="text-slate-500 mt-2">Manage and monitor patients.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold text-lg">Health Records</h2>

            <p className="text-slate-500 mt-2">
              Review patient health information.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold text-lg">Predictions</h2>

            <p className="text-slate-500 mt-2">
              View health predictions and insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;

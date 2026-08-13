function HealthHistory() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold">Health History</h1>

      <p className="mt-4 text-gray-600">
        View your previous health records and activities.
      </p>

      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold">Previous Records</h2>

        <p className="mt-4 text-gray-500">
          Your health history will appear here.
        </p>
      </div>
    </div>
  );
}

export default HealthHistory;

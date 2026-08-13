function Trends() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold">Health Trends</h1>

      <p className="mt-4 text-gray-600">
        Understand how your health changes over time.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mt-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold">Blood Pressure</h2>

          <div className="h-40 mt-4 bg-gray-100 rounded-lg flex items-center justify-center">
            Chart
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold">Blood Glucose</h2>

          <div className="h-40 mt-4 bg-gray-100 rounded-lg flex items-center justify-center">
            Chart
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold">Weight</h2>

          <div className="h-40 mt-4 bg-gray-100 rounded-lg flex items-center justify-center">
            Chart
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trends;

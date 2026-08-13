function AdminDashboard() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <p className="mt-4 text-gray-600">
        Manage users and monitor the MediTwin application.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mt-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Users</p>

          <h2 className="text-3xl font-bold mt-2">--</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Active Users</p>

          <h2 className="text-3xl font-bold mt-2">--</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Health Records</p>

          <h2 className="text-3xl font-bold mt-2">--</h2>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

function Notifications() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Notifications</h1>

      <div className="mt-8 space-y-4">
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
          <h2 className="font-semibold">Health Reminder</h2>

          <p className="text-gray-600 mt-1">
            Remember to record your daily health journal.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 p-5 rounded-xl">
          <h2 className="font-semibold">Medication Reminder</h2>

          <p className="text-gray-600 mt-1">
            Your medication reminder will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Notifications;

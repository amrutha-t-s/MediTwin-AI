function HealthJournal() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Daily Health Journal</h1>

      <p className="mt-4 text-gray-600">
        Record your daily health and lifestyle information.
      </p>

      <div className="mt-6 space-y-4">
        <textarea
          placeholder="How are you feeling today?"
          className="w-full max-w-xl border p-4 rounded-lg"
          rows="5"
        />

        <input
          type="number"
          placeholder="Steps"
          className="block border p-3 rounded-lg"
        />

        <input
          type="number"
          placeholder="Sleep hours"
          className="block border p-3 rounded-lg"
        />

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          Save Journal
        </button>
      </div>
    </div>
  );
}

export default HealthJournal;

function Medication() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Medications</h1>

      <p className="mt-4 text-gray-600">Manage and track your medications.</p>

      <div className="mt-6 bg-white border rounded-xl p-6 max-w-xl">
        <input
          type="text"
          placeholder="Medication name"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Dosage"
          className="w-full border p-3 rounded-lg mt-4"
        />

        <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg">
          Add Medication
        </button>
      </div>
    </div>
  );
}

export default Medication;

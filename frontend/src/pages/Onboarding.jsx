function Onboarding() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Health Onboarding</h1>

      <p className="mt-4 text-gray-600">
        Tell us about yourself to personalize your MediTwin experience.
      </p>

      <div className="mt-6 space-y-4">
        <input
          type="number"
          placeholder="Age"
          className="block border p-3 rounded-lg"
        />

        <input
          type="number"
          placeholder="Height (cm)"
          className="block border p-3 rounded-lg"
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          className="block border p-3 rounded-lg"
        />

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          Continue
        </button>
      </div>
    </div>
  );
}

export default Onboarding;

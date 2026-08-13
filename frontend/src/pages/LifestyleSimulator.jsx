function LifestyleSimulator() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold">Lifestyle Simulator</h1>

      <p className="mt-4 text-gray-600">
        Explore possible outcomes of different lifestyle choices.
      </p>

      <div className="mt-8 bg-white p-6 rounded-xl shadow max-w-xl">
        <label className="block font-medium">Daily Exercise</label>

        <input type="range" className="w-full mt-3" />

        <label className="block font-medium mt-6">Sleep</label>

        <input type="range" className="w-full mt-3" />

        <label className="block font-medium mt-6">Diet Quality</label>

        <input type="range" className="w-full mt-3" />

        <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg">
          Run Simulation
        </button>
      </div>
    </div>
  );
}

export default LifestyleSimulator;

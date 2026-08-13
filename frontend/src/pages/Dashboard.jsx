function Dashboard() {
  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-blue-600 font-medium">Good morning 👋</p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Your Health Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Here's an overview of your health today.
        </p>
      </div>

      {/* Health Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Heart Rate */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex justify-between">
            <p className="text-sm text-slate-500">Heart Rate</p>

            <span className="text-xl">❤️</span>
          </div>

          <h2 className="text-3xl font-bold text-blue-600 mt-3">
            72
            <span className="text-base font-normal"> BPM</span>
          </h2>

          <p className="text-xs text-green-600 mt-2">✓ Normal range</p>
        </div>

        {/* Blood Pressure */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex justify-between">
            <p className="text-sm text-slate-500">Blood Pressure</p>

            <span className="text-xl">🩺</span>
          </div>

          <h2 className="text-3xl font-bold text-purple-600 mt-3">120/80</h2>

          <p className="text-xs text-green-600 mt-2">✓ Healthy range</p>
        </div>

        {/* Sleep */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex justify-between">
            <p className="text-sm text-slate-500">Sleep</p>

            <span className="text-xl">😴</span>
          </div>

          <h2 className="text-3xl font-bold text-green-600 mt-3">
            7.5
            <span className="text-base font-normal"> hrs</span>
          </h2>

          <p className="text-xs text-green-600 mt-2">✓ Good sleep</p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex justify-between">
            <p className="text-sm text-slate-500">Steps</p>

            <span className="text-xl">🚶</span>
          </div>

          <h2 className="text-3xl font-bold text-orange-500 mt-3">7,240</h2>

          <p className="text-xs text-slate-500 mt-2">Goal: 10,000</p>
        </div>
      </div>

      {/* Middle section */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* Health Score */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold">Overall Health Score</h2>

          <div className="flex items-center justify-center py-8">
            <div className="w-36 h-36 rounded-full border-[12px] border-blue-500 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">84%</p>

                <p className="text-xs text-slate-500">Good</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500 text-center">
            Your current health indicators are looking good.
          </p>
        </div>

        {/* Health Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Health Trends</h2>

              <p className="text-sm text-slate-500">
                Your recent health measurements
              </p>
            </div>

            <span className="text-sm text-blue-600">Last 7 days</span>
          </div>

          {/* Chart placeholder */}
          <div className="h-56 mt-6 bg-slate-50 rounded-xl flex items-end justify-around px-6 pb-5">
            <div className="w-8 h-20 bg-blue-300 rounded-t-lg"></div>

            <div className="w-8 h-32 bg-blue-400 rounded-t-lg"></div>

            <div className="w-8 h-24 bg-blue-300 rounded-t-lg"></div>

            <div className="w-8 h-40 bg-blue-500 rounded-t-lg"></div>

            <div className="w-8 h-36 bg-blue-400 rounded-t-lg"></div>

            <div className="w-8 h-44 bg-blue-500 rounded-t-lg"></div>

            <div className="w-8 h-48 bg-blue-600 rounded-t-lg"></div>
          </div>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold">Today's Health Activity</h2>

        <div className="grid md:grid-cols-3 gap-4 mt-5">
          <div className="flex items-center gap-4 bg-green-50 p-4 rounded-lg">
            <span className="text-2xl">✓</span>

            <div>
              <p className="font-medium">Sleep recorded</p>

              <p className="text-sm text-slate-500">7.5 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg">
            <span className="text-2xl">✓</span>

            <div>
              <p className="font-medium">Health profile</p>

              <p className="text-sm text-slate-500">Profile completed</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-lg">
            <span className="text-2xl">+</span>

            <div>
              <p className="font-medium">Add journal</p>

              <p className="text-sm text-slate-500">Record today's health</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

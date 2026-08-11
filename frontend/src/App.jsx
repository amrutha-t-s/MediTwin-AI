export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">
          MediTwin – Your Health Digital Twin
        </h1>
      </header>

      <main className="flex-1 p-6">
        <section className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">Welcome to MediTwin</h2>
          <p className="text-gray-700 mb-4">
            MediTwin helps you track your daily health metrics and understand
            how your habits may affect your future health.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
            <p className="text-sm text-gray-800">
              <strong>Disclaimer:</strong> MediTwin is a health-monitoring and
              educational prototype. It does not diagnose diseases, replace a
              doctor, or recommend changing medication.
            </p>
          </div>

          <p className="text-gray-700">This MVP will allow you to:</p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            <li>Create an account and log in securely.</li>
            <li>Complete your health profile.</li>
            <li>
              Log daily glucose, BP, food, sleep, steps, medication, and
              lifestyle.
            </li>
            <li>View charts and trends.</li>
            <li>Receive simple, educational insights.</li>
            <li>Test “what-if” lifestyle scenarios.</li>
          </ul>
        </section>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500">
        MediTwin © {new Date().getFullYear()} – Educational prototype
      </footer>
    </div>
  );
}

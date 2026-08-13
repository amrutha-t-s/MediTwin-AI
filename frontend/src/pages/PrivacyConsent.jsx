function PrivacyConsent() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Privacy & Consent</h1>

      <p className="mt-4 text-gray-600">
        Manage your health data privacy and consent preferences.
      </p>

      <div className="mt-8 bg-white border rounded-xl p-6 max-w-2xl">
        <label className="flex gap-3 items-start">
          <input type="checkbox" className="mt-1" />

          <span>
            I consent to MediTwin storing my health information for the purpose
            of providing the application's health monitoring features.
          </span>
        </label>

        <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

export default PrivacyConsent;

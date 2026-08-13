function ResetPassword() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Reset Password</h1>

      <p className="mt-4 text-gray-600">
        Create a new password for your account.
      </p>

      <input
        type="password"
        placeholder="New password"
        className="block mt-6 border p-3 rounded-lg"
      />

      <input
        type="password"
        placeholder="Confirm password"
        className="block mt-4 border p-3 rounded-lg"
      />

      <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg">
        Reset Password
      </button>
    </div>
  );
}

export default ResetPassword;

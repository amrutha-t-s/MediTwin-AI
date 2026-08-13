function ForgotPassword() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Forgot Password</h1>

      <p className="mt-4 text-gray-600">
        Enter your email address to reset your password.
      </p>

      <input
        type="email"
        placeholder="Enter your email"
        className="mt-6 border p-3 rounded-lg"
      />

      <br />

      <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg">
        Send Reset Link
      </button>
    </div>
  );
}

export default ForgotPassword;

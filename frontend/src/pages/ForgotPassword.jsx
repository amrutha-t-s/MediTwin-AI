import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        },
      );

      const data = await response.json();

      console.log("Forgot password response:", data);

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to process password reset request",
        );
      }

      setSuccess(
        "Reset link generated successfully. For this student demo, open the backend terminal and copy the reset link shown there.",
      );

      setEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);

      setError(error.message || "Unable to process password reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">MediTwin</h1>

          <h2 className="text-2xl font-semibold text-slate-900 mt-6">
            Forgot Password?
          </h2>

          <p className="text-slate-500 mt-2">
            Enter your registered email to reset your password.
          </p>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating reset link..." : "Send Reset Link"}
          </button>
        </form>

        {/* Error */}

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mt-5 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Login */}

        <p className="text-center text-sm text-slate-500 mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

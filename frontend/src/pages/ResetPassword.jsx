import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError(
        "Invalid or missing reset token. Please use the reset link generated from the Forgot Password page.",
      );

      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");

      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
            password,
            confirmPassword,
          }),
        },
      );

      const data = await response.json();

      console.log("Reset password response:", data);

      if (!response.ok) {
        throw new Error(data.error || data.message || "Password reset failed");
      }

      setMessage("Password reset successfully. Redirecting to login...");

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);

      setError(error.message || "Unable to reset password.");
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
            Reset Password
          </h2>

          <p className="text-slate-500 mt-2">
            Create a new password for your account.
          </p>
        </div>

        {/* Missing token */}

        {!token ? (
          <div>
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
              Invalid or missing reset token.
            </div>

            <Link
              to="/forgot-password"
              className="block text-center mt-6 text-blue-600 font-medium hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            {/* New Password */}

            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={8}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={8}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Success */}

        {message && (
          <div className="mt-5 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Back */}

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;

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
    <div className="min-h-screen bg-[#070a12] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0d1322] border border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10 backdrop-blur-xl">
        {/* Header */}

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 shadow-md">
              <span className="text-xl">🫀</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent">
              MediTwin
            </span>
          </Link>

          <h2 className="text-2xl font-bold text-white mt-4">
            Reset Password
          </h2>

          <p className="text-slate-400 text-sm mt-1.5">
            Create a new password for your account.
          </p>
        </div>

        {/* Missing token */}

        {!token ? (
          <div>
            <div className="bg-red-950/40 border border-red-500/40 text-red-300 p-4 rounded-xl text-sm flex items-center gap-2">
              <span className="text-red-400 font-bold shrink-0">⚠️</span>
              <span>Invalid or missing reset token.</span>
            </div>

            <Link
              to="/forgot-password"
              className="block text-center mt-6 text-blue-400 font-medium hover:text-blue-300 hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            {/* New Password */}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={8}
                className="w-full px-4 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
              />
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={8}
                className="w-full px-4 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Success */}

        {message && (
          <div className="mt-5 bg-blue-950/40 border border-blue-500/40 text-blue-300 p-3.5 rounded-xl text-sm flex items-center gap-2">
            <span className="text-blue-400 font-bold shrink-0">✓</span>
            <span>{message}</span>
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mt-5 bg-red-950/40 border border-red-500/40 text-red-300 p-3.5 rounded-xl text-sm flex items-center gap-2">
            <span className="text-red-400 font-bold shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Back */}

        <p className="text-center text-sm text-slate-400 mt-6 pt-5 border-t border-slate-800">
          <Link
            to="/login"
            className="text-blue-400 font-semibold hover:text-blue-300 hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;

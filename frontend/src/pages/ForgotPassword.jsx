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
    <div className="min-h-screen bg-[#070a12] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

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
            Forgot Password?
          </h2>

          <p className="text-slate-400 text-sm mt-1.5">
            Enter your registered email to reset your password.
          </p>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Email Address</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-[#090d16] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Generating reset link..." : "Send Reset Link"}
          </button>
        </form>

        {/* Error */}

        {error && (
          <div className="mt-5 bg-red-950/40 border border-red-500/40 text-red-300 p-3.5 rounded-xl text-sm flex items-center gap-2">
            <span className="text-red-400 font-bold shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mt-5 bg-blue-950/40 border border-blue-500/40 text-blue-300 p-3.5 rounded-xl text-sm flex items-start gap-2">
            <span className="text-blue-400 font-bold shrink-0 mt-0.5">ℹ️</span>
            <span>{success}</span>
          </div>
        )}

        {/* Login */}

        <p className="text-center text-sm text-slate-400 mt-6 pt-5 border-t border-slate-800">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-400 font-semibold hover:text-blue-300 hover:underline ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

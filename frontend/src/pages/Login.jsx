import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuth } from "../utils/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ==========================
      // Send login request
      // ==========================

      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      // ==========================
      // Handle backend error
      // ==========================

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ==========================
      // Get user information
      // ==========================

      const user = data.user;

      // ==========================
      // Store authentication data
      // ==========================

      saveAuth(data, rememberMe);

      // ==========================
      // Role-based navigation
      // ==========================

      const userRole = (user?.role || "").toLowerCase();

      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(error.message || "Unable to login. Please try again.");
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
        {/* ==========================
            Header
        ========================== */}

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
            Welcome Back
          </h2>

          <p className="text-slate-400 text-sm mt-1.5">Login to your clinical health dashboard</p>
        </div>

        {/* ==========================
            Login Form
        ========================== */}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}

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

          {/* Password */}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 pr-20 bg-[#090d16] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded bg-slate-800/80 transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-200 transition">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/30 accent-blue-600"
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        {/* ==========================
            Error Message
        ========================== */}

        {error && (
          <div className="mt-5 bg-red-950/40 border border-red-500/40 text-red-300 p-3.5 rounded-xl text-sm flex items-center gap-2">
            <span className="text-red-400 font-bold shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ==========================
            Register
        ========================== */}

        <p className="text-center text-sm text-slate-400 mt-6 pt-5 border-t border-slate-800">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 font-semibold hover:text-blue-300 hover:underline ml-1"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

import { Link } from "react-router-dom";

function EmailVerification() {
  return (
    <div className="min-h-screen bg-[#070a12] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#0d1322] border border-slate-800 rounded-3xl shadow-2xl p-8 text-center text-slate-100">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-3xl shadow-lg shadow-blue-900/30">
          ✉️
        </div>

        <h1 className="text-2xl font-bold text-white">Email Verification</h1>

        <p className="mt-3 text-slate-400 text-sm leading-relaxed">
          Please check your email and click the verification link to activate your account.
        </p>

        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg shadow-blue-600/30 transition active:scale-[0.98] cursor-pointer">
          Resend Verification Email
        </button>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;

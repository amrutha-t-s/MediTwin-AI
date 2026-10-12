import { Navigate, useLocation, Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (
      localStorage.getItem("role") ||
      sessionStorage.getItem("role") ||
      "patient"
    ).toLowerCase();

    const hasAccess = allowedRoles.some((r) => r.toLowerCase() === userRole);

    if (!hasAccess) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 font-bold">
              🛡️
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Access Restricted
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              This area requires <strong>{allowedRoles.join(" or ")}</strong> privileges.
              Your current authenticated role is <strong>{userRole}</strong>.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                to="/dashboard"
                className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Return to Patient Dashboard
              </Link>
              <Link
                to="/privacy-consent"
                className="w-full py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition text-sm"
              >
                Manage Privacy & Role Settings
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
}

export default ProtectedRoute;

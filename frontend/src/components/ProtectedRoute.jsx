import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = getUserRole();

    const hasAccess = allowedRoles.some((r) => r.toLowerCase() === userRole);

    if (!hasAccess) {
      // If doctor is attempting to access a patient-only page, redirect immediately to doctor dashboard
      if (userRole === "doctor") {
        return <Navigate to="/doctor-dashboard" replace />;
      }

      // If patient is attempting to access clinician/admin page, redirect to patient dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;

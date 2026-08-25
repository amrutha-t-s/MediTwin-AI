import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Public pages
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";

// Protected pages
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import HealthJournal from "./pages/HealthJournal";
import HealthHistory from "./pages/HealthHistory";
import HealthProfile from "./pages/HealthProfile";
import Medication from "./pages/Medication";
import Trends from "./pages/Trends";
import DigitalTwin from "./pages/DigitalTwin";
import LifestyleSimulator from "./pages/LifestyleSimulator";
import Notifications from "./pages/Notifications";
import PrivacyConsent from "./pages/PrivacyConsent";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        {/* Home */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Welcome />
            </>
          }
        />

        {/* About */}
        <Route path="/about" element={<About />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Registration */}
        <Route path="/register" element={<Register />} />

        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Reset Password */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Email Verification */}
        <Route path="/email-verification" element={<EmailVerification />} />

        {/* =====================================================
            PROTECTED ROUTES
        ===================================================== */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Patient */}
          <Route path="/onboarding" element={<Onboarding />} />

          <Route path="/dashboard" element={<Dashboard />} />

          {/* Doctor */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

          {/* Health */}
          <Route path="/health-journal" element={<HealthJournal />} />

          <Route path="/health-history" element={<HealthHistory />} />

          <Route path="/health-profile" element={<HealthProfile />} />

          {/* Medication */}
          <Route path="/medications" element={<Medication />} />

          {/* Analytics */}
          <Route path="/trends" element={<Trends />} />

          {/* Digital Twin */}
          <Route path="/digital-twin" element={<DigitalTwin />} />

          {/* Simulation */}
          <Route path="/lifestyle-simulator" element={<LifestyleSimulator />} />

          {/* Notifications */}
          <Route path="/notifications" element={<Notifications />} />

          {/* Privacy */}
          <Route path="/privacy-consent" element={<PrivacyConsent />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

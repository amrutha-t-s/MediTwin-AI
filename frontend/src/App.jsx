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
import EditProfile from "./pages/EditProfile";

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
            PROTECTED ONBOARDING
        ===================================================== */}

        {/*
          IMPORTANT:

          Onboarding is protected by authentication,
          but it is NOT inside DashboardLayout.

          This prevents DashboardLayout navigation/overlay/
          layout logic from interfering with the 4-step form.
        */}

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            PROTECTED APPLICATION ROUTES
        ===================================================== */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* =================================================
              PATIENT
          ================================================= */}

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/edit-profile" element={<EditProfile />} />

          {/* =================================================
              DOCTOR
          ================================================= */}

          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

          {/* =================================================
              HEALTH
          ================================================= */}

          <Route path="/health-journal" element={<HealthJournal />} />

          <Route path="/health-history" element={<HealthHistory />} />

          <Route path="/health-profile" element={<HealthProfile />} />

          {/* =================================================
              MEDICATION
          ================================================= */}

          <Route path="/medications" element={<Medication />} />

          {/* =================================================
              ANALYTICS
          ================================================= */}

          <Route path="/trends" element={<Trends />} />

          {/* =================================================
              DIGITAL TWIN
          ================================================= */}

          <Route path="/digital-twin" element={<DigitalTwin />} />

          {/* =================================================
              SIMULATION
          ================================================= */}

          <Route path="/lifestyle-simulator" element={<LifestyleSimulator />} />

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <Route path="/notifications" element={<Notifications />} />

          {/* =================================================
              PRIVACY
          ================================================= */}

          <Route path="/privacy-consent" element={<PrivacyConsent />} />

          {/* =================================================
              ADMIN
          ================================================= */}

          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import DoctorDashboard from "./pages/DoctorDashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Public pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import About from "./pages/About";

// Protected pages
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
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
        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Welcome />
            </>
          }
        />

        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/email-verification" element={<EmailVerification />} />

        {/* ================= PROTECTED ================= */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/onboarding" element={<Onboarding />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

          <Route path="/health-journal" element={<HealthJournal />} />

          <Route path="/health-history" element={<HealthHistory />} />

          <Route path="/health-profile" element={<HealthProfile />} />

          <Route path="/medications" element={<Medication />} />

          <Route path="/trends" element={<Trends />} />

          <Route path="/digital-twin" element={<DigitalTwin />} />

          <Route path="/lifestyle-simulator" element={<LifestyleSimulator />} />

          <Route path="/notifications" element={<Notifications />} />

          <Route path="/privacy-consent" element={<PrivacyConsent />} />

          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

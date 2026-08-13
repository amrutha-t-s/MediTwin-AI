import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
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

import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            PUBLIC PAGES
        ========================== */}

        <Route path="/" element={<Welcome />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/verify-email" element={<EmailVerification />} />

        <Route path="/onboarding" element={<Onboarding />} />

        {/* =========================
            MAIN APPLICATION
        ========================== */}

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/profile" element={<HealthProfile />} />

          <Route path="/journal" element={<HealthJournal />} />

          <Route path="/history" element={<HealthHistory />} />

          <Route path="/medications" element={<Medication />} />

          <Route path="/trends" element={<Trends />} />

          <Route path="/digital-twin" element={<DigitalTwin />} />

          <Route path="/lifestyle" element={<LifestyleSimulator />} />

          <Route path="/notifications" element={<Notifications />} />

          <Route path="/privacy" element={<PrivacyConsent />} />
        </Route>

        {/* =========================
            ADMIN
        ========================== */}

        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

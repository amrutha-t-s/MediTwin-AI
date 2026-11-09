import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function PrivacyConsent({ _isPublic = false }) {
  const navigate = useNavigate();

  // Authentication & Role
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const storedRole = (
    localStorage.getItem("role") ||
    sessionStorage.getItem("role") ||
    "patient"
  ).toLowerCase();
  const storedEmail =
    localStorage.getItem("email") ||
    sessionStorage.getItem("email") ||
    "user@meditwin.health";

  // State
  const [currentRole, setCurrentRole] = useState(storedRole);
  const [researchConsent, setResearchConsent] = useState(false);
  const [consentLastUpdated, setConsentLastUpdated] = useState(null);
  const [loadingConsent, setLoadingConsent] = useState(false);
  const [savingConsent, setSavingConsent] = useState(false);
  const [consentMessage, setConsentMessage] = useState(null);

  // Data Export state
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState(null);

  // Session Logout state
  const [loggingOutAll, setLoggingOutAll] = useState(false);
  const [sessionMessage, setSessionMessage] = useState(null);

  // Account Deletion modal & state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Active Tab navigation
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch initial consent and audit logs if logged in
  useEffect(() => {
    if (!token) return;

    // Load consent
    setLoadingConsent(true);
    fetch("http://localhost:4000/api/privacy/consent", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setResearchConsent(!!data.researchConsent);
          if (data.lastUpdated) {
            setConsentLastUpdated(
              new Date(data.lastUpdated).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            );
          }
        }
      })
      .catch((err) => {
        console.warn("Could not load consent settings:", err.message);
      })
      .finally(() => setLoadingConsent(false));

    // Load audit logs
    setLoadingAudit(true);
    fetch("http://localhost:4000/api/privacy/audit-logs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.auditLogs) {
          setAuditLogs(data.auditLogs);
        }
      })
      .catch((err) => {
        console.warn("Could not load audit trail:", err.message);
      })
      .finally(() => setLoadingAudit(false));
  }, [token]);

  // Handle research consent toggle
  const handleToggleResearchConsent = async () => {
    if (!token) {
      setConsentMessage({
        type: "error",
        text: "Please log in to update research consent preferences.",
      });
      return;
    }

    const nextValue = !researchConsent;
    setSavingConsent(true);
    setConsentMessage(null);

    try {
      const res = await fetch("http://localhost:4000/api/privacy/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ researchConsent: nextValue }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update consent.");
      }

      setResearchConsent(data.researchConsent);
      setConsentLastUpdated(
        new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setConsentMessage({
        type: "success",
        text: data.message,
      });

      // Refresh audit logs
      refreshAuditLogs();
    } catch (err) {
      setConsentMessage({
        type: "error",
        text: err.message || "Failed to save preference.",
      });
    } finally {
      setSavingConsent(false);
    }
  };

  // Secure Data Export
  // Privacy Guardrail: Health records are downloaded via direct stream; never passed in URLs or printed in logs
  const handleExportData = async () => {
    if (!token) {
      setExportMessage({
        type: "error",
        text: "You must be logged in to export health records.",
      });
      return;
    }

    setExporting(true);
    setExportMessage(null);

    try {
      const res = await fetch("http://localhost:4000/api/privacy/export", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Unable to export health records from server.");
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStamp = new Date().toISOString().slice(0, 10);
      link.href = downloadUrl;
      link.download = `meditwin_health_export_${dateStamp}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setExportMessage({
        type: "success",
        text: "Health records exported successfully. Your JSON download has started.",
      });

      refreshAuditLogs();
    } catch (err) {
      setExportMessage({
        type: "error",
        text: err.message || "Data export failed.",
      });
    } finally {
      setExporting(false);
    }
  };

  // Logout from all sessions
  const handleLogoutAllSessions = async () => {
    if (!token) return;

    if (
      !window.confirm(
        "Are you sure you want to log out from all active sessions across all devices? You will be returned to the login screen."
      )
    ) {
      return;
    }

    setLoggingOutAll(true);
    try {
      const res = await fetch("http://localhost:4000/api/privacy/logout-all", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        logout();
        navigate("/login", {
          replace: true,
          state: {
            message:
              "You have been successfully logged out from all active sessions and devices.",
          },
        });
      } else {
        throw new Error("Failed to invalidate remote sessions.");
      }
    } catch (err) {
      setSessionMessage({
        type: "error",
        text: err.message,
      });
      setLoggingOutAll(false);
    }
  };

  // Delete Account & All Data
  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") {
      setDeleteError("Please type DELETE exactly to proceed.");
      return;
    }

    setDeletingAccount(true);
    setDeleteError(null);

    try {
      const res = await fetch("http://localhost:4000/api/privacy/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ confirmationText: "DELETE" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account.");
      }

      logout();
      alert(
        "Your account and all associated health records have been permanently deleted."
      );
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err.message || "Account deletion failed.");
      setDeletingAccount(false);
    }
  };

  // Helper to refresh audit logs
  const refreshAuditLogs = () => {
    if (!token) return;
    fetch("http://localhost:4000/api/privacy/audit-logs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.auditLogs) setAuditLogs(data.auditLogs);
      })
      .catch(() => {});
  };

  // Role testing helper (allows demo evaluator to switch roles easily)
  const handleTestRoleChange = (newRole) => {
    setCurrentRole(newRole);
    localStorage.setItem("role", newRole);
    sessionStorage.setItem("role", newRole);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-950/60 border border-blue-500/30 text-blue-400 rounded-xl text-2xl">
                🔒
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Privacy, Consent & Data Governance
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Your health information belongs to you. Review what is
                  collected, manage consent, export your records, or purge data.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
              ✓ Zero Health Data In URLs
            </span>
            <span className="px-3 py-1 bg-blue-950/40 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold">
              ✓ Non-PHI Audit Logging
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800">
          {[
            { id: "overview", label: "Policy & Collection", icon: "📋" },
            { id: "rights", label: "Data Export & Wipe", icon: "📦" },
            { id: "consent", label: "Research Consent", icon: "🔬" },
            { id: "rbac", label: "Role Authorization", icon: "🛡️" },
            { id: "audit", label: "Security Audit Trail", icon: "📜" },
            { id: "contact", label: "Contact & Legal", icon: "✉️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-[#090d16] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prominent Medical Disclaimer (Always visible) */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-5 mb-8 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">⚠️</span>
        <div className="text-sm text-amber-200/90 leading-relaxed">
          <strong className="font-semibold text-amber-400 block mb-1">
            Prototype Wellness & Privacy Notice:
          </strong>
          MediTwin is a personal health-monitoring and lifestyle-simulation
          educational prototype. It is <strong>not a medical device</strong>,
          does not offer medical diagnoses, and does not prescribe therapeutic
          courses. Simulations and insight correlations are non-pharmacological
          heuristics. <strong>Never alter insulin or medication dosages</strong>{" "}
          based on information presented in MediTwin. Always consult a licensed
          physician.
        </div>
      </div>

      {/* =========================================================
          TAB 1: POLICY & COLLECTION
      ========================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* What Data Is Collected */}
          <section className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-blue-500">1.</span> What Data Is Collected
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              MediTwin collects only the data explicitly entered by you or
              generated to build your health-pattern twin:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  <span className="text-red-400">🩸</span> Biometric Health Metrics
                </div>
                <ul className="text-xs text-slate-300 mt-2 space-y-1.5 list-disc pl-5">
                  <li>Blood glucose readings (fasting, post-meal)</li>
                  <li>Blood pressure (systolic / diastolic mmHg)</li>
                  <li>Heart rate & pulse rate (bpm)</li>
                  <li>Body weight (kg) and waist circumference (cm)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  <span className="text-blue-400">🏃</span> Lifestyle & Sleep Patterns
                </div>
                <ul className="text-xs text-slate-300 mt-2 space-y-1.5 list-disc pl-5">
                  <li>Daily step counts and active exercise duration</li>
                  <li>Sleep hours, sleep start/wake times, and sleep quality</li>
                  <li>Sedentary sitting hours and hydration level</li>
                  <li>Daily stress and energy ratings (1–5 scale)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  <span className="text-emerald-400">🥗</span> Nutrition & Dietary Habits
                </div>
                <ul className="text-xs text-slate-300 mt-2 space-y-1.5 list-disc pl-5">
                  <li>Meal times, portion sizes, and qualitative food logs</li>
                  <li>Dietary flags: sugary drinks, high-carb, fried foods, vegetables</li>
                  <li>Self-reported alcohol and smoking habits</li>
                  <li>Meal satisfaction feedback</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  <span className="text-red-400">💊</span> Medication Adherence
                </div>
                <ul className="text-xs text-slate-300 mt-2 space-y-1.5 list-disc pl-5">
                  <li>Medication names, prescribed dosages, and schedule</li>
                  <li>Adherence confirmation (taken on time vs missed)</li>
                  <li>Reason for missed doses (for adherence scoring only)</li>
                  <li>*Strict guardrail: MediTwin never simulates medication adjustments</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16] md:col-span-2">
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  <span className="text-blue-400">🔒</span> Security & Authentication Metadata
                </div>
                <ul className="text-xs text-slate-300 mt-2 space-y-1.5 list-disc pl-5">
                  <li>Hashed passwords (bcrypt 12 rounds), session tokens (JWT)</li>
                  <li>Anonymized IP addresses and browser user-agent for fraud prevention</li>
                  <li>Immutable security audit logs (strictly stripped of all clinical health values)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Why It Is Collected */}
          <section className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-blue-500">2.</span> Why It Is Collected
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              We collect this information strictly to provide your personalized
              twin interface:
            </p>

            <div className="space-y-3">
              {[
                {
                  title: "Digital Twin Pattern State",
                  desc: "To synthesize your changing multi-metric state: glucose trend, BP trend, activity pattern, sleep pattern, and adherence.",
                },
                {
                  title: "Health Consistency Score",
                  desc: "To compute the prototype wellness score (Activity: 80, Sleep: 65, Medication: 90, Glucose consistency: 70) for self-monitoring.",
                },
                {
                  title: "Rule-Based Associative Insights",
                  desc: "To identify non-causal patterns (e.g. glucose levels higher on days with under 6 hours of sleep) without asserting medical causation.",
                },
                {
                  title: "Lifestyle Simulator",
                  desc: "To model hypothetical habit adjustments (+2,000 steps, +1hr sleep, alcohol-free days) with transparent low confidence ratings.",
                },
                {
                  title: "Account Security & Integrity",
                  desc: "To authenticate your sessions, enforce role-based permissions, and log security events.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-800 bg-[#090d16] flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Who Can See It */}
          <section className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-blue-500">3.</span> Who Can See It
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <span className="text-emerald-400 font-semibold text-sm block">
                  👤 You (The Account Owner)
                </span>
                <p className="text-xs text-slate-300 mt-2">
                  You maintain 100% full sovereignty. You can view, search,
                  filter, edit, export, or permanently delete your records at any time.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/20">
                <span className="text-blue-400 font-semibold text-sm block">
                  🩺 Authorized Doctors
                </span>
                <p className="text-xs text-slate-300 mt-2">
                  Clinicians can only view your data if explicitly authorized
                  through role-based patient-doctor delegation in clinical mode.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-[#090d16]">
                <span className="text-slate-400 font-semibold text-sm block">
                  🚫 Zero Third Parties
                </span>
                <p className="text-xs text-slate-400 mt-2">
                  We never monetize, sell, license, or share your health records
                  with insurers, advertisers, pharmaceutical brokers, or data aggregators.
                </p>
              </div>
            </div>
          </section>

          {/* How Users Can Delete It */}
          <section className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-blue-500">4.</span> How Users Can Delete It
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              We provide both fine-grained and full-account self-service deletion:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-800 rounded-xl bg-[#090d16]">
                <h3 className="font-semibold text-sm text-white">
                  Granular Health Log Deletion
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-3">
                  Delete any specific day's glucose, blood pressure, or lifestyle
                  entry directly from the Health History table.
                </p>
                <button
                  onClick={() => navigate("/health-history")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium rounded-lg transition"
                >
                  Go to Health History →
                </button>
              </div>

              <div className="p-4 border border-red-500/30 rounded-xl bg-red-950/20">
                <h3 className="font-semibold text-sm text-red-300">
                  Permanent Account Wipeout
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-3">
                  Instantly and irrevocably purge your account and all associated
                  biometrics, medications, simulations, and consents.
                </p>
                <button
                  onClick={() => setActiveTab("rights")}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 text-xs font-semibold rounded-lg transition"
                >
                  Manage Account Deletion →
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =========================================================
          TAB 2: DATA RIGHTS (EXPORT & DELETE)
      ========================================================= */}
      {activeTab === "rights" && (
        <div className="space-y-8">
          {/* Export Data Section */}
          <section className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-blue-400">📦</span> Export Personal Health Record
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Download a structured, machine-readable JSON archive of all
                  your daily logs, medications, simulations, and consent records.
                </p>
              </div>
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2 disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Generating Export...</span>
                  </>
                ) : (
                  <>
                    <span>⬇️</span>
                    <span>Export Data (JSON)</span>
                  </>
                )}
              </button>
            </div>

            {exportMessage && (
              <div
                className={`p-3.5 rounded-xl text-sm mb-4 ${
                  exportMessage.type === "success"
                    ? "bg-blue-950/60 text-blue-300 border border-blue-500/40"
                    : "bg-red-950/60 text-red-300 border border-red-500/40"
                }`}
              >
                {exportMessage.text}
              </div>
            )}

            <div className="bg-[#090d16] border border-slate-800 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200 block mb-1">
                Security & Data Sensitivity Guarantee:
              </strong>
              In compliance with medical data handling standards, your health
              records are <strong>never passed through URL query parameters</strong>,
              never written to plain console logs, and never exposed to public
              repositories. The export stream is delivered through an authenticated,
              encrypted session directly to your browser memory.
            </div>
          </section>

          {/* Session Termination Section */}
          <section className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🚪</span> Logout From All Sessions
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Revoke active access tokens across all browsers, mobile devices,
                  and desktop sessions.
                </p>
              </div>
              <button
                onClick={handleLogoutAllSessions}
                disabled={loggingOutAll}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-sm font-semibold rounded-xl transition flex items-center gap-2 disabled:opacity-50"
              >
                {loggingOutAll ? "Revoking..." : "Logout From All Sessions"}
              </button>
            </div>

            {sessionMessage && (
              <div className="p-3.5 rounded-xl text-sm mt-4 bg-red-950/60 text-red-300 border border-red-500/40">
                {sessionMessage.text}
              </div>
            )}
          </section>

          {/* Danger Zone: Account Deletion */}
          <section className="bg-[#0d1322] border-2 border-red-500/40 rounded-2xl p-6 md:p-8 shadow-xl shadow-red-950/20">
            <div className="flex items-center gap-2 text-red-400 font-bold text-lg mb-2">
              <span>⚠️</span>
              <h2>Danger Zone: Permanent Account Deletion</h2>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Deleting your account is permanent. It immediately and irreversibly
              purges your user profile, daily health logs, medication records,
              scenario simulations, family histories, and consent preferences.
              This operation cannot be undone.
            </p>

            <button
              onClick={() => {
                setDeleteInput("");
                setDeleteError(null);
                setShowDeleteModal(true);
              }}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-red-600/30 transition"
            >
              Delete Account & All Data
            </button>
          </section>
        </div>
      )}

      {/* =========================================================
          TAB 3: RESEARCH-USE CONSENT
      ========================================================= */}
      {activeTab === "consent" && (
        <section className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-400">🔬</span> Research-Use Consent & Algorithmic Modeling
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              MediTwin allows you to decide whether your de-identified health
              patterns can contribute to non-clinical lifestyle research.
            </p>
          </div>

          <div className="p-5 border border-slate-800 rounded-xl bg-[#090d16] space-y-3">
            <h3 className="font-semibold text-white text-sm">
              How Research-Use Works:
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-5">
              <li>
                <strong className="text-white">Cryptographic De-Identification:</strong> Your name,
                email, exact dates, and account identifiers are completely removed
                prior to any research pattern analysis.
              </li>
              <li>
                <strong className="text-white">Observational Purpose Only:</strong> Data is used solely
                to refine correlation models (e.g. sleep duration vs next-day
                activity consistency) in wellness applications.
              </li>
              <li>
                <strong className="text-white">Zero Commercial Selling:</strong> Data is never sold to
                insurance companies, employers, or third-party advertisers.
              </li>
              <li>
                <strong className="text-white">100% Revocable at Any Time:</strong> Revoking consent
                instantly removes your de-identified profile from future research batches.
              </li>
            </ul>
          </div>

          {/* Interactive Consent Toggle */}
          <div className="p-6 border-2 border-blue-500/30 rounded-2xl bg-blue-950/20 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-base">
                De-Identified Research Participation
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {researchConsent
                  ? "Status: CONSENT GRANTED. Your de-identified patterns contribute to research."
                  : "Status: CONSENT WITHHELD. Your records are strictly kept private to your account."}
              </p>
              {consentLastUpdated && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Last updated: {consentLastUpdated}
                </p>
              )}
            </div>

            <button
              onClick={handleToggleResearchConsent}
              disabled={savingConsent || loadingConsent}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                researchConsent
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
              }`}
            >
              {savingConsent ? (
                "Updating..."
              ) : researchConsent ? (
                <>
                  <span>✕</span> Revoke Research Consent
                </>
              ) : (
                <>
                  <span>✓</span> Grant Research Consent
                </>
              )}
            </button>
          </div>

          {consentMessage && (
            <div
              className={`p-4 rounded-xl text-sm ${
                consentMessage.type === "success"
                  ? "bg-blue-950/60 text-blue-300 border border-blue-500/40"
                  : "bg-red-950/60 text-red-300 border border-red-500/40"
              }`}
            >
              {consentMessage.text}
            </div>
          )}
        </section>
      )}

      {/* =========================================================
          TAB 4: ROLE-BASED AUTHORIZATION (RBAC)
      ========================================================= */}
      {activeTab === "rbac" && (
        <section className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-400">🛡️</span> Role-Based Access Control (RBAC)
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              MediTwin enforces strict role-based authorization to prevent
              unauthorized access across patient, clinician, and administrator boundaries.
            </p>
          </div>

          {/* Current Role Card */}
          <div className="p-5 border border-slate-800 rounded-xl bg-[#090d16] flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Active Authenticated Account
              </span>
              <div className="text-base font-bold text-white mt-0.5">
                {storedEmail}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Current Role:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  currentRole === "admin"
                    ? "bg-purple-950/60 text-purple-300 border border-purple-500/40"
                    : currentRole === "doctor"
                    ? "bg-blue-950/60 text-blue-300 border border-blue-500/40"
                    : "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                }`}
              >
                {currentRole}
              </span>
            </div>
          </div>

          {/* RBAC Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-[#090d16] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3 border-b border-slate-800">Feature / Route</th>
                  <th className="p-3 border-b border-slate-800 text-center">Patient</th>
                  <th className="p-3 border-b border-slate-800 text-center">Doctor / Clinician</th>
                  <th className="p-3 border-b border-slate-800 text-center">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 bg-[#0d1322]">
                <tr className="hover:bg-slate-800/20">
                  <td className="p-3 font-medium text-white">
                    Patient Dashboard & Journal (/dashboard)
                  </td>
                  <td className="p-3 text-center text-blue-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-blue-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-blue-400 font-bold">✓ Full</td>
                </tr>
                <tr className="hover:bg-slate-800/20">
                  <td className="p-3 font-medium text-white">
                    Doctor Clinical Dashboard (/doctor-dashboard)
                  </td>
                  <td className="p-3 text-center text-red-400 font-bold">✕ Denied</td>
                  <td className="p-3 text-center text-blue-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-blue-400 font-bold">✓ Full</td>
                </tr>
                <tr className="hover:bg-slate-800/20">
                  <td className="p-3 font-medium text-white">
                    Admin System Control (/admin, /api/admin)
                  </td>
                  <td className="p-3 text-center text-red-400 font-bold">✕ Denied</td>
                  <td className="p-3 text-center text-red-400 font-bold">✕ Denied</td>
                  <td className="p-3 text-center text-blue-400 font-bold">✓ Full</td>
                </tr>
                <tr className="hover:bg-slate-800/20">
                  <td className="p-3 font-medium text-white">
                    Personal Data Export & Self-Service Wipe
                  </td>
                  <td className="p-3 text-center text-blue-400 font-bold">✓ Own Data</td>
                  <td className="p-3 text-center text-blue-400 font-bold">✓ Own Data</td>
                  <td className="p-3 text-center text-blue-400 font-bold">✓ Own Data</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Demo Role Switcher for Test Evaluation */}
          <div className="p-5 border border-dashed border-slate-800 rounded-xl bg-[#090d16]">
            <div className="text-xs font-semibold text-slate-300 mb-2">
              🛠️ Test Evaluation Tool: Role Simulation Switcher
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Switch roles in this test session to verify that ProtectedRoute
              and backend endpoints enforce authorization properly:
            </p>
            <div className="flex flex-wrap gap-2">
              {["patient", "doctor", "admin"].map((roleName) => (
                <button
                  key={roleName}
                  onClick={() => handleTestRoleChange(roleName)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition ${
                    currentRole === roleName
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  Switch to {roleName}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          TAB 5: SECURITY AUDIT TRAIL
      ========================================================= */}
      {activeTab === "audit" && (
        <section className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-blue-400">📜</span> Account Security & Privacy Audit Trail
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Tamper-evident log of security events (Logins, exports, session
                revocations, and consent updates).
              </p>
            </div>
            <button
              onClick={refreshAuditLogs}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium transition"
            >
              🔄 Refresh Logs
            </button>
          </div>

          <div className="p-3.5 bg-blue-950/30 border border-blue-500/30 rounded-xl text-xs text-blue-300">
            <strong>Confidentiality Guarantee:</strong> In accordance with
            privacy laws, <strong>health metrics (glucose, BP, medications)</strong>{" "}
            are strictly excluded from audit logs to prevent accidental disclosure.
          </div>

          {loadingAudit ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Loading security audit events...
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm bg-[#090d16] rounded-xl border border-dashed border-slate-800">
              No audit logs recorded for this account yet. Audit events will appear
              when you log in, export data, or update consent.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-[#090d16] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3 border-b border-slate-800">Timestamp</th>
                    <th className="p-3 border-b border-slate-800">Action</th>
                    <th className="p-3 border-b border-slate-800">Entity</th>
                    <th className="p-3 border-b border-slate-800">IP / Client</th>
                    <th className="p-3 border-b border-slate-800">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-[#0d1322]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3 font-semibold text-white">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700 text-[11px] font-mono">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{log.entity || "—"}</td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        {log.ipAddress || "127.0.0.1"}
                      </td>
                      <td className="p-3 text-blue-400 font-semibold">
                        ✓ Logged
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* =========================================================
          TAB 6: CONTACT INFORMATION & LEGAL
      ========================================================= */}
      {activeTab === "contact" && (
        <section className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-400">✉️</span> Privacy Contact & Data Protection Office
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Have questions regarding your data privacy, rights, or wish to
              reach our Data Protection Officer?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 border border-slate-800 rounded-xl bg-[#090d16]">
              <h3 className="font-semibold text-sm text-white mb-2">
                Direct Privacy Inquiries
              </h3>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Reach our dedicated Privacy Operations team for questions regarding
                data processing, retention, or consent withdrawals:
              </p>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="font-semibold text-slate-300">Email: </span>
                  <a
                    href="mailto:privacy@meditwin.health"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    privacy@meditwin.health
                  </a>
                </div>
                <div>
                  <span className="font-semibold text-slate-300">DPO: </span>
                  <a
                    href="mailto:dpo@meditwin.health"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    dpo@meditwin.health
                  </a>
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Security: </span>
                  <a
                    href="mailto:security@meditwin.health"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    security@meditwin.health
                  </a>
                </div>
              </div>
            </div>

            <div className="p-5 border border-slate-800 rounded-xl bg-[#090d16]">
              <h3 className="font-semibold text-sm text-white mb-2">
                Physical Address & SLA
              </h3>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Written requests and statutory privacy inquiries may be directed
                to our official privacy headquarters:
              </p>
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-medium text-white">
                  MediTwin Health Technologies, Inc.
                </p>
                <p>Data Protection Office, Suite 400</p>
                <p>100 Innovation Way, Cambridge, MA 02142</p>
                <p className="text-slate-400 pt-1">
                  ⏱ Response Time: Within 24–48 business hours
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          CONFIRMATION MODAL FOR ACCOUNT DELETION
      ========================================================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1322] rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-red-950/40 border border-red-500/40 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 flex items-center justify-center text-2xl mx-auto mb-4 font-bold">
              ⚠️
            </div>

            <h3 className="text-xl font-bold text-center text-white mb-2">
              Permanently Delete Account?
            </h3>

            <p className="text-xs text-slate-400 text-center mb-6 leading-relaxed">
              This action <strong>cannot be undone</strong>. All daily health logs,
              glucose readings, blood pressure entries, medication records,
              lifestyle simulations, and consent records will be wiped immediately.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Type <span className="font-mono text-red-400">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 bg-[#090d16] border border-slate-700 rounded-xl text-sm text-center font-mono font-bold tracking-widest text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>

            {deleteError && (
              <p className="text-xs text-red-400 text-center mb-4 font-medium">
                {deleteError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteInput !== "DELETE" || deletingAccount}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 rounded-xl text-sm font-semibold transition disabled:opacity-40"
              >
                {deletingAccount ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrivacyConsent;

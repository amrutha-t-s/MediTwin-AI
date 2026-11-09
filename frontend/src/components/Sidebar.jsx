import { useEffect, useState, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout, getUserRole, getUserName, getUserEmail } from "../utils/auth";
import api from "../services/api";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = getUserRole();
  const isDoctorRole = userRole === "doctor";

  // Real profile details state
  const [profileName, setProfileName] = useState(() => getUserName());
  const [profileEmail, setProfileEmail] = useState(() => getUserEmail());

  useEffect(() => {
    // If name is not cached or to verify freshness, fetch from /api/profile
    api
      .get("/profile")
      .then((res) => {
        if (res.data?.user) {
          const u = res.data.user;
          if (u.fullName) {
            setProfileName(u.fullName);
            localStorage.setItem("fullName", u.fullName);
            sessionStorage.setItem("fullName", u.fullName);
          }
          if (u.email) {
            setProfileEmail(u.email);
            localStorage.setItem("email", u.email);
            sessionStorage.setItem("email", u.email);
          }
        }
      })
      .catch(() => {
        // Fall back to storage
      });
  }, []);

  // Compute clean display name
  const displayName = useMemo(() => {
    let name = (profileName || "").trim();
    if (!name && profileEmail) {
      const prefix = profileEmail.split("@")[0];
      name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    if (!name) {
      name = isDoctorRole ? "Doctor" : "Patient";
    }

    if (isDoctorRole) {
      return /^dr\.?\s+/i.test(name) ? name : `Dr. ${name}`;
    }
    return name;
  }, [profileName, profileEmail, isDoctorRole]);

  // STRICT ROLE-BASED NAVIGATION:
  // - Doctors see ONLY Doctor Dashboard (never patient dashboard, daily journal, health history, health profile, medications, trends, digital twin, simulator, notifications)
  // - Patients see ONLY patient pages (never doctor dashboard)
  const links = useMemo(() => {
    if (isDoctorRole) {
      return [
        {
          name: "Doctor Dashboard",
          path: "/doctor-dashboard",
          aliases: [],
          icon: "🩺",
          badge: "MD",
        },
      ];
    }

    return [
      { name: "Dashboard", path: "/dashboard", aliases: [], icon: "📊" },
      { name: "Daily Journal", path: "/daily-journal", aliases: ["/health-journal"], icon: "📝" },
      { name: "Health History", path: "/history", aliases: ["/health-history"], icon: "📋" },
      { name: "Health Profile", path: "/profile", aliases: ["/health-profile", "/edit-profile"], icon: "👤" },
      { name: "Medications", path: "/medications", aliases: [], icon: "💊" },
      { name: "Trends & Charts", path: "/trends", aliases: [], icon: "📈" },
      { name: "Digital Twin", path: "/digital-twin", aliases: [], icon: "🧬" },
      { name: "Lifestyle Simulator", path: "/simulator", aliases: ["/lifestyle-simulator"], icon: "🔮" },
      { name: "Notifications", path: "/notifications", aliases: [], icon: "🔔" },
      { name: "Privacy & Consent", path: "/privacy", aliases: ["/privacy-consent"], icon: "🔒" },
    ];
  }, [isDoctorRole]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 min-h-screen bg-[#090d16] border-r border-slate-800/80 p-5 flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400 shadow-md shadow-blue-900/30">
          <span className="text-xl">🫀</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent">
            MediTwin
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
            {isDoctorRole ? "Clinician Portal" : "Health OS"}
          </p>
        </div>
      </div>

      {/* Authenticated Identity Card */}
      <div
        className={`mb-6 p-3 rounded-2xl border transition-all ${
          isDoctorRole
            ? "bg-blue-950/30 border-blue-500/30 shadow-md shadow-blue-950/40"
            : "bg-slate-900/60 border-slate-800"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${
              isDoctorRole
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/40"
            }`}
          >
            {isDoctorRole ? "🩺" : "👤"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate" title={displayName}>
              {displayName}
            </p>
            <p className="text-[11px] text-slate-400 truncate" title={profileEmail}>
              {profileEmail || (isDoctorRole ? "Doctor Account" : "Patient Account")}
            </p>
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                isDoctorRole
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {isDoctorRole ? "Clinician / Doctor" : "Patient"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
        <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {isDoctorRole ? "Clinician Portal" : "Main Menu"}
        </p>
        {links.map((link) => {
          const isActive =
            location.pathname === link.path ||
            link.aliases.includes(location.pathname);

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? "bg-blue-600/15 text-blue-400 font-semibold border-l-2 border-blue-500 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full mt-6 px-4 py-2.5 bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-900/40 hover:border-red-500/60 hover:text-red-300 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-red-950/50"
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;


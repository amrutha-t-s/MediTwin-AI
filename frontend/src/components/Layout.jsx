import { NavLink, Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");

    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Health Profile", path: "/profile", icon: "👤" },
    { name: "Daily Journal", path: "/journal", icon: "📝" },
    { name: "Health History", path: "/history", icon: "📋" },
    { name: "Medications", path: "/medications", icon: "💊" },
    { name: "Trends", path: "/trends", icon: "📈" },
    { name: "Digital Twin", path: "/digital-twin", icon: "🧬" },
    { name: "Lifestyle Simulator", path: "/lifestyle", icon: "🔬" },
    { name: "Notifications", path: "/notifications", icon: "🔔" },
    { name: "Privacy & Consent", path: "/privacy", icon: "🔒" },
  ];

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#090d16] border-r border-slate-800/80 hidden md:flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400 shadow-md shadow-blue-900/30">
            <span className="text-xl">🫀</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent">
              MediTwin
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Digital Twin AI
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Health Modules
          </p>

          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 bg-red-950/30 border border-red-500/30 hover:bg-red-900/40 hover:border-red-500/60 hover:text-red-300 transition cursor-pointer"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="md:ml-64">
        {/* Top bar */}
        <header className="h-16 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-6 sticky top-0 z-40">
          <div>
            <h2 className="font-semibold text-white">
              MediTwin Health Center
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/notifications")}
              className="text-xl text-slate-400 hover:text-white hover:bg-slate-800/80 p-2 rounded-xl transition"
            >
              🔔
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-slate-800/60 transition"
            >
              <div className="w-9 h-9 bg-blue-950 border border-blue-500/40 text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                U
              </div>

              <span className="hidden sm:block text-sm font-medium text-slate-300">
                My Profile
              </span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;

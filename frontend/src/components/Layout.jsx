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
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
    {
      name: "Health Profile",
      path: "/profile",
      icon: "👤",
    },
    {
      name: "Daily Journal",
      path: "/journal",
      icon: "📝",
    },
    {
      name: "Health History",
      path: "/history",
      icon: "📋",
    },
    {
      name: "Medications",
      path: "/medications",
      icon: "💊",
    },
    {
      name: "Trends",
      path: "/trends",
      icon: "📈",
    },
    {
      name: "Digital Twin",
      path: "/digital-twin",
      icon: "🧬",
    },
    {
      name: "Lifestyle Simulator",
      path: "/lifestyle",
      icon: "🔬",
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: "🔔",
    },
    {
      name: "Privacy & Consent",
      path: "/privacy",
      icon: "🔒",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-blue-600">MediTwin</h1>

          <p className="text-xs text-slate-500 mt-1">
            Your Health. Your Digital Twin.
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Health
          </p>

          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>

                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="md:ml-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h2 className="font-semibold text-slate-800">
              MediTwin Health Center
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/notifications")}
              className="text-xl hover:bg-slate-100 p-2 rounded-lg"
            >
              🔔
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                U
              </div>

              <span className="hidden sm:block text-sm font-medium text-slate-700">
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

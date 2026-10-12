import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard", aliases: [] },
    { name: "Daily Journal", path: "/daily-journal", aliases: ["/health-journal"] },
    { name: "Health History", path: "/history", aliases: ["/health-history"] },
    { name: "Health Profile", path: "/profile", aliases: ["/health-profile", "/edit-profile"] },
    { name: "Medications", path: "/medications", aliases: [] },
    { name: "Trends & Charts", path: "/trends", aliases: [] },
    { name: "Digital Twin", path: "/digital-twin", aliases: [] },
    { name: "Lifestyle Simulator", path: "/simulator", aliases: ["/lifestyle-simulator"] },
    { name: "Notifications", path: "/notifications", aliases: [] },
    { name: "Privacy & Consent", path: "/privacy", aliases: ["/privacy-consent"] },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r p-4 flex flex-col">
      <h2 className="text-xl font-bold text-blue-600 mb-6">MediTwin</h2>

      <nav className="space-y-2 flex-1">
        {links.map((link) => {
          const isActive =
            location.pathname === link.path ||
            link.aliases.includes(location.pathname);

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full mt-6 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;

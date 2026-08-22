import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Health Journal", path: "/health-journal" },
    { name: "Health History", path: "/health-history" },
    { name: "Health Profile", path: "/health-profile" },
    { name: "Medications", path: "/medications" },
    { name: "Trends", path: "/trends" },
    { name: "Digital Twin", path: "/digital-twin" },
    { name: "Lifestyle Simulator", path: "/lifestyle-simulator" },
    { name: "Notifications", path: "/notifications" },
    { name: "Privacy & Consent", path: "/privacy-consent" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r p-4">
      <h2 className="text-xl font-bold text-blue-600 mb-6">MediTwin</h2>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

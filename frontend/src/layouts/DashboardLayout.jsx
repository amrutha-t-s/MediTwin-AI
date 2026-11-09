import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex selection:bg-blue-600 selection:text-white">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;

import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { useSocket } from "../hooks/useSocket";

export default function DashboardLayout() {
  const { user } = useContext(AuthContext);

  // keep socket alive for whole dashboard
  useSocket(user?.id);

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* sidebar (fixed full height) */}
      <div className="h-full flex-shrink-0">
        <Sidebar user={user} />
      </div>

      {/* right content scrolls only */}
      <div className="flex-1 h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
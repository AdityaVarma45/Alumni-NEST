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
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar user={user} />

      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
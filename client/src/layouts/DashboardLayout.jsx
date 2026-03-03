import { Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";
import { useSocket } from "../hooks/useSocket";

export default function DashboardLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Initialize socket globally
  useSocket(user?.id);

  const isChatPage = location.pathname.includes("/chat/");

  return (
    <div className="h-screen flex bg-slate-50">

      {/* Sidebar */}
      <div className="h-full flex-shrink-0">
        <Sidebar user={user} />
      </div>

      {/* Main area */}
      <main className="flex-1 h-full flex flex-col overflow-hidden">

        {/* Top Header (Notifications) */}
        {!isChatPage && (
          <div className="flex justify-end items-center px-6 py-4">
            <NotificationBell />
          </div>
        )}

        {isChatPage ? (
          /* Chat Full Height */
          <div className="h-full p-4 md:p-5">
            <div className="h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <Outlet />
            </div>
          </div>
        ) : (
          /* Normal Pages */
          <div className="flex-1 overflow-y-auto px-5 md:px-6 pb-6">
            <Outlet />
          </div>
        )}

      </main>
    </div>
  );
}
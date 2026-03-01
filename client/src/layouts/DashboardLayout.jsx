import { Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { useSocket } from "../hooks/useSocket";

export default function DashboardLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  useSocket(user?.id);

  const isChatPage = location.pathname.includes("/chat/");

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">

      {/* Sidebar */}
      <div className="h-full flex-shrink-0">
        <Sidebar user={user} />
      </div>

      {/* Main area */}
      <main className="flex-1 h-full overflow-hidden">

        {isChatPage ? (
          /* chat uses full height but aligned */
          <div className="h-full p-4 md:p-5">
            <div className="h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <Outlet />
            </div>
          </div>
        ) : (
          /* normal pages */
          <div className="h-full overflow-y-auto p-5 md:p-6">
            <Outlet />
          </div>
        )}

      </main>
    </div>
  );
}
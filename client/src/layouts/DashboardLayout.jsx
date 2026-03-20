import { Outlet, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { useSocket } from "../hooks/useSocket";
import TopHeader from "../components/TopHeader";

export default function DashboardLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useSocket(user?.id);

  const isChatPage = location.pathname.includes("/chat/");

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static z-50
          h-full flex-shrink-0
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar
          user={user}
          closeMobile={() => setSidebarOpen(false)}
        />
      </div>

      {/* MAIN */}
      <main className="flex-1 h-full flex flex-col overflow-hidden">

        {/* HEADER */}
        {!isChatPage && (
          <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        )}

        {/* CONTENT */}
        {isChatPage ? (
          <div className="h-full p-2 md:p-5">
            <div className="h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <Outlet />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 pb-6">
            <Outlet />
          </div>
        )}

      </main>
    </div>
  );
}
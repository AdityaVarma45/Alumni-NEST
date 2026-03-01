import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState, memo } from "react";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import Logo from "../components/Logo";

/* lucide icons */
import {
  MessageSquare,
  Users,
  UserCircle,
  GraduationCap,
  LogOut,
} from "lucide-react";

function Sidebar({ user }) {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const [requestCount, setRequestCount] = useState(0);

  // mentorship request count (alumni only)
  useEffect(() => {
    if (user?.role !== "alumni") return;

    const handleCount = (count) => {
      setRequestCount(count);
    };

    socket.on("mentorshipRequestCount", handleCount);

    return () => {
      socket.off("mentorshipRequestCount", handleCount);
    };
  }, [user]);

  const isActive = (path) =>
    location.pathname.startsWith(path);

  // reusable nav item
  const NavItem = ({ to, icon, label, exact = false }) => {
    const active = exact
      ? location.pathname === to
      : isActive(to);

    return (
      <Link
        to={to}
        className={`
          group flex items-center gap-3 px-3 py-2 rounded-lg text-sm
          transition-all duration-200
          ${
            active
              ? "bg-blue-50 text-blue-600 shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }
        `}
      >
        <span
          className={`transition-transform ${
            active ? "scale-110" : "group-hover:scale-105"
          }`}
        >
          {icon}
        </span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="w-72 h-full bg-white border-r flex flex-col">

      {/* Top brand */}
      <div className="h-16 flex items-center px-5 border-b">
        <Logo size="text-2xl" />
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b">
        <p className="font-semibold text-gray-800">
          {user?.username}
        </p>
        <p className="text-sm text-gray-500 capitalize">
          {user?.role}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">

        {/* My Profile */}
        <NavItem
          to="/dashboard/my-profile"
          icon={<UserCircle size={17} />}
          label="My Profile"
          exact
        />

        {/* Chats */}
        <NavItem
          to="/dashboard"
          icon={<MessageSquare size={17} />}
          label="Chats"
          exact
        />

        {/* Browse Users */}
        <NavItem
          to="/dashboard/users"
          icon={<Users size={17} />}
          label="Browse Users"
          exact
        />

        {/* Alumni only */}
        {user?.role === "alumni" && (
          <Link
            to="/dashboard/mentorship"
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
              isActive("/dashboard/mentorship")
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap size={17} />
              <span>Mentorship Requests</span>
            </div>

            {requestCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {requestCount}
              </span>
            )}
          </Link>
        )}
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default memo(Sidebar);
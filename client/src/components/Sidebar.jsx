import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState, memo } from "react";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import Logo from "../components/Logo";

import {
  LayoutDashboard,
  MessageSquare,
  Users,
  UserCircle,
  GraduationCap,
  Briefcase,
  Bell,
  LogOut,
} from "lucide-react";

function Sidebar({ user }) {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const [requestCount, setRequestCount] = useState(0);
  const [opportunityCount, setOpportunityCount] = useState(0);

  useEffect(() => {
    if (user?.role !== "alumni") return;

    const handleCount = (count = 0) => setRequestCount(count);

    socket.on("mentorshipRequestCount", handleCount);
    return () => socket.off("mentorshipRequestCount", handleCount);
  }, [user?.role]);

  useEffect(() => {
    const handleOpportunityCount = (count = 0) =>
      setOpportunityCount(count);

    socket.on("opportunityCount", handleOpportunityCount);
    return () => socket.off("opportunityCount", handleOpportunityCount);
  }, []);

  const isActive = (path, exact = false) =>
    exact
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const NavItem = ({
    to,
    icon,
    label,
    badge = 0,
    exact = false,
  }) => {
    const active = isActive(to, exact);

    return (
      <Link
        to={to}
        className={`
          flex items-center justify-between
          px-3 py-2.5 rounded-xl text-sm
          transition-all duration-200
          ${
            active
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }
        `}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{label}</span>
        </div>

        {badge > 0 && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              active
                ? "bg-white text-blue-600"
                : "bg-blue-600 text-white"
            }`}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="h-full p-3">
      <div className="w-72 h-full bg-white rounded-2xl shadow-sm flex flex-col">

        {/* Brand */}
        <div className="h-16 flex items-center px-5">
          <Logo size="text-2xl" />
        </div>

        {/* User card */}
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="font-semibold text-gray-800">
              {user?.username || "User"}
            </p>
            <p className="text-sm text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 px-3 space-y-2 overflow-y-auto">

          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard size={17} />}
            label="Overview"
            exact
          />

          <NavItem
            to="/dashboard/notifications"
            icon={<Bell size={17} />}
            label="Notifications"
          />

          <NavItem
            to="/dashboard/chats"
            icon={<MessageSquare size={17} />}
            label="Chats"
          />

          <NavItem
            to="/dashboard/users"
            icon={<Users size={17} />}
            label="Browse Users"
          />

          <NavItem
            to="/dashboard/opportunities"
            icon={<Briefcase size={17} />}
            label="Opportunities"
            badge={opportunityCount}
          />

          {user?.role === "alumni" && (
            <NavItem
              to="/dashboard/mentorship"
              icon={<GraduationCap size={17} />}
              label="Mentorship Requests"
              badge={requestCount}
            />
          )}

          <NavItem
            to="/dashboard/my-profile"
            icon={<UserCircle size={17} />}
            label="My Profile"
          />
        </div>

        {/* Logout */}
        <div className="p-3">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm transition-all duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(Sidebar);
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState, memo } from "react";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import Logo from "../components/Logo";

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

  return (
    <div className="w-72 h-full bg-white border-r flex flex-col">

      {/* Top brand / logo */}
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

        {/* Chats */}
        <Link
          to="/dashboard"
          className={`block px-3 py-2 rounded-lg text-sm ${
            location.pathname === "/dashboard"
              ? "bg-blue-50 text-blue-600"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          Chats
        </Link>

        {/* Browse Users (exact match only) */}
        <Link
          to="/dashboard/users"
          className={`block px-3 py-2 rounded-lg text-sm ${
            location.pathname === "/dashboard/users"
              ? "bg-blue-50 text-blue-600"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          Browse Users
        </Link>

        {/* My Profile */}
        <Link
          to={`/dashboard/users/${user?.id}`}
          className={`block px-3 py-2 rounded-lg text-sm ${
            location.pathname === `/dashboard/users/${user?.id}`
              ? "bg-blue-50 text-blue-600"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          My Profile
        </Link>

        
        {/* Alumni only */}
        {user?.role === "alumni" && (
          <Link
            to="/dashboard/mentorship"
            className={`px-3 py-2 rounded-lg text-sm flex justify-between items-center ${
              isActive("/dashboard/mentorship")
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <span>Mentorship Requests</span>

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
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default memo(Sidebar);
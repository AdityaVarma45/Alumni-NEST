import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";

export default function Sidebar({ user }) {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const [requestCount, setRequestCount] = useState(0);

  // listen for live mentorship count updates
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
    <div className="w-72 bg-white border-r flex flex-col">
      {/* app title */}
      <div className="h-16 flex items-center px-5 border-b">
        <h1 className="text-xl font-bold text-blue-600">
          AlumniNest
        </h1>
      </div>

      {/* user info */}
      <div className="px-5 py-4 border-b">
        <p className="font-semibold text-gray-800">
          {user?.username}
        </p>
        <p className="text-sm text-gray-500 capitalize">
          {user?.role}
        </p>
      </div>

      {/* navigation */}
      <div className="flex-1 px-3 py-4 space-y-2">

        <Link
          to="/dashboard"
          className={`block px-3 py-2 rounded-lg text-sm ${
            isActive("/dashboard")
              ? "bg-blue-50 text-blue-600"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          Chats
        </Link>

        <Link
          to="/users"
          className={`block px-3 py-2 rounded-lg text-sm ${
            isActive("/users")
              ? "bg-blue-50 text-blue-600"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          Browse Users
        </Link>

        <Link
          to="/profile-setup"
          className={`block px-3 py-2 rounded-lg text-sm ${
            isActive("/profile-setup")
              ? "bg-blue-50 text-blue-600"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          Update Profile Skills
        </Link>

        {/* alumni only */}
        {user?.role === "alumni" && (
          <Link
            to="/mentorship"
            className={`px-3 py-2 rounded-lg text-sm flex justify-between items-center ${
              isActive("/mentorship")
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

      {/* logout */}
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
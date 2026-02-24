import { Link } from "react-router-dom";

export default function Sidebar({ user, onLogout }) {
  return (
    <div className="w-72 bg-white border-r flex flex-col">
      {/* App title */}
      <div className="h-16 flex items-center px-5 border-b">
        <h1 className="text-xl font-bold text-blue-600">AlumniNest</h1>
      </div>

      {/* user info */}
      <div className="px-5 py-4 border-b">
        <p className="font-semibold text-gray-800">{user?.username}</p>
        <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
      </div>

      {/* nav */}
      <div className="flex-1 px-3 py-4 space-y-2">
        <Link
          to="/dashboard"
          className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
        >
          Chats
        </Link>

        <Link
          to="/users"
          className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
        >
          Browse Users
        </Link>
        <Link
          to="/profile-setup"
          className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm"
        >
          Update Profile Skills
        </Link>
      </div>

      {/* logout */}
      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

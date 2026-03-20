import { Menu } from "lucide-react";
import NotificationBell from "./Notificationbell";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TopHeader({ onMenuClick }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="h-14 flex items-center justify-between px-4 md:px-6">

      {/* LEFT */}
      <div className="flex items-center">
        <button
          className="md:hidden text-gray-600"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* Notification */}
        <div className="
          w-10 h-10
          flex items-center justify-center
          rounded-xl
          hover:bg-gray-100
          transition
          cursor-pointer
        ">
          <NotificationBell />
        </div>

        {/* Avatar */}
        <div
          onClick={() => navigate("/dashboard/my-profile")}
          className="
            w-10 h-10
            rounded-xl
            bg-gradient-to-br from-blue-500 to-indigo-600
            text-white
            flex items-center justify-center
            font-semibold
            cursor-pointer
            hover:scale-105
            transition
            shadow-sm
          "
        >
          {user?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>

      </div>

    </div>
  );
}
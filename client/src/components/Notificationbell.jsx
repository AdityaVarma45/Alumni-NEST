import { useEffect, useState } from "react";
import axios from "../api/axios";
import socket from "../socket";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/notifications");
        setNotifications(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  /* REAL TIME LISTENER */
  useEffect(() => {
    socket.on("newNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  return (
    <div className="relative">

      <button
        onClick={() => setOpen((p) => !p)}
        className="relative"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg p-4 space-y-3 z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`text-sm p-2 rounded-lg ${
                  n.read
                    ? "bg-slate-50"
                    : "bg-blue-50 font-medium"
                }`}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
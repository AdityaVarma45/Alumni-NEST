import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import socket from "../socket";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  /* ===============================
     Fetch initial notifications
  =============================== */

  
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

  /* ===============================
     Real-time listener
  =============================== */
  useEffect(() => {
    socket.on("newNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);

      // bell pulse animation
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    });

    return () => socket.off("newNotification");
  }, []);

  /* ===============================
     Close on outside click
  =============================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  /* ===============================
     Click notification
  =============================== */
  const handleNotificationClick = async (notification) => {
    try {
      await axios.put(
        `/notifications/${notification._id}/read`
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id
            ? { ...n, read: true }
            : n
        )
      );

      setOpen(false);

      if (notification.type === "mentorship_request") {
        navigate("/dashboard/mentorship");
      }

      if (notification.type === "mentorship_response") {
        navigate("/dashboard/mentorship");
      }

      if (notification.type === "new_opportunity") {
        navigate("/dashboard/opportunities");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     Mark all as read
  =============================== */
  const markAllRead = async () => {
    try {
      await axios.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="relative z-[1000]"
      ref={dropdownRef}
    >
      {/* Bell Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`relative p-2 rounded-lg transition ${
          animate ? "scale-110" : ""
        }`}
      >
        <Bell
          size={20}
          className="text-slate-700"
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="
          absolute right-0 mt-3 w-80
          bg-white border border-slate-200
          rounded-2xl shadow-xl
          p-4 space-y-3
          max-h-96 overflow-y-auto
          animate-fadeIn
        ">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-slate-700">
              Notifications
            </p>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() =>
                  handleNotificationClick(n)
                }
                className={`text-sm p-3 rounded-xl cursor-pointer transition ${
                  n.read
                    ? "bg-slate-50 hover:bg-slate-100"
                    : "bg-blue-50 font-medium hover:bg-blue-100"
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
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

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

  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

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

  /* Navigate based on notification type */
  const handleNotificationClick = async (notification) => {
    await markAsRead(notification._id);

    switch (notification.type) {
      case "mentorship_request":
        navigate("/dashboard/mentorship");
        break;

      case "mentorship_response":
        navigate("/dashboard/chats");
        break;

      case "new_opportunity":
        navigate("/dashboard/opportunities");
        break;

      case "chat_message":
        if (notification.relatedId) {
          navigate(`/dashboard/chat/${notification.relatedId}`);
        }
        break;

      default:
        break;
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "mentorship")
      return n.type.includes("mentorship");
    if (filter === "opportunity")
      return n.type.includes("opportunity");
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">
          Notifications
        </h1>

        <button
          onClick={markAllRead}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "unread", "mentorship", "opportunity"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize transition ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-500">
            No notifications found
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`bg-white border border-slate-200 rounded-2xl p-4 transition cursor-pointer ${
                !n.read ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="text-sm text-slate-700">
                  {n.message}
                </p>

                {!n.read && (
                  <span className="text-xs text-blue-600">
                    New
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
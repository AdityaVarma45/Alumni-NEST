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
    if (filter === "mentorship") return n.type.includes("mentorship");
    if (filter === "opportunity") return n.type.includes("opportunity");
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Notifications
          </h1>

          <p className="text-sm text-slate-500">
            Stay updated with mentorship, opportunities and messages
          </p>

        </div>

        <button
          onClick={markAllRead}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          Mark all as read
        </button>

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-2">

        {["all", "unread", "mentorship", "opportunity"].map((f) => (

          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition ${
              filter === f
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f}

          </button>

        ))}

      </div>

      {/* LIST */}

      <div className="space-y-3">

        {filtered.length === 0 ? (

          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm text-sm text-slate-500">

            No notifications yet

          </div>

        ) : (

          filtered.map((n) => (

            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`bg-white border rounded-xl p-4 cursor-pointer transition hover:shadow-md
              ${!n.read ? "border-blue-200 bg-blue-50" : "border-slate-200"}`}
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex-1">

                  <p className="text-sm text-slate-800 leading-relaxed">
                    {n.message}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>

                </div>

                {!n.read && (

                  <span className="text-xs text-blue-600 font-semibold whitespace-nowrap">

                    New

                  </span>

                )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}
import { Link, useLocation } from "react-router-dom";

/* format time preview */
const formatPreviewTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* last seen label */
const getActivityLabel = (conv) => {
  if (conv.online) return "Active now";

  if (!conv.updatedAt) return "Offline";

  const diff =
    (Date.now() - new Date(conv.updatedAt)) / 1000;

  if (diff < 60) return "Active just now";
  if (diff < 3600)
    return `Active ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return "Active today";

  return "Offline";
};

export default function ConversationCard({ conv, user }) {
  const location = useLocation();

  /* -----------------------------
     SAFE participant detection
  ----------------------------- */
  const otherUser = conv.participants?.find((p) => {
    // if populated object
    if (typeof p === "object") {
      return p._id?.toString() !== user?.id;
    }

    // if string id
    return p.toString() !== user?.id;
  });

  const isActive = location.pathname.includes(conv._id);

  return (
    <Link to={`/dashboard/chat/${conv._id}`} className="block">
      <div
        className={`
          rounded-2xl p-4 transition-all
          shadow-sm hover:shadow-md
          ${
            isActive
              ? "bg-blue-50 border-l-4 border-blue-500"
              : "bg-white hover:bg-gray-50"
          }
        `}
      >
        {/* top row */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            {otherUser?.username || "User"}
          </h3>

          <span className="text-xs text-gray-500">
            {getActivityLabel(conv)}
          </span>
        </div>

        {/* message preview */}
        <div className="mt-1 flex justify-between items-center">
          <p
            className={`text-sm truncate ${
              conv.typing
                ? "text-blue-500 italic"
                : "text-gray-500"
            }`}
          >
            {conv.typing
              ? "typing..."
              : conv.lastMessage || "Start chatting"}
          </p>

          <span className="text-[10px] text-gray-400">
            {formatPreviewTime(conv.updatedAt)}
          </span>
        </div>

        {/* unread badge */}
        {conv.unreadCount > 0 && (
          <div className="mt-2 inline-flex bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {conv.unreadCount}
          </div>
        )}
      </div>
    </Link>
  );
} 
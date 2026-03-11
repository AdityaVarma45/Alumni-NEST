import { Link, useLocation } from "react-router-dom";

/* format time shown on right side */
const formatPreviewTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* activity label */
const getActivityLabel = (conv) => {
  if (conv.online) return "Active now";
  if (!conv.updatedAt) return "Offline";

  const diff = (Date.now() - new Date(conv.updatedAt)) / 1000;

  if (diff < 60) return "Active just now";
  if (diff < 3600) return `Active ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return "Active today";

  return "Offline";
};

export default function ConversationCard({ conv, user }) {
  const location = useLocation();

  /* safely find other participant */
  const otherUser = conv.participants?.find((p) => {
    const id = typeof p === "object" ? p._id : p;
    return id?.toString() !== user?.id;
  });

  const isActive = location.pathname.includes(conv._id);

  const initial =
    otherUser?.username?.[0]?.toUpperCase() || "U";

  return (
    <Link to={`/dashboard/chat/${conv._id}`} className="block">

      <div
        className={`
          relative rounded-2xl border p-4
          transition-all duration-200
          ${
            isActive
              ? "bg-blue-50 border-blue-200 shadow-sm"
              : "bg-white border-slate-200 hover:bg-slate-50 hover:shadow-sm"
          }
        `}
      >

        {/* active indicator */}
        {isActive && (
          <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-blue-600" />
        )}

        <div className="flex items-start gap-3">

          {/* avatar */}
          <div className="relative shrink-0">

            <div
              className="
                w-10 h-10 rounded-full
                bg-gradient-to-br from-blue-500 to-indigo-600
                text-white
                flex items-center justify-center
                text-sm font-semibold
                shadow-sm
              "
            >
              {initial}
            </div>

            {conv.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}

          </div>

          {/* content */}
          <div className="flex-1 min-w-0">

            {/* top row */}
            <div className="flex items-center justify-between gap-2">

              <h3 className="font-semibold text-slate-800 truncate">
                {otherUser?.username || "User"}
              </h3>

              <span className="text-xs text-slate-500 whitespace-nowrap">
                {getActivityLabel(conv)}
              </span>

            </div>

            {/* preview */}
            <div className="mt-1 flex items-center justify-between gap-3">

              <p
                className={`text-sm truncate ${
                  conv.typing
                    ? "text-blue-600 italic animate-pulse"
                    : "text-slate-500"
                }`}
              >
                {conv.typing
                  ? "typing..."
                  : conv.lastMessage || "Start chatting"}
              </p>

              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {formatPreviewTime(conv.updatedAt)}
              </span>

            </div>

          </div>

        </div>

        {/* unread badge */}
        {conv.unreadCount > 0 && (
          <div
            className="
              absolute top-3 right-3
              min-w-[20px] h-5 px-1.5
              rounded-full
              bg-blue-600 text-white
              text-[10px] font-semibold
              flex items-center justify-center
              shadow-sm
            "
          >
            {conv.unreadCount}
          </div>
        )}

      </div>

    </Link>
  );
}
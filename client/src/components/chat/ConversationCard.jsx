import { Link, useLocation } from "react-router-dom";

// small helper → clean time preview
const formatPreviewTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ConversationCard({ conv, user }) {
  const location = useLocation();

  const otherUser = conv.participants.find(
    (p) => p._id !== user?.id
  );

  const isActive = location.pathname.includes(conv._id);

  return (
    <Link
      to={`/dashboard/chat/${conv._id}`}
      className="block"
    >
      <div
        className={`
          relative overflow-hidden
          rounded-2xl p-4
          transition-all duration-300 ease-out
          shadow-sm hover:shadow-md
          hover:scale-[1.01]
          group

          ${
            isActive
              ? "bg-blue-50 border-l-4 border-blue-500 shadow-md"
              : "bg-white hover:bg-gray-50"
          }
        `}
      >
        {/* subtle hover glow */}
        <div
          className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            bg-gradient-to-r from-blue-50/40 to-transparent
            transition-opacity duration-300 pointer-events-none
          "
        />

        {/* TOP ROW */}
        <div className="relative flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            {otherUser?.username}
          </h3>

          {/* ONLINE DOT ENGINE */}
          <div className="flex items-center gap-1">
            <span
              className={`
                w-2 h-2 rounded-full
                ${conv.online ? "bg-green-500" : "bg-gray-400"}
                ${conv.online ? "animate-pulse" : ""}
              `}
            />
            <span className="text-xs text-gray-400">
              {conv.online ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* MESSAGE PREVIEW */}
        <div className="relative mt-1 flex items-center justify-between gap-2">
          <p
            className={`
              text-sm truncate
              ${
                conv.typing
                  ? "text-blue-500 italic animate-pulse"
                  : "text-gray-500"
              }
            `}
          >
            {conv.typing
              ? "typing..."
              : conv.lastMessage || "Start chatting"}
          </p>

          <span className="text-[10px] text-gray-400 shrink-0">
            {formatPreviewTime(conv.updatedAt)}
          </span>
        </div>

        {/* UNREAD BADGE */}
        {conv.unreadCount > 0 && (
          <div
            className="
              mt-2 inline-flex items-center
              bg-blue-600 text-white
              text-xs px-2.5 py-1 rounded-full
              animate-[popIn_0.25s_ease]
            "
          >
            {conv.unreadCount}
          </div>
        )}
      </div>
    </Link>
  );
}
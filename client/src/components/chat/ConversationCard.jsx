import { Link, useLocation } from "react-router-dom";

/* ---------- helpers ---------- */

// time preview
const formatPreviewTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// activity label
const getActivityLabel = (conv) => {
  if (conv.online) return "Active now";

  if (!conv.updatedAt) return "Inactive";

  const diff =
    (Date.now() - new Date(conv.updatedAt)) / 1000;

  if (diff < 60) return "Active just now";
  if (diff < 3600)
    return `Active ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return "Active today";

  return "Inactive";
};

// detect emoji-only message
const isEmojiOnly = (text = "") => {
  const emojiRegex = /^(\p{Extended_Pictographic}|\s)+$/u;
  return emojiRegex.test(text.trim());
};

// 🔥 preview intelligence
const getPreviewText = (conv, userId) => {
  if (conv.typing) return "typing...";

  const text = conv.lastMessage || "";

  if (!text) return "Start chatting";

  // if current user sent message
  const isMine =
    conv.lastMessageSender?.toString?.() === userId;

  // emoji message
  if (isEmojiOnly(text)) {
    return `${isMine ? "You: " : ""}${text}`;
  }

  // link preview
  if (/(https?:\/\/[^\s]+)/g.test(text)) {
    return `${isMine ? "You: " : ""}🔗 Link`;
  }

  // attachment style future-safe
  if (text.startsWith("[file]")) {
    return `${isMine ? "You: " : ""}📎 Attachment`;
  }

  return `${isMine ? "You: " : ""}${text}`;
};

export default function ConversationCard({ conv, user }) {
  const location = useLocation();

  const otherUser = conv.participants.find(
    (p) => p._id !== user?.id
  );

  const isActive = location.pathname.includes(conv._id);

  const previewText = getPreviewText(conv, user?.id);

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
        {/* soft hover glow */}
        <div
          className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            bg-gradient-to-r from-blue-50/40 to-transparent
            transition-opacity duration-300 pointer-events-none
          "
        />

        {/* top row */}
        <div className="relative flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            {otherUser?.username}
          </h3>

          <div className="flex items-center gap-2">
            <span
              className={`
                w-2 h-2 rounded-full
                ${conv.online ? "bg-green-500" : "bg-gray-400"}
                ${conv.online ? "animate-pulse" : ""}
              `}
            />

            <span className="text-xs text-gray-400">
              {getActivityLabel(conv)}
            </span>
          </div>
        </div>

        {/* preview row */}
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
            {previewText}
          </p>

          <span className="text-[10px] text-gray-400 shrink-0">
            {formatPreviewTime(conv.updatedAt)}
          </span>
        </div>

        {/* unread badge */}
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
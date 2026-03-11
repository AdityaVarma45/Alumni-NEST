import { formatLastSeen } from "../../utils/presence";

/*
  Chat header
  - clean SPA style
  - lightweight premium feel
  - safe layout (no height issues)
*/

export default function ChatHeader({
  userName,
  online,
  typing,
  lastSeen,
}) {

  const getStatusText = () => {
    if (typing) return "Typing...";
    if (online) return "Online";
    if (!lastSeen) return "Offline";
    return `Last seen ${formatLastSeen(lastSeen)}`;
  };

  const initial = userName?.[0]?.toUpperCase() || "U";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-5 md:px-6 flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="relative">

          <div
            className="
              w-10 h-10
              rounded-full
              bg-gradient-to-br from-blue-500 to-indigo-600
              text-white
              flex items-center justify-center
              font-semibold text-sm
              shadow-sm
            "
          >
            {initial}
          </div>

          {/* Online indicator */}
          {online && (
            <span
              className="
                absolute bottom-0 right-0
                w-3 h-3 rounded-full
                bg-green-500
                border-2 border-white
              "
            />
          )}

        </div>

        {/* Name + status */}
        <div className="flex flex-col leading-tight">

          <span className="font-semibold text-slate-800">
            {userName}
          </span>

          <span
            className={`text-xs transition-colors ${
              typing
                ? "text-blue-600 font-medium"
                : online
                ? "text-green-600"
                : "text-slate-500"
            }`}
          >
            {getStatusText()}
          </span>

        </div>

      </div>

      {/* Right label */}
      <span className="text-xs text-slate-400 font-medium hidden sm:block">
        AlumniNest Chat
      </span>

    </header>
  );
}
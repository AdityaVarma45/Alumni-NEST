import { formatLastSeen } from "../../utils/presence";

export default function ChatHeader({
  userName,
  online,
  typing,
  lastSeen,
}) {
  const getStatusText = () => {
    if (typing) return "typing...";
    if (online) return "Online";
    return `Last seen ${formatLastSeen(lastSeen)}`;
  };

  return (
    <div className="h-16 bg-white border-b px-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">

      <div className="flex items-center gap-3">
        {/* avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            {userName?.charAt(0).toUpperCase()}
          </div>

          {/* online dot */}
          {online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {userName}
          </span>

          <span className="text-xs text-gray-500">
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-400">
        AlumniNest Chat
      </div>
    </div>
  );
}
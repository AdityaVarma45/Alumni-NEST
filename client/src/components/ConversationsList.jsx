import ConversationCard from "./chat/ConversationCard";

/* skeleton loader */
function ConversationSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-3">
        {/* avatar skeleton */}
        <div className="w-10 h-10 rounded-full bg-slate-200" />

        <div className="flex-1">
          <div className="flex justify-between">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-3 w-12 rounded bg-slate-200" />
          </div>

          <div className="h-3 w-48 rounded bg-slate-200 mt-3" />
        </div>
      </div>
    </div>
  );
}

export default function ConversationsList({
  conversations = [],
  user,
  loading = false,
}) {
  const safeConversations = Array.isArray(conversations)
    ? conversations
    : [];

  return (
    <div className="space-y-3">

      {/* ===============================
          LOADING STATE
      =============================== */}
      {loading && (
        <div className="space-y-3">
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
        </div>
      )}

      {/* ===============================
          EMPTY STATE
      =============================== */}
      {!loading && safeConversations.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            No conversations yet
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Start a chat from Browse Users
          </p>
        </div>
      )}

      {/* ===============================
          CONVERSATION LIST
      =============================== */}
      {!loading && safeConversations.length > 0 && (
        <div className="space-y-3">
          {safeConversations.map((conv) => (
            <ConversationCard
              key={conv._id}
              conv={conv}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
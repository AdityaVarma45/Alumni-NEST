import ConversationCard from "./chat/ConversationCard";

/* ===============================
   Skeleton Loader
=============================== */
function ConversationSkeleton() {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-12 bg-gray-200 rounded" />
      </div>

      <div className="h-3 w-48 bg-gray-200 rounded mt-3" />
    </div>
  );
}

export default function ConversationsList({
  conversations = [],   // 🔥 safety fallback
  user,
  loading = false,      // 🔥 safety fallback
}) {
  // extra protection (prevents crash)
  const safeConversations = Array.isArray(conversations)
    ? conversations
    : [];

  return (
    <div className="space-y-2">

      {/* ===============================
          LOADING STATE (SHIMMER)
      =============================== */}
      {loading && (
        <>
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
        </>
      )}

      {/* ===============================
          EMPTY STATE (only after load)
      =============================== */}
      {!loading && safeConversations.length === 0 && (
        <p className="text-gray-500 text-sm">
          No conversations yet
        </p>
      )}

      {/* ===============================
          CONVERSATIONS
      =============================== */}
      {!loading &&
        safeConversations.map((conv) => (
          <ConversationCard
            key={conv._id}
            conv={conv}
            user={user}
          />
        ))}
    </div>
  );
}
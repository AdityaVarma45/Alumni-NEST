import ConversationCard from "./chat/ConversationCard";

export default function ConversationsList({
  conversations,
  user,
  loading = false, // 👈 NEW (safe default)
}) {
  return (
    <div className="space-y-2">

      {/* ===============================
         LOADING STATE
      =============================== */}
      {loading && (
        <p className="text-gray-400 text-sm">
          Loading conversations...
        </p>
      )}

      {/* ===============================
         EMPTY STATE (only AFTER loading)
      =============================== */}
      {!loading && conversations.length === 0 && (
        <p className="text-gray-500 text-sm">
          No conversations yet
        </p>
      )}

      {/* ===============================
         CONVERSATION CARDS
      =============================== */}
      {!loading &&
        conversations.map((conv) => (
          <ConversationCard
            key={conv._id}
            conv={conv}
            user={user}
          />
        ))}
    </div>
  );
}
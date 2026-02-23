import ConversationCard from "./chat/ConversationCard";

export default function ConversationsList({
  conversations,
  user,
}) {
  return (
    <div className="space-y-2">

      {/* empty state */}
      {conversations.length === 0 && (
        <p className="text-gray-500 text-sm">
          No conversations yet
        </p>
      )}

      {/* conversation cards */}
      {conversations.map((conv) => (
        <ConversationCard
          key={conv._id}
          conv={conv}
          user={user}
        />
      ))}

    </div>
  );
}
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ConversationsList from "../components/ConversationsList";
import { useConversations } from "../hooks/useConversations";

export default function Chats() {
  const { user } = useContext(AuthContext);

  const {
    conversations,
    loading,
  } = useConversations(user);

  return (
    <div className="max-w-6xl mx-auto">

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Chats
        </h2>

        <ConversationsList
          conversations={conversations}
          user={user}
          loading={loading}
        />
      </section>

    </div>
  );
}
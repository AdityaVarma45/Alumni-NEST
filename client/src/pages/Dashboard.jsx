import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ConversationsList from "../components/ConversationsList";
import { useConversations } from "../hooks/useConversations";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const conversations = useConversations(user);

  return (
    <div className="h-full p-6 overflow-y-auto">
      <ConversationsList
        conversations={conversations}
        user={user}
      />
    </div>
  );
}
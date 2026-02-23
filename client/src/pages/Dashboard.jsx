import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import ConversationsList from "../components/ConversationsList";
import RecommendedAlumniSection from "../components/recommendations/RecommendedAlumniSection";

import { useConversations } from "../hooks/useConversations";
import { useRecommendedAlumni } from "../hooks/useRecommendedAlumni";

/*
  Dashboard page
  ------------------------------------------------
  Responsibilities:
  1. Show conversations
  2. Show smart alumni recommendations
  (UI composition only — logic stays in hooks)
*/

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // conversations (chat system)
  const conversations = useConversations(user);

  // smart recommendation engine
  const recommendedAlumni = useRecommendedAlumni();

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* ===============================
          Conversations Section
      =============================== */}
      <ConversationsList
        conversations={conversations}
        user={user}
      />

      {/* ===============================
          Recommended Alumni Section
      =============================== */}
      <RecommendedAlumniSection
        alumni={recommendedAlumni}
      />
    </div>
  );
}
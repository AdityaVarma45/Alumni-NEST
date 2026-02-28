import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import ConversationsList from "../components/ConversationsList";
import RecommendedAlumniSection from "../components/recommendations/RecommendedAlumniSection";

import { useConversations } from "../hooks/useConversations";
import { useRecommendedAlumni } from "../hooks/useRecommendedAlumni";

/*
  Dashboard page
  ----------------
  - conversations list
  - smart alumni recommendations
*/

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // conversations hook
  const {
    conversations,
    loading: conversationsLoading,
  } = useConversations(user);

  // recommendations hook
  const {
    alumni: recommendedAlumni,
    loading: recommendationsLoading,
  } = useRecommendedAlumni();

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* ===============================
          CONVERSATIONS
      =============================== */}
      <ConversationsList
        conversations={conversations}
        user={user}
        loading={conversationsLoading}
      />

      {/* ===============================
          RECOMMENDED ALUMNI
      =============================== */}
      <RecommendedAlumniSection
        alumni={recommendedAlumni}
        loading={recommendationsLoading}
      />
    </div>
  );
}